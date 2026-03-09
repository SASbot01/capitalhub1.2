package com.capitalhub.training.repository;

import com.capitalhub.training.entity.UserFormationUnlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserFormationUnlockRepository extends JpaRepository<UserFormationUnlock, Long> {
    List<UserFormationUnlock> findByUserId(Long userId);

    List<UserFormationUnlock> findByUserIdAndRouteId(Long userId, Long routeId);

    boolean existsByUserIdAndFormationId(Long userId, Long formationId);
}
