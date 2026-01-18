package com.capitalhub.training.service;

import com.capitalhub.training.entity.Community;
import com.capitalhub.training.entity.Formation;
import com.capitalhub.training.entity.UserActiveFormation;
import com.capitalhub.training.repository.CommunityRepository;
import com.capitalhub.training.repository.FormationRepository;
import com.capitalhub.training.repository.UserActiveFormationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final UserActiveFormationRepository userActiveFormationRepository;
    private final FormationRepository formationRepository;

    /**
     * Get all communities accessible to a user based on their active formation.
     * Returns: route-level community + formation-level community
     */
    public List<Community> getUserCommunities(Long userId) {
        List<Community> communities = new ArrayList<>();

        // Get user's active formation
        Optional<UserActiveFormation> activeFormation = userActiveFormationRepository.findByUserId(userId);

        if (activeFormation.isPresent()) {
            Long formationId = activeFormation.get().getFormationId();
            Formation formation = formationRepository.findById(formationId)
                    .orElseThrow(() -> new RuntimeException("Formation not found"));

            Long routeId = formation.getRouteId();

            // Get route-level community
            communityRepository.findByRouteId(routeId).ifPresent(communities::add);

            // Get formation-level community
            communityRepository.findByFormationId(formationId).ifPresent(communities::add);
        }

        return communities;
    }

    public Community getCommunityByRoute(Long routeId) {
        return communityRepository.findByRouteId(routeId)
                .orElseThrow(() -> new RuntimeException("Community not found for route: " + routeId));
    }

    public Community getCommunityByFormation(Long formationId) {
        return communityRepository.findByFormationId(formationId)
                .orElseThrow(() -> new RuntimeException("Community not found for formation: " + formationId));
    }
}
