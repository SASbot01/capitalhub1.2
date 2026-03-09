import { apiClient } from './client';

// ========================================
// Types
// ========================================

export interface Route {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    displayOrder: number;
    active: boolean;
}

export interface Formation {
    id: number;
    routeId: number;
    name: string;
    description: string;
    imageUrl: string;
    level: string;
    displayOrder: number;
    active: boolean;
    minTier: string;
    isIntroModule: boolean;
    estimatedHours?: number;
}

export interface TrainingModule {
    id: number;
    formationId: number;
    name: string;
    description: string;
    displayOrder: number;
    contentType: string; // TECHNICAL or MINDSET
}

export interface Lesson {
    id: number;
    moduleId: number;
    title: string;
    description: string;
    videoUrl: string;
    duration: string;
    position: number;
}

export interface FormationAccessInfo {
    formation: Formation;
    status: 'UNLOCKED' | 'TRIAL_ACCESS' | 'LOCKED';
    isTrialAccess: boolean;
}

export interface ModuleAccessInfo {
    module: TrainingModule;
    accessible: boolean;
    lockReason: string | null; // TRIAL_LIMIT, ANNUAL_PLAN_REQUIRED, FORMATION_LOCKED
    contentType: string;
}

export interface FormationProgress {
    totalLessons: number;
    completedLessons: number;
    progressPercentage: number;
    isCompleted: boolean;
}

export interface CoinTransaction {
    id: number;
    userId: number;
    amount: number;
    transactionType: string;
    referenceId: number | null;
    description: string;
    createdAt: string;
}

// ========================================
// Routes API
// ========================================

export async function getRoutes(): Promise<Route[]> {
    return apiClient.get<Route[]>('/api/training/routes', true);
}

export async function getRoute(id: number): Promise<Route> {
    return apiClient.get<Route>(`/api/training/routes/${id}`, true);
}

// ========================================
// Active Route API
// ========================================

export async function getActiveRoute(): Promise<Route | null> {
    try {
        return await apiClient.get<Route>('/api/training/active-route', true);
    } catch {
        return null;
    }
}

export async function setActiveRoute(routeId: number): Promise<void> {
    await apiClient.post('/api/training/active-route', { routeId }, true);
}

export async function switchRoute(routeId: number): Promise<void> {
    await apiClient.post('/api/training/switch-route', { routeId }, true);
}

// ========================================
// Formations Access API
// ========================================

export async function getFormationsAccess(routeId: number): Promise<FormationAccessInfo[]> {
    return apiClient.get<FormationAccessInfo[]>(`/api/training/routes/${routeId}/formations-access`, true);
}

export async function getFormations(routeId: number): Promise<Formation[]> {
    return apiClient.get<Formation[]>(`/api/training/routes/${routeId}/formations`, true);
}

export async function getFormation(id: number): Promise<Formation> {
    return apiClient.get<Formation>(`/api/training/formations/${id}`, true);
}

// ========================================
// Modules Access API
// ========================================

export async function getModulesAccess(formationId: number): Promise<ModuleAccessInfo[]> {
    return apiClient.get<ModuleAccessInfo[]>(`/api/training/formations/${formationId}/modules-access`, true);
}

export async function getModules(formationId: number): Promise<TrainingModule[]> {
    return apiClient.get<TrainingModule[]>(`/api/training/formations/${formationId}/modules`, true);
}

// ========================================
// Lessons API
// ========================================

export async function getLessons(moduleId: number): Promise<Lesson[]> {
    return apiClient.get<Lesson[]>(`/api/training/modules/${moduleId}/lessons`, true);
}

export async function getLesson(id: number): Promise<Lesson> {
    return apiClient.get<Lesson>(`/api/training/lessons/${id}`, true);
}

export async function completeLesson(lessonId: number): Promise<void> {
    await apiClient.post(`/api/training/lessons/${lessonId}/complete`, {}, true);
}

export async function isLessonUnlocked(lessonId: number): Promise<boolean> {
    const res = await apiClient.get<{ unlocked: boolean }>(`/api/training/lessons/${lessonId}/unlocked`, true);
    return res.unlocked;
}

// ========================================
// Unlock Formation API
// ========================================

export async function unlockFormation(formationId: number): Promise<void> {
    await apiClient.post(`/api/training/formations/${formationId}/unlock`, {}, true);
}

// ========================================
// Trial API
// ========================================

export async function startTrial(routeId: number, formationId: number): Promise<void> {
    await apiClient.post('/api/v1/trial/start', { routeId, formationId }, true);
}

// ========================================
// Coins API
// ========================================

export async function getCoinBalance(): Promise<number> {
    const res = await apiClient.get<{ balance: number }>('/api/v1/coins/balance', true);
    return res.balance;
}

export async function getCoinHistory(): Promise<CoinTransaction[]> {
    return apiClient.get<CoinTransaction[]>('/api/v1/coins/history', true);
}

// ========================================
// Progress API
// ========================================

export async function getFormationProgress(formationId: number): Promise<FormationProgress> {
    return apiClient.get<FormationProgress>(`/api/training/formations/${formationId}/progress`, true);
}

export async function getActiveFormation(): Promise<Formation | null> {
    try {
        return await apiClient.get<Formation>('/api/training/active-formation', true);
    } catch {
        return null;
    }
}

export async function setActiveFormation(formationId: number): Promise<void> {
    await apiClient.post('/api/training/active-formation', { formationId }, true);
}
