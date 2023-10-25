package world.ludium.education.auth;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import world.ludium.education.auth.google.GoogleUser;
import world.ludium.education.auth.google.GoogleUserService;

import java.math.BigInteger;

@RestController
@RequestMapping(value = "/auth/google", produces = "application/json")
public class OAuth2Controller {

    LoginService  loginService;
    GoogleUserService googleUserService;

    public OAuth2Controller(LoginService loginService, GoogleUserService googleUserService) {
        this.loginService = loginService;
        this.googleUserService = googleUserService;
    }

    @GetMapping("/code/{registrationId}")
    public RedirectView googleLogin(@RequestParam String code, @PathVariable String registrationId, HttpServletResponse response) {
        String accessToken = loginService.socialLogin(code, registrationId).toString();

        Cookie cookie = new Cookie("access_token", accessToken);
        cookie.setPath("/");
        response.addCookie(cookie);

        JsonNode googleUserInfo = loginService.getUserResource(accessToken, registrationId);

        if(googleUserService.getUserById(new BigInteger(googleUserInfo.get("id").toString().replaceAll("\"", ""))) == null) {
            return new RedirectView(){{
                setUrl("http://localhost:3000/sign-up");
            }};
        }

        return new RedirectView(){{
           setUrl("http://localhost:3000/main");
        }};
    }

    @GetMapping("/info/{registrationId}")
    public JsonNode googleUserInfo(@RequestHeader("Authorization") String authorization, @PathVariable String registrationId) {
        String accessToken = authorization.replace("Bearer", "");
        return loginService.getUserResource(accessToken, registrationId);
    }
}