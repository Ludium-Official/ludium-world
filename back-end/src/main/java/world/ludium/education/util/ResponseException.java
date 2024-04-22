package world.ludium.education.util;

import java.util.Objects;

public record ResponseException(String message, String debug) {

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ResponseException that = (ResponseException) o;
    return Objects.equals(message, that.message) && Objects.equals(debug, that.debug);
  }

  @Override
  public int hashCode() {
    return Objects.hash(message, debug);
  }

  @Override
  public String toString() {
    return "ResponseException{"
        + "message='" + message + '\''
        + ", debug='" + debug + '\''
        + '}';
  }
}
