package world.ludium.education.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.auth.google.GoogleUser;
import world.ludium.education.auth.google.GoogleUserService;
import world.ludium.education.auth.ludium.LudiumUser;
import world.ludium.education.auth.ludium.LudiumUserService;
import world.ludium.education.auth.ludium.UserDTO;
import world.ludium.education.util.ResponseException;
import world.ludium.education.util.ResponseUtil;

import java.math.BigInteger;
import java.util.HashMap;
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

    @GetMapping("")
    public ResponseEntity<Object> getAllUser() {
        var userDTOList = ludiumUserService.getAllUser()
                .stream()
                .map(user -> {
                    var userRight = ludiumUserService.getUserRight(user.getId());
                    var googleUser = googleUserService.getUserById(user.getGglId());

                    var userDTO = new UserDTO();
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

    @GetMapping("/right")
    public ResponseEntity<Object> getUserRight(@CookieValue(name = "access_token", required = false) String accessToken) {
        try {
            var ludiumUser = ludiumUserService.getUser(accessToken);

            if(ludiumUser == null) return responseUtil.getUnAuthorizedMessage();

            var ludiumUserRight = ludiumUserService.getUserRight(ludiumUser.getId());

            return ResponseEntity.ok(ludiumUserRight);
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("사용자 권한을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
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

    @PostMapping("/sign-up/{registrationId}")
    public ResponseEntity<Object> signUpUser(@PathVariable String registrationId,
                                             @RequestBody LudiumUser ludiumUser,
                                             @CookieValue(name = "access_token", required = false) String accessToken) {
        try {
            var googleUserApiData = loginService.getUserResource(accessToken, "google");
            var gglId = new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", ""));

            GoogleUser googleUser = new GoogleUser();
            googleUser.setGgl_id(gglId);
            googleUser.setGgl_gvn(googleUserApiData.get("given_name").toString().replaceAll("\"", ""));
            googleUser.setGgl_nm(googleUserApiData.get("name").toString().replaceAll("\"", ""));
            googleUser.setGgl_eml(googleUserApiData.get("email").toString().replaceAll("\"", ""));

            ludiumUser.setGglId(gglId);

            if(ludiumUserService.getUser(gglId) != null) {
                return responseUtil.getDuplicateExceptionMessage(new ResponseException("이미 가입한 회원입니다.", ""));
            }

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

        return ResponseEntity.ok(ludiumUser);
    }

    @PutMapping("/{userId}/provider")
    public ResponseEntity<Object> updateProviderRight(@CookieValue(name = "access_token", required = false) String accessToken,
                                              @PathVariable UUID userId,
                                              @RequestParam boolean isProvider) {
        var provider = ludiumUserService.getUserRight(userId);

        provider.setPrv(isProvider);

        try {
            ludiumUserService.updateUserRight(provider);
            return ResponseEntity.ok(provider);
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("프로바이더 권한을 설정하는 중에 에러가 발생하였습니다.", e.getMessage());
        }
    }

    @PutMapping("/{userId}/admin")
    public ResponseEntity<Object> updateAdminRight(@CookieValue(name = "access_token", required = false) String accessToken,
                                           @PathVariable UUID userId,
                                           @RequestParam boolean isAdmin) {
        var admin = ludiumUserService.getUserRight(userId);

        admin.setAdm(isAdmin);

        try {
            ludiumUserService.updateUserRight(admin);

            return ResponseEntity.ok(admin);
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("관리자 권한을 설정하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @DeleteMapping("")
    public ResponseEntity<Object> deleteUser(@CookieValue(name = "access_token", required = false) String accessToken,
                                             HttpServletRequest request,
                                             HttpServletResponse response) {
        var ludiumUser = ludiumUserService.getUser(accessToken);

        if (ludiumUser == null)
            return responseUtil.getUnAuthorizedMessage();

        var deletedKey = ludiumUser.getGglId();

        ludiumUserService.deleteUser(ludiumUser);
        googleUserService.deleteUser(deletedKey);

        Cookie[] cookies = request.getCookies();

        for(var expiredCookie: cookies) {
            expiredCookie.setMaxAge(0);
            response.addCookie(expiredCookie);
        }

        return ResponseEntity.ok(ludiumUser);
    }
}
