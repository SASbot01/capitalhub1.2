package com.capitalhub.rep.service;

import com.capitalhub.auth.repository.UserRepository;
import com.capitalhub.rep.dto.RepProfileResponse;
import com.capitalhub.rep.dto.RepProfileUpdateRequest;
import com.capitalhub.rep.entity.RepProfile;
import com.capitalhub.rep.repository.RepProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class RepService {

    private final RepProfileRepository repProfileRepository;
    private final UserRepository userRepository;

    public RepProfileResponse getMyProfile(Long userId) {
        RepProfile rep = repProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Perfil de comercial no encontrado"));
        return mapToResponse(rep);
    }

    public RepProfileResponse updateMyProfile(Long userId, RepProfileUpdateRequest req) {
        RepProfile rep = repProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Perfil de comercial no encontrado"));

        // Actualizar datos básicos de usuario
        if (StringUtils.hasText(req.getFirstName()))
            rep.getUser().setFirstName(req.getFirstName());
        if (StringUtils.hasText(req.getLastName()))
            rep.getUser().setLastName(req.getLastName());
        userRepository.save(rep.getUser());

        // Actualizar perfil
        if (req.getRoleType() != null)
            rep.setRoleType(req.getRoleType());
        if (req.getBio() != null)
            rep.setBio(req.getBio());
        if (req.getPhone() != null)
            rep.setPhone(req.getPhone());
        if (req.getCity() != null)
            rep.setCity(req.getCity());
        if (req.getCountry() != null)
            rep.setCountry(req.getCountry());
        if (req.getLinkedinUrl() != null)
            rep.setLinkedinUrl(req.getLinkedinUrl());
        if (req.getPortfolioUrl() != null)
            rep.setPortfolioUrl(req.getPortfolioUrl());
        if (req.getAvatarUrl() != null)
            rep.setAvatarUrl(req.getAvatarUrl());

        RepProfile saved = repProfileRepository.save(rep);
        return mapToResponse(saved);
    }

    public RepProfileResponse updateAvatar(Long userId, String url) {
        RepProfile rep = repProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Perfil no encontrado"));
        rep.setAvatarUrl(url);
        return mapToResponse(repProfileRepository.save(rep));
    }

    // Método para que Company pueda ver el perfil de un Rep por su ID
    public RepProfileResponse getRepProfileById(Long repId) {
        RepProfile rep = repProfileRepository.findById(repId)
                .orElseThrow(() -> new EntityNotFoundException("Perfil de comercial no encontrado"));
        return mapToResponse(rep);
    }

    private RepProfileResponse mapToResponse(RepProfile p) {
        return RepProfileResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .email(p.getUser().getEmail())
                .firstName(p.getUser().getFirstName())
                .lastName(p.getUser().getLastName())
                .fullName(p.getFullName())
                .roleType(p.getRoleType())
                .bio(p.getBio())
                .phone(p.getPhone())
                .city(p.getCity())
                .country(p.getCountry())
                .linkedinUrl(p.getLinkedinUrl())
                .portfolioUrl(p.getPortfolioUrl())
                .avatarUrl(p.getAvatarUrl())
                .introVideoUrl(p.getIntroVideoUrl())
                .bestCallUrl(p.getBestCallUrl())
                .build();
    }
}