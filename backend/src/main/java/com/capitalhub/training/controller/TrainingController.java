package com.capitalhub.training.controller;

import com.capitalhub.training.dto.CourseDTO;
import com.capitalhub.training.service.TrainingService;
import com.capitalhub.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.capitalhub.auth.entity.User;

import java.util.List;

@RestController
@RequestMapping("/api/training")
@RequiredArgsConstructor
public class TrainingController {

    private final TrainingService trainingService;
    private final UserRepository userRepository;

    @GetMapping("/courses")
    public ResponseEntity<List<CourseDTO>> getCourses(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(trainingService.getCoursesForUser(user.getId()));
    }

    @PostMapping("/lessons/{id}/complete")
    public ResponseEntity<Void> completeLesson(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        trainingService.completeLesson(user.getId(), id);
        return ResponseEntity.ok().build();
    }
}
