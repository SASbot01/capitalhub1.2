package com.capitalhub.training.repository;

import com.capitalhub.training.entity.TrainingModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<TrainingModule, Long> {
    List<TrainingModule> findByFormationIdOrderByDisplayOrder(Long formationId);
}
