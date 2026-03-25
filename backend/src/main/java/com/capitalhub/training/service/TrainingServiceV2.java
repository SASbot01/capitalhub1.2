package com.capitalhub.training.service;

import com.capitalhub.auth.entity.User;
import com.capitalhub.auth.repository.UserRepository;
import com.capitalhub.subscription.entity.CoinTransaction;
import com.capitalhub.subscription.entity.SubscriptionTier;
import com.capitalhub.subscription.repository.CoinTransactionRepository;
import com.capitalhub.training.entity.*;
import com.capitalhub.training.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainingServiceV2 {

    private final RouteRepository routeRepository;
    private final FormationRepository formationRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final UserActiveFormationRepository userActiveFormationRepository;
    private final UserProgressRepository userProgressRepository;
    private final UserCertificationRepository userCertificationRepository;
    private final UserStreakRepository userStreakRepository;
    private final ExamQuestionRepository examQuestionRepository;
    private final UserExamAttemptRepository userExamAttemptRepository;
    private final UserActiveRouteRepository userActiveRouteRepository;
    private final UserFormationUnlockRepository userFormationUnlockRepository;
    private final UserRepository userRepository;
    private final CoinTransactionRepository coinTransactionRepository;

    // ========================================
    // ROUTES
    // ========================================

    public List<Route> getAllRoutes() {
        return routeRepository.findAllByActiveOrderByDisplayOrder(true);
    }

    public Route getRouteById(Long id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found with id: " + id));
    }

    // ========================================
    // FORMATIONS
    // ========================================

    public List<Formation> getFormationsByRoute(Long routeId) {
        return formationRepository.findByRouteIdAndActiveOrderByDisplayOrder(routeId, true);
    }

    /**
     * Get formations filtered by user's subscription tier
     * T0/null: only intro modules
     * T1+: all formations
     */
    public List<Formation> getFormationsByRouteForUser(Long routeId, User user) {
        if (user == null || !user.hasFullFormationAccess()) {
            // User has no subscription or T0 - only return intro modules
            return formationRepository.findByRouteIdAndActiveAndIsIntroModuleOrderByDisplayOrder(routeId, true, true);
        }

        // User has T1+ - return all formations
        return formationRepository.findByRouteIdAndActiveOrderByDisplayOrder(routeId, true);
    }

    public Formation getFormationById(Long id) {
        return formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation not found with id: " + id));
    }

    // ========================================
    // ACTIVE ROUTE
    // ========================================

    @Transactional
    public void setActiveRoute(Long userId, Long routeId) {
        // Verify route exists
        getRouteById(routeId);

        userActiveRouteRepository.findByUserId(userId)
                .ifPresent(existing -> userActiveRouteRepository.delete(existing));

        UserActiveRoute activeRoute = UserActiveRoute.builder()
                .userId(userId)
                .routeId(routeId)
                .build();
        userActiveRouteRepository.save(activeRoute);
    }

    @Transactional
    public void switchRoute(Long userId, Long newRouteId) {
        // Verify route exists
        getRouteById(newRouteId);

        // Delete existing active route
        userActiveRouteRepository.findByUserId(userId)
                .ifPresent(existing -> userActiveRouteRepository.delete(existing));

        // Set new active route
        UserActiveRoute activeRoute = UserActiveRoute.builder()
                .userId(userId)
                .routeId(newRouteId)
                .build();
        userActiveRouteRepository.save(activeRoute);

        // Clear active formation (user starts fresh on new route)
        userActiveFormationRepository.findByUserId(userId)
                .ifPresent(existing -> userActiveFormationRepository.delete(existing));
    }

    public Route getActiveRoute(Long userId) {
        return userActiveRouteRepository.findByUserId(userId)
                .map(uar -> getRouteById(uar.getRouteId()))
                .orElse(null);
    }

    public Long getActiveRouteId(Long userId) {
        return userActiveRouteRepository.findByUserId(userId)
                .map(UserActiveRoute::getRouteId)
                .orElse(null);
    }

    // ========================================
    // FORMATIONS ACCESS (Level 1)
    // ========================================

    /**
     * Get formations with access status for a route
     */
    public List<Map<String, Object>> getFormationsWithAccess(Long routeId, User user) {
        List<Formation> formations = formationRepository.findByRouteIdAndActiveOrderByDisplayOrder(routeId, true);
        List<Map<String, Object>> result = new ArrayList<>();

        boolean isActiveTrial = user.isInTrial();

        for (Formation formation : formations) {
            Map<String, Object> item = new HashMap<>();
            item.put("formation", formation);

            boolean isUnlocked = userFormationUnlockRepository.existsByUserIdAndFormationId(user.getId(), formation.getId());
            boolean isIntro = Boolean.TRUE.equals(formation.getIsIntroModule());

            if (isUnlocked || isIntro) {
                // Intro modules are always unlocked for everyone
                item.put("status", "UNLOCKED");
                item.put("isTrialAccess", false);
            } else if (isActiveTrial) {
                // T0 trial: full access to all formations during 14 days
                item.put("status", "TRIAL_ACCESS");
                item.put("isTrialAccess", true);
            } else {
                item.put("status", "LOCKED");
                item.put("isTrialAccess", false);
            }

            result.add(item);
        }

        return result;
    }

    /**
     * Get modules with access status for a formation
     */
    public List<Map<String, Object>> getModulesWithAccess(Long formationId, User user) {
        List<TrainingModule> modules = moduleRepository.findByFormationIdOrderByDisplayOrder(formationId);
        List<Map<String, Object>> result = new ArrayList<>();

        Formation formation = getFormationById(formationId);
        boolean isIntroFormation = Boolean.TRUE.equals(formation.getIsIntroModule());
        boolean formationUnlocked = userFormationUnlockRepository.existsByUserIdAndFormationId(user.getId(), formationId);
        boolean isActiveTrial = user.isInTrial();
        boolean isPaid = user.isPaidMember();

        for (int i = 0; i < modules.size(); i++) {
            TrainingModule module = modules.get(i);
            Map<String, Object> item = new HashMap<>();
            item.put("module", module);
            item.put("contentType", module.getContentType() != null ? module.getContentType() : "TECHNICAL");

            boolean isMindset = "MINDSET".equalsIgnoreCase(module.getContentType());

            if (isIntroFormation) {
                // Intro formations (like MIFG) are fully accessible to everyone
                item.put("accessible", true);
                item.put("lockReason", null);
            } else if (isActiveTrial) {
                // T0 trial: full access to all modules during 14 days
                item.put("accessible", true);
                item.put("lockReason", null);
            } else if (isMindset) {
                // Mindset content: intro (first) is accessible, rest locked for annual plan
                if (i == 0 || (formationUnlocked && isPaid)) {
                    item.put("accessible", true);
                    item.put("lockReason", null);
                } else {
                    item.put("accessible", false);
                    item.put("lockReason", "ANNUAL_PLAN_REQUIRED");
                }
            } else if (formationUnlocked && isPaid) {
                // Paid + unlocked: full access to all technical modules
                item.put("accessible", true);
                item.put("lockReason", null);
            } else {
                // Formation not unlocked
                item.put("accessible", false);
                item.put("lockReason", "FORMATION_LOCKED");
            }

            result.add(item);
        }

        return result;
    }

    /**
     * Get list of unlocked formation IDs for a user
     */
    public List<Long> getUnlockedFormationIds(Long userId) {
        return userFormationUnlockRepository.findByUserId(userId)
                .stream()
                .map(UserFormationUnlock::getFormationId)
                .collect(Collectors.toList());
    }

    /**
     * Check if a formation is unlocked for a user (via coin spend or first payment)
     */
    public boolean isFormationUnlockedForUser(Long userId, Long formationId) {
        return userFormationUnlockRepository.existsByUserIdAndFormationId(userId, formationId);
    }

    // ========================================
    // MODULES
    // ========================================

    public List<TrainingModule> getModulesByFormation(Long formationId) {
        return moduleRepository.findByFormationIdOrderByDisplayOrder(formationId);
    }

    public TrainingModule getModuleById(Long id) {
        return moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found with id: " + id));
    }

    // ========================================
    // LESSONS
    // ========================================

    public List<Lesson> getLessonsByModule(Long moduleId) {
        return lessonRepository.findByModuleIdOrderByPositionAsc(moduleId);
    }

    public Lesson getLessonById(Long id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));
    }

    // ========================================
    // ACTIVE FORMATION
    // ========================================

    @Transactional
    public void setActiveFormation(Long userId, Long formationId) {
        // Verify formation exists
        Formation formation = getFormationById(formationId);

        // Delete existing active formation if any
        userActiveFormationRepository.findByUserId(userId)
                .ifPresent(existing -> userActiveFormationRepository.delete(existing));

        // Create new active formation
        UserActiveFormation activeFormation = new UserActiveFormation();
        activeFormation.setUserId(userId);
        activeFormation.setFormationId(formationId);
        activeFormation.setStartedAt(LocalDateTime.now());
        userActiveFormationRepository.save(activeFormation);
    }

    public Formation getUserActiveFormation(Long userId) {
        return userActiveFormationRepository.findByUserId(userId)
                .map(uaf -> getFormationById(uaf.getFormationId()))
                .orElse(null);
    }

    public Long getUserActiveFormationId(Long userId) {
        return userActiveFormationRepository.findByUserId(userId)
                .map(UserActiveFormation::getFormationId)
                .orElse(null);
    }

    // ========================================
    // PROGRESS & UNLOCKING
    // ========================================

    /**
     * Check if a lesson is unlocked for the user.
     * A lesson is unlocked if:
     * 1. It's the first lesson in the first module, OR
     * 2. The previous lesson in the same module is completed, OR
     * 3. It's the first lesson of a module AND all lessons in the previous module
     * are completed
     */
    public boolean isLessonUnlocked(Long userId, Long lessonId) {
        Lesson lesson = getLessonById(lessonId);
        Long moduleId = lesson.getModuleId();

        List<Lesson> lessonsInModule = getLessonsByModule(moduleId);

        // Find position of this lesson in the module
        int lessonIndex = -1;
        for (int i = 0; i < lessonsInModule.size(); i++) {
            if (lessonsInModule.get(i).getId().equals(lessonId)) {
                lessonIndex = i;
                break;
            }
        }

        if (lessonIndex == -1) {
            return false; // Lesson not found in module
        }

        // If it's the first lesson in the module
        if (lessonIndex == 0) {
            // Check if this is the first module in the formation
            TrainingModule module = getModuleById(moduleId);
            List<TrainingModule> modulesInFormation = getModulesByFormation(module.getFormationId());

            if (modulesInFormation.isEmpty() || modulesInFormation.get(0).getId().equals(moduleId)) {
                return true; // First lesson of first module is always unlocked
            }

            // Check if all lessons in previous module are completed
            int moduleIndex = -1;
            for (int i = 0; i < modulesInFormation.size(); i++) {
                if (modulesInFormation.get(i).getId().equals(moduleId)) {
                    moduleIndex = i;
                    break;
                }
            }

            if (moduleIndex > 0) {
                TrainingModule previousModule = modulesInFormation.get(moduleIndex - 1);
                return isModuleCompleted(userId, previousModule.getId());
            }

            return true;
        }

        // Check if previous lesson is completed
        Lesson previousLesson = lessonsInModule.get(lessonIndex - 1);
        return isLessonCompleted(userId, previousLesson.getId());
    }

    /**
     * Check if a module is unlocked for the user.
     * A module is unlocked if the previous module is completed.
     */
    public boolean isModuleUnlocked(Long userId, Long moduleId) {
        TrainingModule module = getModuleById(moduleId);
        List<TrainingModule> modules = getModulesByFormation(module.getFormationId());

        if (modules.isEmpty() || modules.get(0).getId().equals(moduleId)) {
            return true; // First module is always unlocked
        }

        // Find previous module
        int moduleIndex = -1;
        for (int i = 0; i < modules.size(); i++) {
            if (modules.get(i).getId().equals(moduleId)) {
                moduleIndex = i;
                break;
            }
        }

        if (moduleIndex > 0) {
            TrainingModule previousModule = modules.get(moduleIndex - 1);
            return isModuleCompleted(userId, previousModule.getId());
        }

        return true;
    }

    private boolean isLessonCompleted(Long userId, Long lessonId) {
        UserProgress progress = userProgressRepository.findByUserIdAndLessonId(userId, lessonId);
        return progress != null && progress.isCompleted();
    }

    private boolean isModuleCompleted(Long userId, Long moduleId) {
        List<Lesson> lessons = getLessonsByModule(moduleId);
        if (lessons.isEmpty()) {
            return true;
        }

        for (Lesson lesson : lessons) {
            if (!isLessonCompleted(userId, lesson.getId())) {
                return false;
            }
        }
        return true;
    }

    @Transactional
    public void markLessonCompleted(Long userId, Long lessonId) {
        // Verify lesson is unlocked
        if (!isLessonUnlocked(userId, lessonId)) {
            throw new RuntimeException("Cannot complete a locked lesson");
        }

        UserProgress progress = userProgressRepository.findByUserIdAndLessonId(userId, lessonId);
        if (progress == null) {
            progress = new UserProgress();
            progress.setUserId(userId);
            progress.setLessonId(lessonId);
        }

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            userProgressRepository.save(progress);

            // Update streak
            updateUserStreak(userId);
        }
    }

    /**
     * Get user's overall progress across all formations
     */
    public Map<String, Object> getUserProgress(Long userId) {
        Map<String, Object> result = new HashMap<>();

        // Get active formation
        Long activeFormationId = getUserActiveFormationId(userId);
        if (activeFormationId != null) {
            Formation activeFormation = getFormationById(activeFormationId);
            result.put("activeFormation", activeFormation);

            // Calculate progress in active formation
            Map<String, Object> formationProgress = getFormationProgress(userId, activeFormationId);
            result.put("activeFormationProgress", formationProgress);
        }

        // Get certifications
        List<UserCertification> certifications = getUserCertifications(userId);
        result.put("certifications", certifications);

        // Get streak
        UserStreak streak = getUserStreak(userId);
        result.put("streak", streak);

        return result;
    }

    /**
     * Get progress for a specific formation
     */
    public Map<String, Object> getFormationProgress(Long userId, Long formationId) {
        Map<String, Object> result = new HashMap<>();

        List<TrainingModule> modules = getModulesByFormation(formationId);
        int totalLessons = 0;
        int completedLessons = 0;

        for (TrainingModule module : modules) {
            List<Lesson> lessons = getLessonsByModule(module.getId());
            totalLessons += lessons.size();

            for (Lesson lesson : lessons) {
                if (isLessonCompleted(userId, lesson.getId())) {
                    completedLessons++;
                }
            }
        }

        int progressPercentage = totalLessons == 0 ? 0
                : (int) Math.round(((double) completedLessons / totalLessons) * 100);

        result.put("totalLessons", totalLessons);
        result.put("completedLessons", completedLessons);
        result.put("progressPercentage", progressPercentage);
        result.put("isCompleted", progressPercentage == 100);

        return result;
    }

    // ========================================
    // STREAK SYSTEM
    // ========================================

    @Transactional
    public void updateUserStreak(Long userId) {
        UserStreak streak = userStreakRepository.findByUserId(userId)
                .orElse(new UserStreak(null, userId, 0, 0, null, LocalDateTime.now(), LocalDateTime.now()));

        LocalDate today = LocalDate.now();
        LocalDate lastActivity = streak.getLastActivityDate();

        if (lastActivity == null) {
            // First activity
            streak.setCurrentStreak(1);
            streak.setLongestStreak(1);
            streak.setLastActivityDate(today);
        } else if (lastActivity.equals(today)) {
            // Already counted today, do nothing
            return;
        } else if (lastActivity.equals(today.minusDays(1))) {
            // Consecutive day
            streak.setCurrentStreak(streak.getCurrentStreak() + 1);
            if (streak.getCurrentStreak() > streak.getLongestStreak()) {
                streak.setLongestStreak(streak.getCurrentStreak());
            }
            streak.setLastActivityDate(today);
        } else {
            // Streak broken
            streak.setCurrentStreak(1);
            streak.setLastActivityDate(today);
        }

        streak.setUpdatedAt(LocalDateTime.now());
        userStreakRepository.save(streak);
    }

    public UserStreak getUserStreak(Long userId) {
        return userStreakRepository.findByUserId(userId)
                .orElse(new UserStreak(null, userId, 0, 0, null, LocalDateTime.now(), LocalDateTime.now()));
    }

    // ========================================
    // CERTIFICATION & EXAMS
    // ========================================

    @Transactional
    public Map<String, Object> submitExam(Long userId, Long formationId, Map<Long, String> answers) {
        // Get exam questions
        List<ExamQuestion> questions = examQuestionRepository.findByFormationId(formationId);

        if (questions.isEmpty()) {
            throw new RuntimeException("No exam questions found for this formation");
        }

        // Calculate score
        int correctAnswers = 0;
        for (ExamQuestion question : questions) {
            String userAnswer = answers.get(question.getId());
            if (userAnswer != null && userAnswer.equalsIgnoreCase(question.getCorrectAnswer())) {
                correctAnswers++;
            }
        }

        int score = (int) Math.round(((double) correctAnswers / questions.size()) * 100);
        boolean passed = score >= 70; // 70% passing score

        // Save exam attempt
        UserExamAttempt attempt = new UserExamAttempt();
        attempt.setUserId(userId);
        attempt.setFormationId(formationId);
        attempt.setScore(score);
        attempt.setPassed(passed);
        attempt.setAttemptedAt(LocalDateTime.now());
        userExamAttemptRepository.save(attempt);

        // If passed, create or update certification
        if (passed) {
            Formation formation = getFormationById(formationId);

            boolean alreadyCertified = userCertificationRepository
                    .findByUserIdAndFormationId(userId, formationId)
                    .map(c -> Boolean.TRUE.equals(c.getPassed()))
                    .orElse(false);

            UserCertification certification = userCertificationRepository
                    .findByUserIdAndFormationId(userId, formationId)
                    .orElse(new UserCertification());

            certification.setUserId(userId);
            certification.setFormationId(formationId);
            certification.setRouteId(formation.getRouteId());
            certification.setExamScore(score);
            certification.setPassed(true);
            certification.setCertifiedAt(LocalDateTime.now());
            userCertificationRepository.save(certification);

            // Grant +1 coin for first certification of this formation
            if (!alreadyCertified) {
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found"));
                user.setCoinBalance((user.getCoinBalance() != null ? user.getCoinBalance() : 0) + 1);
                userRepository.save(user);

                CoinTransaction tx = CoinTransaction.builder()
                        .userId(userId)
                        .amount(1)
                        .transactionType("CERTIFICATION_REWARD")
                        .referenceId(formationId)
                        .description("Moneda por certificación en " + formation.getName())
                        .build();
                coinTransactionRepository.save(tx);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("score", score);
        result.put("passed", passed);
        result.put("correctAnswers", correctAnswers);
        result.put("totalQuestions", questions.size());

        return result;
    }

    public List<UserCertification> getUserCertifications(Long userId) {
        return userCertificationRepository.findByUserIdAndPassedOrderByCreatedAtDesc(userId, true);
    }

    public List<ExamQuestion> getExamQuestions(Long formationId) {
        return examQuestionRepository.findByFormationId(formationId);
    }
}
