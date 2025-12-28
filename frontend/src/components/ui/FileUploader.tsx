// frontend/src/components/ui/FileUploader.tsx
import { useState, useRef } from "react";
import { uploadFile } from "../../api/client";

interface FileUploaderProps {
  onUploadComplete: (url: string) => void;
  folder?: string;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  currentUrl?: string;
  variant?: "avatar" | "video" | "file";
}

export default function FileUploader({
  onUploadComplete,
  folder = "general",
  accept = "image/*",
  maxSizeMB = 5,
  label = "Subir archivo",
  currentUrl,
  variant = "file",
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validar tamaño
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`El archivo excede el límite de ${maxSizeMB}MB`);
      return;
    }

    // Preview local para imágenes
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }

    setUploading(true);

    try {
      const response = await uploadFile(file, folder);
      setPreviewUrl(response.url);
      onUploadComplete(response.url);
    } catch (err: any) {
      setError(err?.message || "Error al subir el archivo");
      setPreviewUrl(currentUrl || null); // Restaurar preview anterior
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Variante Avatar (circular)
  if (variant === "avatar") {
    return (
      <div className="flex flex-col items-center gap-3">
        <div 
          className="relative w-24 h-24 rounded-full bg-neutral-100 border-2 border-dashed border-neutral-300 overflow-hidden cursor-pointer hover:border-neutral-400 transition"
          onClick={triggerFileSelect}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={triggerFileSelect}
          disabled={uploading}
          className="text-xs text-neutral-600 hover:text-neutral-900 underline underline-offset-2"
        >
          {uploading ? "Subiendo..." : label}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }

  // Variante Video (preview con ícono)
  if (variant === "video") {
    return (
      <div className="space-y-2">
        <div
          className="relative w-full h-32 rounded-2xl bg-neutral-100 border-2 border-dashed border-neutral-300 overflow-hidden cursor-pointer hover:border-neutral-400 transition flex items-center justify-center"
          onClick={triggerFileSelect}
        >
          {previewUrl ? (
            <div className="flex items-center gap-3 px-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-neutral-800">Video subido</p>
                <p className="text-[10px] text-neutral-500 truncate max-w-[200px]">{previewUrl}</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <svg className="w-10 h-10 text-neutral-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-neutral-500">{label}</p>
              <p className="text-[10px] text-neutral-400">Max {maxSizeMB}MB</p>
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }

  // Variante por defecto (file genérico)
  return (
    <div className="space-y-2">
      <div
        className="relative w-full py-6 rounded-2xl bg-neutral-50 border-2 border-dashed border-neutral-300 cursor-pointer hover:border-neutral-400 transition flex flex-col items-center justify-center"
        onClick={triggerFileSelect}
      >
        <svg className="w-8 h-8 text-neutral-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        {uploading ? (
          <p className="text-xs text-neutral-500">Subiendo...</p>
        ) : (
          <>
            <p className="text-xs text-neutral-700">{label}</p>
            <p className="text-[10px] text-neutral-400 mt-1">Max {maxSizeMB}MB</p>
          </>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl">
            <div className="w-6 h-6 border-2 border-neutral-800 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {previewUrl && (
        <p className="text-[10px] text-emerald-600 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Archivo subido correctamente
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

