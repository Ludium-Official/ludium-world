package world.ludium.education.learning.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import world.ludium.education.learning.model.EnhancedMissionSubmit;
import world.ludium.education.learning.model.EnhancedMissionSubmitComment;
import world.ludium.education.learning.model.EnhancedMissionSubmitStatus;
import world.ludium.education.learning.model.Mission;
import world.ludium.education.learning.repository.EnhancedMissionSubmitCommentRepository;
import world.ludium.education.learning.repository.EnhancedMissionSubmitRepository;
import world.ludium.education.learning.repository.MissionRepository;
import world.ludium.education.profile.dto.MyMissionDTO;

@Service
public class MissionService {

  private final MissionRepository missionRepository;
  private final EnhancedMissionSubmitRepository enhancedMissionSubmitRepository;
  private final EnhancedMissionSubmitCommentRepository enhancedMissionSubmitCommentRepository;

  public MissionService(MissionRepository missionRepository,
      EnhancedMissionSubmitRepository enhancedMissionSubmitRepository,
      EnhancedMissionSubmitCommentRepository enhancedMissionSubmitCommentRepository) {
    this.missionRepository = missionRepository;
    this.enhancedMissionSubmitRepository = enhancedMissionSubmitRepository;
    this.enhancedMissionSubmitCommentRepository = enhancedMissionSubmitCommentRepository;
  }

  public List<Mission> getAllMission() {
    return missionRepository.findAllByOrderByCreateAtDesc();
  }

  public List<Mission> getAllMission(UUID curriculumId) {
    return missionRepository.findAllByCurriculumIdOrderByOrderNum(curriculumId);
  }

  public List<MyMissionDTO> getAllMyMissionDTO(UUID usrId) {
    return missionRepository.findAllByUsrIdOrderByCreateAt(usrId);
  }

  public List<MyMissionDTO> getTop4MyMissionDTO(UUID usrId) {
    return missionRepository.findTop4ByUsrIdOrderByCreateAt(usrId, PageRequest.of(0, 4));
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

  public List<EnhancedMissionSubmit> getAllMissionSubmit(UUID missionId) {
    return enhancedMissionSubmitRepository.findAllByMissionIdOrderByCreateAt(missionId);
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

  public List<EnhancedMissionSubmitComment> getAllMissionSubmitComment(UUID missionId, UUID usrId) {
    return enhancedMissionSubmitCommentRepository.findAllByMissionIdAndUsrIdOrderByCreateAt(
        missionId, usrId);
  }

  public EnhancedMissionSubmitComment createMissionSubmitComment(
      EnhancedMissionSubmitComment missionSubmitComment) {
    missionSubmitComment.setCreateAt(new Timestamp(System.currentTimeMillis()));

    return enhancedMissionSubmitCommentRepository.save(missionSubmitComment);
  }
}
