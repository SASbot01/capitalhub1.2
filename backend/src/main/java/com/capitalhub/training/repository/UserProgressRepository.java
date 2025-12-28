package com.capitalhub.training.repository;

import com.capitalhub.training.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    List<UserProgress> findByUserId(Long userId);
    UserProgress findByUserIdAndLessonId(Long userId, Long lessonId);
}
