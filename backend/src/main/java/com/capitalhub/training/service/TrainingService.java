package com.capitalhub.training.service;

import com.capitalhub.training.dto.CourseDTO;
import com.capitalhub.training.dto.LessonDTO;
import com.capitalhub.training.entity.Course;
import com.capitalhub.training.entity.Lesson;
import com.capitalhub.training.entity.UserProgress;
import com.capitalhub.training.repository.CourseRepository;
import com.capitalhub.training.repository.LessonRepository;
import com.capitalhub.training.repository.UserProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainingService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final UserProgressRepository userProgressRepository;

    public List<CourseDTO> getCoursesForUser(Long userId) {
        List<Course> courses = courseRepository.findAll();
        List<UserProgress> progressList = userProgressRepository.findByUserId(userId);

        // Map lessonId -> UserProgress for quick lookup
        Map<Long, UserProgress> progressMap = progressList.stream()
                .collect(Collectors.toMap(UserProgress::getLessonId, p -> p));

        return courses.stream().map(course -> {
            CourseDTO dto = new CourseDTO();
            dto.setId(course.getId().toString());
            dto.setTitle(course.getTitle());
            dto.setLevel(course.getLevel());
            dto.setFocus(course.getFocus());

            List<Lesson> lessons = lessonRepository.findByCourseIdOrderByPositionAsc(course.getId());
            List<LessonDTO> lessonDTOs = new ArrayList<>();

            boolean previousCompleted = true; // First lesson is unlocked by default
            int completedCount = 0;

            for (Lesson lesson : lessons) {
                LessonDTO lessonDTO = new LessonDTO();
                lessonDTO.setId(lesson.getId());
                lessonDTO.setTitle(lesson.getTitle());
                lessonDTO.setDuration(lesson.getDuration());

                UserProgress up = progressMap.get(lesson.getId());
                boolean isCompleted = up != null && up.isCompleted();

                if (isCompleted) {
                    lessonDTO.setStatus("completed");
                    completedCount++;
                    previousCompleted = true;
                } else if (previousCompleted) {
                    lessonDTO.setStatus("in-progress");
                    previousCompleted = false; // Next one will be locked
                } else {
                    lessonDTO.setStatus("locked");
                    previousCompleted = false;
                }

                lessonDTOs.add(lessonDTO);
            }

            dto.setLessons(lessonDTOs);

            int progress = lessons.isEmpty() ? 0 : (int) Math.round(((double) completedCount / lessons.size()) * 100);
            dto.setProgress(progress);

            return dto;
        }).collect(Collectors.toList());
    }

    public void completeLesson(Long userId, Long lessonId) {
        UserProgress progress = userProgressRepository.findByUserIdAndLessonId(userId, lessonId);
        if (progress == null) {
            progress = new UserProgress();
            progress.setUserId(userId);
            progress.setLessonId(lessonId);
        }
        progress.setCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
        userProgressRepository.save(progress);
    }
}
