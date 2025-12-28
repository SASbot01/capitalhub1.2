// frontend/src/pages/company/CompanyDashboardPage.tsx
import { Link } from "react-router-dom";
import Topbar from "../../layouts/Topbar";
import StatCard from "../../components/ui/StatCard";
import { useFetch } from "../../hooks/useFetch";
import { apiClient } from "../../api/client";
import { useEffect, useState } from "react";

interface DashboardStats {
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  hiredCount: number;
  companyName?: string;
}

interface RecentApplication {
  id: number;
  repFullName: string;
  jobTitle: string;
  jobRole: string;
  status: string;
  createdAt: string;
}

export default function CompanyDashboardPage() {
  const { data: stats, isLoading: loadingStats } = useFetch<DashboardStats>("/company/dashboard/stats", true);
  const [recentApps, setRecentApps] = useState<RecentApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  // Cargar aplicaciones recientes
  useEffect(() => {
    const fetchRecentApps = async () => {
      try {
        const data = await apiClient.get<RecentApplication[]>("/company/applications", true);
        // Tomar solo las 5 más recientes
        setRecentApps(data.slice(0, 5));
      } catch (err) {
        console.error("Error cargando aplicaciones:", err);
      } finally {
        setLoadingApps(false);
      }
    };
    fetchRecentApps();
  }, []);

  const statusPill = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      APPLIED: { label: "Pendiente", color: "bg-neutral-100 text-neutral-700 border-neutral-200" },
      INTERVIEW: { label: "Entrevista", color: "bg-amber-50 text-amber-700 border-amber-100" },
      HIRED: { label: "Contratado", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
      REJECTED: { label: "Descartado", color: "bg-red-50 text-red-600 border-red-100" },
    };
    
    const config = statusMap[status] || { label: status, color: "bg-neutral-100 text-neutral-700 border-neutral-200" };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  const isLoading = loadingStats || loadingApps;

  if (isLoading) {
    return (
      <>
        <Topbar title="Dashboard empresa" subtitle="Cargando datos..." />
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  const kpis = [
    {
      label: "Ofertas activas",
      value: stats?.activeJobs?.toString() || "0",
      hint: "Publicadas y abiertas",
    },
    {
      label: "Aplicaciones totales",
      value: stats?.totalApplications?.toString() || "0",
      hint: "Candidatos interesados",
    },
    {
      label: "Pendientes de revisar",
      value: stats?.pendingApplications?.toString() || "0",
      hint: "Requieren tu atención",
    },
    {
      label: "Contrataciones",
      value: stats?.hiredCount?.toString() || "0",
      hint: "Comerciales contratados",
    },
  ];

  return (
    <div className="space-y-6 mb-10">
      <Topbar
        title={`Dashboard ${stats?.companyName ? `- ${stats.companyName}` : "empresa"}`}
        subtitle="Resumen de tus ofertas y equipo de ventas"
      />

      {/* KPIs PRINCIPALES */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            hint={kpi.hint}
          />
        ))}
      </section>

      {/* ACCIONES RÁPIDAS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* APLICACIONES RECIENTES */}
        <div className="bg-white rounded-3xl border border-neutral-200 px-6 py-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">
                Aplicaciones recientes
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Últimos candidatos que se han postulado
              </p>
            </div>
            <Link 
              to="/company/applications"
              className="text-[11px] text-neutral-500 hover:text-neutral-900 underline"
            >
              Ver todas
            </Link>
          </div>

          {recentApps.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-neutral-500">
                Aún no tienes aplicaciones.
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Publica ofertas para recibir candidatos.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {recentApps.map((app) => (
                <div
                  key={app.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">
                      {app.repFullName}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {app.jobRole} · {app.jobTitle}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {formatDate(app.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusPill(app.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ACCIONES RÁPIDAS */}
        <div className="bg-white rounded-3xl border border-neutral-200 px-6 py-5 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-900 mb-1.5">
            Acciones rápidas
          </h2>
          <p className="text-xs text-neutral-500 mb-4">
            Gestiona tu cuenta y ofertas desde aquí.
          </p>

          <div className="space-y-3">
            <Link
              to="/company/jobs"
              className="block w-full px-4 py-3 rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">Crear nueva oferta</p>
                  <p className="text-xs text-neutral-500">Publica una vacante para comerciales</p>
                </div>
              </div>
            </Link>

            <Link
              to="/company/applications"
              className="block w-full px-4 py-3 rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">Gestionar candidatos</p>
                  <p className="text-xs text-neutral-500">Revisa y filtra aplicaciones</p>
                </div>
              </div>
            </Link>

            <Link
              to="/company/settings"
              className="block w-full px-4 py-3 rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">Configuración</p>
                  <p className="text-xs text-neutral-500">Actualiza los datos de tu empresa</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* INFO DEL MVP */}
      <section className="bg-neutral-50 rounded-2xl border border-neutral-200 px-6 py-4">
        <p className="text-xs text-neutral-500">
          💡 <strong>Tip:</strong> Completa el perfil de tu empresa en Configuración para atraer mejores candidatos.
          Los comerciales pueden ver tu descripción, industria y métricas antes de aplicar.
        </p>
      </section>
    </div>
  );
}
