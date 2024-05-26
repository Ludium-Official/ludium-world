package world.ludium.education.auth.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.auth.dto.UserDTO;
import world.ludium.education.auth.model.GoogleUser;
import world.ludium.education.auth.model.LudiumUser;
import world.ludium.education.auth.service.GoogleUserService;
import world.ludium.education.auth.service.LoginService;
import world.ludium.education.auth.service.LudiumUserService;
import world.ludium.education.util.ResponseException;
import world.ludium.education.util.ResponseUtil;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 루디움 사용자 데이터 처리 컨트롤러
 */
@RestController
@RequestMapping(value = "/user", produces = "application/json")
public class UserController {

    LoginService loginService;
    GoogleUserService googleUserService;
    LudiumUserService ludiumUserService;
    private final ResponseUtil responseUtil;

    /***
     * 서비스와 응답 유틸리티 객체를 초기화하기 위한 생성자
     *
     * @param loginService      로그인 서비스
     * @param googleUserService 구글 사용자 서비스
     * @param ludiumUserService 루디움 사용자 서비스
     * @param responseUtil  응답 유틸리티
     */
    public UserController(LoginService loginService,
                          GoogleUserService googleUserService,
                          LudiumUserService ludiumUserService,
                          ResponseUtil responseUtil) {
        this.loginService = loginService;
        this.googleUserService = googleUserService;
        this.ludiumUserService = ludiumUserService;
        this.responseUtil = responseUtil;
    }

    /**
     * 구글 사용자 정보와 권한을 포함한 모든 사용자 정보를 조회하는 엔드포인트
     *
     * @return UserDTO 리스트를 반환
     */
    @GetMapping("")
    public ResponseEntity<Object> getAllUser() {
        var userDtoList = ludiumUserService.getAllUser()
                .stream()
                .map(user -> {
                    var userRight = ludiumUserService.getUserRight(user.getId());
                    var googleUser = googleUserService.getUserById(user.getGglId());

                    var userDto = new UserDTO();
                    userDto.setId(user.getId());
                    userDto.setNick(user.getNick());
                    userDto.setEmail(googleUser.getGgl_eml());
                    userDto.setContributor(userRight.isCrt());
                    userDto.setProvider(userRight.isPrv());
                    userDto.setAdmin(userRight.isAdm());

                    return userDto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(userDtoList);
    }

    /**
     * OAuth2 로그인을 이용하여 접속한 사용자 권한을 조회하는 엔드포인트
     *
     * @param accessToken 구글 로그인을 성공했을 때 받는 access token
     * @return 사용자 권한 데이터를 반환
     */
    @GetMapping("/right")
    public ResponseEntity<Object> getUserRight(
            @CookieValue(name = "access_token", required = false) String accessToken) {
        try {
            var ludiumUser = ludiumUserService.getUser(accessToken);

            if (ludiumUser == null) {
                return responseUtil.getUnAuthorizedMessage();
            }

            var ludiumUserRight = ludiumUserService.getUserRight(ludiumUser.getId());

            return ResponseEntity.ok(ludiumUserRight);
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("사용자 권한을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    /**
     * 사용자 ID를 이용한 사용자 정보 조회
     *
     * @param usrId 사용자 ID
     * @return 사용자 정보를 반환
     */
    @GetMapping("{usrId}")
    public ResponseEntity<Object> getUser(@PathVariable UUID usrId) {
        try {
            var ludiumUser = ludiumUserService.getUser(usrId);

            if (ludiumUser == null) {
                throw new NoSuchElementException();
            }

            return ResponseEntity.ok(ludiumUser);
        } catch (NoSuchElementException nse) {
            return responseUtil.getNoSuchElementExceptionMessage("사용자 데이터가 없습니다.", nse.getMessage());
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("사용자를 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    /**
     * OAuth2 로그인을 이용하여 접속한 신규 사용자을 가입하는 엔드포인트
     *
     * @param registrationId OAuth2를 이용해서 로그인한 플랫폼(구글)
     * @param ludiumUser     신규 사용자 정보
     * @param accessToken    구글 로그인을 성공했을 때 받는 access token
     * @return 사용자 정보를 반환
     */
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

            if (ludiumUserService.getUser(gglId) != null) {
                return responseUtil.getDuplicateExceptionMessage(
                        new ResponseException("이미 가입한 사용자입니다.", ""));
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

    /**
     * 사용자의 프로바이더 권한을 업데이트 하는 엔드포인트
     *
     * @param accessToken 구글 로그인을 성공했을 때 받는 access token
     * @param userId      사용자 ID
     * @param isProvider  프로바이더 권한 할당(true), 권한 해제 (false)
     * @return 권한 정보를 반환
     */
    @PutMapping("/{userId}/provider")
    public ResponseEntity<Object> updateProviderRight(
            @CookieValue(name = "access_token", required = false) String accessToken,
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

    /**
     * 사용자의 관리자 권한을 업데이트 하는 엔드포인트
     *
     * @param accessToken 구글 로그인을 성공했을 때 받는 access token
     * @param userId      사용자 ID
     * @param isAdmin     관리자 권한 할당(true), 권한 해제 (false)
     * @return 권한 정보를 반환
     */
    @PutMapping("/{userId}/admin")
    public ResponseEntity<Object> updateAdminRight(
            @CookieValue(name = "access_token", required = false) String accessToken,
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

    /**
     * OAuth2 로그인을 이용하여 접속한 사용자 탈퇴하고 쿠키 정보를 삭제하는 엔드포인트
     *
     * @param accessToken 구글 로그인을 성공했을 때 받는 access token
     * @param request     HTTP request
     * @param response    HTTP response
     * @return 탈퇴한 사용자 정보를 반환
     */
    @DeleteMapping("")
    public ResponseEntity<Object> deleteUser(
            @CookieValue(name = "access_token", required = false) String accessToken,
            HttpServletRequest request,
            HttpServletResponse response) {
        var ludiumUser = ludiumUserService.getUser(accessToken);

        if (ludiumUser == null) {
            return responseUtil.getUnAuthorizedMessage();
        }

        var deletedKey = ludiumUser.getGglId();

        ludiumUserService.deleteUser(ludiumUser);
        googleUserService.deleteUser(deletedKey);

        Cookie[] cookies = request.getCookies();

        for (var expiredCookie : cookies) {
            expiredCookie.setMaxAge(0);
            response.addCookie(expiredCookie);
        }

        return ResponseEntity.ok(ludiumUser);
    }
}
