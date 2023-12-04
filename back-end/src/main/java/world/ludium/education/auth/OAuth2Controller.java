package world.ludium.education.auth;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import world.ludium.education.auth.google.GoogleRefreshToken;
import world.ludium.education.auth.google.GoogleUserService;

import java.math.BigInteger;
import java.util.HashMap;

@RestController
@RequestMapping(value = "/auth/google", produces = "application/json")
public class OAuth2Controller {
    private final Environment env;
    LoginService loginService;
    GoogleUserService googleUserService;

    public OAuth2Controller(LoginService loginService,
                            GoogleUserService googleUserService,
                            Environment env) {
        this.loginService = loginService;
        this.googleUserService = googleUserService;
        this.env = env;
    }

    @GetMapping("/code/{registrationId}/{type}")
    public RedirectView googleLogin(@RequestParam String code
            , @PathVariable String registrationId
            , @PathVariable String type
            , HttpServletResponse response) {
        JsonNode tokenInfo = loginService.socialLogin(code, registrationId, type);
        String accessToken = tokenInfo.get("access_token").asText();

        Cookie cookie = new Cookie("access_token", accessToken);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        response.addCookie(cookie);

        JsonNode googleUserInfo = loginService.getUserResource(accessToken, registrationId);

        Cookie cookie1 = new Cookie("ggl_id", googleUserInfo.get("id").toString().replaceAll("\"", ""));
        cookie1.setPath("/");
        cookie1.setHttpOnly(true);
        response.addCookie(cookie1);


        if (tokenInfo.get("refresh_token") != null) {
            GoogleRefreshToken googleRefreshToken = new GoogleRefreshToken();
            googleRefreshToken.setGglId(new BigInteger(googleUserInfo.get("id").toString().replaceAll("\"", "")));
            googleRefreshToken.setGglTk(tokenInfo.get("refresh_token").asText());

            googleUserService.createUserRefreshToken(googleRefreshToken);
        }

        if (type.equals("provider")) {
            String uri = env.getProperty("ludium.world.provider.redirect-uri");
            if (googleUserService.getUserById(new BigInteger(googleUserInfo.get("id").toString().replaceAll("\"", ""))) == null) {
                return new RedirectView() {{
                    setUrl(uri + "/sign-up");
                }};
            }

            return new RedirectView() {{
                setUrl(uri);
            }};
        }

        String uri = env.getProperty("ludium.world.admin.redirect-uri");
        if (googleUserService.getUserById(new BigInteger(googleUserInfo.get("id").toString().replaceAll("\"", ""))) == null) {
            return new RedirectView() {{
                setUrl(uri + "/sign-up");
            }};
        }
        return new RedirectView() {{
            setUrl(uri);
        }};
    }

    @GetMapping("/info/{registrationId}")
    public JsonNode googleUserInfo(@CookieValue(name = "access_token", required = false) String accessToken,
                                   @PathVariable String registrationId) {
        return loginService.getUserResource(accessToken, registrationId);
    }

    @PostMapping("/token-refresh")
    public ResponseEntity tokenRefresh(@CookieValue(name = "ggl_id", required = false) String gglId,
                                       HttpServletResponse response) {
        GoogleRefreshToken googleRefreshToken = googleUserService.getUserRefreshToken(new BigInteger(gglId));
        JsonNode tokenInfo = loginService.getAccessToken(googleRefreshToken.getGglTk());

        Cookie cookie = new Cookie("access_token", tokenInfo.get("access_token").asText());
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        response.addCookie(cookie);

        return ResponseEntity.ok(new HashMap<>() {{
            put("headers", new HashMap<>() {{
                put("cookie", """
                        ggl_id=%s; access_token=%s
                        """.formatted(gglId, tokenInfo.get("access_token").asText()));
            }});
        }});
    }
}