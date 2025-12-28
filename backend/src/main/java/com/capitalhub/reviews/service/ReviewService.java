package com.capitalhub.reviews.service;

import com.capitalhub.company.entity.Company;
import com.capitalhub.company.repository.CompanyRepository;
import com.capitalhub.jobs.entity.JobOffer;
import com.capitalhub.jobs.repository.JobOfferRepository;
import com.capitalhub.rep.entity.RepProfile;
import com.capitalhub.rep.repository.RepProfileRepository;
import com.capitalhub.reviews.dto.ReviewRequest;
import com.capitalhub.reviews.dto.ReviewResponse;
import com.capitalhub.reviews.entity.Review;
import com.capitalhub.reviews.repository.ReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CompanyRepository companyRepository;
    private final RepProfileRepository repProfileRepository;
    private final JobOfferRepository jobOfferRepository;

    /**
     * Empresa deja review a un REP.
     */
    public ReviewResponse createReview(Long companyUserId, ReviewRequest req) {

        Company company = companyRepository.findByUserId(companyUserId)
                .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada"));

        RepProfile rep = repProfileRepository.findById(req.getRepId())
                .orElseThrow(() -> new EntityNotFoundException("REP no encontrado"));

        JobOffer offer = null;
        if (req.getJobOfferId() != null) {
            offer = jobOfferRepository.findById(req.getJobOfferId())
                    .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada"));

            // seguridad: la empresa solo puede dejar review en ofertas suyas
            if (!offer.getCompany().getId().equals(company.getId())) {
                throw new IllegalArgumentException("No puedes dejar review sobre una oferta que no es tuya");
            }
        }

        Review review = Review.builder()
                .company(company)
                .rep(rep)
                .jobOffer(offer)
                .rating(req.getRating())
                .comment(req.getComment())
                .callsMade(req.getCallsMade())
                .dealsClosed(req.getDealsClosed())
                .generatedRevenue(req.getGeneratedRevenue())
                .visible(true)
                .build();

        Review saved = reviewRepository.save(review);
        return mapToResponse(saved);
    }

    /**
     * REP ve todas sus reviews.
     */
    public List<ReviewResponse> listReviewsForRep(Long repUserId) {
        RepProfile rep = repProfileRepository.findByUserId(repUserId)
                .orElseThrow(() -> new EntityNotFoundException("Perfil REP no encontrado"));

        return reviewRepository.findByRepId(rep.getId())
                .stream()
                .filter(Review::getVisible)
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Empresa ve todas las reviews que ha dejado.
     */
    public List<ReviewResponse> listReviewsForCompany(Long companyUserId) {
        Company company = companyRepository.findByUserId(companyUserId)
                .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada"));

        return reviewRepository.findByCompanyId(company.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // -----------------------
    // Mapper sencillo MVP
    // -----------------------
    private ReviewResponse mapToResponse(Review r) {
        return ReviewResponse.builder()
                .id(r.getId())
                .companyId(r.getCompany().getId())
                .companyName(r.getCompany().getName())
                .repId(r.getRep().getId())
                // ✅ ESTO FUNCIONARÁ AL ARREGLAR RepProfile.java
                .repFullName(r.getRep().getFullName()) 
                .jobOfferId(r.getJobOffer() != null ? r.getJobOffer().getId() : null)
                .jobTitle(r.getJobOffer() != null ? r.getJobOffer().getTitle() : null)
                .rating(r.getRating())
                .comment(r.getComment())
                .callsMade(r.getCallsMade())
                .dealsClosed(r.getDealsClosed())
                .generatedRevenue(r.getGeneratedRevenue())
                .visible(r.getVisible())
                .createdAt(r.getCreatedAt())
                .build();
    }
}