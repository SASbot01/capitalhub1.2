import { apiClient } from './client';
import type { Route, Formation, TrainingModule, Lesson } from './training';

// ========================================
// Admin Routes API
// ========================================

export async function adminGetRoutes(): Promise<Route[]> {
    return apiClient.get<Route[]>('/api/admin/training/routes', true);
}

export async function adminGetRoute(id: number): Promise<Route> {
    return apiClient.get<Route>(`/api/admin/training/routes/${id}`, true);
}

export async function adminCreateRoute(route: Partial<Route>): Promise<Route> {
    return apiClient.post<Route>('/api/admin/training/routes', route, true);
}

export async function adminUpdateRoute(id: number, route: Partial<Route>): Promise<Route> {
    return apiClient.put<Route>(`/api/admin/training/routes/${id}`, route, true);
}

export async function adminDeleteRoute(id: number): Promise<void> {
    await apiClient.delete(`/api/admin/training/routes/${id}`, true);
}

// ========================================
// Admin Formations API
// ========================================

export async function adminGetFormationsByRoute(routeId: number): Promise<Formation[]> {
    return apiClient.get<Formation[]>(`/api/admin/training/routes/${routeId}/formations`, true);
}

export async function adminGetFormation(id: number): Promise<Formation> {
    return apiClient.get<Formation>(`/api/admin/training/formations/${id}`, true);
}

export async function adminCreateFormation(formation: Partial<Formation>): Promise<Formation> {
    return apiClient.post<Formation>('/api/admin/training/formations', formation, true);
}

export async function adminUpdateFormation(id: number, formation: Partial<Formation>): Promise<Formation> {
    return apiClient.put<Formation>(`/api/admin/training/formations/${id}`, formation, true);
}

export async function adminDeleteFormation(id: number): Promise<void> {
    await apiClient.delete(`/api/admin/training/formations/${id}`, true);
}

// ========================================
// Admin Modules API
// ========================================

export async function adminGetModulesByFormation(formationId: number): Promise<TrainingModule[]> {
    return apiClient.get<TrainingModule[]>(`/api/admin/training/formations/${formationId}/modules`, true);
}

export async function adminGetModule(id: number): Promise<TrainingModule> {
    return apiClient.get<TrainingModule>(`/api/admin/training/modules/${id}`, true);
}

export async function adminCreateModule(module: Partial<TrainingModule>): Promise<TrainingModule> {
    return apiClient.post<TrainingModule>('/api/admin/training/modules', module, true);
}

export async function adminUpdateModule(id: number, module: Partial<TrainingModule>): Promise<TrainingModule> {
    return apiClient.put<TrainingModule>(`/api/admin/training/modules/${id}`, module, true);
}

export async function adminDeleteModule(id: number): Promise<void> {
    await apiClient.delete(`/api/admin/training/modules/${id}`, true);
}

// ========================================
// Admin Lessons API
// ========================================

export async function adminGetLessonsByModule(moduleId: number): Promise<Lesson[]> {
    return apiClient.get<Lesson[]>(`/api/admin/training/modules/${moduleId}/lessons`, true);
}

export async function adminGetLesson(id: number): Promise<Lesson> {
    return apiClient.get<Lesson>(`/api/admin/training/lessons/${id}`, true);
}

export async function adminCreateLesson(lesson: Partial<Lesson>): Promise<Lesson> {
    return apiClient.post<Lesson>('/api/admin/training/lessons', lesson, true);
}

export async function adminUpdateLesson(id: number, lesson: Partial<Lesson>): Promise<Lesson> {
    return apiClient.put<Lesson>(`/api/admin/training/lessons/${id}`, lesson, true);
}

export async function adminDeleteLesson(id: number): Promise<void> {
    await apiClient.delete(`/api/admin/training/lessons/${id}`, true);
}
