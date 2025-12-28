package com.capitalhub.jobs.service;

import com.capitalhub.company.entity.Company;
import com.capitalhub.company.repository.CompanyRepository;
import com.capitalhub.jobs.dto.JobOfferRequest;
import com.capitalhub.jobs.dto.JobOfferResponse;
import com.capitalhub.jobs.entity.JobOffer;
import com.capitalhub.jobs.entity.JobStatus;
import com.capitalhub.jobs.repository.JobOfferRepository;
import com.capitalhub.rep.entity.RepRole;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobOfferService {

    private final JobOfferRepository jobOfferRepository;
    private final CompanyRepository companyRepository;

    public JobOfferResponse createOffer(Long companyUserId, JobOfferRequest req) {
        Company company = companyRepository.findByUserId(companyUserId)
                .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada"));

        // Convertir role String a RepRole enum
        RepRole repRole = parseRole(req.getRole());

        // Determinar URL de entrevista según callTool
        String calendlyUrl = null;
        String zoomUrl = null;
        String whatsappUrl = null;
        String googleFormUrl = null;

        if (req.getCallTool() != null && req.getCallLink() != null) {
            switch (req.getCallTool().toUpperCase()) {
                case "CALENDLY" -> calendlyUrl = req.getCallLink();
                case "ZOOM" -> zoomUrl = req.getCallLink();
                case "WHATSAPP" -> whatsappUrl = req.getCallLink();
                case "GOOGLE_FORM" -> googleFormUrl = req.getCallLink();
            }
        }

        // Valores por defecto si no se envían
        Integer seats = req.getSeats() != null ? req.getSeats() : 1;

        JobOffer offer = JobOffer.builder()
                .company(company)
                .title(req.getTitle())
                .description(req.getDescription() != null ? req.getDescription() : "")
                .role(repRole)
                .seats(seats)
                .maxApplicants(seats * 20)
                .applicantsCount(0)
                .language(req.getLanguage() != null ? req.getLanguage() : "Español")
                .crm(req.getCrm())
                .commissionPercent(req.getCommissionPercent())
                .avgTicket(req.getAvgTicket())
                .estimatedMonthlyEarnings(req.getEstimatedMonthlyEarnings())
                .modality(req.getType() != null ? req.getType() : req.getModality()) // type del frontend = modality
                .market(req.getMarket())
                .calendlyUrl(calendlyUrl != null ? calendlyUrl : req.getCalendlyUrl())
                .zoomUrl(zoomUrl != null ? zoomUrl : req.getZoomUrl())
                .whatsappUrl(whatsappUrl != null ? whatsappUrl : req.getWhatsappUrl())
                .googleFormUrl(googleFormUrl != null ? googleFormUrl : req.getGoogleFormUrl())
                .status(JobStatus.ACTIVE)
                .active(true)
                .build();

        return mapToResponse(jobOfferRepository.save(offer), req.getSalaryHint(), req.getModel(), req.getCallTool(),
                req.getCallLink());
    }

    private RepRole parseRole(String roleStr) {
        if (roleStr == null || roleStr.isBlank()) {
            return RepRole.CLOSER; // Default
        }

        return switch (roleStr.toUpperCase()) {
            case "SETTER" -> RepRole.SETTER;
            case "CLOSER" -> RepRole.CLOSER;
            case "COLD_CALLER", "SDR" -> RepRole.COLD_CALLER;
            case "BOTH" -> RepRole.BOTH;
            default -> RepRole.CLOSER;
        };
    }

    public List<JobOfferResponse> listCompanyOffers(Long companyUserId) {
        Company company = companyRepository.findByUserId(companyUserId)
                .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada"));

        return jobOfferRepository.findByCompanyId(company.getId())
                .stream()
                .map(o -> mapToResponse(o, null, null, null, null))
                .toList();
    }

    public List<JobOfferResponse> listOffersForRep(RepRole repRole) {
        List<RepRole> allowedRoles = new ArrayList<>();
        if (repRole != null) {
            if (repRole == RepRole.SETTER) {
                allowedRoles.add(RepRole.SETTER);
                allowedRoles.add(RepRole.BOTH);
            } else if (repRole == RepRole.CLOSER) {
                allowedRoles.add(RepRole.CLOSER);
                allowedRoles.add(RepRole.BOTH);
            } else if (repRole == RepRole.COLD_CALLER) {
                allowedRoles.add(RepRole.COLD_CALLER);
                allowedRoles.add(RepRole.BOTH);
            }
        } else {
            allowedRoles.add(RepRole.SETTER);
            allowedRoles.add(RepRole.CLOSER);
            allowedRoles.add(RepRole.COLD_CALLER);
            allowedRoles.add(RepRole.BOTH);
        }

        return jobOfferRepository.findByActiveTrueAndRoleIn(allowedRoles)
                .stream()
                .filter(o -> o.getStatus() == JobStatus.ACTIVE)
                .map(o -> mapToResponse(o, null, null, null, null))
                .toList();
    }

    public List<JobOfferResponse> listAllActiveOffers() {
        return jobOfferRepository.findAll().stream()
                .filter(o -> Boolean.TRUE.equals(o.getActive()) && o.getStatus() == JobStatus.ACTIVE)
                .map(o -> mapToResponse(o, null, null, null, null))
                .toList();
    }

    public JobOfferResponse getOffer(Long id) {
        JobOffer offer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada"));
        return mapToResponse(offer, null, null, null, null);
    }

    public JobOfferResponse updateStatus(Long companyUserId, Long offerId, JobStatus status) {
        Company company = companyRepository.findByUserId(companyUserId)
                .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada"));

        JobOffer offer = jobOfferRepository.findById(offerId)
                .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada"));

        if (!offer.getCompany().getId().equals(company.getId())) {
            throw new IllegalArgumentException("No puedes editar una oferta que no es tuya");
        }

        offer.setStatus(status);
        offer.setActive(status != JobStatus.CLOSED);

        return mapToResponse(jobOfferRepository.save(offer), null, null, null, null);
    }

    private JobOfferResponse mapToResponse(JobOffer o, String salaryHint, String model, String callTool,
            String callLink) {
        // Determinar callTool y callLink desde los URLs guardados
        String resolvedCallTool = callTool;
        String resolvedCallLink = callLink;

        if (resolvedCallTool == null) {
            if (o.getCalendlyUrl() != null && !o.getCalendlyUrl().isBlank()) {
                resolvedCallTool = "CALENDLY";
                resolvedCallLink = o.getCalendlyUrl();
            } else if (o.getZoomUrl() != null && !o.getZoomUrl().isBlank()) {
                resolvedCallTool = "ZOOM";
                resolvedCallLink = o.getZoomUrl();
            } else if (o.getWhatsappUrl() != null && !o.getWhatsappUrl().isBlank()) {
                resolvedCallTool = "WHATSAPP";
                resolvedCallLink = o.getWhatsappUrl();
            } else if (o.getGoogleFormUrl() != null && !o.getGoogleFormUrl().isBlank()) {
                resolvedCallTool = "GOOGLE_FORM";
                resolvedCallLink = o.getGoogleFormUrl();
            }
        }

        // Generar salaryHint si no viene
        String resolvedSalaryHint = salaryHint;
        if (resolvedSalaryHint == null && o.getCommissionPercent() != null) {
            resolvedSalaryHint = o.getCommissionPercent() + "% comisión";
            if (o.getAvgTicket() != null) {
                resolvedSalaryHint += " · ticket " + o.getAvgTicket().intValue() + " €";
            }
        }

        // Generar model si no viene
        String resolvedModel = model != null ? model : "Variable";

        return JobOfferResponse.builder()
                .id(o.getId())
                .companyId(o.getCompany().getId())
                .companyName(o.getCompany().getName())
                .title(o.getTitle())
                .description(o.getDescription())
                .role(o.getRole() != null ? o.getRole().name() : "CLOSER")
                .seats(o.getSeats())
                .maxApplicants(o.getMaxApplicants())
                .applicantsCount(o.getApplicantsCount())
                .language(o.getLanguage())
                .crm(o.getCrm())
                .commissionPercent(o.getCommissionPercent())
                .avgTicket(o.getAvgTicket())
                .estimatedMonthlyEarnings(o.getEstimatedMonthlyEarnings())
                .modality(o.getModality())
                .market(o.getMarket())
                .calendlyUrl(o.getCalendlyUrl())
                .zoomUrl(o.getZoomUrl())
                .whatsappUrl(o.getWhatsappUrl())
                .googleFormUrl(o.getGoogleFormUrl())
                .status(o.getStatus())
                .active(o.getActive())
                .createdAt(o.getCreatedAt())
                .updatedAt(o.getUpdatedAt())
                // Campos adicionales para el frontend
                .salaryHint(resolvedSalaryHint)
                .model(resolvedModel)
                .type(o.getModality())
                .callTool(resolvedCallTool)
                .callLink(resolvedCallLink)
                .build();
    }
}
