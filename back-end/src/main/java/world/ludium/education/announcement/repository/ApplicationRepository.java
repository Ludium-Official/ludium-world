package world.ludium.education.announcement.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import world.ludium.education.announcement.model.Application;
import world.ludium.education.profile.dto.MyApplicationDTO;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {

  List<Application> findAllByDetailIdAndRole(UUID detailId, String role);

  Optional<Application> findAllByDetailIdAndRoleAndUsrId(UUID detailId, String role, UUID usrId);

  @Query("""
      SELECT NEW world.ludium.education.profile.dto.MyApplicationDTO(a.applicationId,
                                                                 a.title,
                                                                 a.detailId,
                                                                 a.role,
                                                                 a.createAt,
                                                                 dp.postingId)
        FROM Application a
        LEFT JOIN DetailedAnnouncement dp
          ON a.detailId = dp.detailId
       WHERE a.usrId = :usrId
       ORDER BY a.createAt DESC
      """)
  List<MyApplicationDTO> findAllByUsrIdOrderByCreateAt(@Param("usrId") UUID usrId);

  @Query("""
      SELECT NEW world.ludium.education.profile.dto.MyApplicationDTO(a.applicationId,
                                                                 a.title,
                                                                 a.detailId,
                                                                 a.role,
                                                                 a.createAt,
                                                                 dp.postingId)
        FROM Application a
        LEFT JOIN DetailedAnnouncement dp
          ON a.detailId = dp.detailId
       WHERE a.usrId = :usrId
       ORDER BY a.createAt DESC
      """)
  List<MyApplicationDTO> findTop4ByUsrIdOrderByCreateAt(@Param("usrId") UUID usrId,
      Pageable pageable);
}
