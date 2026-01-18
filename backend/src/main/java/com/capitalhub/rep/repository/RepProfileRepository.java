package com.capitalhub.rep.repository;

import com.capitalhub.rep.entity.RepProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RepProfileRepository extends JpaRepository<RepProfile, Long> {

    Optional<RepProfile> findByUserId(Long userId);

    // BORRADO: boolean existsByFullNameIgnoreCase(String fullName);
    // Esto causaba el error al arrancar. Si necesitamos buscar por nombre,
    // lo haremos a través de la entidad User más adelante.
}