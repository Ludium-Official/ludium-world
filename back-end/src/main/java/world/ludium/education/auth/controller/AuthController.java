package world.ludium.education.auth.controller;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import java.math.BigInteger;
import java.util.HashMap;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;
import world.ludium.education.auth.model.GoogleRefreshToken;
import world.ludium.education.auth.service.GoogleUserService;
import world.ludium.education.auth.service.LoginService;

@RestController
@RequestMapping(value = "/auth/google", produces = "application/json")
public class AuthController {

  private final Environment env;
  LoginService loginService;
  GoogleUserService googleUserService;

  public AuthController(LoginService loginService,
      GoogleUserService googleUserService,
      Environment env) {
    this.loginService = loginService;
    this.googleUserService = googleUserService;
    this.env = env;
  }

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

  @GetMapping("/info/{registrationId}")
  public JsonNode googleUserInfo(
      @CookieValue(name = "access_token", required = false) String accessToken,
      @PathVariable String registrationId) {
    return loginService.getUserResource(accessToken, registrationId);
  }

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