// frontend/src/pages/company/CompanyJobsPage.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import Topbar from "../../layouts/Topbar";
import { useFetch } from "../../hooks/useFetch";
import { apiClient } from "../../api/client";

interface JobOffer {
  id: number;
  title: string;
  description: string;
  role: "SETTER" | "CLOSER" | "COLD_CALLER" | "BOTH";
  companyName: string;
  companyId: number;
  salaryHint: string;
  model: string;
  type: string;
  callTool: string;
  callLink: string;
  active: boolean;
  status: "ACTIVE" | "CLOSED";
  applicantsCount: number;
  createdAt: string;
}

interface CreateJobRequest {
  title: string;
  description: string;
  role: string;
  salaryHint: string;
  model: string;
  type: string;
  callTool: string;
  callLink: string;
}

const roleLabels: Record<string, string> = {
  CLOSER: "Closer",
  SETTER: "Setter",
  COLD_CALLER: "Cold Caller / SDR",
  BOTH: "Setter + Closer",
};

export default function CompanyJobsPage() {
  const { data: jobs, isLoading, error, refetch } = useFetch<JobOffer[]>("/company/jobs", true);

  // Estados del formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("CLOSER");
  const [model, setModel] = useState("Solo variable");
  const [salaryHint, setSalaryHint] = useState("");
  const [callTool, setCallTool] = useState("GOOGLE_FORM");
  const [callLink, setCallLink] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleCreateJob = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setCreating(true);
    setCreateError(null);

    try {
      const payload: CreateJobRequest = {
        title: title.trim(),
        description: description.trim() || "Sin descripción",
        role,
        salaryHint: salaryHint.trim() || "A definir en la llamada",
        model: model.trim(),
        type: "Remoto",
        callTool,
        callLink: callLink.trim() || "https://calendly.com",
      };

      await apiClient.post("/company/jobs", payload, true);

      // Limpiar formulario
      setTitle("");
      setDescription("");
      setRole("CLOSER");
      setModel("Solo variable");
      setSalaryHint("");
      setCallTool("GOOGLE_FORM");
      setCallLink("");

      // Recargar lista
      refetch();
    } catch (err: any) {
      setCreateError(err?.message || "Error al crear la oferta");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (jobId: number, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "CLOSED" : "ACTIVE";

    try {
      await apiClient.patch(`/company/jobs/${jobId}/status?status=${newStatus}`, {}, true);
      refetch();
    } catch (err: any) {
      alert(err?.message || "Error al cambiar el estado");
    }
  };

  const StatusPill = ({ status }: { status: string }) => {
    if (status === "ACTIVE") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-900/30 text-[11px] font-medium text-emerald-400 border border-emerald-700/30">
          Activa
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-graphite text-[11px] font-medium text-muted border border-graphite">
        Cerrada
      </span>
    );
  };

  if (isLoading) {
    return (
      <>
        <Topbar title="Ofertas" subtitle="Cargando tus ofertas..." />
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-graphite border-t-accent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Topbar title="Ofertas" subtitle="Error de conexión" />
        <div className="bg-red-900/30 border border-red-700/30 text-red-400 px-4 py-3 rounded-2xl text-sm">
          Error al cargar las ofertas.
          <button onClick={refetch} className="underline ml-2">Reintentar</button>
        </div>
      </>
    );
  }

  const jobsList = jobs || [];

  return (
    <div className="space-y-6 mb-10">
      <Topbar
        title="Ofertas"
        subtitle="Publica y gestiona tus ofertas para setters, closers y cold callers"
      />

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6">
        {/* LISTA DE OFERTAS */}
        <div className="bg-panel rounded-3xl border border-graphite px-6 py-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-offwhite">
                Ofertas publicadas
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Gestiona el estado de tus ofertas y ve las aplicaciones recibidas.
              </p>
            </div>
            <span className="text-[11px] text-muted">
              Total: {jobsList.length}
            </span>
          </div>

          {jobsList.length === 0 ? (
            <div className="py-12 text-center">
              <svg className="w-12 h-12 mx-auto text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-offwhite mb-2">Aún no has publicado ninguna oferta</p>
              <p className="text-xs text-muted">
                Crea tu primera oferta desde el panel de la derecha.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-graphite">
              {jobsList.map((job) => (
                <article
                  key={job.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-offwhite">
                      {job.title}
                    </p>
                    <p className="text-xs text-muted">
                      {roleLabels[job.role] || job.role} · {job.type || "Remoto"}
                    </p>
                    <p className="text-[11px] text-muted mt-0.5">
                      {job.model} · {job.salaryHint}
                    </p>
                    <p className="text-[11px] text-muted mt-0.5">
                      {job.applicantsCount} aplicaciones
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <StatusPill status={job.status} />
                    <button
                      className="px-3 py-1 rounded-full border border-graphite text-[11px] text-offwhite hover:bg-graphite transition"
                      onClick={() => handleToggleStatus(job.id, job.status)}
                    >
                      {job.status === "ACTIVE" ? "Pausar" : "Reactivar"}
                    </button>
                    <a
                      href={`/company/jobs/${job.id}/applications`}
                      className="px-3 py-1 rounded-full border border-graphite text-[11px] text-offwhite hover:bg-graphite transition"
                    >
                      Ver aplicaciones
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* FORMULARIO CREAR OFERTA */}
        <div className="bg-panel rounded-3xl border border-graphite px-6 py-5 shadow-card">
          <h2 className="text-sm font-semibold text-offwhite mb-2">
            Crear nueva oferta
          </h2>
          <p className="text-xs text-muted mb-4">
            Define el rol, condiciones y enlace para agendar entrevistas.
          </p>

          <form className="space-y-3" onSubmit={handleCreateJob}>
            <div>
              <label className="block text-[11px] text-muted mb-1">
                Título de la oferta
              </label>
              <input
                className="w-full rounded-2xl border border-graphite px-3 py-2 text-xs text-offwhite bg-carbon outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                placeholder="Ej: Closer para lanzamientos evergreen high-ticket"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-muted mb-1">
                Descripción
              </label>
              <textarea
                className="w-full rounded-2xl border border-graphite px-3 py-2 text-xs text-offwhite bg-carbon outline-none focus:ring-1 focus:ring-accent focus:border-accent resize-none"
                rows={3}
                placeholder="Describe la oferta, responsabilidades y requisitos..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-muted mb-1">
                  Rol buscado
                </label>
                <select
                  className="w-full rounded-2xl border border-graphite px-3 py-2 text-xs text-offwhite bg-carbon outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="CLOSER">Closer</option>
                  <option value="SETTER">Setter</option>
                  <option value="COLD_CALLER">Cold Caller / SDR</option>
                  <option value="BOTH">Setter + Closer</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-muted mb-1">
                  Modelo de pago
                </label>
                <select
                  className="w-full rounded-2xl border border-graphite px-3 py-2 text-xs text-offwhite bg-carbon outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option>Solo variable</option>
                  <option>Fijo + variable</option>
                  <option>Fee por cierre</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-muted mb-1">
                Detalle económico
              </label>
              <input
                className="w-full rounded-2xl border border-graphite px-3 py-2 text-xs text-offwhite bg-carbon outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                placeholder="Ej: 15% comisión · ticket 2.000 €"
                value={salaryHint}
                onChange={(e) => setSalaryHint(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] text-muted mb-1">
                Enlace al formulario de cualificación
              </label>
              {/* Ocultamos selector, forzamos Google Form internamente */}
              <div className="hidden">
                {/* Mantengo lógica interna pero oculto UI */}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <input
                  type="url"
                  className="w-full rounded-2xl border border-graphite pl-9 pr-3 py-2 text-xs text-offwhite bg-carbon outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                  placeholder="Pegar URL de Google Forms (https://docs.google.com/forms/...)"
                  value={callLink}
                  onChange={(e) => {
                    setCallLink(e.target.value);
                    setCallTool("GOOGLE_FORM"); // Forzar actualización de estado
                  }}
                  required
                />
              </div>
              <p className="text-[10px] text-muted mt-1">
                Debes usar Google Forms para cualificar a los candidatos.
              </p>
            </div>

            {createError && (
              <p className="text-xs text-red-400 bg-red-900/30 border border-red-700/30 rounded-2xl px-3 py-2">
                {createError}
              </p>
            )}

            <button
              type="submit"
              disabled={creating}
              className="mt-3 w-full rounded-full bg-accent text-carbon text-xs py-2.5 hover:bg-accent/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? "Publicando..." : "Publicar oferta"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
