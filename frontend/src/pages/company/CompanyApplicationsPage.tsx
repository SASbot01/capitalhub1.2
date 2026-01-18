// frontend/src/pages/company/CompanyApplicationsPage.tsx
import { useState, useMemo } from "react";
import Topbar from "../../layouts/Topbar";
import { useFetch } from "../../hooks/useFetch";
import { apiClient } from "../../api/client";

type StatusFilter = "ALL" | "APPLIED" | "INTERVIEW" | "HIRED" | "REJECTED";

interface Application {
  id: number;
  jobOfferId: number;
  jobTitle: string;
  jobRole: string;
  companyId: number;
  companyName: string;
  repId: number;
  repFullName: string;
  status: "APPLIED" | "INTERVIEW" | "HIRED" | "REJECTED" | "OFFER_SENT" | "WITHDRAWN";
  repMessage: string;
  companyNotes: string;
  interviewUrl: string;
  createdAt: string;
}

const statusLabels: Record<string, string> = {
  APPLIED: "Pendiente",
  INTERVIEW: "Entrevista",
  HIRED: "Contratado",
  REJECTED: "Descartado",
  OFFER_SENT: "Oferta enviada",
  WITHDRAWN: "Retirado",
};

const statusColors: Record<string, string> = {
  APPLIED: "bg-neutral-100 text-neutral-700 border-neutral-200",
  INTERVIEW: "bg-amber-50 text-amber-700 border-amber-100",
  HIRED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  REJECTED: "bg-red-50 text-red-600 border-red-100",
  OFFER_SENT: "bg-purple-50 text-purple-700 border-purple-100",
  WITHDRAWN: "bg-neutral-50 text-neutral-500 border-neutral-200",
};

export default function CompanyApplicationsPage() {
  const { data: applications, isLoading, error, refetch } = useFetch<Application[]>("/company/applications", true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Filtrar aplicaciones
  const filtered = useMemo(() => {
    if (!applications) return [];
    if (statusFilter === "ALL") return applications;
    return applications.filter((app) => app.status === statusFilter);
  }, [applications, statusFilter]);

  // Cambiar estado de aplicación
  const handleChangeStatus = async (appId: number, newStatus: string) => {
    setUpdatingId(appId);
    try {
      await apiClient.patch(`/company/applications/${appId}/status?status=${newStatus}`, {}, true);
      refetch();
    } catch (err: any) {
      alert(err?.message || "Error al cambiar el estado");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 mb-10">
        <Topbar title="Aplicaciones" subtitle="Cargando candidatos..." />
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 mb-10">
        <Topbar title="Aplicaciones" subtitle="Error de conexión" />
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
          Error al cargar las aplicaciones.
          <button onClick={refetch} className="underline ml-2">Reintentar</button>
        </div>
      </div>
    );
  }

  const allApplications = applications || [];

  return (
    <div className="space-y-6 mb-10">
      <Topbar
        title="Aplicaciones"
        subtitle="Gestiona a los candidatos que se postulan a tus ofertas"
      />

      {/* FILTROS */}
      <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mt-2">
        <div className="inline-flex rounded-full bg-white border border-neutral-200 p-1 shadow-sm overflow-x-auto">
          {[
            { id: "ALL", label: "Todas" },
            { id: "APPLIED", label: "Pendientes" },
            { id: "INTERVIEW", label: "Entrevistas" },
            { id: "HIRED", label: "Contratados" },
            { id: "REJECTED", label: "Descartados" },
          ].map((status) => (
            <button
              key={status.id}
              type="button"
              onClick={() => setStatusFilter(status.id as StatusFilter)}
              className={`px-4 py-1.5 text-xs rounded-full transition whitespace-nowrap ${
                statusFilter === status.id
                  ? "bg-black text-white"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        <p className="text-[11px] text-neutral-500">
          {filtered.length} de {allApplications.length} aplicaciones
        </p>
      </section>

      {/* LISTA DE APLICACIONES */}
      <section className="bg-white rounded-3xl border border-neutral-200 px-6 py-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Candidatos</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Revisa perfiles y gestiona el proceso de selección.
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <svg className="w-12 h-12 mx-auto text-neutral-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm text-neutral-600 mb-2">
              {statusFilter === "ALL" 
                ? "Aún no tienes aplicaciones" 
                : `No hay aplicaciones con estado "${statusLabels[statusFilter] || statusFilter}"`}
            </p>
            <p className="text-xs text-neutral-500">
              {statusFilter === "ALL" 
                ? "Publica ofertas para recibir candidatos."
                : "Intenta con otro filtro."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filtered.map((app) => (
              <article
                key={app.id}
                className="py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
              >
                {/* Info del candidato */}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-900">{app.repFullName}</p>
                  <p className="text-xs text-neutral-500">
                    {app.jobRole} · {app.jobTitle}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Aplicó el {formatDate(app.createdAt)}
                  </p>
                  {app.repMessage && (
                    <p className="text-xs text-neutral-500 mt-1 italic">"{app.repMessage}"</p>
                  )}
                </div>

                {/* Estado actual */}
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${statusColors[app.status] || statusColors.APPLIED}`}>
                    {statusLabels[app.status] || app.status}
                  </span>
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap gap-2">
                  {app.status === "APPLIED" && (
                    <>
                      <button
                        onClick={() => handleChangeStatus(app.id, "INTERVIEW")}
                        disabled={updatingId === app.id}
                        className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-medium hover:bg-amber-100 transition border border-amber-100 disabled:opacity-50"
                      >
                        📅 Marcar entrevista
                      </button>
                      <button
                        onClick={() => handleChangeStatus(app.id, "REJECTED")}
                        disabled={updatingId === app.id}
                        className="px-3 py-1.5 rounded-full bg-neutral-50 text-neutral-600 text-[11px] font-medium hover:bg-neutral-100 transition border border-neutral-200 disabled:opacity-50"
                      >
                        ✕ Descartar
                      </button>
                    </>
                  )}
                  
                  {app.status === "INTERVIEW" && (
                    <>
                      <button
                        onClick={() => handleChangeStatus(app.id, "HIRED")}
                        disabled={updatingId === app.id}
                        className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium hover:bg-emerald-100 transition border border-emerald-100 disabled:opacity-50"
                      >
                        ✓ Contratar
                      </button>
                      <button
                        onClick={() => handleChangeStatus(app.id, "REJECTED")}
                        disabled={updatingId === app.id}
                        className="px-3 py-1.5 rounded-full bg-neutral-50 text-neutral-600 text-[11px] font-medium hover:bg-neutral-100 transition border border-neutral-200 disabled:opacity-50"
                      >
                        ✕ Descartar
                      </button>
                    </>
                  )}

                  {app.status === "HIRED" && (
                    <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-100">
                      🎉 Contratado
                    </span>
                  )}

                  {app.status === "REJECTED" && (
                    <button
                      onClick={() => handleChangeStatus(app.id, "APPLIED")}
                      disabled={updatingId === app.id}
                      className="px-3 py-1.5 rounded-full bg-neutral-50 text-neutral-600 text-[11px] font-medium hover:bg-neutral-100 transition border border-neutral-200 disabled:opacity-50"
                    >
                      ↩ Reconsiderar
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
