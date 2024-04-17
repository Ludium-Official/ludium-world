package world.ludium.education.auth.dto;

import java.util.UUID;

public class UserDTO {

  private UUID id;
  private String nick;
  private String email;
  private boolean contributor;
  private boolean provider;
  private boolean admin;

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public String getNick() {
    return nick;
  }

  public void setNick(String nick) {
    this.nick = nick;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public boolean isContributor() {
    return contributor;
  }

  public void setContributor(boolean contributor) {
    this.contributor = contributor;
  }

  public boolean isProvider() {
    return provider;
  }

  public void setProvider(boolean provider) {
    this.provider = provider;
  }

  public boolean isAdmin() {
    return admin;
  }

  public void setAdmin(boolean admin) {
    this.admin = admin;
  }
}
