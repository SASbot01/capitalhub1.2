package com.capitalhub.jobs.dto;

import com.capitalhub.jobs.entity.JobStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobOfferResponse {

    private Long id;

    private Long companyId;
    private String companyName;

    private String title;
    private String description;

    // Cambiado a String para compatibilidad con frontend
    private String role;

    private Integer seats;
    private Integer maxApplicants;
    private Integer applicantsCount;

    private String language;
    private String crm;

    private Double commissionPercent;
    private Double avgTicket;
    private Double estimatedMonthlyEarnings;

    private String modality;
    private String market;

    private String calendlyUrl;
    private String zoomUrl;
    private String whatsappUrl;
    private String googleFormUrl;

    private JobStatus status;
    private Boolean active;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ===== Campos adicionales para el frontend =====
    private String salaryHint; // Ej: "15% comisión · ticket 2.000 €"
    private String model; // Ej: "Solo variable"
    private String type; // Ej: "Remoto"
    private String callTool; // "CALENDLY", "ZOOM", "WHATSAPP", "GOOGLE_FORM"
    private String callLink; // URL de la herramienta
}
