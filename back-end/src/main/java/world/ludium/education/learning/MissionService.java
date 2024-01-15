package world.ludium.education.learning;

import org.springframework.stereotype.Service;
import world.ludium.education.learning.model.*;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
public class MissionService {
    private final MissionRepository missionRepository;
    private final EnhancedMissionSubmitRepository enhancedMissionSubmitRepository;

    public MissionService(MissionRepository missionRepository,
                          EnhancedMissionSubmitRepository enhancedMissionSubmitRepository) {
        this.missionRepository = missionRepository;
        this.enhancedMissionSubmitRepository = enhancedMissionSubmitRepository;
    }

    public List<Mission> getAllMission() {
        return missionRepository.findAllByOrderByCreateAt();
    }

    public List<Mission> getAllMission(UUID curriculumId) {
        return missionRepository.findAllByCurriculumIdOrderByCreateAt(curriculumId);
    }

    public Mission getMission(UUID missionId) {
        return missionRepository.findById(missionId).orElseThrow();
    }

    public Mission createMission(Mission mission) {
        mission.setMissionId(UUID.randomUUID());
        mission.setCreateAt(new Timestamp(System.currentTimeMillis()));

        return missionRepository.save(mission);
    }

    public Mission updateMission(Mission mission) {
        return missionRepository.save(mission);
    }

    public EnhancedMissionSubmit getMissionSubmit(UUID missionId, UUID usrId) {
        return enhancedMissionSubmitRepository.findByMissionIdAndUsrId(missionId, usrId).orElseThrow();
    }

    public EnhancedMissionSubmit createMissionSubmit(EnhancedMissionSubmit enhancedMissionSubmit) {
        enhancedMissionSubmit.setCreateAt(new Timestamp(System.currentTimeMillis()));
        enhancedMissionSubmit.setStatus(EnhancedMissionSubmitStatus.SUBMIT.toString());

        return enhancedMissionSubmitRepository.save(enhancedMissionSubmit);
    }

    public EnhancedMissionSubmit updateMissionSubmit(EnhancedMissionSubmit enhancedMissionSubmit) {
        return enhancedMissionSubmitRepository.save(enhancedMissionSubmit);
    }
}
