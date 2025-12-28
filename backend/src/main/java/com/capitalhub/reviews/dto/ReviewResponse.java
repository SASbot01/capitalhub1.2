package com.capitalhub.reviews.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ReviewResponse {

    private Long id;

    private Long companyId;
    private String companyName;

    private Long repId;
    private String repFullName;

    private Long jobOfferId;
    private String jobTitle;

    private Integer rating;
    private String comment;

    private Integer callsMade;
    private Integer dealsClosed;
    private Double generatedRevenue;

    private Boolean visible;

    private LocalDateTime createdAt;
}
