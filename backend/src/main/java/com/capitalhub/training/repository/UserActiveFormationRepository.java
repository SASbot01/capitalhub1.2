package com.capitalhub.training.repository;

import com.capitalhub.training.entity.UserActiveFormation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserActiveFormationRepository extends JpaRepository<UserActiveFormation, Long> {
    Optional<UserActiveFormation> findByUserId(Long userId);

    void deleteByUserId(Long userId);
}
