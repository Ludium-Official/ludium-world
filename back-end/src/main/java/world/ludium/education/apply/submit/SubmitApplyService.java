package world.ludium.education.apply.submit;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import world.ludium.education.article.Article;
import world.ludium.education.article.ArticleService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SubmitApplyService {
    private final SubmitApplyReferenceRepository submitApplyReferenceRepository;
    private final ArticleService articleService;

    public SubmitApplyService(SubmitApplyReferenceRepository submitApplyReferenceRepository,
                              ArticleService articleService) {
        this.submitApplyReferenceRepository = submitApplyReferenceRepository;
        this.articleService = articleService;
    }

    @Transactional
    public SubmitApplyReference createSubmitApplyReference(SubmitApplyReference submitApplyReference, Article applySubmit) {
        articleService.createArticle(applySubmit);

        submitApplyReference.setSbmId(applySubmit.getId());

        return submitApplyReferenceRepository.save(submitApplyReference);
    }

    public List<Article> getSubmitApplyReference(UUID applyId) {
        var submitList = submitApplyReferenceRepository
                .findAllByAplId(applyId)
                .stream()
                .map(submit -> submit.getSbmId())
                .collect(Collectors.toList());

        return articleService.getAllArticle(submitList);
    }

    public SubmitApplyReference getSubmitApplyReference(UUID applyId, UUID userId) {
        return submitApplyReferenceRepository.findByAplIdAndUsrId(applyId, userId).orElse(new SubmitApplyReference());
    }

    public long getSubmitApplyCount(UUID applyId) {
        return submitApplyReferenceRepository.countByAplId(applyId);
    }
}
