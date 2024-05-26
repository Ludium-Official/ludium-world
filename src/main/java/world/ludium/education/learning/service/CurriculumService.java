package world.ludium.education.learning.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import world.ludium.education.learning.model.Curriculum;
import world.ludium.education.learning.repository.CurriculumRepository;

@Service
public class CurriculumService {

  private final CurriculumRepository curriculumRepository;

  public CurriculumService(CurriculumRepository curriculumRepository) {
    this.curriculumRepository = curriculumRepository;
  }

  public List<Curriculum> getAllCurriculum(UUID learningId) {
    return curriculumRepository.findAllByPostingIdOrderByOrderNum(learningId);
  }

  public Curriculum getCurriculum(UUID curriculumId) {
    return curriculumRepository.findById(curriculumId).orElseThrow();
  }

  public Curriculum createCurriculum(Curriculum curriculum) {
    curriculum.setCurriculumId(UUID.randomUUID());
    curriculum.setCreateAt(new Timestamp(System.currentTimeMillis()));

    return curriculumRepository.save(curriculum);
  }

  public Curriculum updateCurriculum(Curriculum curriculum) {
    return curriculumRepository.save(curriculum);
  }

  public List<Map<String, String>> getAllCurriculumContents(UUID curriculumId) {
    return curriculumRepository.findAllMissionAndArticle(curriculumId);
  }
}
