package com.capitalhub.rep.controller;

import com.capitalhub.auth.entity.User;
import com.capitalhub.rep.dto.RepProfileResponse;
import com.capitalhub.rep.dto.RepProfileUpdateRequest;
import com.capitalhub.rep.service.RepService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rep")
@RequiredArgsConstructor
public class RepController {

    private final RepService repService;

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('REP')")
    public ResponseEntity<RepProfileResponse> getMyProfile(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(repService.getMyProfile(user.getId()));
    }

    @PutMapping("/me")
    @PreAuthorize("hasAuthority('REP')")
    public ResponseEntity<RepProfileResponse> updateMyProfile(
            @Valid @RequestBody RepProfileUpdateRequest req,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(repService.updateMyProfile(user.getId(), req));
    }

    // Endpoint público para que Company pueda ver perfiles de Reps
    @GetMapping("/{repId}")
    @PreAuthorize("hasAuthority('COMPANY')")
    public ResponseEntity<RepProfileResponse> getRepProfile(@PathVariable Long repId) {
        return ResponseEntity.ok(repService.getRepProfileById(repId));
    }
}