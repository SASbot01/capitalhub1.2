package com.capitalhub.training.repository;

import com.capitalhub.training.entity.Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {
    Optional<Community> findByRouteId(Long routeId);

    Optional<Community> findByFormationId(Long formationId);

    List<Community> findByRouteIdOrFormationId(Long routeId, Long formationId);
}
