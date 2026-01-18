package com.capitalhub.company.repository;

import com.capitalhub.company.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByUserId(Long userId);
    
    // Spring Data JPA ya incluye count() por defecto, no hace falta escribirlo.
}