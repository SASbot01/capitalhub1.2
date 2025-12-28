package com.capitalhub.jobs.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobOfferRequest {

    @NotBlank(message = "El título es obligatorio")
    private String title;

    private String description;

    // El frontend envía "CLOSER", "SETTER", "COLD_CALLER", "BOTH"
    private String role;

    // Campos del frontend
    private String salaryHint; // Ej: "15% comisión · ticket 2.000 €"
    private String model; // Ej: "Solo variable", "Fijo + variable"
    private String type; // Ej: "Remoto", "Híbrido"
    private String callTool; // "CALENDLY", "ZOOM", "WHATSAPP"
    private String callLink; // URL de la herramienta

    // Campos originales opcionales
    private Integer seats; // Número de plazas (default 1)
    private String language; // "ES", "EN", "ES+EN"
    private String crm; // "HubSpot", "GoHighLevel", etc.
    private Double commissionPercent;
    private Double avgTicket;
    private Double estimatedMonthlyEarnings;
    private String modality; // remoto/híbrido/presencial
    private String market; // ES/LATAM/USA...
    private String calendlyUrl;
    private String zoomUrl;
    private String whatsappUrl;
    private String googleFormUrl;
}
