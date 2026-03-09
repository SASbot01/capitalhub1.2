// frontend/src/api/auth.ts
import { apiClient } from "./client";

// DTO del lado del Frontend para la respuesta de Login/Registro
export interface LoginResponse {
  accessToken: string;
  tokenType: "Bearer"; // Añadido para coincidir con el backend
  email: string;
  role: "REP" | "COMPANY" | "ADMIN"; // Tipo de rol que devuelve el backend
}

// DTO para la petición de Registro (Adaptado al SignupRequest.java)
export interface RegisterRepRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  plan?: string;
  token?: string;
}

// DTO para registro de empresas
export interface RegisterCompanyRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// ----------------------------------------------------------------------------------

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  // ✅ CORREGIDO: La ruta es /auth/login (el /api ya lo añade client.ts)
  return apiClient.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
}

// ✅ Registro de Comerciales (REP)
export async function registerRep(payload: RegisterRepRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/signup/rep", {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    password: payload.password,
    plan: payload.plan,
    token: payload.token,
  });
  return response;
}

// ✅ Registro de Empresas (COMPANY)
export async function registerCompany(payload: RegisterCompanyRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/signup/company", {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    password: payload.password,
  });
  return response;
}

// ----------------------------------------------------------------------------------
// 🔐 FUNCIONES DE RECUPERACIÓN DE CONTRASEÑA
// ----------------------------------------------------------------------------------

export interface MessageResponse {
  message: string;
  success: boolean;
}

export async function forgotPassword(email: string): Promise<MessageResponse> {
  return apiClient.post<MessageResponse>("/auth/forgot-password", { email });
}

export async function resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
  return apiClient.post<MessageResponse>("/auth/reset-password", { token, newPassword });
}

export async function validateResetToken(token: string): Promise<MessageResponse> {
  return apiClient.get<MessageResponse>(`/auth/validate-reset-token?token=${token}`);
}