package world.ludium.education.learning;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import world.ludium.education.learning.model.LearnMonitorDTO;
import world.ludium.education.learning.model.Learning;
import world.ludium.education.learning.model.LearningRepository;
import world.ludium.education.profile.LearningDTO;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
public class LearningService {
    private final LearningRepository learningRepository;

    public LearningService(LearningRepository learningRepository) {
        this.learningRepository = learningRepository;
    }
    public List<Learning> getAllLearning() {
        return learningRepository.findAllByOrderByCreateAtDesc();
    }

    public List<Learning> getTop5Learning() {
        return learningRepository.findTop5ByOrderByCreateAtDesc();
    }

    public List<LearningDTO> getAllLearningDTO(UUID usrId) {
        return learningRepository.getAllLearningDTOByUsrId(usrId);
    }

    public List<LearningDTO> getTop4LearningDTO(UUID usrId) {
        return learningRepository.getTop4LearningDTOByUsrId(usrId, PageRequest.of(0, 4));
    }

    public Learning getLearning(UUID learningId) {
        return learningRepository.findById(learningId).orElseThrow();
    }

    public Learning createLearning(Learning learning) {
        learning.setPostingId(UUID.randomUUID());
        learning.setCreateAt(new Timestamp(System.currentTimeMillis()));

        return learningRepository.save(learning);
    }

    public Learning updateLearning(Learning learning) {
        return learningRepository.save(learning);
    }

    public List<LearnMonitorDTO> getAllMonitor(UUID learningId) {
        return learningRepository.findAllLearningMonitor(learningId);
    }
}
