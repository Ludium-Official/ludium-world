package world.ludium.education.learning;

import org.springframework.stereotype.Service;
import world.ludium.education.learning.model.Learning;
import world.ludium.education.learning.model.LearningRepository;

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
        return learningRepository.findAllByOrderByCreateAt();
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
}
