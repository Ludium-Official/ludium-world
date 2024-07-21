package world.ludium.education.payment.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "reward_claim")
public class RewardClaim {
    @Id
    private UUID id;
    private UUID resourceId;
    private String resourceType;
    private UUID coinNetworkId;
    private String rewardClaimStatus;
    private Integer amount;
    private UUID userId;
    private String userAddress;
    private Timestamp createdDate;
    private Timestamp updatedDate;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getResourceId() {
        return resourceId;
    }

    public void setResourceId(UUID resourceId) {
        this.resourceId = resourceId;
    }

    public UUID getCoinNetworkId() {
        return coinNetworkId;
    }

    public void setCoinNetworkId(UUID coinNetworkId) {
        this.coinNetworkId = coinNetworkId;
    }

    public String getRewardClaimStatus() {
        return rewardClaimStatus;
    }

    public void setRewardClaimStatus(String rewardClaimStatus) {
        this.rewardClaimStatus = rewardClaimStatus;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getUserAddress() {
        return userAddress;
    }

    public void setUserAddress(String userAddress) {
        this.userAddress = userAddress;
    }

    public Timestamp getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Timestamp createdDate) {
        this.createdDate = createdDate;
    }

    public Timestamp getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Timestamp updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }
}
