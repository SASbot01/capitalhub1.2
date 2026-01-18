package com.capitalhub.training.repository;

import com.capitalhub.training.entity.UserExamAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserExamAttemptRepository extends JpaRepository<UserExamAttempt, Long> {
    List<UserExamAttempt> findByUserIdAndFormationIdOrderByAttemptedAtDesc(Long userId, Long formationId);
}
