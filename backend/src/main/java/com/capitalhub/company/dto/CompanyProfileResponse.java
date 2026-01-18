package com.capitalhub.company.dto;

import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyProfileResponse {

    private Long id;
    private Long userId;

    private String name;
    private String website;
    private String industry;
    private String description;

    // Métricas de negocio
    private Integer monthlyRevenue;
    private Integer monthlyCalls;
    private Integer monthlyClosedDeals;
    private Double winRate;

    // Video de oferta
    private String offerVideoUrl;

    // Google Form
    private String googleFormUrl;

    private String logoUrl;

    // Integraciones
    private String calendlyUrl;
    private String zoomUrl;
    private String whatsappUrl;

    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
