package com.capitalhub.admin;

import com.capitalhub.training.entity.*;
import com.capitalhub.training.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/training")
@RequiredArgsConstructor
public class AdminTrainingController {

    private final RouteRepository routeRepository;
    private final FormationRepository formationRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;

    // ========================================
    // ROUTES CRUD
    // ========================================

    @GetMapping("/routes")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Route>> getAllRoutes() {
        return ResponseEntity.ok(routeRepository.findAll());
    }

    @GetMapping("/routes/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Route> getRoute(@PathVariable Long id) {
        return routeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/routes")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Route> createRoute(@RequestBody Route route) {
        route.setId(null);
        route.setCreatedAt(LocalDateTime.now());
        if (route.getActive() == null) route.setActive(true);
        return ResponseEntity.ok(routeRepository.save(route));
    }

    @PutMapping("/routes/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Route> updateRoute(@PathVariable Long id, @RequestBody Route route) {
        return routeRepository.findById(id).map(existing -> {
            existing.setName(route.getName());
            existing.setDescription(route.getDescription());
            existing.setImageUrl(route.getImageUrl());
            existing.setDisplayOrder(route.getDisplayOrder());
            existing.setActive(route.getActive());
            return ResponseEntity.ok(routeRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/routes/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteRoute(@PathVariable Long id) {
        if (!routeRepository.existsById(id)) return ResponseEntity.notFound().build();
        routeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ========================================
    // FORMATIONS CRUD
    // ========================================

    @GetMapping("/routes/{routeId}/formations")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Formation>> getFormationsByRoute(@PathVariable Long routeId) {
        return ResponseEntity.ok(formationRepository.findByRouteIdOrderByDisplayOrder(routeId));
    }

    @GetMapping("/formations")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Formation>> getAllFormations() {
        return ResponseEntity.ok(formationRepository.findAll());
    }

    @GetMapping("/formations/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Formation> getFormation(@PathVariable Long id) {
        return formationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/formations")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Formation> createFormation(@RequestBody Formation formation) {
        formation.setId(null);
        formation.setCreatedAt(LocalDateTime.now());
        if (formation.getActive() == null) formation.setActive(true);
        return ResponseEntity.ok(formationRepository.save(formation));
    }

    @PutMapping("/formations/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Formation> updateFormation(@PathVariable Long id, @RequestBody Formation formation) {
        return formationRepository.findById(id).map(existing -> {
            existing.setRouteId(formation.getRouteId());
            existing.setName(formation.getName());
            existing.setDescription(formation.getDescription());
            existing.setImageUrl(formation.getImageUrl());
            existing.setLevel(formation.getLevel());
            existing.setDisplayOrder(formation.getDisplayOrder());
            existing.setActive(formation.getActive());
            existing.setMinTier(formation.getMinTier());
            existing.setIsIntroModule(formation.getIsIntroModule());
            return ResponseEntity.ok(formationRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/formations/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteFormation(@PathVariable Long id) {
        if (!formationRepository.existsById(id)) return ResponseEntity.notFound().build();
        formationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ========================================
    // MODULES (BLOQUES) CRUD
    // ========================================

    @GetMapping("/formations/{formationId}/modules")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<TrainingModule>> getModulesByFormation(@PathVariable Long formationId) {
        return ResponseEntity.ok(moduleRepository.findByFormationIdOrderByDisplayOrder(formationId));
    }

    @GetMapping("/modules/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<TrainingModule> getModule(@PathVariable Long id) {
        return moduleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/modules")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<TrainingModule> createModule(@RequestBody TrainingModule module) {
        module.setId(null);
        module.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(moduleRepository.save(module));
    }

    @PutMapping("/modules/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<TrainingModule> updateModule(@PathVariable Long id, @RequestBody TrainingModule module) {
        return moduleRepository.findById(id).map(existing -> {
            existing.setFormationId(module.getFormationId());
            existing.setName(module.getName());
            existing.setDescription(module.getDescription());
            existing.setDisplayOrder(module.getDisplayOrder());
            existing.setContentType(module.getContentType());
            return ResponseEntity.ok(moduleRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/modules/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        if (!moduleRepository.existsById(id)) return ResponseEntity.notFound().build();
        moduleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ========================================
    // LESSONS (CLASES) CRUD
    // ========================================

    @GetMapping("/modules/{moduleId}/lessons")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Lesson>> getLessonsByModule(@PathVariable Long moduleId) {
        return ResponseEntity.ok(lessonRepository.findByModuleIdOrderByPositionAsc(moduleId));
    }

    @GetMapping("/lessons/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Lesson> getLesson(@PathVariable Long id) {
        return lessonRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/lessons")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Lesson> createLesson(@RequestBody Lesson lesson) {
        lesson.setId(null);
        lesson.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(lessonRepository.save(lesson));
    }

    @PutMapping("/lessons/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Lesson> updateLesson(@PathVariable Long id, @RequestBody Lesson lesson) {
        return lessonRepository.findById(id).map(existing -> {
            existing.setCourseId(lesson.getCourseId());
            existing.setModuleId(lesson.getModuleId());
            existing.setTitle(lesson.getTitle());
            existing.setContent(lesson.getContent());
            existing.setVideoUrl(lesson.getVideoUrl());
            existing.setDuration(lesson.getDuration());
            existing.setPosition(lesson.getPosition());
            return ResponseEntity.ok(lessonRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/lessons/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        if (!lessonRepository.existsById(id)) return ResponseEntity.notFound().build();
        lessonRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
