package world.ludium.education.payment.service;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.ludium.education.payment.model.RewardClaim;
import world.ludium.education.payment.repository.MissionRewardClaimRepository;

import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Service
public class MissionRewardClaimService {
    private final MissionRewardClaimRepository missionRewardClaimRepository;

    public MissionRewardClaimService(MissionRewardClaimRepository missionRewardClaimRepository) {
        this.missionRewardClaimRepository = missionRewardClaimRepository;
    }

    public Mono<RewardClaim> getMissionRewardClaimMono(UUID missionId, UUID userId) {
        return Mono.defer(() -> {
            Optional<RewardClaim> rewardClaim = missionRewardClaimRepository.findByMissionIdAndUserId(missionId, userId);
            return rewardClaim.map(Mono::just).orElseGet(Mono::empty);
        });
    }
}
