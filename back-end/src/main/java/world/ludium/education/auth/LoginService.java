package world.ludium.education.auth;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.core.env.Environment;
import org.springframework.http.*;
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

    public String socialLogin(String code, String registrationId) {
        return getAccessToken(code, registrationId);
    }

    private String getAccessToken(String authorizationCode, String registrationId) {
        String clientId = env.getProperty("spring.security.oauth2.client.registration." + registrationId + ".client-id");
        String clientSecret = env.getProperty("spring.security.oauth2.client.registration." + registrationId + ".client-secret");
        String redirectUri = env.getProperty("spring.security.oauth2.client.registration." + registrationId + ".redirect-uri");
        String tokenUri = env.getProperty("spring.security.oauth2.client.provider." + registrationId + ".token-uri");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>(){
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
        ResponseEntity<JsonNode> responseNode = restTemplate.exchange(tokenUri, HttpMethod.POST, entity, JsonNode.class);
        JsonNode accessTokenNode = responseNode.getBody();
        assert accessTokenNode != null;
        return accessTokenNode.get("access_token").asText();
    }

    public JsonNode getUserResource(String accessToken, String registrationId) {
        String resourceUri = env.getProperty("spring.security.oauth2.client.provider." + registrationId + ".resource-uri");

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<HttpHeaders> entity = new HttpEntity<>(headers);

        assert resourceUri != null;
        return restTemplate.exchange(resourceUri, HttpMethod.GET, entity, JsonNode.class).getBody();
    }
}
