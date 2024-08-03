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
import world.ludium.education.payment.service.RewardClaimService;

import java.time.Duration;
import java.util.NoSuchElementException;
import java.util.UUID;

@RestController
@RequestMapping(value = "/reward", produces = MediaType.APPLICATION_JSON_VALUE)
public class RewardController {
    private static final Logger logger = LoggerFactory.getLogger(RewardController.class);

    private final RewardClaimService rewardClaimService;
    private final LudiumUserService ludiumUserService;

    public RewardController(RewardClaimService rewardClaimService,
                            LudiumUserService ludiumUserService) {
        this.rewardClaimService = rewardClaimService;
        this.ludiumUserService = ludiumUserService;
    }

    @GetMapping(value = "/status", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Mono<ResponseEntity<Flux<String>>> streamEvents(@RequestParam(name = "resourceId") UUID resourceId,
                                                           @CookieValue(name = "access_token", required = false) String accessToken) throws AuthException {
        return ludiumUserService.getUserMono(accessToken)
                .switchIfEmpty(Mono.error(new AuthException("Unauthorized")))
                .flatMap(ludiumUser -> rewardClaimService.getRewardClaimMono(resourceId, ludiumUser.getId())
                        .flatMap(rewardClaim -> getEventStream(resourceId, ludiumUser.getId()))
                        .switchIfEmpty(Mono.error(new NoSuchElementException("RewardClaim not found"))))
                .onErrorResume(AuthException.class, e -> unauthorizedResponse())
                .onErrorResume(NoSuchElementException.class, this::notFoundResponse)
                .onErrorResume(Exception.class, this::internalServerErrorResponse);
    }

    private Mono<ResponseEntity<Flux<String>>> getEventStream(UUID resourceId, UUID userId) {
        var eventStream = Flux.interval(Duration.ofSeconds(2))
                .flatMap(sequence -> rewardClaimService.getRewardClaimMono(resourceId, userId)
                        .map(RewardClaim::getRewardClaimStatus))
                .takeUntil(status -> "TRANSACTION_APPROVED".equalsIgnoreCase(status) || "TRANSACTION_FAILED".equalsIgnoreCase(status));

        return Mono.just(ResponseEntity.ok().contentType(MediaType.TEXT_EVENT_STREAM).body(eventStream));
    }

    private Mono<ResponseEntity<Flux<String>>> unauthorizedResponse() {
        return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Flux.just("{\"error\": \"Unauthorized\"}")));
    }

    private Mono<ResponseEntity<Flux<String>>> notFoundResponse(NoSuchElementException e) {
        logger.error("NoSuchElementException: {}", e.getMessage(), e);
        return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Flux.just("{\"error\": \"RewardClaim not found\"}")));
    }

    private Mono<ResponseEntity<Flux<String>>> internalServerErrorResponse(Throwable e) {
        logger.error("Exception: {}", e.getMessage(), e);
        return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Flux.just("{\"error\": \"RewardClaimStatus error\"}")));
    }
}
