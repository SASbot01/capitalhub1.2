package com.capitalhub.subscription.controller;

import com.capitalhub.auth.entity.User;
import com.capitalhub.subscription.entity.CoinTransaction;
import com.capitalhub.subscription.service.CoinService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/coins")
@RequiredArgsConstructor
@Slf4j
public class CoinController {

    private final CoinService coinService;

    /**
     * GET /api/v1/coins/balance — Get coin balance
     */
    @GetMapping("/balance")
    public ResponseEntity<Map<String, Object>> getCoinBalance(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        int balance = coinService.getCoinBalance(user.getId());
        return ResponseEntity.ok(Map.of("balance", balance));
    }

    /**
     * GET /api/v1/coins/history — Get coin transaction history
     */
    @GetMapping("/history")
    public ResponseEntity<List<CoinTransaction>> getCoinHistory(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(coinService.getCoinHistory(user.getId()));
    }
}
