// frontend/src/pages/shared/HomePage.tsx
import { useNavigate } from "react-router-dom";
import Topbar from "../../layouts/Topbar";

type HomePageProps = {
  userType: "rep" | "company";
};

export default function HomePage({ userType }: HomePageProps) {
  const navigate = useNavigate();
  const isRep = userType === "rep";

  const title = isRep ? "Inicio" : "Inicio";
  const subtitle = isRep
    ? "Tu panel para encontrar mejores oportunidades y crecer como closer / setter."
    : "Tu panel para encontrar talento comercial y hacer que tu facturación crezca.";

  const primaryCta = isRep ? "Buscar ofertas activas" : "Publicar nueva oferta";
  const secondaryCta = isRep ? "Ver mi perfil" : "Ver aplicaciones";

  // Rutas de navegación
  const handlePrimaryCta = () => {
    if (isRep) {
      navigate("/rep/offers");
    } else {
      navigate("/company/jobs");
    }
  };

  const handleSecondaryCta = () => {
    if (isRep) {
      navigate("/rep/profile");
    } else {
      navigate("/company/applications");
    }
  };

  const primaryDescription = isRep
    ? "Explora lanzamientos, ofertas evergreen y equipos que buscan closers, setters y cold callers. Filtra por tipo de rol y comisiones."
    : "Crea ofertas de trabajo para tus lanzamientos, marca el número de plazas y deja que los mejores comerciales se postulen.";

  const secondaryDescription = isRep
    ? "Un perfil completo (bio, métricas y contacto) multiplica tus probabilidades de ser contratado."
    : "Revisa perfiles, organiza entrevistas y gestiona tus procesos desde un solo lugar.";

  const highlights = isRep
    ? [
        {
          label: "Talento",
          value: "Setters, Closers y Cold Callers",
          text: "Perfiles enfocados en venta consultiva, lanzamientos y funnels evergreen.",
        },
        {
          label: "Objetivo",
          value: "Ganar más dinero",
          text: "Conectar con equipos serios, procesos claros y comisiones atractivas.",
        },
        {
          label: "Ventaja",
          value: "Todo en un solo lugar",
          text: "Ofertas, aplicaciones, formación y métricas en un mismo panel.",
        },
      ]
    : [
        {
          label: "Empresas",
          value: "Agencias & Infoproductores",
          text: "Agencias de marketing/venta e infoproductores que venden de forma recurrente.",
        },
        {
          label: "Objetivo",
          value: "Vender más",
          text: "Conectar con comerciales preparados para escalar tus lanzamientos.",
        },
        {
          label: "Ventaja",
          value: "Proceso simple",
          text: "Publica tu oferta, recibe aplicaciones y contrata en pocos pasos.",
        },
      ];

  return (
    <>
      <Topbar title={title} subtitle={subtitle} />

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-[2fr,1.4fr] gap-6">
        {/* Columna principal */}
        <section className="bg-white rounded-3xl shadow-sm border border-neutral-200 px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold">
                Bienvenido a <span className="font-bold">CapitalHub</span>
              </h2>
              <p className="text-sm text-neutral-500 mt-1 max-w-xl">
                {isRep 
                  ? "Conectamos talento comercial con empresas que buscan crecer. Explora ofertas, aplica y haz crecer tu carrera."
                  : "Encuentra el talento comercial que necesitas para hacer crecer tu negocio. Publica ofertas y contrata profesionales."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handlePrimaryCta}
                className="px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-900 transition"
              >
                {primaryCta}
              </button>
              <button 
                onClick={handleSecondaryCta}
                className="px-4 py-2 rounded-full bg-neutral-100 text-sm font-medium hover:bg-neutral-200 transition"
              >
                {secondaryCta}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <article 
              onClick={handlePrimaryCta}
              className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 cursor-pointer hover:border-neutral-300 hover:bg-neutral-100 transition"
            >
              <h3 className="text-sm font-semibold mb-1">
                {isRep ? "🎯 Conecta con oportunidades" : "📝 Publica tu oferta"}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {primaryDescription}
              </p>
              <p className="text-[11px] text-blue-600 mt-2 font-medium">
                Ir a {isRep ? "ofertas" : "mis ofertas"} →
              </p>
            </article>

            <article 
              onClick={handleSecondaryCta}
              className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 cursor-pointer hover:border-neutral-300 hover:bg-neutral-100 transition"
            >
              <h3 className="text-sm font-semibold mb-1">
                {isRep ? "👤 Completa tu perfil" : "👥 Gestiona candidatos"}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {secondaryDescription}
              </p>
              <p className="text-[11px] text-blue-600 mt-2 font-medium">
                Ir a {isRep ? "mi perfil" : "aplicaciones"} →
              </p>
            </article>
          </div>

          {/* Accesos rápidos adicionales */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button 
              onClick={() => navigate(isRep ? "/rep/dashboard" : "/company/dashboard")}
              className="px-3 py-1.5 rounded-full border border-neutral-200 text-xs text-neutral-700 hover:bg-neutral-50 transition"
            >
              📊 Dashboard
            </button>
            <button 
              onClick={() => navigate(isRep ? "/rep/applications" : "/company/jobs")}
              className="px-3 py-1.5 rounded-full border border-neutral-200 text-xs text-neutral-700 hover:bg-neutral-50 transition"
            >
              {isRep ? "📋 Mis aplicaciones" : "💼 Mis ofertas"}
            </button>
            <button 
              onClick={() => navigate(isRep ? "/rep/settings" : "/company/settings")}
              className="px-3 py-1.5 rounded-full border border-neutral-200 text-xs text-neutral-700 hover:bg-neutral-50 transition"
            >
              ⚙️ Ajustes
            </button>
          </div>
        </section>

        {/* Columna lateral */}
        <aside className="space-y-4">
          <section className="bg-white rounded-3xl shadow-sm border border-neutral-200 px-6 py-5">
            <h3 className="text-sm font-semibold mb-1">Sobre CapitalHub</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Plataforma que conecta talento comercial de alto rendimiento con empresas 
              que buscan crecer. Ofrecemos herramientas simples para el reclutamiento, 
              gestión de contrataciones y seguimiento de resultados.
            </p>
            <div className="mt-3 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-800 text-white text-[11px] px-4 py-3">
              <p className="font-medium">
                🚀 MVP Activo
              </p>
              <p className="mt-1 text-neutral-300">
                Todas las funcionalidades conectadas con datos reales. 
                ¡Explora y prueba la plataforma!
              </p>
            </div>
          </section>

          <section className="bg-white rounded-3xl shadow-sm border border-neutral-200 px-6 py-5">
            <h3 className="text-sm font-semibold mb-3">
              {isRep ? "¿Qué te ofrece CapitalHub?" : "¿Qué consigues como empresa?"}
            </h3>

            <div className="space-y-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start justify-between gap-3 rounded-2xl bg-neutral-50 px-4 py-3"
                >
                  <div>
                    <p className="text-[11px] text-neutral-500 mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold">{item.value}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-3xl shadow-sm border border-neutral-200 px-6 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-neutral-700">
                  ¿Necesitas ayuda?
                </p>
                <p className="text-[11px] text-neutral-500">
                  Revisa la documentación o contacta con soporte.
                </p>
              </div>
              <button className="px-3 py-1.5 rounded-full bg-neutral-100 text-xs font-medium hover:bg-neutral-200 transition">
                Ayuda
              </button>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
