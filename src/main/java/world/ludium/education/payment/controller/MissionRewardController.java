package world.ludium.education.payment.controller;

import jakarta.security.auth.message.AuthException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.ludium.education.auth.service.LudiumUserService;
import world.ludium.education.payment.model.RewardClaim;
import world.ludium.education.payment.service.MissionRewardClaimService;

import java.time.Duration;
import java.util.NoSuchElementException;
import java.util.UUID;

@RestController
@RequestMapping(value = "/mission-reward", produces = MediaType.APPLICATION_JSON_VALUE)
public class MissionRewardController {
    private static final Logger logger = LoggerFactory.getLogger(MissionRewardController.class);

    private final MissionRewardClaimService missionRewardClaimService;
    private final LudiumUserService ludiumUserService;

    public MissionRewardController(MissionRewardClaimService missionRewardClaimService,
                                   LudiumUserService ludiumUserService) {
        this.missionRewardClaimService = missionRewardClaimService;
        this.ludiumUserService = ludiumUserService;
    }

    @GetMapping(value = "/status", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Mono<ResponseEntity<Flux<String>>> streamEvents(@RequestParam(name = "missionId") UUID missionId,
                                                           @CookieValue(name = "access_token", required = false) String accessToken) throws AuthException {
        return ludiumUserService.getUserMono(accessToken)
                .switchIfEmpty(Mono.error(new AuthException("Unauthorized")))
                .flatMap(ludiumUser -> missionRewardClaimService.getMissionRewardClaimMono(missionId, ludiumUser.getId())
                        .flatMap(rewardClaim -> getEventStream(missionId, ludiumUser.getId()))
                        .switchIfEmpty(Mono.error(new NoSuchElementException("Mission reward claim not found"))))
                .onErrorResume(AuthException.class, e -> unauthorizedResponse())
                .onErrorResume(NoSuchElementException.class, this::notFoundResponse)
                .onErrorResume(Exception.class, this::internalServerErrorResponse);
    }

    private Mono<ResponseEntity<Flux<String>>> getEventStream(UUID missionId, UUID userId) {
        var eventStream = Flux.interval(Duration.ofSeconds(2))
                .flatMap(sequence -> missionRewardClaimService.getMissionRewardClaimMono(missionId, userId)
                        .map(RewardClaim::getRewardClaimStatus))
                .takeUntil(status -> "TRANSACTION_APPROVED".equalsIgnoreCase(status) || "TRANSACTION_FAILED".equalsIgnoreCase(status));

        return Mono.just(ResponseEntity.ok().contentType(MediaType.TEXT_EVENT_STREAM).body(eventStream));
    }

    private Mono<ResponseEntity<Flux<String>>> unauthorizedResponse() {
        return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Flux.just("{\"error\": \"Unauthorized\"}")));
    }

    private Mono<ResponseEntity<Flux<String>>> notFoundResponse(NoSuchElementException e) {
        logger.error("NoSuchElementException: {}", e.getMessage(), e);
        return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Flux.just("{\"error\": \"Mission reward claim not found\"}")));
    }

    private Mono<ResponseEntity<Flux<String>>> internalServerErrorResponse(Throwable e) {
        logger.error("Exception: {}", e.getMessage(), e);
        return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Flux.just("{\"error\": \"Mission claim status error\"}")));
    }
}
