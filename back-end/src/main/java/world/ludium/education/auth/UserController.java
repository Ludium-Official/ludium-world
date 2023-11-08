package world.ludium.education.auth;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.auth.google.GoogleUser;
import world.ludium.education.auth.google.GoogleUserService;
import world.ludium.education.auth.ludium.LudiumUser;
import world.ludium.education.auth.ludium.LudiumUserService;

import java.math.BigInteger;
import java.util.HashMap;

@RestController
@RequestMapping(value = "/user", produces = "application/json")
public class UserController {
    LoginService loginService;
    GoogleUserService googleUserService;
    LudiumUserService ludiumUserService;

    public UserController(LoginService loginService, GoogleUserService googleUserService, LudiumUserService ludiumUserService) {
        this.loginService = loginService;
        this.googleUserService = googleUserService;
        this.ludiumUserService = ludiumUserService;
    }

    @PostMapping("/sign-up/{registrationId}")
    public ResponseEntity<Object> signUpUser(@CookieValue(name = "access_token", required = false) String accessToken,
                                             @PathVariable String registrationId,
                                             @RequestParam String nick,
                                             @RequestParam String self_intro,
                                             @RequestParam String phone_number
    ) {
        JsonNode googleUserApiData = null;
        try {
            googleUserApiData = loginService.getUserResource(accessToken, "google");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new HashMap<String, String>() {{
                        put("message", "인증에 실패했습니다.");
                        put("debug", e.getMessage());
                    }
                    });
        }

        GoogleUser googleUser = new GoogleUser();
        googleUser.setGgl_id(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));
        googleUser.setGgl_gvn(googleUserApiData.get("given_name").toString().replaceAll("\"", ""));
        googleUser.setGgl_nm(googleUserApiData.get("name").toString().replaceAll("\"", ""));
        googleUser.setGgl_eml(googleUserApiData.get("email").toString().replaceAll("\"", ""));

        LudiumUser ludiumUser = new LudiumUser();
        ludiumUser.setGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));
        ludiumUser.setNick(nick);
        ludiumUser.setSelfIntro(self_intro);
        ludiumUser.setPhnNmb(phone_number);

        try {
            googleUserService.createUser(googleUser);
            ludiumUserService.createUser(ludiumUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {
                        {
                            put("message", "사용자 데이터를 만드는 중에 에러가 발생하였습니다.");
                            put("debug", e.getMessage());
                        }
                    });
        }

        return ResponseEntity.ok(new HashMap<String, String>() {{
            put("nick", nick);
            put("self_intro", self_intro);
            put("phn_nmb", phone_number);
        }});
    }
}
