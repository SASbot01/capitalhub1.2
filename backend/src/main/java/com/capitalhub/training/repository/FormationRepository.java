package com.capitalhub.training.repository;

import com.capitalhub.training.entity.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {
    List<Formation> findByRouteIdAndActiveOrderByDisplayOrder(Long routeId, Boolean active);

    List<Formation> findByRouteIdOrderByDisplayOrder(Long routeId);

    List<Formation> findByRouteIdAndActiveAndIsIntroModuleOrderByDisplayOrder(Long routeId, Boolean active, Boolean isIntroModule);
}
