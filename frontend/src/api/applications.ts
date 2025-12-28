import { apiClient } from './client';

export type ApplicationStatus = 'APPLIED' | 'INTERVIEW' | 'OFFER_SENT' | 'HIRED' | 'REJECTED' | 'WITHDRAWN';

export interface ApplicationResponse {
    id: number;

    jobOfferId: number;
    jobTitle: string;
    jobRole?: string;

    companyId: number;
    companyName: string;

    repId: number;
    repFullName: string;

    status: ApplicationStatus;

    repMessage?: string;
    companyNotes?: string;
    interviewUrl?: string;

    appliedAt: string;
    interviewAt?: string;
    hiredAt?: string;
    rejectedAt?: string;

    createdAt: string;
    updatedAt: string;
}

/**
 * Aplica a una oferta.
 * URL: /api/rep/jobs/{offerId}/apply
 */
export const applyToJob = async (jobOfferId: number): Promise<ApplicationResponse> => {
    return await apiClient.post<ApplicationResponse>(
        `/rep/jobs/${jobOfferId}/apply`,
        {}, // body vacío
        true // auth
    );
};

/**
 * Obtiene las aplicaciones del REP.
 * URL: /api/rep/applications
 */
export const fetchRepApplications = async (): Promise<ApplicationResponse[]> => {
    return await apiClient.get<ApplicationResponse[]>('/rep/applications', true);
};

/**
 * COMPANY: Obtiene las aplicaciones de una oferta específica.
 * URL: /api/company/jobs/{offerId}/applications
 */
export const fetchJobApplications = async (jobOfferId: number): Promise<ApplicationResponse[]> => {
    return await apiClient.get<ApplicationResponse[]>(`/company/jobs/${jobOfferId}/applications`, true);
};

/**
 * COMPANY: Actualiza el estado de una aplicación.
 * URL: /api/company/applications/{id}/status
 */
export const updateApplicationStatus = async (
    applicationId: number,
    status: ApplicationStatus,
    companyNotes?: string,
    interviewUrl?: string
): Promise<ApplicationResponse> => {
    const params = new URLSearchParams();
    params.append('status', status);
    if (companyNotes) params.append('companyNotes', companyNotes);
    if (interviewUrl) params.append('interviewUrl', interviewUrl);

    return await apiClient.patch<ApplicationResponse>(
        `/company/applications/${applicationId}/status?${params.toString()}`,
        {}, // body vacío, todo va en query params
        true // auth
    );
};