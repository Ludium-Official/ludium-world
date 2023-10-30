package world.ludium.education.auth;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import world.ludium.education.auth.google.GoogleUser;
import world.ludium.education.auth.google.GoogleUserService;

import java.math.BigInteger;

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

    @GetMapping("/code/{registrationId}")
    public RedirectView googleLogin(@RequestParam String code, @PathVariable String registrationId, HttpServletResponse response) {
        String accessToken = loginService.socialLogin(code, registrationId).toString();

        Cookie cookie = new Cookie("access_token", accessToken);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        response.addCookie(cookie);

        JsonNode googleUserInfo = loginService.getUserResource(accessToken, registrationId);

        String uri = env.getProperty("ludium.world.redirect-uri");
        if (googleUserService.getUserById(new BigInteger(googleUserInfo.get("id").toString().replaceAll("\"", ""))) == null) {
            return new RedirectView() {{
                setUrl(uri+"/sign-up");
            }};
        }

        return new RedirectView() {{
            setUrl(uri+"/main");
        }};
    }

    @GetMapping("/info/{registrationId}")
    public JsonNode googleUserInfo(@CookieValue(name = "access_token", required = false) String accessToken,
                                   @PathVariable String registrationId) {
        return loginService.getUserResource(accessToken, registrationId);
    }
}