package com.capitalhub.applications.service;

import com.capitalhub.applications.dto.ApplicationResponse;
import com.capitalhub.applications.dto.ApplyRequest;
import com.capitalhub.applications.entity.ApplicationStatus;
import com.capitalhub.applications.entity.JobApplication;
import com.capitalhub.applications.repository.JobApplicationRepository;
import com.capitalhub.company.entity.Company;
import com.capitalhub.company.repository.CompanyRepository;
import com.capitalhub.jobs.entity.JobOffer;
import com.capitalhub.jobs.entity.JobStatus;
import com.capitalhub.jobs.repository.JobOfferRepository;
import com.capitalhub.rep.entity.RepProfile;
import com.capitalhub.rep.repository.RepProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobOfferRepository jobOfferRepository;
    private final RepProfileRepository repProfileRepository;
    private final CompanyRepository companyRepository;

    @Transactional
    public ApplicationResponse applyToOffer(Long repUserId, Long offerId, ApplyRequest req) {
        RepProfile rep = repProfileRepository.findByUserId(repUserId)
                .orElseThrow(() -> new EntityNotFoundException("Perfil de REP no encontrado"));

        JobOffer offer = jobOfferRepository.findById(offerId)
                .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada"));

        if (!Boolean.TRUE.equals(offer.getActive()) || offer.getStatus() != JobStatus.ACTIVE) {
            throw new IllegalArgumentException("Esta oferta ya no está activa.");
        }
        
        if (applicationRepository.existsByRepIdAndJobOfferId(rep.getId(), offer.getId())) {
            throw new IllegalStateException("Ya has aplicado a esta oferta anteriormente."); 
        }

        JobApplication application = JobApplication.builder()
                .rep(rep)
                .jobOffer(offer)
                .status(ApplicationStatus.APPLIED)
                .repMessage(req != null ? req.getRepMessage() : null)
                .build();

        JobApplication saved = applicationRepository.save(application);

        // Actualizamos contador
        offer.setApplicantsCount(offer.getApplicantsCount() + 1);
        jobOfferRepository.save(offer);

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> listMyApplications(Long repUserId) {
        RepProfile rep = repProfileRepository.findByUserId(repUserId)
                .orElseThrow(() -> new EntityNotFoundException("Perfil REP no encontrado"));

        return applicationRepository.findByRepId(rep.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> listApplicationsForOffer(Long companyUserId, Long offerId) {
        Company company = companyRepository.findByUserId(companyUserId)
                .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada"));
        
        JobOffer offer = jobOfferRepository.findById(offerId)
                .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada"));

        if (!offer.getCompany().getId().equals(company.getId())) {
            throw new IllegalArgumentException("No tienes permiso para ver las aplicaciones de esta oferta.");
        }
        return applicationRepository.findByJobOfferId(offerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ✅ MÉTODO NUEVO QUE FALTABA: Listar TODAS las aplicaciones de una empresa
    @Transactional(readOnly = true)
    public List<ApplicationResponse> listAllCompanyApplications(Long companyUserId) {
        Company company = companyRepository.findByUserId(companyUserId)
                .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada"));

        // IMPORTANTE: Para que esto funcione, JobApplicationRepository debe tener el método 'findByJobOffer_CompanyId'
        // Si no lo tienes, añádelo al repositorio como te mostré antes.
        return applicationRepository.findByJobOffer_CompanyId(company.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(Long companyUserId, Long applicationId, 
                                                       ApplicationStatus status, String companyNotes, 
                                                       String interviewUrl) {
        Company company = companyRepository.findByUserId(companyUserId)
                .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada"));
                
        JobApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Aplicación no encontrada"));

        if (!app.getJobOffer().getCompany().getId().equals(company.getId())) {
            throw new IllegalArgumentException("No puedes modificar aplicaciones de otra empresa");
        }

        // Lógica de negocio para cambios de estado
        app.setStatus(status); 
        
        if (status == ApplicationStatus.INTERVIEW && interviewUrl != null) {
            app.markInterview(interviewUrl);
        } else if (status == ApplicationStatus.HIRED) {
            app.markHired();
        } else if (status == ApplicationStatus.REJECTED) {
            app.markRejected(companyNotes);
        }

        if (companyNotes != null) app.setCompanyNotes(companyNotes);

        return mapToResponse(applicationRepository.save(app));
    }

    private ApplicationResponse mapToResponse(JobApplication app) {
        return ApplicationResponse.builder()
                .id(app.getId())
                .jobOfferId(app.getJobOffer().getId())
                .jobTitle(app.getJobOffer().getTitle())
                .jobRole(app.getJobOffer().getRole().name())
                .companyId(app.getJobOffer().getCompany().getId())
                .companyName(app.getJobOffer().getCompany().getName()) 
                .repId(app.getRep().getId())
                .repFullName(app.getRep().getFullName()) // Asegúrate de que RepProfile tiene este método
                .status(app.getStatus())
                .repMessage(app.getRepMessage())
                .companyNotes(app.getCompanyNotes())
                .interviewUrl(app.getInterviewUrl())
                .createdAt(app.getCreatedAt())
                .build();
    }
}