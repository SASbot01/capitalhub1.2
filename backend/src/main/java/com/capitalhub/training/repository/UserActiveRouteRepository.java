package com.capitalhub.training.repository;

import com.capitalhub.training.entity.UserActiveRoute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserActiveRouteRepository extends JpaRepository<UserActiveRoute, Long> {
    Optional<UserActiveRoute> findByUserId(Long userId);

    void deleteByUserId(Long userId);
}
