package world.ludium.education.auth;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping(value = "/auth/google", produces = "application/json")
public class OAuth2Controller {

    LoginService  loginService;

    public OAuth2Controller(LoginService loginService) {
        this.loginService = loginService;
    }

    @GetMapping("/code/{registrationId}")
    public RedirectView googleLogin(@RequestParam String code, @PathVariable String registrationId, HttpServletResponse response) {
        String accessToken = loginService.socialLogin(code, registrationId).toString();

        Cookie cookie = new Cookie("access_token", accessToken);
        cookie.setPath("/");
        response.addCookie(cookie);

        return new RedirectView(){{
           setUrl("http://localhost:3000/main");
        }};
    }

    @GetMapping("/info/{registrationId}")
    @CrossOrigin(origins = "http://localhost:3000")
    public JsonNode googleUserInfo(@RequestHeader("Authorization") String authorization, @PathVariable String registrationId) {
        String accessToken = authorization.replace("Bearer", "");
        return loginService.getUserResource(accessToken, registrationId);
    }
}