package com.capitalhub.jobs.repository;

import com.capitalhub.jobs.entity.JobOffer;
import com.capitalhub.rep.entity.RepRole;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {
    List<JobOffer> findByCompanyId(Long companyId);
    
    // Para buscar ofertas activas filtradas por rol (ej: solo Setters o Both)
    List<JobOffer> findByActiveTrueAndRoleIn(List<RepRole> roles);
    
    // Contar ofertas activas de una empresa
    long countByCompanyIdAndActive(Long companyId, Boolean active);
}