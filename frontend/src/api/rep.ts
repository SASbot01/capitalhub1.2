import { apiClient } from './client';

export interface RepProfileResponse {
    id: number;
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    roleType: 'CLOSER' | 'SETTER' | 'COLD_CALLER';
    bio?: string;
    phone?: string;
    city?: string;
    country?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    avatarUrl?: string;
    introVideoUrl?: string;
    bestCallUrl?: string;
}

/**
 * COMPANY: Obtiene el perfil público de un Rep por su ID.
 * URL: /api/rep/{repId}
 */
export const fetchRepProfile = async (repId: number): Promise<RepProfileResponse> => {
    return await apiClient.get<RepProfileResponse>(`/rep/${repId}`, true);
};
