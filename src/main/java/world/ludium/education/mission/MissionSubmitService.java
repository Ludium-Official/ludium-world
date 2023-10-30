package world.ludium.education.mission;

import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.UUID;

@Service
public class MissionSubmitService {

    private final MissionSubmitRepository missionSubmitRepository;
    private final MissionSubmitHistoryRepository missionSubmitHistoryRepository;

    public MissionSubmitService(MissionSubmitRepository missionSubmitRepository,
                                MissionSubmitHistoryRepository missionSubmitHistoryRepository) {
        this.missionSubmitRepository = missionSubmitRepository;
        this.missionSubmitHistoryRepository = missionSubmitHistoryRepository;
    }

    public MissionSubmit createMissionSubmit(MissionSubmit missionSubmit) {
        missionSubmit.setId(UUID.randomUUID());
        missionSubmit.setVldStt(false);

        return missionSubmitRepository.save((missionSubmit));
    }

    public MissionSubmitHistory createMissionSubmitHistory(MissionSubmitHistory missionSubmitHistory) {
        missionSubmitHistory.setId((UUID.randomUUID()));
        missionSubmitHistory.setCreateAt(ZonedDateTime.now());

        return missionSubmitHistoryRepository.save(missionSubmitHistory);
    }
}
