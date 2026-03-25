package com.capitalhub.training.controller;

import com.capitalhub.auth.entity.User;
import com.capitalhub.subscription.service.CoinService;
import com.capitalhub.training.entity.*;
import com.capitalhub.training.service.TrainingServiceV2;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/training")
@RequiredArgsConstructor
public class TrainingControllerV2 {

    private final TrainingServiceV2 trainingService;
    private final CoinService coinService;

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
    public ResponseEntity<?> getLessonsByModule(@PathVariable Long id, Authentication auth) {
        User user = getUserFromAuth(auth);
        TrainingModule module = trainingService.getModuleById(id);
        Formation formation = trainingService.getFormationById(module.getFormationId());
        boolean isIntro = Boolean.TRUE.equals(formation.getIsIntroModule());
        boolean isUnlocked = trainingService.isFormationUnlockedForUser(user.getId(), formation.getId());
        boolean isTrial = user.isInTrial();

        if (!isIntro && !isUnlocked && !isTrial) {
            return ResponseEntity.status(403).body(Map.of("message", "Formación bloqueada"));
        }

        return ResponseEntity.ok(trainingService.getLessonsByModule(id));
    }

    // ========================================
    // LESSONS
    // ========================================

    @GetMapping("/lessons/{id}")
    public ResponseEntity<?> getLessonById(@PathVariable Long id, Authentication auth) {
        User user = getUserFromAuth(auth);
        Lesson lesson = trainingService.getLessonById(id);

        // Check formation-level access via the module
        TrainingModule module = trainingService.getModuleById(lesson.getModuleId());
        Formation formation = trainingService.getFormationById(module.getFormationId());
        boolean isIntro = Boolean.TRUE.equals(formation.getIsIntroModule());
        boolean isUnlocked = trainingService.isFormationUnlockedForUser(user.getId(), formation.getId());
        boolean isTrial = user.isInTrial();

        if (!isIntro && !isUnlocked && !isTrial) {
            return ResponseEntity.status(403).body(Map.of("message", "Formación bloqueada. Usa una moneda para desbloquearla."));
        }

        return ResponseEntity.ok(lesson);
    }

    @PostMapping("/lessons/{id}/complete")
    public ResponseEntity<Void> markLessonCompleted(@PathVariable Long id, Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        trainingService.markLessonCompleted(userId, id);
        return ResponseEntity.noContent().build();
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
        return ResponseEntity.noContent().build();
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
        if (auth != null && auth.getPrincipal() instanceof User) {
            return ((User) auth.getPrincipal()).getId();
        }
        throw new RuntimeException("User not authenticated");
    }

    private User getUserFromAuth(Authentication auth) {
        if (auth != null && auth.getPrincipal() instanceof User) {
            return (User) auth.getPrincipal();
        }
        throw new RuntimeException("User not authenticated");
    }

    // ========================================
    // ACTIVE ROUTE
    // ========================================

    @PostMapping("/active-route")
    public ResponseEntity<Void> setActiveRoute(@RequestBody Map<String, Long> request, Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        Long routeId = request.get("routeId");
        trainingService.setActiveRoute(userId, routeId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/active-route")
    public ResponseEntity<Route> getActiveRoute(Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        Route route = trainingService.getActiveRoute(userId);
        return ResponseEntity.ok(route);
    }

    @PostMapping("/switch-route")
    public ResponseEntity<Void> switchRoute(@RequestBody Map<String, Long> request, Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        Long routeId = request.get("routeId");
        trainingService.switchRoute(userId, routeId);
        return ResponseEntity.noContent().build();
    }

    // ========================================
    // FORMATIONS ACCESS (Level 1)
    // ========================================

    @GetMapping("/routes/{id}/formations-access")
    public ResponseEntity<List<Map<String, Object>>> getFormationsAccess(@PathVariable Long id, Authentication auth) {
        User user = getUserFromAuth(auth);
        return ResponseEntity.ok(trainingService.getFormationsWithAccess(id, user));
    }

    @GetMapping("/formations/{id}/modules-access")
    public ResponseEntity<List<Map<String, Object>>> getModulesAccess(@PathVariable Long id, Authentication auth) {
        User user = getUserFromAuth(auth);
        return ResponseEntity.ok(trainingService.getModulesWithAccess(id, user));
    }

    @PostMapping("/formations/{id}/unlock")
    public ResponseEntity<?> unlockFormation(@PathVariable Long id, Authentication auth) {
        User user = getUserFromAuth(auth);
        try {
            // Determine route from formation
            Formation formation = trainingService.getFormationById(id);
            coinService.spendCoinOnFormation(user.getId(), id, formation.getRouteId());
            return ResponseEntity.ok(Map.of("message", "Formación desbloqueada"));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
