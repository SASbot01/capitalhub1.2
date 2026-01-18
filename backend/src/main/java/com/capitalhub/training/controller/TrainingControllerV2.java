package com.capitalhub.training.controller;

import com.capitalhub.training.entity.*;
import com.capitalhub.training.service.TrainingServiceV2;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/training")
@RequiredArgsConstructor
public class TrainingControllerV2 {

    private final TrainingServiceV2 trainingService;

    // ========================================
    // ROUTES
    // ========================================

    @GetMapping("/routes")
    public ResponseEntity<List<Route>> getAllRoutes() {
        return ResponseEntity.ok(trainingService.getAllRoutes());
    }

    @GetMapping("/routes/{id}")
    public ResponseEntity<Route> getRouteById(@PathVariable Long id) {
        return ResponseEntity.ok(trainingService.getRouteById(id));
    }

    @GetMapping("/routes/{id}/formations")
    public ResponseEntity<List<Formation>> getFormationsByRoute(@PathVariable Long id) {
        return ResponseEntity.ok(trainingService.getFormationsByRoute(id));
    }

    // ========================================
    // FORMATIONS
    // ========================================

    @GetMapping("/formations/{id}")
    public ResponseEntity<Formation> getFormationById(@PathVariable Long id) {
        return ResponseEntity.ok(trainingService.getFormationById(id));
    }

    @GetMapping("/formations/{id}/modules")
    public ResponseEntity<List<TrainingModule>> getModulesByFormation(@PathVariable Long id) {
        return ResponseEntity.ok(trainingService.getModulesByFormation(id));
    }

    // ========================================
    // MODULES
    // ========================================

    @GetMapping("/modules/{id}")
    public ResponseEntity<TrainingModule> getModuleById(@PathVariable Long id) {
        return ResponseEntity.ok(trainingService.getModuleById(id));
    }

    @GetMapping("/modules/{id}/lessons")
    public ResponseEntity<List<Lesson>> getLessonsByModule(@PathVariable Long id) {
        return ResponseEntity.ok(trainingService.getLessonsByModule(id));
    }

    // ========================================
    // LESSONS
    // ========================================

    @GetMapping("/lessons/{id}")
    public ResponseEntity<Lesson> getLessonById(@PathVariable Long id) {
        return ResponseEntity.ok(trainingService.getLessonById(id));
    }

    @PostMapping("/lessons/{id}/complete")
    public ResponseEntity<Void> markLessonCompleted(@PathVariable Long id, Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        trainingService.markLessonCompleted(userId, id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/lessons/{id}/unlocked")
    public ResponseEntity<Map<String, Boolean>> isLessonUnlocked(@PathVariable Long id, Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        boolean unlocked = trainingService.isLessonUnlocked(userId, id);
        return ResponseEntity.ok(Map.of("unlocked", unlocked));
    }

    // ========================================
    // ACTIVE FORMATION
    // ========================================

    @PostMapping("/active-formation")
    public ResponseEntity<Void> setActiveFormation(@RequestBody Map<String, Long> request, Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        Long formationId = request.get("formationId");
        trainingService.setActiveFormation(userId, formationId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/active-formation")
    public ResponseEntity<Formation> getUserActiveFormation(Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        Formation formation = trainingService.getUserActiveFormation(userId);
        return ResponseEntity.ok(formation);
    }

    // ========================================
    // PROGRESS
    // ========================================

    @GetMapping("/progress")
    public ResponseEntity<Map<String, Object>> getUserProgress(Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        return ResponseEntity.ok(trainingService.getUserProgress(userId));
    }

    @GetMapping("/formations/{id}/progress")
    public ResponseEntity<Map<String, Object>> getFormationProgress(@PathVariable Long id, Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        return ResponseEntity.ok(trainingService.getFormationProgress(userId, id));
    }

    // ========================================
    // STREAK
    // ========================================

    @GetMapping("/streak")
    public ResponseEntity<UserStreak> getUserStreak(Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        return ResponseEntity.ok(trainingService.getUserStreak(userId));
    }

    // ========================================
    // CERTIFICATION & EXAMS
    // ========================================

    @GetMapping("/formations/{id}/exam")
    public ResponseEntity<List<ExamQuestion>> getExamQuestions(@PathVariable Long id) {
        return ResponseEntity.ok(trainingService.getExamQuestions(id));
    }

    @PostMapping("/exam/{formationId}")
    public ResponseEntity<Map<String, Object>> submitExam(
            @PathVariable Long formationId,
            @RequestBody Map<Long, String> answers,
            Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        return ResponseEntity.ok(trainingService.submitExam(userId, formationId, answers));
    }

    @GetMapping("/certifications")
    public ResponseEntity<List<UserCertification>> getUserCertifications(Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        return ResponseEntity.ok(trainingService.getUserCertifications(userId));
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    private Long getUserIdFromAuth(Authentication auth) {
        // Extract user ID from authentication
        // This assumes the authentication principal contains the user ID
        // Adjust based on your actual authentication setup
        if (auth != null && auth.getPrincipal() instanceof org.springframework.security.core.userdetails.User) {
            String email = ((org.springframework.security.core.userdetails.User) auth.getPrincipal()).getUsername();
            // You'll need to fetch the user ID from the email
            // For now, returning a placeholder - you should implement proper user lookup
            return 1L; // TODO: Implement proper user ID extraction
        }
        throw new RuntimeException("User not authenticated");
    }
}
