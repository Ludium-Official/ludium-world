package world.ludium.education.learning;

import org.springframework.stereotype.Service;
import world.ludium.education.learning.model.Mission;
import world.ludium.education.learning.model.MissionRepository;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
public class MissionService {
    private final MissionRepository missionRepository;

    public MissionService(MissionRepository missionRepository) {
        this.missionRepository = missionRepository;
    }

    public List<Mission> getAllMission(UUID curriculumId) {
        return missionRepository.findAllByCurriculumIdOrderByCreateAt(curriculumId);
    }

    public Mission createMission(Mission mission) {
        mission.setMissionId(UUID.randomUUID());
        mission.setCreateAt(new Timestamp(System.currentTimeMillis()));

        return missionRepository.save(mission);
    }

    public Mission updateMission(Mission mission) {
        return missionRepository.save(mission);
    }
}
