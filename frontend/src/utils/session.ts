// frontend/src/utils/session.ts
// 🟢 CORREGIDO: Usamos 'import type' ya que LoginResponse es solo una interfaz
import type { LoginResponse } from "../api/auth";

const TOKEN_KEY = "accessToken";
const USER_KEY = "currentUser";

export interface UserSession {
  email: string;
  role: "REP" | "COMPANY" | "ADMIN";
}

/**
 * Guarda el token y los datos básicos del usuario después de un login/registro exitoso.
 */
export function saveSession(authData: LoginResponse) {
  if (authData.accessToken) {
    localStorage.setItem(TOKEN_KEY, authData.accessToken);
  }
  
  // Guardamos el email y rol para usar en la app
  const userData: UserSession = {
    email: authData.email,
    role: authData.role,
  };
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
}

/**
 * Carga la sesión actual desde el localStorage.
 */
export function loadSession(): UserSession | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const userJson = localStorage.getItem(USER_KEY);

  if (!token || !userJson) {
    return null;
  }

  try {
    // 💡 El tipo UserSession es exportado desde aquí, por lo que su uso es correcto
    const userData: UserSession = JSON.parse(userJson);
    return userData;
  } catch (e) {
    // Si el JSON del usuario está corrupto, limpiamos la sesión
    clearSession();
    return null;
  }
}

/**
 * Elimina la sesión (Logout).
 */
export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Devuelve solo el token.
 */
export function getAuthToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}