package com.capitalhub.applications.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ApplyRequest {
    private String repMessage; // mensaje opcional del rep al aplicar
}
