package world.ludium.education.auth;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.auth.google.GoogleUser;
import world.ludium.education.auth.google.GoogleUserService;
import world.ludium.education.auth.ludium.LudiumUser;
import world.ludium.education.auth.ludium.LudiumUserRight;
import world.ludium.education.auth.ludium.LudiumUserService;
import world.ludium.education.auth.ludium.UserDTO;
import world.ludium.education.util.ResponseUtil;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/user", produces = "application/json")
public class UserController {
    LoginService loginService;
    GoogleUserService googleUserService;
    LudiumUserService ludiumUserService;
    private final ResponseUtil responseUtil;

    public UserController(LoginService loginService,
                          GoogleUserService googleUserService,
                          LudiumUserService ludiumUserService,
                          ResponseUtil responseUtil) {
        this.loginService = loginService;
        this.googleUserService = googleUserService;
        this.ludiumUserService = ludiumUserService;
        this.responseUtil = responseUtil;
    }

    @PostMapping("/sign-up/{registrationId}")
    public ResponseEntity<Object> signUpUser(@CookieValue(name = "access_token", required = false) String accessToken,
                                             @PathVariable String registrationId,
                                             @RequestBody LudiumUser ludiumUser) {
        try {
            var googleUserApiData = loginService.getUserResource(accessToken, "google");

            GoogleUser googleUser = new GoogleUser();
            googleUser.setGgl_id(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));
            googleUser.setGgl_gvn(googleUserApiData.get("given_name").toString().replaceAll("\"", ""));
            googleUser.setGgl_nm(googleUserApiData.get("name").toString().replaceAll("\"", ""));
            googleUser.setGgl_eml(googleUserApiData.get("email").toString().replaceAll("\"", ""));

            ludiumUser.setGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

            googleUserService.createUser(googleUser);
            ludiumUserService.createUser(ludiumUser);
        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
//                    new HashMap<String, String>() {
//                        {
//                            put("message", "인증에 실패했습니다.");
//                            put("debug", e.getMessage());
//                        }
//                    });
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {
                        {
                            put("message", "사용자 데이터를 만드는 중에 에러가 발생하였습니다.");
                            put("debug", e.getMessage());
                        }
                    });
        }

        return ResponseEntity.ok(ludiumUser);
    }

    @GetMapping("")
    public ResponseEntity getAllUser() {
        List<UserDTO> userDTOList = ludiumUserService.getAllUser()
                .stream()
                .map(user -> {
                    LudiumUserRight userRight = ludiumUserService.getUserRight(user.getId());
                    GoogleUser googleUser = googleUserService.getUserById(user.getGglId());

                    UserDTO userDTO = new UserDTO();
                    userDTO.setId(user.getId());
                    userDTO.setNick(user.getNick());
                    userDTO.setEmail(googleUser.getGgl_eml());
                    userDTO.setContributor(userRight.isCrt());
                    userDTO.setProvider(userRight.isPrv());
                    userDTO.setAdmin(userRight.isAdm());

                    return userDTO;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(userDTOList);
    }

    @GetMapping("{usrId}")
    public ResponseEntity<Object> getUser(@PathVariable UUID usrId) {
        try {
            var ludiumUser = ludiumUserService.getUser(usrId);

            if (ludiumUser == null) throw new NoSuchElementException();

            return ResponseEntity.ok(ludiumUser);
        } catch (NoSuchElementException nse) {
            return responseUtil.getNoSuchElementExceptionMessage("사용자 데이터가 없습니다.", nse.getMessage());
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("사용자를 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @PutMapping("/{userId}/provider")
    public ResponseEntity updateProviderRight(@CookieValue(name = "access_token", required = false) String accessToken,
                                              @PathVariable UUID userId,
                                              @RequestParam boolean isProvider) {
        LudiumUserRight provider = ludiumUserService.getUserRight(userId);

        provider.setPrv(isProvider);

        try {
            ludiumUserService.updateUserRight(provider);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {
                        {
                            put("message", "프로바이더를 설정하는 중에 에러가 발생하였습니다.");
                            put("debug", e.getMessage());
                        }
                    });
        }

        return ResponseEntity.ok(provider);
    }

    @PutMapping("/{userId}/admin")
    public ResponseEntity updateAdminRight(@CookieValue(name = "access_token", required = false) String accessToken,
                                           @PathVariable UUID userId,
                                           @RequestParam boolean isAdmin) {
        var admin = ludiumUserService.getUserRight(userId);

        admin.setAdm(isAdmin);

        try {
            ludiumUserService.updateUserRight(admin);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {
                        {
                            put("message", "관리자를 설정하는 중에 에러가 발생하였습니다.");
                            put("debug", e.getMessage());
                        }
                    });
        }

        return ResponseEntity.ok(admin);
    }
}
