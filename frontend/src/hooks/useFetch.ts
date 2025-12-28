// frontend/src/hooks/useFetch.ts
import { useState, useCallback, useEffect } from "react";
// Importamos el cliente API que ya hemos configurado con el token
import { apiClient } from "../api/client"; 

// Definición de la interfaz del estado que devuelve el hook
interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

// ----------------------------------------------------------------------
// Hook para obtener datos protegidos
// ----------------------------------------------------------------------

/**
 * Custom Hook para realizar peticiones GET a endpoints protegidos del backend.
 *
 * @param endpoint El endpoint de la API (ej: '/rep/dashboard/stats', '/rep/offers')
 * @param immediate Si es true, la petición se ejecuta al montar el componente.
 * @returns {FetchState<T> & { refetch: () => void }}
 */
export function useFetch<T>(endpoint: string, immediate: boolean = true) {
  
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    // Si no hay endpoint, o ya está cargando, salimos
    if (!endpoint || state.isLoading) return; 

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Usamos el cliente API, que automáticamente añade el token JWT
      const response = await apiClient.get<T>(endpoint, true); // ✅ auth = true
      
      setState({
        data: response,
        isLoading: false,
        error: null,
      });

    } catch (err: any) {
      console.error(`Error fetching data from ${endpoint}:`, err);
      let errorMessage = "Ocurrió un error al cargar los datos.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message; // Mensaje del backend
      } else if (err.message) {
        errorMessage = err.message; // Mensaje de red
      }

      setState({
        data: null,
        isLoading: false,
        error: errorMessage,
      });
    }
  }, [endpoint]); // Depende solo del endpoint

  // Ejecutar la petición si 'immediate' es true
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, fetchData]);

  return {
    ...state,
    refetch: fetchData, // Función para recargar los datos manualmente
  };
}