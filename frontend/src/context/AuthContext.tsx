// frontend/src/context/AuthContext.tsx (CORREGIDO)
import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Importación de VALORES (funciones)
import { loadSession, saveSession, clearSession } from "../utils/session";
import { login as apiLogin, registerRep as apiRegisterRep, registerCompany as apiRegisterCompany } from "../api/auth"; 

// 2. Importación de TIPOS (interfaces)
import type { UserSession } from "../utils/session";
import type { LoginResponse, RegisterRepRequest, RegisterCompanyRequest } from "../api/auth";


// 1. Definición de la interfaz del Contexto
interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  role: UserSession["role"] | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  registerRep: (payload: RegisterRepRequest) => Promise<LoginResponse>;
  registerCompany: (payload: RegisterCompanyRequest) => Promise<LoginResponse>;
  logout: () => void;
}

// Estado inicial (no autenticado, cargando al inicio)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Proveedor del Contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar sesión inicial al cargar la aplicación
  useEffect(() => {
    const session = loadSession();
    if (session) {
      setUser(session);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      const response = await apiLogin(email, password);
      // ✅ UserSession está importado como tipo
      const sessionData: UserSession = { email: response.email, role: response.role };
      
      saveSession(response); // Guarda el token en localStorage
      setUser(sessionData); // Actualiza el estado de React
      
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterRep = async (payload: RegisterRepRequest): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      const response = await apiRegisterRep(payload);
      const sessionData: UserSession = { email: response.email, role: response.role };
      saveSession(response);
      setUser(sessionData);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterCompany = async (payload: RegisterCompanyRequest): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      const response = await apiRegisterCompany(payload);
      const sessionData: UserSession = { email: response.email, role: response.role };
      saveSession(response);
      setUser(sessionData);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    role: user ? user.role : null,
    isLoading,
    login: handleLogin,
    registerRep: handleRegisterRep,
    registerCompany: handleRegisterCompany,
    logout: handleLogout,
  };

  // 3. Renderizar el proveedor con el valor del contexto
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// 4. Custom Hook para usar el Contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};