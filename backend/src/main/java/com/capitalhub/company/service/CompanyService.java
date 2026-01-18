package com.capitalhub.company.service;

import com.capitalhub.company.dto.CompanyProfileResponse;
import com.capitalhub.company.dto.CompanyProfileUpdateRequest;
import com.capitalhub.company.entity.Company;
import com.capitalhub.company.repository.CompanyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyProfileResponse getMyProfile(Long userId) {
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada para este usuario"));

        return mapToResponse(company);
    }

    public CompanyProfileResponse updateMyProfile(Long userId, CompanyProfileUpdateRequest req) {
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada para este usuario"));

        if (StringUtils.hasText(req.getName())) {
            company.setName(req.getName());
        }
        if (req.getWebsite() != null) company.setWebsite(req.getWebsite());
        if (req.getIndustry() != null) company.setIndustry(req.getIndustry());
        if (req.getDescription() != null) company.setDescription(req.getDescription());

        // Mapeo de campos antiguos del DTO a los nuevos de la Entidad
        if (req.getMonthlyRevenue() != null) company.setProjectionMrr(req.getMonthlyRevenue());
        if (req.getWinRate() != null) company.setProjectionGrowth(req.getWinRate().intValue()); // Adaptación temporal
        
        if (req.getOfferVideoUrl() != null) company.setVideoOfferUrl(req.getOfferVideoUrl());
        if (req.getGoogleFormUrl() != null) company.setGoogleFormUrl(req.getGoogleFormUrl());
        if (req.getLogoUrl() != null) company.setLogoUrl(req.getLogoUrl());

        // Estos campos no existen en la tabla companies actual, los omitimos o los guardamos en 'about' si es crítico
        // company.setCalendlyUrl(...); 
        
        Company saved = companyRepository.save(company);
        return mapToResponse(saved);
    }

    private CompanyProfileResponse mapToResponse(Company c) {
        return CompanyProfileResponse.builder()
                .id(c.getId())
                .userId(c.getUser() != null ? c.getUser().getId() : null)
                .name(c.getName())
                .website(c.getWebsite())
                .industry(c.getIndustry())
                .description(c.getDescription())
                .monthlyRevenue(c.getProjectionMrr())
                // .monthlyCalls(0) // No existe en DB
                // .monthlyClosedDeals(0) // No existe en DB
                .winRate(c.getProjectionGrowth() != null ? c.getProjectionGrowth().doubleValue() : 0.0)
                .offerVideoUrl(c.getVideoOfferUrl())
                .googleFormUrl(c.getGoogleFormUrl())
                .logoUrl(c.getLogoUrl())
                // .calendlyUrl(...) // No existe en DB
                .active(true) // Default
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getCreatedAt()) // Temporal
                .build();
    }
}