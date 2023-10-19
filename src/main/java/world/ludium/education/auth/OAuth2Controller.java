package world.ludium.education.auth;

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
    public RedirectView googleLogin(@RequestParam String code, @PathVariable String registrationId) {
        String result = loginService.socialLogin(code, registrationId).toString();

        return new RedirectView(){{
           setUrl("http://localhost:3000/main");
        }};
    }
}