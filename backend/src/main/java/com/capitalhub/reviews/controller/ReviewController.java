package com.capitalhub.reviews.controller;

import com.capitalhub.auth.entity.User;
import com.capitalhub.reviews.dto.ReviewRequest;
import com.capitalhub.reviews.dto.ReviewResponse;
import com.capitalhub.reviews.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // ✅ Empresa deja una review a un REP
    // POST /api/company/reviews
    @PreAuthorize("hasAuthority('COMPANY')")
    @PostMapping("/company/reviews")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse createReview(@Valid @RequestBody ReviewRequest req,
                                       Principal principal) {
        Long companyUserId = extractUserId(principal);
        return reviewService.createReview(companyUserId, req);
    }

    // ✅ REP ve sus reviews
    // GET /api/rep/reviews
    @PreAuthorize("hasAuthority('REP')")
    @GetMapping("/rep/reviews")
    public List<ReviewResponse> myReviews(Principal principal) {
        Long repUserId = extractUserId(principal);
        return reviewService.listReviewsForRep(repUserId);
    }

    // ✅ Empresa ve sus reviews dejadas
    // GET /api/company/reviews
    @PreAuthorize("hasAuthority('COMPANY')")
    @GetMapping("/company/reviews")
    public List<ReviewResponse> companyReviews(Principal principal) {
        Long companyUserId = extractUserId(principal);
        return reviewService.listReviewsForCompany(companyUserId);
    }

    private Long extractUserId(Principal principal) {
        if (principal == null) throw new IllegalArgumentException("Usuario no autenticado");
        if (principal instanceof User user) return user.getId();
        throw new IllegalStateException("No se pudo extraer el userId del token");
    }
}
