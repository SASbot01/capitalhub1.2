import { apiClient } from "./client";

export interface Lesson {
    id: number;
    title: string;
    duration: string;
    status: "completed" | "in-progress" | "locked";
}

export interface Course {
    id: string;
    title: string;
    level: string; // Backend string, usually "Básico", "Intermedio", "Avanzado"
    focus: string;
    progress: number;
    lessons: Lesson[];
}

export async function getTrainingCourses(): Promise<Course[]> {
    return apiClient.get<Course[]>("/training/courses");
}

export async function completeLesson(lessonId: number): Promise<void> {
    return apiClient.post(`/training/lessons/${lessonId}/complete`, {});
}
