import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Topbar from "../../layouts/Topbar";
import {
  fetchJobApplications,
  updateApplicationStatus,
  ApplicationResponse,
  ApplicationStatus
} from "../../api/applications";

// Mapeo de estados del backend a español
const statusLabels: Record<ApplicationStatus, string> = {
  APPLIED: "Pendiente",
  INTERVIEW: "Entrevista",
  OFFER_SENT: "Oferta Enviada",
  HIRED: "Contratado",
  REJECTED: "Descartado",
  WITHDRAWN: "Retirado"
};

const statusPill = (status: ApplicationStatus) => {
  const label = statusLabels[status];

  if (status === "HIRED") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 text-[11px] font-medium text-emerald-700 border border-emerald-100">
        {label}
      </span>
    );
  }
  if (status === "INTERVIEW" || status === "OFFER_SENT") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 text-[11px] font-medium text-amber-700 border border-amber-100">
        {label}
      </span>
    );
  }
  if (status === "APPLIED") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-[11px] font-medium text-blue-700 border border-blue-100">
        {label}
      </span>
    );
  }
  if (status === "REJECTED") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-red-50 text-[11px] font-medium text-red-700 border border-red-100">
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-neutral-50 text-[11px] font-medium text-neutral-500 border border-neutral-200">
      {label}
    </span>
  );
};

export default function CompanyJobApplicationsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "Todas">("Todas");

  // Modal de cambio de estado
  const [editingApp, setEditingApp] = useState<ApplicationResponse | null>(null);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("APPLIED");
  const [companyNotes, setCompanyNotes] = useState("");
  const [interviewUrl, setInterviewUrl] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadApplications();
  }, [jobId]);

  const loadApplications = async () => {
    if (!jobId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchJobApplications(Number(jobId));
      setApplications(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar las aplicaciones");
      console.error("Error loading applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!editingApp) return;

    try {
      setUpdating(true);
      await updateApplicationStatus(
        editingApp.id,
        newStatus,
        companyNotes || undefined,
        interviewUrl || undefined
      );

      // Recargar aplicaciones
      await loadApplications();

      // Cerrar modal
      closeModal();

      // Mostrar notificación de éxito (opcional)
      alert("Estado actualizado correctamente");
    } catch (err: any) {
      alert("Error al actualizar el estado: " + (err.message || "Error desconocido"));
      console.error("Error updating status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const openModal = (app: ApplicationResponse) => {
    setEditingApp(app);
    setNewStatus(app.status);
    setCompanyNotes(app.companyNotes || "");
    setInterviewUrl(app.interviewUrl || "");
  };

  const closeModal = () => {
    setEditingApp(null);
    setNewStatus("APPLIED");
    setCompanyNotes("");
    setInterviewUrl("");
  };

  const filtered = applications.filter((app) =>
    statusFilter === "Todas" ? true : app.status === statusFilter
  );

  if (loading) {
    return (
      <div className="space-y-6 mb-10">
        <Topbar
          title="Aplicaciones"
          subtitle="Gestiona a los candidatos que se postulan a tus ofertas"
        />
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-neutral-500">Cargando aplicaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 mb-10">
        <Topbar
          title="Aplicaciones"
          subtitle="Gestiona a los candidatos que se postulan a tus ofertas"
        />
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="text-sm text-red-700">Error: {error}</p>
          <button
            onClick={loadApplications}
            className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-10">
      <Topbar
        title="Aplicaciones"
        subtitle="Gestiona a los candidatos que se postulan a tus ofertas"
      />

      {/* FILTROS */}
      <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mt-2">
        <div className="inline-flex rounded-full bg-white border border-neutral-200 p-1 shadow-sm overflow-x-auto">
          {["Todas", "APPLIED", "INTERVIEW", "OFFER_SENT", "HIRED", "REJECTED"].map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() =>
                  setStatusFilter(status as ApplicationStatus | "Todas")
                }
                className={`px-4 py-1.5 text-xs rounded-full transition whitespace-nowrap ${statusFilter === status
                  ? "bg-black text-white"
                  : "text-neutral-700 hover:bg-neutral-100"
                  }`}
              >
                {status === "Todas" ? "Todas" : statusLabels[status as ApplicationStatus]}
              </button>
            )
          )}
        </div>

        <p className="text-[11px] text-neutral-500">
          Mostrando {filtered.length} de {applications.length} aplicaciones
        </p>
      </section>

      {/* LISTA DE APLICACIONES */}
      <section className="bg-white rounded-3xl border border-neutral-200 px-6 py-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">
              Candidatos
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Gestiona el estado de cada aplicación y agenda entrevistas.
            </p>
          </div>
        </div>

        <div className="divide-y divide-neutral-100">
          {filtered.map((app) => (
            <article
              key={app.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-900">
                  {app.repFullName}
                </p>
                <p className="text-xs text-neutral-500">
                  {app.jobRole || "Rep"} · {app.jobTitle}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Aplicó el {new Date(app.appliedAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })} · ID: {app.repId}
                </p>
                {app.repMessage && (
                  <p className="text-[11px] text-neutral-600 mt-1 bg-blue-50 px-2 py-1 rounded">
                    💬 Mensaje del Rep: {app.repMessage}
                  </p>
                )}
                {app.companyNotes && (
                  <p className="text-[11px] text-neutral-600 mt-1 italic bg-amber-50 px-2 py-1 rounded">
                    📝 Notas internas: {app.companyNotes}
                  </p>
                )}
                {app.interviewUrl && (
                  <a
                    href={app.interviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-600 hover:underline mt-1 block"
                  >
                    🔗 Ver entrevista
                  </a>
                )}
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-end flex-wrap">
                {statusPill(app.status)}
                <button
                  onClick={() => openModal(app)}
                  className="px-3 py-1.5 rounded-full border border-neutral-300 text-[11px] text-neutral-700 hover:bg-neutral-50 transition font-medium"
                >
                  Cambiar estado
                </button>
                <button
                  onClick={() => navigate(`/company/reps/${app.repId}`)}
                  className="px-3 py-1.5 rounded-full bg-black text-white text-[11px] hover:bg-neutral-800 transition font-medium"
                >
                  Ver perfil
                </button>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-neutral-500">
              No hay aplicaciones con este estado todavía.
            </div>
          )}
        </div>
      </section>

      {/* MODAL DE CAMBIO DE ESTADO */}
      {editingApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              Actualizar Estado
            </h3>
            <p className="text-sm text-neutral-500 mb-4">
              {editingApp.repFullName} - {editingApp.jobTitle}
            </p>

            <div className="space-y-4">
              {/* Estado */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Nuevo Estado
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="APPLIED">Pendiente</option>
                  <option value="INTERVIEW">Entrevista</option>
                  <option value="OFFER_SENT">Oferta Enviada</option>
                  <option value="HIRED">Contratado</option>
                  <option value="REJECTED">Descartado</option>
                </select>
              </div>

              {/* URL de Entrevista (solo si es INTERVIEW) */}
              {newStatus === "INTERVIEW" && (
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                    URL de Entrevista
                  </label>
                  <input
                    type="url"
                    value={interviewUrl}
                    onChange={(e) => setInterviewUrl(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              )}

              {/* Notas de la Empresa */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Notas (opcional)
                </label>
                <textarea
                  value={companyNotes}
                  onChange={(e) => setCompanyNotes(e.target.value)}
                  placeholder="Añade notas internas sobre este candidato..."
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                disabled={updating}
                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={updating}
                className="flex-1 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition disabled:opacity-50"
              >
                {updating ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
