package world.ludium.education.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.HashMap;

@Component
public class ResponseUtil {
    public ResponseEntity<Object> getUnAuthorizedMessage() {
        var unAuthorizedResponse = new HashMap<String, String>();

        unAuthorizedResponse.put("message", "인증에 실패했습니다.");

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(unAuthorizedResponse);
    }

    public ResponseEntity<Object> getExceptionMessage(String message, String debugMessage) {
        var exceptionResponse = new HashMap<String, String>();

        exceptionResponse.put("message", message);
        exceptionResponse.put("debug", debugMessage);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(exceptionResponse);
    }

    public ResponseEntity<Object> getNoSuchElementExceptionMessage(String message, String debugMessage) {
        var exceptionResponse = new HashMap<String, String>();

        exceptionResponse.put("message", message);
        exceptionResponse.put("debug", debugMessage);

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(exceptionResponse);
    }
}
