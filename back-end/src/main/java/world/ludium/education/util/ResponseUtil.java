package world.ludium.education.util;

import java.util.HashMap;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class ResponseUtil {

  public ResponseEntity<Object> getUnAuthorizedMessage() {
    return ResponseEntity
        .status(HttpStatus.UNAUTHORIZED)
        .body(new ResponseException("인증에 실패했습니다.", ""));
  }

  public ResponseEntity<Object> getExceptionMessage(String message, String debugMessage) {
    var exceptionResponse = new HashMap<String, String>();

    exceptionResponse.put("message", message);
    exceptionResponse.put("debug", debugMessage);

    return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(exceptionResponse);
  }

  public ResponseEntity<Object> getNoSuchElementExceptionMessage(String message,
      String debugMessage) {
    var exceptionResponse = new HashMap<String, String>();

    exceptionResponse.put("message", message);
    exceptionResponse.put("debug", debugMessage);

    return ResponseEntity
        .status(HttpStatus.NOT_FOUND)
        .body(exceptionResponse);
  }

  public ResponseEntity<Object> getForbiddenExceptionMessage(ResponseException responseException) {
    return ResponseEntity
        .status(HttpStatus.FORBIDDEN)
        .body(responseException);
  }

  public ResponseEntity<Object> getDuplicateExceptionMessage(ResponseException responseException) {
    return ResponseEntity
        .status(HttpStatus.CONFLICT)
        .body(responseException);
  }
}
