package com.capitalhub.training.repository;

import com.capitalhub.training.entity.UserCertification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserCertificationRepository extends JpaRepository<UserCertification, Long> {
    List<UserCertification> findByUserIdAndPassedOrderByCreatedAtDesc(Long userId, Boolean passed);

    Optional<UserCertification> findByUserIdAndFormationId(Long userId, Long formationId);
}
