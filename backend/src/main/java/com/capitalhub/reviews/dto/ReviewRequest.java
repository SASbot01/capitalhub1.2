package com.capitalhub.reviews.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ReviewRequest {

    @NotNull
    private Long repId;       // id del RepProfile evaluado

    private Long jobOfferId;  // opcional, pero recomendado

    @NotNull
    @Min(1) @Max(5)
    private Integer rating;

    private String comment;

    // métricas logradas (opcionales MVP)
    private Integer callsMade;
    private Integer dealsClosed;
    private Double generatedRevenue;
}
