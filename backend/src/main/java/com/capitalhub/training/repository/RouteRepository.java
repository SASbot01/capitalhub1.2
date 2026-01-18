package com.capitalhub.training.repository;

import com.capitalhub.training.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findAllByActiveOrderByDisplayOrder(Boolean active);
}
