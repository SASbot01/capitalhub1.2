// frontend/src/pages/rep/RepSettingsPage.tsx
import { useState, useEffect } from "react";
import Topbar from "../../layouts/Topbar";
import { useFetch } from "../../hooks/useFetch";
import { apiClient } from "../../api/client";

interface RepProfile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  roleType: string;
  bio: string;
  phone: string;
  country: string;
  linkedinUrl: string;
  avatarUrl: string;
  introVideoUrl: string;
  active: boolean;
}

export default function RepSettingsPage() {
  const { data: profile, isLoading, error, refetch } = useFetch<RepProfile>("/rep/me", true);
  
  // Estados del formulario
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [roleType, setRoleType] = useState("CLOSER");
  
  // Estados de contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Estados de UI
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Cargar datos cuando llega el perfil
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setCountry(profile.country || "");
      setLinkedinUrl(profile.linkedinUrl || "");
      setRoleType(profile.roleType || "CLOSER");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMessage(null);
    
    try {
      await apiClient.put("/rep/me", {
        firstName,
        lastName,
        phone,
        country,
        linkedinUrl,
        roleType,
      }, true);
      
      setSaveMessage({ type: "success", text: "✅ Cambios guardados correctamente" });
      refetch();
    } catch (err: any) {
      setSaveMessage({ type: "error", text: err?.message || "Error al guardar los cambios" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    
    if (newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // TODO: Implementar cambio de contraseña en el backend
    alert("Funcionalidad de cambio de contraseña próximamente");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (isLoading) {
    return (
      <div className="space-y-6 mb-10">
        <Topbar title="Configuración" subtitle="Cargando..." />
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 mb-10">
        <Topbar title="Configuración" subtitle="Error" />
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
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
        subtitle="Gestiona tu cuenta, seguridad y preferencias"
      />

      {/* Mensaje de estado */}
      {saveMessage && (
        <div className={`px-4 py-3 rounded-2xl text-sm ${
          saveMessage.type === "success" 
            ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {saveMessage.text}
        </div>
      )}

      {/* GRID PRINCIPAL */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* INFORMACIÓN PERSONAL */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 px-6 py-6">
          <h2 className="text-sm font-semibold mb-4 text-neutral-900">
            Información personal
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">Nombre</label>
              <input
                className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 bg-neutral-50"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">Apellidos</label>
              <input
                className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 bg-neutral-50"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">Email</label>
              <input
                type="email"
                className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-xs outline-none bg-neutral-100 cursor-not-allowed"
                value={email}
                disabled
              />
              <p className="text-[10px] text-neutral-400 mt-1">El email no se puede cambiar</p>
            </div>
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">Teléfono</label>
              <input
                className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 bg-neutral-50"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+34 600 123 456"
              />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">País</label>
              <input
                className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 bg-neutral-50"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="España"
              />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">Rol principal</label>
              <select 
                className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 bg-neutral-50"
                value={roleType}
                onChange={(e) => setRoleType(e.target.value)}
              >
                <option value="SETTER">Setter</option>
                <option value="CLOSER">Closer</option>
                <option value="BOTH">Setter + Closer</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] text-neutral-500 mb-1">LinkedIn</label>
              <input
                type="url"
                className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 bg-neutral-50"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/tu-perfil"
              />
            </div>
          </div>

          <button 
            onClick={handleSaveProfile}
            disabled={saving}
            className="mt-4 px-4 py-2 text-xs rounded-full bg-black text-white hover:bg-neutral-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

        {/* SEGURIDAD + NOTIFICACIONES */}
        <div className="space-y-6">
          {/* SEGURIDAD */}
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 px-6 py-6">
            <h2 className="text-sm font-semibold mb-4 text-neutral-900">Seguridad</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1">Contraseña actual</label>
                <input
                  type="password"
                  className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 bg-neutral-50"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1">Nueva contraseña</label>
                <input
                  type="password"
                  className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 bg-neutral-50"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1">Confirmar</label>
                <input
                  type="password"
                  className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 bg-neutral-50"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={handleChangePassword}
              className="mt-4 px-4 py-2 text-xs rounded-full border border-neutral-200 text-neutral-800 hover:bg-neutral-50 transition"
            >
              Actualizar contraseña
            </button>
          </div>

          {/* NOTIFICACIONES */}
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 px-6 py-6">
            <h2 className="text-sm font-semibold mb-3 text-neutral-900">Notificaciones</h2>
            <p className="text-[11px] text-neutral-500 mb-3">
              Configura qué tipo de emails quieres recibir.
            </p>

            <div className="space-y-3">
              <label className="flex items-center justify-between text-xs">
                <span className="text-neutral-700">Invitaciones de nuevas empresas</span>
                <input type="checkbox" defaultChecked className="accent-black" />
              </label>
              <label className="flex items-center justify-between text-xs">
                <span className="text-neutral-700">Recordatorios de entrevistas</span>
                <input type="checkbox" defaultChecked className="accent-black" />
              </label>
              <label className="flex items-center justify-between text-xs">
                <span className="text-neutral-700">Resumen semanal de actividad</span>
                <input type="checkbox" className="accent-black" />
              </label>
              <label className="flex items-center justify-between text-xs">
                <span className="text-neutral-700">Novedades de formación y cursos</span>
                <input type="checkbox" className="accent-black" />
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* ZONA DE CUENTA */}
      <section className="bg-white rounded-3xl shadow-sm border border-neutral-200 px-6 py-5">
        <h2 className="text-sm font-semibold mb-2 text-neutral-900">Cuenta</h2>
        <p className="text-[11px] text-neutral-500 mb-3">
          Gestión de tu cuenta de CapitalHub.
        </p>
        <button className="px-4 py-2 text-xs rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition">
          Solicitar cierre de cuenta
        </button>
      </section>
    </div>
  );
}
