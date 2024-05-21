package world.ludium.education.auth.controller;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import world.ludium.education.auth.model.GoogleRefreshToken;
import world.ludium.education.auth.service.GoogleUserService;
import world.ludium.education.auth.service.LoginService;

import java.math.BigInteger;
import java.util.HashMap;

/**
 * 구글 인증 처리를 위한 컨트롤러
 */
@RestController
@RequestMapping(value = "/auth/google", produces = "application/json")
public class AuthController {

    private final Environment env;
    LoginService loginService;
    GoogleUserService googleUserService;

    /**
     * 서비스와 환경 변수를 초기화 하기 위한 생성자
     *
     * @param loginService      로그인 서비스
     * @param googleUserService 구글 회원 서비스
     * @param env               환경 변수
     */
    public AuthController(LoginService loginService,
                          GoogleUserService googleUserService,
                          Environment env) {
        this.loginService = loginService;
        this.googleUserService = googleUserService;
        this.env = env;
    }

    /**
     * 사용자 유형에 따라 Google 로그인 및 리디렉션을 처리하는 엔드포인트
     *
     * @param code           인증 코드
     * @param registrationId OAuth2를 이용해서 로그인한 플랫폼(구글)
     * @param type           로그인을 성공한 웹 사이트 유형(컨트리뷰터, 프로바이더, 관리자)
     * @param response       HTTP Response
     * @return 환경 변수에 설정되어 있는 URL로 리디렉션
     */
    @GetMapping("/code/{registrationId}/{type}")
    public RedirectView googleLogin(@RequestParam String code,
                                    @PathVariable String registrationId,
                                    @PathVariable String type,
                                    HttpServletResponse response) {
        JsonNode tokenInfo = loginService.socialLogin(code, registrationId, type);
        String accessToken = tokenInfo.get("access_token").asText();

        Cookie cookie = new Cookie("access_token", accessToken);
        cookie.setPath("/");
        cookie.setAttribute("SameSite", "None");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge(604800);
        cookie.setAttribute("Domain", env.getProperty("ludium.world.cookie-domain"));
        response.addCookie(cookie);

        JsonNode googleUserInfo = loginService.getUserResource(accessToken, registrationId);

        Cookie cookie1 = new Cookie("ggl_id", googleUserInfo.get("id").toString().replaceAll("\"", ""));
        cookie1.setPath("/");
        cookie1.setAttribute("SameSite", "None");
        cookie1.setHttpOnly(true);
        cookie1.setSecure(true);
        cookie1.setMaxAge(604800);
        cookie1.setAttribute("Domain", env.getProperty("ludium.world.cookie-domain"));
        response.addCookie(cookie1);

        if (tokenInfo.get("refresh_token") != null) {
            GoogleRefreshToken googleRefreshToken = new GoogleRefreshToken();
            googleRefreshToken.setGglId(
                    new BigInteger(googleUserInfo.get("id").toString().replaceAll("\"", "")));
            googleRefreshToken.setGglTk(tokenInfo.get("refresh_token").asText());

            googleUserService.createUserRefreshToken(googleRefreshToken);
        }

        String uri = type.equals("provider") ? env.getProperty("ludium.world.provider.redirect-uri") :
                type.equals("contributor") ? env.getProperty("ludium.world.contributor.redirect-uri") :
                        env.getProperty("ludium.world.admin.redirect-uri");
        if (googleUserService.getUserById(
                new BigInteger(googleUserInfo.get("id").toString().replaceAll("\"", ""))) == null) {
            return new RedirectView() {
                {
                    setUrl(uri + "/sign-up");
                }
            };
        }
        return new RedirectView() {
            {
                setUrl(uri);
            }
        };
    }

    /**
     * 쿠키에 저장되어 있는 엑세스 토큰을 이용해서 구글 사용자 정보를 가져오는 엔드포인트
     *
     * @param accessToken    구글 로그인을 성공했을 때 받는 access token
     * @param registrationId OAuth2를 이용해서 로그인한 플랫폼(구글)
     * @return 구글 사용자 정보를 반환
     */
    @GetMapping("/info/{registrationId}")
    public JsonNode googleUserInfo(
            @CookieValue(name = "access_token", required = false) String accessToken,
            @PathVariable String registrationId) {
        return loginService.getUserResource(accessToken, registrationId);
    }

    /**
     * refresh token을 이용해서 구글 access token을 재발급 받는 엔드포인트
     *
     * @param gglId    구글 사용자 ID
     * @param response HTTP Response
     * @return 업데이트 된 쿠키 정보를 반환
     */
    @PostMapping("/token-refresh")
    public ResponseEntity tokenRefresh(@CookieValue(name = "ggl_id", required = false) String gglId,
                                       HttpServletResponse response) {
        GoogleRefreshToken googleRefreshToken = googleUserService.getUserRefreshToken(
                new BigInteger(gglId));
        JsonNode tokenInfo = loginService.getAccessToken(googleRefreshToken.getGglTk());

        Cookie cookie = new Cookie("access_token", tokenInfo.get("access_token").asText());
        cookie.setPath("/");
        cookie.setAttribute("SameSite", "None");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge(604800);
        cookie.setAttribute("Domain", env.getProperty("ludium.world.cookie-domain"));
        response.addCookie(cookie);

        return ResponseEntity.ok(new HashMap<>() {
            {
                put("headers", new HashMap<>() {
                    {
                        put("cookie", """
                                ggl_id=%s; access_token=%s
                                """.formatted(gglId, tokenInfo.get("access_token").asText()));
                    }
                });
            }
        });
    }
}