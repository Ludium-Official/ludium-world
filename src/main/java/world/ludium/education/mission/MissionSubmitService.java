package world.ludium.education.mission;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class MissionSubmitService {

    private final MissionSubmitRepository missionSubmitRepository;
    private final MissionSubmitHistoryRepository missionSubmitHistoryRepository;
    private final MissionSubmitCommentRepository missionSubmitCommentRepository;

    public MissionSubmitService(MissionSubmitRepository missionSubmitRepository,
                                MissionSubmitHistoryRepository missionSubmitHistoryRepository,
                                MissionSubmitCommentRepository missionSubmitCommentRepository) {
        this.missionSubmitRepository = missionSubmitRepository;
        this.missionSubmitHistoryRepository = missionSubmitHistoryRepository;
        this.missionSubmitCommentRepository = missionSubmitCommentRepository;
    }

    public MissionSubmit createMissionSubmit(MissionSubmit missionSubmit) {
        missionSubmit.setId(UUID.randomUUID());
        missionSubmit.setVldStt(false);

        return missionSubmitRepository.save((missionSubmit));
    }

    public MissionSubmitHistory createMissionSubmitHistory(MissionSubmitHistory missionSubmitHistory) {
        missionSubmitHistory.setId(UUID.randomUUID());
        missionSubmitHistory.setCreateAt(ZonedDateTime.now());

        return missionSubmitHistoryRepository.save(missionSubmitHistory);
    }

    public List<MissionSubmit> getMissionSubmits(UUID missionId) {
        return missionSubmitRepository.findAllByMsnId(missionId);
    }

    public MissionSubmit validateMissionSubmit(UUID submitId) {
        MissionSubmit missionSubmit = missionSubmitRepository.findById(submitId)
                .orElseThrow(() -> new EntityNotFoundException("미션 서브밋을 찾을 수 없습니다. ID: " + submitId));

        missionSubmit.setVldStt(true);

        return missionSubmitRepository.save(missionSubmit);
    }

    public MissionSubmit invalidateMissionSubmit(UUID submitId) {
        MissionSubmit missionSubmit = missionSubmitRepository.findById(submitId)
                .orElseThrow(() -> new EntityNotFoundException("미션 서브밋을 찾을 수 없습니다. ID: " + submitId));

        missionSubmit.setVldStt(false);

        return missionSubmitRepository.save(missionSubmit);
    }

    public MissionSubmit getMissionSubmit(UUID submitId) {
        return missionSubmitRepository.findById(submitId)
                .orElseThrow(() -> new EntityNotFoundException("미션 서브밋을 찾을 수 없습니다. ID: " + submitId));
    }

    public MissionSubmit updateMissionSubmit(UUID submitId, String content) {
        MissionSubmit missionSubmit = missionSubmitRepository.findById(submitId)
                .orElseThrow(() -> new EntityNotFoundException("미션 서브밋을 찾을 수 없습니다. ID: " + submitId));

        missionSubmit.setContent(content);

        return missionSubmitRepository.save(missionSubmit);
    }

    public List<MissionSubmitHistory> getMissionSubmitHistory(UUID submitId) {
        return missionSubmitHistoryRepository.findAllByMsnSbmId(submitId);
    }

    public void createMissionSubmitComment(MissionSubmitComment missionSubmitComment) {
        missionSubmitComment.setId(UUID.randomUUID());
        missionSubmitComment.setCreateAt(ZonedDateTime.now());

        missionSubmitCommentRepository.save(missionSubmitComment);
    }

    public List<MissionSubmitComment> getMissionSubmitComments(UUID submitId) {
        return missionSubmitCommentRepository.findAllByMsnSbmId(submitId);
    }

    public MissionSubmitComment getMissionSubmitComment(UUID commentId) {
        return missionSubmitCommentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("미션 코멘트를 찾을 수 없습니다. ID: " + commentId));
    }

    public void updateMissionSubmitComment(MissionSubmitComment missionSubmitComment) {
        missionSubmitCommentRepository.save(missionSubmitComment);
    }

    public void deleteMissionSubmitComment(MissionSubmitComment missionSubmitComment) {
        missionSubmitCommentRepository.delete(missionSubmitComment);
    }
}
