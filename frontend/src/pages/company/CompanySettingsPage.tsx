// frontend/src/pages/company/CompanySettingsPage.tsx
import { useState, useEffect, useRef } from "react";
import Topbar from "../../layouts/Topbar";
import { useFetch } from "../../hooks/useFetch";
import { apiClient, uploadFile } from "../../api/client";

interface CompanyProfile {
  id: number;
  userId: number;
  name: string;
  email: string;
  industry: string;
  website: string;
  googleFormUrl?: string;
  description: string;
  logoUrl: string;
  size: string;
  location: string;
  foundedYear: number;
  createdAt: string;
}

export default function CompanySettingsPage() {
  const { data: profile, isLoading, error, refetch } = useFetch<CompanyProfile>("/company/me", true);

  // Estados del formulario
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [googleFormUrl, setGoogleFormUrl] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");
  const [location, setLocation] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  // Estados de UI
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos cuando llega el perfil
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setIndustry(profile.industry || "");
      setWebsite(profile.website || "");
      setGoogleFormUrl(profile.googleFormUrl || "");
      setDescription(profile.description || "");
      setSize(profile.size || "");
      setLocation(profile.location || "");
      setLogoUrl(profile.logoUrl || "");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMessage(null);

    try {
      await apiClient.put("/company/me", {
        name,
        industry,
        website,
        googleFormUrl,
        description,
        size,
        location,
        logoUrl,
      }, true);

      setSaveMessage({ type: "success", text: "✅ Cambios guardados correctamente" });
      refetch();
    } catch (err: any) {
      setSaveMessage({ type: "error", text: err?.message || "Error al guardar los cambios" });
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);
    try {
      const res = await uploadFile(file, "logos");
      setLogoUrl(res.url);
    } catch (error) {
      console.error("Error subiendo logo:", error);
      alert("Error al subir el logo");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 mb-10">
        <Topbar title="Configuración" subtitle="Cargando..." />
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-graphite border-t-accent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 mb-10">
        <Topbar title="Configuración" subtitle="Error" />
        <div className="bg-red-900/30 border border-red-700/30 text-red-400 px-4 py-3 rounded-2xl text-sm">
          Error al cargar la configuración.
          <button onClick={refetch} className="underline ml-2">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-10">
      <Topbar
        title="Configuración"
        subtitle="Gestiona el perfil de tu empresa"
      />

      {/* Mensaje de estado */}
      {saveMessage && (
        <div className={`px-4 py-3 rounded-2xl text-sm ${saveMessage.type === "success"
          ? "bg-emerald-900/30 border border-emerald-700/30 text-emerald-400"
          : "bg-red-900/30 border border-red-700/30 text-red-400"
          }`}>
          {saveMessage.text}
        </div>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* INFORMACIÓN DE LA EMPRESA */}
        <div className="bg-panel rounded-3xl shadow-card border border-graphite px-6 py-6">
          <h2 className="text-sm font-semibold mb-4 text-offwhite">
            Información de la empresa
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-muted mb-1">Nombre de la empresa</label>
              <input
                className="w-full rounded-2xl border border-graphite px-3 py-2 text-xs text-offwhite outline-none focus:ring-1 focus:ring-accent focus:border-accent bg-carbon"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre de tu empresa"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-muted mb-1">Industria</label>
                <select
                  className="w-full rounded-2xl border border-graphite px-3 py-2 text-xs text-offwhite outline-none focus:ring-1 focus:ring-accent focus:border-accent bg-carbon"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option value="">Selecciona una industria</option>
                  <option value="Technology">Tecnología</option>
                  <option value="SaaS">SaaS</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finanzas</option>
                  <option value="Education">Educación</option>
                  <option value="Health">Salud</option>
                  <option value="Real Estate">Inmobiliaria</option>
                  <option value="Other">Otra</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-muted mb-1">Tamaño</label>
                <select
                  className="w-full rounded-2xl border border-graphite px-3 py-2 text-xs text-offwhite outline-none focus:ring-1 focus:ring-accent focus:border-accent bg-carbon"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                >
                  <option value="">Selecciona el tamaño</option>
                  <option value="1-10">1-10 empleados</option>
                  <option value="11-50">11-50 empleados</option>
                  <option value="51-200">51-200 empleados</option>
                  <option value="201-500">201-500 empleados</option>
                  <option value="500+">500+ empleados</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-muted mb-1">Sitio web</label>
              <input
                type="url"
                className="w-full rounded-2xl border border-graphite px-3 py-2 text-xs text-offwhite outline-none focus:ring-1 focus:ring-accent focus:border-accent bg-carbon"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://tuempresa.com"
              />
            </div>

            <div>
              <label className="block text-[11px] text-muted mb-1">Google Forms URL (opcional)</label>
              <input
                type="url"
                className="w-full rounded-2xl border border-graphite px-3 py-2 text-xs text-offwhite outline-none focus:ring-1 focus:ring-accent focus:border-accent bg-carbon"
                value={googleFormUrl}
                onChange={(e) => setGoogleFormUrl(e.target.value)}
                placeholder="https://docs.google.com/forms/..."
              />
              <p className="text-[10px] text-muted mt-1">Si añades esto, se usará por defecto en tus nuevas ofertas.</p>
            </div>

            <div>
              <label className="block text-[11px] text-muted mb-1">Ubicación</label>
              <input
                className="w-full rounded-2xl border border-graphite px-3 py-2 text-xs text-offwhite outline-none focus:ring-1 focus:ring-accent focus:border-accent bg-carbon"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ciudad, País"
              />
            </div>

            <div>
              <label className="block text-[11px] text-muted mb-1">Descripción</label>
              <textarea
                className="w-full rounded-2xl border border-graphite px-3 py-2 text-xs text-offwhite outline-none focus:ring-1 focus:ring-accent focus:border-accent bg-carbon resize-none"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cuéntanos sobre tu empresa, productos, cultura..."
              />
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="mt-4 px-4 py-2 text-xs rounded-full bg-accent text-carbon hover:bg-accent/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

        {/* PANEL LATERAL */}
        <div className="space-y-6">
          {/* LOGO */}
          <div className="bg-panel rounded-3xl shadow-card border border-graphite px-6 py-6">
            <h2 className="text-sm font-semibold mb-3 text-offwhite">Logo de la empresa</h2>
            <p className="text-xs text-muted mb-4">
              Tu logo aparecerá en las ofertas de trabajo y en tu perfil público.
            </p>

            <div className="flex items-center gap-4">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={name}
                  className="w-16 h-16 rounded-2xl object-cover border border-graphite"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-graphite flex items-center justify-center text-muted">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div>
                <button
                  onClick={triggerFileUpload}
                  disabled={uploading}
                  className="px-3 py-1.5 text-xs rounded-full border border-graphite text-offwhite hover:bg-graphite transition disabled:opacity-50"
                >
                  {uploading ? "Subiendo..." : "Subir logo"}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <p className="text-[10px] text-muted mt-1">PNG, JPG. Máx 2MB</p>
              </div>
            </div>
          </div>

          {/* INFORMACIÓN DE CONTACTO */}
          <div className="bg-panel rounded-3xl shadow-card border border-graphite px-6 py-6">
            <h2 className="text-sm font-semibold mb-3 text-offwhite">Información de contacto</h2>
            <p className="text-xs text-muted mb-4">
              Esta información se usa para comunicarnos contigo.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-offwhite">
                <span>✉</span>
                <span>{profile?.email || "Sin email"}</span>
              </div>
              <p className="text-[10px] text-muted">
                Para cambiar el email de contacto, contacta con soporte.
              </p>
            </div>
          </div>

          {/* ZONA PELIGROSA */}
          <div className="bg-panel rounded-3xl shadow-card border border-graphite px-6 py-6">
            <h2 className="text-sm font-semibold mb-2 text-offwhite">Zona de peligro</h2>
            <p className="text-xs text-muted mb-3">
              Acciones irreversibles sobre tu cuenta de empresa.
            </p>
            <button className="px-4 py-2 text-xs rounded-full border border-red-700/30 text-red-400 hover:bg-red-900/30 transition">
              Eliminar cuenta de empresa
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
