package com.capitalhub.reviews.repository;

import com.capitalhub.reviews.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Todas las reviews de un rep
    List<Review> findByRepId(Long repId);

    // Todas las reviews creadas por una empresa
    List<Review> findByCompanyId(Long companyId);

    // Reviews de un rep dentro de una oferta concreta
    List<Review> findByRepIdAndJobOfferId(Long repId, Long jobOfferId);
}
