// frontend/src/pages/common/HomePage.tsx
import Topbar from "../../layouts/Topbar";

export default function HomePage() {
  return (
    <div className="space-y-6 mb-10">
      <Topbar
        title="Inicio"
        subtitle="Visión general de Capital Hub y cómo funciona la plataforma"
      />

      {/* HERO: LOGO + MISIÓN / VISIÓN */}
      <section className="bg-panel rounded-xl border border-graphite px-6 py-6 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-lg border border-graphite px-3 py-1 bg-carbon">
              <div className="w-6 h-6 rounded-lg bg-offwhite text-carbon flex items-center justify-center text-[11px] font-display font-extrabold">
                CH
              </div>
              <span className="text-[11px] tracking-wide text-muted">
                Capital Hub · Sales Talent Platform
              </span>
            </div>

            <h1 className="text-xl font-display font-bold text-offwhite tracking-tight">
              Conectamos talento en ventas con lanzamientos reales y empresas
              que quieren crecer.
            </h1>

            <div className="space-y-2">
              <div>
                <p className="text-[11px] font-semibold text-muted uppercase">
                  Misión
                </p>
                <p className="text-sm text-offwhite/80">
                  Ayudar a las personas a ganar dinero conectando con
                  oportunidades reales (setters, closers, cold callers) y a las
                  empresas a captar más ingresos a través de equipos comerciales
                  eficaces y profesionales.
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted uppercase mt-2">
                  Visión
                </p>
                <p className="text-sm text-offwhite/80">
                  Convertirnos en la plataforma líder de conexión entre empresas
                  y vendedores de alto rendimiento, ofreciendo herramientas
                  simples y visuales que automaticen el reclutamiento, la
                  gestión de contrataciones y la optimización de resultados.
                </p>
              </div>
            </div>
          </div>

          {/* BLOQUE VIDEO LOOM */}
          <div className="w-full max-w-sm">
            <div className="rounded-xl border border-graphite bg-carbon px-4 py-4 flex flex-col gap-3">
              <p className="text-xs font-semibold text-offwhite">
                Video introductorio
              </p>
              <p className="text-[11px] text-muted">
                Aquí podrás incrustar tu vídeo de Loom explicando qué es
                Capital Hub y cómo usar la plataforma, tanto para empresas como
                para comerciales.
              </p>
              <div className="aspect-video rounded-lg bg-graphite flex items-center justify-center text-[11px] text-muted">
                Placeholder vídeo Loom
              </div>
              <button className="mt-1 px-4 py-1.5 text-xs rounded-lg bg-accent text-offwhite hover:bg-accent/80 transition">
                Ver guía de Capital Hub (próximamente)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TIPOS DE EMPRESA Y ROLES */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Empresas */}
        <div className="bg-panel rounded-xl border border-graphite px-6 py-5 shadow-card">
          <h2 className="text-sm font-display font-bold text-offwhite mb-2">
            ¿Qué tipo de empresas pueden usar Capital Hub?
          </h2>
          <p className="text-xs text-muted mb-3">
            Empezamos por los segmentos donde tú ya te mueves cómodo, y una vez
            validado el modelo escalaremos a otros mercados.
          </p>
          <ul className="space-y-2 text-sm text-offwhite/80">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              Agencias de Marketing
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              Agencias de Venta
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              Infoproductores
            </li>
          </ul>
          <p className="text-[11px] text-muted mt-3 border-l-2 border-graphite pl-3">
            Nota: En el MVP nos centraremos en estos nichos. Más adelante
            añadiremos consultorías, SaaS B2B y otros modelos.
          </p>
        </div>

        {/* Roles */}
        <div className="bg-panel rounded-xl border border-graphite px-6 py-5 shadow-card">
          <h2 className="text-sm font-display font-bold text-offwhite mb-2">
            Perfiles que conectamos
          </h2>
          <p className="text-xs text-muted mb-3">
            Los comerciales que se registran en Capital Hub pueden especializarse
            en diferentes partes del funnel de ventas.
          </p>

          <ul className="space-y-2 text-sm text-offwhite/80">
            <li>
              <span className="font-semibold text-offwhite">Closers</span> · se encargan de
              cerrar clientes en llamada, normalmente con ticket medio/alto.
            </li>
            <li>
              <span className="font-semibold text-offwhite">Setters</span> · generan y
              califican oportunidades, agendando llamadas para los closers.
            </li>
            <li>
              <span className="font-semibold text-offwhite">Cold Callers / SDRs</span> ·
              atacan el frío: llamadas salientes, prospección y activación de
              leads al inicio del funnel.
            </li>
          </ul>

          <p className="text-[11px] text-muted mt-3 border-l-2 border-graphite pl-3">
            Nota: más adelante se podrán añadir otros roles como Project
            Manager, Head of Sales o Account Manager, manteniendo el mismo
            modelo de matching.
          </p>
        </div>
      </section>

      {/* FLOW RESUMIDO */}
      <section className="bg-panel rounded-xl border border-graphite px-6 py-5 shadow-card">
        <h2 className="text-sm font-display font-bold text-offwhite mb-2">
          ¿Cómo funciona Capital Hub a alto nivel?
        </h2>
        <ol className="list-decimal list-inside text-sm text-offwhite/80 space-y-1 mt-2">
          <li>La empresa publica una oferta detallada para setters/closers/cold callers.</li>
          <li>Los comerciales crean su perfil con métricas, experiencia y media.</li>
          <li>Capital Hub calcula un match y muestra los mejores candidatos.</li>
          <li>La empresa agenda entrevistas (Calendly/Zoom/WhatsApp) desde la app.</li>
          <li>Si hay acuerdo, se contrata y se registra la colaboración.</li>
        </ol>
        <p className="text-[11px] text-muted mt-3 border-l-2 border-accent pl-3 bg-accent-glow py-2">
          Todo el diseño de la plataforma está pensado para ser simple, visual y
          lo más automatizable posible, tanto para empresa como para talento.
        </p>
      </section>
    </div>
  );
}
