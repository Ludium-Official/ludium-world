package world.ludium.education.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class LoginService {

  private final Environment env;
  private final RestTemplate restTemplate = new RestTemplate();

  public LoginService(Environment env) {
    this.env = env;
  }

  public JsonNode socialLogin(String code, String registrationId, String type) {
    return getAccessToken(code, registrationId, type);
  }

  private JsonNode getAccessToken(String authorizationCode, String registrationId, String type) {
    String clientId = env.getProperty(
        "spring.security.oauth2.client.registration." + registrationId + ".client-id");
    String clientSecret = env.getProperty(
        "spring.security.oauth2.client.registration." + registrationId + ".client-secret");
    String redirectUri = type.equals("provider") ? env.getProperty(
        "spring.security.oauth2.client.registration." + registrationId + ".provider.redirect-uri")
        : type.equals("contributor") ? env.getProperty(
            "spring.security.oauth2.client.registration." + registrationId
                + ".contributor.redirect-uri")
            : env.getProperty("spring.security.oauth2.client.registration." + registrationId
                + ".admin.redirect-uri");
    String tokenUri = env.getProperty(
        "spring.security.oauth2.client.provider." + registrationId + ".token-uri");

    MultiValueMap<String, String> params = new LinkedMultiValueMap<>() {
      {
        add("code", authorizationCode);
        add("client_id", clientId);
        add("client_secret", clientSecret);
        add("redirect_uri", redirectUri);
        add("grant_type", "authorization_code");
      }
    };

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

    assert tokenUri != null;
    ResponseEntity<JsonNode> responseNode = restTemplate.exchange(tokenUri, HttpMethod.POST, entity,
        JsonNode.class);
    JsonNode googleTokenNode = responseNode.getBody();
    assert googleTokenNode != null;
    return googleTokenNode;
  }

  public JsonNode getAccessToken(String refreshToken) {
    String clientId = env.getProperty(
        "spring.security.oauth2.client.registration.google.client-id");
    String clientSecret = env.getProperty(
        "spring.security.oauth2.client.registration.google.client-secret");
    String tokenUri = env.getProperty("spring.security.oauth2.client.provider.google.token-uri");

    MultiValueMap<String, String> params = new LinkedMultiValueMap<>() {
      {
        add("client_id", clientId);
        add("client_secret", clientSecret);
        add("grant_type", "refresh_token");
        add("refresh_token", refreshToken);
      }
    };

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

    assert tokenUri != null;
    ResponseEntity<JsonNode> responseNode = restTemplate.exchange(tokenUri, HttpMethod.POST, entity,
        JsonNode.class);
    JsonNode googleTokenNode = responseNode.getBody();
    assert googleTokenNode != null;
    return googleTokenNode;
  }

  public JsonNode getUserResource(String accessToken, String registrationId) {
    String resourceUri = env.getProperty(
        "spring.security.oauth2.client.provider." + registrationId + ".resource-uri");

    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + accessToken);

    HttpEntity<HttpHeaders> entity = new HttpEntity<>(headers);

    assert resourceUri != null;
    return restTemplate.exchange(resourceUri, HttpMethod.GET, entity, JsonNode.class).getBody();
  }
}
