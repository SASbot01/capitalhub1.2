// frontend/src/pages/rep/RepApplicationsPage.tsx
import { useMemo } from "react";
import Topbar from "../../layouts/Topbar";
import StatCard from "../../components/ui/StatCard";
import { useFetch } from "../../hooks/useFetch";

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
  APPLIED: "Aplicado",
  INTERVIEW: "Entrevista",
  HIRED: "Contratado",
  REJECTED: "Rechazado",
  OFFER_SENT: "Oferta recibida",
  WITHDRAWN: "Retirado",
};

// Dark theme status colors
const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  APPLIED: { bg: "bg-white/10", text: "text-white", border: "border-white/20" },
  INTERVIEW: { bg: "bg-amber-900/30", text: "text-amber-400", border: "border-amber-700/30" },
  HIRED: { bg: "bg-emerald-900/30", text: "text-emerald-400", border: "border-emerald-700/30" },
  REJECTED: { bg: "bg-red-900/30", text: "text-red-400", border: "border-red-700/30" },
  OFFER_SENT: { bg: "bg-white/10", text: "text-white", border: "border-white/20" },
  WITHDRAWN: { bg: "bg-graphite", text: "text-muted", border: "border-graphite" },
};

export default function RepApplicationsPage() {
  const { data: applications, isLoading, error, refetch } = useFetch<Application[]>("/rep/applications", true);

  // Calcular estadísticas
  const stats = useMemo(() => {
    if (!applications) return { total: 0, interviews: 0, offers: 0, rejected: 0 };

    return {
      total: applications.length,
      interviews: applications.filter(a => a.status === "INTERVIEW").length,
      offers: applications.filter(a => a.status === "OFFER_SENT" || a.status === "HIRED").length,
      rejected: applications.filter(a => a.status === "REJECTED").length,
    };
  }, [applications]);

  // Formatear fecha
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  };

  if (isLoading) {
    return (
      <>
        <Topbar title="Aplicaciones" subtitle="Cargando tus postulaciones..." />
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-graphite border-t-accent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Topbar title="Aplicaciones" subtitle="Error de conexión" />
        <div className="bg-red-900/30 border border-red-700/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          Error al cargar las aplicaciones.
          <button onClick={refetch} className="underline ml-2 hover:text-red-300">Reintentar</button>
        </div>
      </>
    );
  }

  const applicationsList = applications || [];

  return (
    <>
      <Topbar
        title="Aplicaciones"
        subtitle="Seguimiento de tus postulaciones activas"
      />

      {/* ESTADÍSTICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Aplicaciones totales"
          value={stats.total.toString()}
          hint="Todas tus postulaciones"
        />
        <StatCard
          label="Entrevistas"
          value={stats.interviews.toString()}
          hint="Programadas o en curso"
        />
        <StatCard
          label="Ofertas recibidas"
          value={stats.offers.toString()}
          hint="Pendientes o aceptadas"
        />
        <StatCard
          label="Rechazos"
          value={stats.rejected.toString()}
          hint={stats.rejected === 0 ? "Ninguno por ahora" : "Parte del proceso"}
        />
      </div>

      {/* LISTA DE APLICACIONES */}
      <div className="bg-panel rounded-xl shadow-card border border-graphite p-6">
        <h2 className="text-sm font-display font-bold text-offwhite mb-4">Historial de aplicaciones</h2>

        {applicationsList.length === 0 ? (
          <div className="py-12 text-center">
            <svg className="w-12 h-12 mx-auto text-graphite mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm text-muted mb-2">Aún no has aplicado a ninguna oferta</p>
            <p className="text-xs text-muted">
              Ve a la sección de <a href="/rep/offers" className="text-accent underline">Ofertas</a> para encontrar oportunidades.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-graphite">
            {applicationsList.map((app) => {
              const colors = statusColors[app.status] || statusColors.APPLIED;
              return (
                <div
                  key={app.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-offwhite">{app.companyName}</p>
                    <p className="text-xs text-muted">
                      {app.jobRole} · {app.jobTitle}
                    </p>
                    <p className="text-[11px] text-muted mt-0.5">
                      Aplicado el {formatDate(app.createdAt)}
                    </p>
                    {app.repMessage && (
                      <p className="text-xs text-muted mt-1 italic">"{app.repMessage}"</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center rounded-lg px-3 py-1 text-[11px] font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                      {statusLabels[app.status] || app.status}
                    </span>

                    {app.status === "INTERVIEW" && app.interviewUrl && (
                      <a
                        href={app.interviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-lg bg-amber-900/30 text-amber-400 text-[11px] font-medium hover:bg-amber-900/50 transition"
                      >
                        Ver entrevista
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
