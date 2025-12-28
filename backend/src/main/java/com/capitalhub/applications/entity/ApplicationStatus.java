package com.capitalhub.applications.entity;

public enum ApplicationStatus {
    APPLIED,        // el rep se ha apuntado
    INTERVIEW,      // empresa lo selecciona y agenda entrevista
    OFFER_SENT,     // empresa envía oferta formal
    HIRED,          // contratado
    REJECTED,       // rechazado
    WITHDRAWN       // rep retira candidatura
}
