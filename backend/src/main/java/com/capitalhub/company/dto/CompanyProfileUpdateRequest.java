package com.capitalhub.company.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyProfileUpdateRequest {

    private String name;
    private String website;
    private String industry;
    private String description;

    private Integer monthlyRevenue;
    private Integer monthlyCalls;
    private Integer monthlyClosedDeals;
    private Double winRate;

    private String offerVideoUrl;
    private String googleFormUrl;
    private String logoUrl;

    private String calendlyUrl;
    private String zoomUrl;
    private String whatsappUrl;
}
