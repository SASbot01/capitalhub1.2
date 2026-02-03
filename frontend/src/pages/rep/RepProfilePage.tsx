// frontend/src/pages/rep/RepProfilePage.tsx
import { useState, useEffect, useRef } from "react";
import Topbar from "../../layouts/Topbar";
import { useFetch } from "../../hooks/useFetch";
import { apiClient, uploadFile } from "../../api/client";

interface RepProfile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  roleType: "SETTER" | "CLOSER" | "BOTH";
  bio: string;
  phone: string;
  country: string;
  linkedinUrl: string;
  avatarUrl: string;
  introVideoUrl: string;
  active: boolean;
  createdAt: string;
}

interface DashboardStats {
  monthlyStats: {
    callsMade: number;
    closures: number;
    avgTicket: number;
    estimatedCommission: number;
  };
  latestProcesses: Array<{
    id: number;
    companyName: string;
    jobTitle: string;
    status: string;
  }>;
}

export default function RepProfilePage() {
  const { data: profile, isLoading, error, refetch } = useFetch<RepProfile>("/rep/me", true);
  const { data: stats } = useFetch<DashboardStats>("/rep/dashboard/stats", true);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [roleType, setRoleType] = useState("CLOSER");
  const [avatarUrl, setAvatarUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
      setPhone(profile.phone || "");
      setCountry(profile.country || "");
      setLinkedinUrl(profile.linkedinUrl || "");
      setRoleType(profile.roleType || "CLOSER");
      setAvatarUrl(profile.avatarUrl || "");
    }
  }, [profile]);

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (profile) {
      setBio(profile.bio || "");
      setPhone(profile.phone || "");
      setCountry(profile.country || "");
      setLinkedinUrl(profile.linkedinUrl || "");
      setRoleType(profile.roleType || "CLOSER");
      setAvatarUrl(profile.avatarUrl || "");
    }
    setIsEditing(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await apiClient.put("/rep/me", {
        bio,
        phone,
        country,
        linkedinUrl,
        roleType,
        avatarUrl,
      }, true);

      setIsEditing(false);
      refetch();
    } catch (err) {
      console.error("Error guardando perfil:", err);
      alert("Error al guardar los cambios");
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
      const res = await uploadFile(file, "avatars");
      setAvatarUrl(res.url);
    } catch (error) {
      console.error("Error subiendo avatar:", error);
      alert("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const roleLabel = (role: string) => {
    const labels: Record<string, string> = {
      SETTER: "Setter",
      CLOSER: "Closer",
      BOTH: "Setter + Closer",
    };
    return labels[role] || role;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Reciente";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", { month: "short", year: "numeric" });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Topbar title="Perfil" subtitle="Cargando tu perfil..." />
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-graphite border-t-accent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-6">
        <Topbar title="Perfil" subtitle="Error de conexión" />
        <div className="bg-red-900/30 border border-red-700/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          Error al cargar el perfil.
          <button onClick={refetch} className="underline ml-2 hover:text-red-300">Reintentar</button>
        </div>
      </div>
    );
  }

  const fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "Usuario";
  const initials = fullName.split(" ").map((n) => n[0] || "").join("").slice(0, 2).toUpperCase() || "U";

  const activeProcesses = stats?.latestProcesses?.length || 0;
  const callsMade = stats?.monthlyStats?.callsMade || 0;
  const closures = stats?.monthlyStats?.closures || 0;
  const avgTicket = stats?.monthlyStats?.avgTicket || 0;

  return (
    <div className="space-y-6">
      <Topbar
        title="Mi Perfil"
        subtitle="Tu información profesional visible para empresas"
      />

      {/* CABECERA PERFIL */}
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6">
        {/* Info principal */}
        <div className="bg-panel rounded-xl shadow-card border border-graphite px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative group">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent to-purple-800 text-offwhite flex items-center justify-center text-lg font-semibold">
                    {initials}
                  </div>
                )}

                {isEditing && (
                  <div
                    onClick={triggerFileUpload}
                    className="absolute inset-0 bg-carbon/70 rounded-xl flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-offwhite/50 border-t-offwhite rounded-full animate-spin" />
                    ) : (
                      <span className="text-offwhite text-[10px] font-medium">Cambiar</span>
                    )}
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div>
                <h2 className="text-xl font-display font-bold text-offwhite tracking-tight">{fullName}</h2>
                {isEditing ? (
                  <select
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value)}
                    className="mt-1 rounded-lg border border-graphite px-2 py-1 text-xs bg-carbon text-offwhite"
                  >
                    <option value="SETTER">Setter</option>
                    <option value="CLOSER">Closer</option>
                    <option value="BOTH">Setter + Closer</option>
                  </select>
                ) : (
                  <p className="text-sm text-muted mt-0.5">
                    {roleLabel(profile.roleType)} {profile.country ? `· ${profile.country}` : ""}
                  </p>
                )}
                <p className="text-xs text-muted mt-0.5">
                  Miembro desde {formatDate(profile.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-medium border ${profile.active
                ? "bg-emerald-900/30 text-emerald-400 border-emerald-700/30"
                : "bg-graphite text-muted border-graphite"
                }`}>
                {profile.active ? "Activo" : "Inactivo"}
              </span>

              {!isEditing ? (
                <button
                  onClick={startEditing}
                  className="mt-1 inline-flex items-center justify-center px-4 py-1.5 rounded-lg bg-accent text-offwhite text-xs font-medium hover:bg-accent/80 transition-colors"
                >
                  Editar perfil
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={cancelEditing}
                    className="px-4 py-1.5 rounded-lg border border-graphite text-xs font-medium text-muted hover:bg-graphite hover:text-offwhite transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="px-4 py-1.5 rounded-lg bg-accent text-offwhite text-xs font-medium hover:bg-accent/80 transition disabled:opacity-50"
                  >
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* BIO */}
          <div className="mt-5 border-t border-graphite pt-4">
            <h3 className="text-sm font-medium text-offwhite mb-1.5">Sobre mí</h3>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-lg border border-graphite px-3 py-2 text-sm bg-carbon text-offwhite outline-none focus:ring-1 focus:ring-accent resize-none"
                rows={4}
                placeholder="Cuéntanos sobre tu experiencia, logros y qué tipo de proyectos te interesan..."
              />
            ) : (
              <p className="text-sm text-offwhite/80 leading-relaxed">
                {profile.bio || (
                  <span className="text-muted italic">
                    Aún no has añadido una descripción. Haz clic en "Editar perfil" para contar a las empresas quién eres.
                  </span>
                )}
              </p>
            )}
          </div>

          {/* CAMPOS DE CONTACTO */}
          {isEditing ? (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-muted mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-graphite px-3 py-2 text-xs bg-carbon text-offwhite outline-none focus:ring-1 focus:ring-accent"
                  placeholder="+34 600 000 000"
                />
              </div>
              <div>
                <label className="block text-[11px] text-muted mb-1">País / Ciudad</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-lg border border-graphite px-3 py-2 text-xs bg-carbon text-offwhite outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Madrid, España"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] text-muted mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full rounded-lg border border-graphite px-3 py-2 text-xs bg-carbon text-offwhite outline-none focus:ring-1 focus:ring-accent"
                  placeholder="https://linkedin.com/in/tu-perfil"
                />
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.phone && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-carbon border border-graphite text-xs text-offwhite/80">
                  {profile.phone}
                </span>
              )}
              {profile.country && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-carbon border border-graphite text-xs text-offwhite/80">
                  {profile.country}
                </span>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/20 border border-accent/30 text-xs text-accent hover:bg-accent/30 transition"
                >
                  LinkedIn
                </a>
              )}
              {profile.email && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-carbon border border-graphite text-xs text-offwhite/80">
                  {profile.email}
                </span>
              )}
              {!profile.phone && !profile.country && !profile.linkedinUrl && (
                <p className="text-xs text-muted italic">
                  Sin información de contacto. Edita tu perfil para añadirla.
                </p>
              )}
            </div>
          )}
        </div>

        {/* ESTADÍSTICAS REALES */}
        <div className="bg-panel rounded-xl shadow-card border border-graphite px-6 py-5">
          <h3 className="text-sm font-medium text-offwhite mb-4">Tu actividad</h3>
          <dl className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-carbon border border-graphite">
              <dt className="text-xs text-muted">Procesos activos</dt>
              <dd className="text-lg font-display font-bold text-offwhite">{activeProcesses}</dd>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-carbon border border-graphite">
              <dt className="text-xs text-muted">Llamadas este mes</dt>
              <dd className="text-lg font-display font-bold text-offwhite">{callsMade}</dd>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-carbon border border-graphite">
              <dt className="text-xs text-muted">Cierres</dt>
              <dd className="text-lg font-display font-bold text-offwhite">{closures}</dd>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-carbon border border-graphite">
              <dt className="text-xs text-muted">Ticket medio</dt>
              <dd className="text-lg font-display font-bold text-offwhite">
                {avgTicket > 0 ? `${avgTicket.toLocaleString()} €` : "-"}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* VIDEO DE PRESENTACIÓN */}
      <section className="bg-panel rounded-xl shadow-card border border-graphite px-6 py-5 mb-10">
        <h3 className="text-sm font-medium text-offwhite mb-2">Video de presentación</h3>
        <p className="text-xs text-muted mb-4">
          Un video corto aumenta tus posibilidades de ser contactado. Muestra tu personalidad y experiencia.
        </p>

        {profile.introVideoUrl ? (
          <div className="rounded-lg overflow-hidden bg-carbon border border-graphite">
            <video
              src={profile.introVideoUrl}
              controls
              className="w-full max-h-[400px]"
            />
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-graphite bg-carbon px-6 py-12 text-center">
            <svg className="w-12 h-12 mx-auto text-graphite mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium text-offwhite mb-1">Sin video de presentación</p>
            <p className="text-xs text-muted mb-4">
              Graba un video de 1-2 minutos presentándote y destacando tu experiencia.
            </p>
            <p className="text-[11px] text-muted">
              Podrás subir tu video próximamente desde Ajustes.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
