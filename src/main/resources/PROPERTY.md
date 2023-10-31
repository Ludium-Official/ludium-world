```yml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: google-oauth2-client-registration-id
            client-secret: google-oauth2-client-registration-secret
            redirect-uri: google-oauth2-client-registration-redirect-uri
            scope:
              - profile
              - email
            authorizationGrantType: authorization_code
        provider:
          google:
            authorization-uri: https://accounts.google.com/o/oauth2/v2/auth
            token-uri: https://oauth2.googleapis.com/token
            resource-uri: https://www.googleapis.com/oauth2/v2/userinfo
  datasource:
    driver-class-name: org.postgresql.Driver
    url: jdbc:postgresql://db-url/dbname
    username: username
    password: password

logging:
  level:
    root: INFO
    org.springframework.security: DEBUG
    org.springframework.security.oauth2: DEBUG
    org.springframework.web: DEBUG

ludium:
  world:
    redirect-uri: frontend-uri
```
