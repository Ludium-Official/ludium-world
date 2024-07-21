package world.ludium.education.payment.service;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.ludium.education.payment.model.RewardClaim;
import world.ludium.education.payment.repository.RewardClaimRepository;

import java.util.Optional;
import java.util.UUID;

@Service
public class RewardClaimService {
    private final RewardClaimRepository rewardClaimRepository;

    public RewardClaimService(RewardClaimRepository rewardClaimRepository) {
        this.rewardClaimRepository = rewardClaimRepository;
    }

    public Mono<RewardClaim> getRewardClaimMono(UUID missionId, UUID userId) {
        return Mono.defer(() -> {
            Optional<RewardClaim> rewardClaim = rewardClaimRepository.findByResourceIdAndUserId(missionId, userId);
            return rewardClaim.map(Mono::just).orElseGet(Mono::empty);
        });
    }
}
