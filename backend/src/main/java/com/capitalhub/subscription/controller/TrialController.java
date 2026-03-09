package com.capitalhub.subscription.controller;

import com.capitalhub.auth.entity.User;
import com.capitalhub.subscription.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/trial")
@RequiredArgsConstructor
@Slf4j
public class TrialController {

    private final SubscriptionService subscriptionService;

    /**
     * Start free trial — requires auth, no prior subscription
     * POST /api/v1/trial/start
     * Body: { "routeId": 1, "formationId": 1 }
     */
    @PostMapping("/start")
    public ResponseEntity<Map<String, Object>> startTrial(
            @RequestBody Map<String, Long> request,
            @AuthenticationPrincipal User user) {

        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        Long routeId = request.get("routeId");
        Long formationId = request.get("formationId");

        if (routeId == null || formationId == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "routeId and formationId are required"));
        }

        try {
            subscriptionService.startTrial(user, routeId, formationId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Trial iniciado correctamente",
                    "routeId", routeId,
                    "formationId", formationId
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
