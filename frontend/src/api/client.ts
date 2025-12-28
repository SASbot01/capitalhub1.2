// frontend/src/api/client.ts
// En Docker: VITE_API_BASE_URL="" → usa rutas relativas (Nginx proxea a backend)
// En desarrollo local: VITE_API_BASE_URL="http://localhost:8081"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export interface ApiError {
  status: number;
  message: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth: boolean = false
): Promise<T> {
  
  // Normalizar ruta
  let normalizedPath = path;
  if (!normalizedPath.startsWith("/api")) {
    normalizedPath = `/api${path.startsWith("/") ? "" : "/"}${path}`;
  }
  const url = API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // --- LOGICA DE TOKEN ---
  if (auth) {
    // Intentamos leer de ambos sitios
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
      // 👇 ESTO NOS DIRÁ SI HAY TOKEN
      console.log(`🔑 Enviando Token a ${normalizedPath}:`, token.substring(0, 10) + "..."); 
    } else {
      console.warn(`⚠️ ALERTA: Se requiere auth para ${normalizedPath} pero NO HAY TOKEN guardado.`);
    }
  }
  // ----------------------

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = "Error en la comunicación con el servidor";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch { }

    console.error(`❌ Error ${res.status} en ${normalizedPath}: ${message}`);
    
    // Si el token caducó o es inválido, limpiamos para obligar a reloguear
    if (res.status === 403) {
        console.error("⛔ Acceso denegado (403). Revisa roles o validez del token.");
    }

    const error: ApiError = { status: res.status, message };
    throw error;
  }

  if (res.status === 204) return {} as T;
  return (await res.json()) as T;
}

export const apiClient = {
  get: <T>(path: string, auth: boolean = false) => request<T>(path, { method: "GET" }, auth),
  post: <T>(path: string, body?: any, auth: boolean = false) => request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }, auth),
  put: <T>(path: string, body?: any, auth: boolean = false) => request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }, auth),
  patch: <T>(path: string, body?: any, auth: boolean = false) => request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }, auth),
};

// =====================================================
// 📁 UPLOAD DE ARCHIVOS (multipart/form-data)
// =====================================================

interface UploadResponse {
  url: string;
}

export async function uploadFile(
  file: File, 
  folder: string = "general"
): Promise<UploadResponse> {
  const normalizedPath = "/api/media/upload";
  const url = API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const headers: HeadersInit = {};
  
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    let message = "Error al subir el archivo";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch { }
    throw { status: res.status, message };
  }

  return (await res.json()) as UploadResponse;
}