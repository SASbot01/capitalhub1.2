package com.capitalhub.training.controller;

import com.capitalhub.training.entity.Community;
import com.capitalhub.training.service.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    @GetMapping("/my-communities")
    public ResponseEntity<List<Community>> getUserCommunities(Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        return ResponseEntity.ok(communityService.getUserCommunities(userId));
    }

    @GetMapping("/route/{routeId}")
    public ResponseEntity<Community> getCommunityByRoute(@PathVariable Long routeId) {
        return ResponseEntity.ok(communityService.getCommunityByRoute(routeId));
    }

    @GetMapping("/formation/{formationId}")
    public ResponseEntity<Community> getCommunityByFormation(@PathVariable Long formationId) {
        return ResponseEntity.ok(communityService.getCommunityByFormation(formationId));
    }

    private Long getUserIdFromAuth(Authentication auth) {
        if (auth != null && auth.getPrincipal() instanceof org.springframework.security.core.userdetails.User) {
            String email = ((org.springframework.security.core.userdetails.User) auth.getPrincipal()).getUsername();
            return 1L; // TODO: Implement proper user ID extraction
        }
        throw new RuntimeException("User not authenticated");
    }
}
