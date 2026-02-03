import { useState, useMemo } from "react";
import Topbar from "../../layouts/Topbar";
import { useFetch } from '../../hooks/useFetch';
import { Button } from "../../components/ui/Button";
import { applyToJob } from '../../api/applications';

type RoleFilter = "all" | "closer" | "setter" | "cold_caller";

interface JobOffer {
    id: number;
    title: string;
    companyName: string;
    role: string;
    model: string;
    salaryHint: string;
    type: string;
    description: string;
    callTool: string;
    callLink: string;
    active: boolean;
}

const JobOfferCard: React.FC<{ offer: JobOffer }> = ({ offer }) => {
    const [loading, setLoading] = useState(false);
    const [applied, setApplied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleApply = async () => {
        if (applied) {
            window.open(offer.callLink, "_blank", "noopener,noreferrer");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await applyToJob(offer.id);
            setApplied(true);
            window.open(offer.callLink, "_blank", "noopener,noreferrer");
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || err.message || "Error desconocido";

            if (msg.includes("Ya has aplicado") || msg.includes("previously")) {
                setError("Ya has aplicado a esta oferta.");
                setApplied(true);
                window.open(offer.callLink, "_blank", "noopener,noreferrer");
            } else {
                setError("Error al registrar uso del formulario. Intenta de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    const roleLabel = (role: string) => {
        if (!role) return "";
        const r = role.toLowerCase();
        if (r.includes("closer")) return "Closer";
        if (r.includes("setter")) return "Setter";
        if (r.includes("cold")) return "Cold Caller / SDR";
        if (r.includes("both")) return "Setter + Closer";
        return role;
    };

    const callToolLabel = (tool: string) => {
        if (!tool) return "Video/Llamada";
        const t = tool.toLowerCase();
        if (t.includes("calendly")) return "Calendly";
        if (t.includes("zoom")) return "Zoom";
        if (t.includes("what")) return "WhatsApp";
        if (t.includes("form")) return "Google Form";
        return tool;
    }

    const buttonText = applied
        ? 'Formulario Abierto'
        : 'Rellenar formulario';

    return (
        <article className="bg-panel rounded-xl border border-graphite px-6 py-5 shadow-card flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                    <h2 className="text-sm font-display font-bold text-offwhite">{offer.title}</h2>
                    <p className="text-xs text-muted mt-0.5">
                        {offer.companyName} · {offer.type}
                    </p>
                    <p className="text-[11px] text-muted mt-1">
                        Rol: {roleLabel(offer.role)}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-[11px] text-muted mb-1">Modelo de pago</p>
                    <p className="text-xs font-medium text-offwhite">{offer.model}</p>
                    <p className="text-[11px] text-muted mt-0.5">{offer.salaryHint}</p>
                </div>
            </div>

            <p className="text-xs text-offwhite/80 leading-relaxed">
                {offer.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-graphite">
                <p className="text-[11px] text-muted">
                    Entrevista vía <span className="font-medium text-offwhite">{callToolLabel(offer.callTool)}</span>.
                </p>

                <div className="flex gap-2">
                    <Button
                        onClick={handleApply}
                        disabled={loading}
                        className={`px-3 py-1.5 text-xs rounded-lg transition ${applied
                            ? "bg-emerald-900/30 text-emerald-400 border border-emerald-700/30 hover:bg-emerald-900/50"
                            : ""
                            }`}
                    >
                        {loading ? "Procesando..." : buttonText}
                    </Button>
                </div>
            </div>
            {error && <p className="text-[10px] text-red-400 mt-1 sm:text-right">{error}</p>}
        </article>
    );
};

export default function RepOffersPage() {
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
    const { data: offers, isLoading, error, refetch } = useFetch<JobOffer[]>('/api/rep/jobs', true);

    const filteredOffers = useMemo(() => {
        if (!offers) return [];

        return offers.filter((offer) => {
            const lowerCaseRole = offer.role ? offer.role.toLowerCase() : "";

            if (roleFilter === "all") return true;
            if (roleFilter === "closer") return lowerCaseRole.includes("closer") || lowerCaseRole === "both";
            if (roleFilter === "setter") return lowerCaseRole.includes("setter") || lowerCaseRole === "both";
            if (roleFilter === "cold_caller") return lowerCaseRole.includes("cold");
            return true;
        });
    }, [offers, roleFilter]);

    if (isLoading) {
        return (
            <>
                <Topbar title="Ofertas disponibles" subtitle="Cargando oportunidades..." />
                <div className="flex items-center justify-center min-h-[300px]">
                    <div className="w-8 h-8 border-4 border-graphite border-t-accent rounded-full animate-spin"></div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Topbar title="Ofertas disponibles" subtitle="Error de conexión" />
                <div className="text-center py-10">
                    <p className="text-red-400 mb-4">No se pudieron cargar las ofertas.</p>
                    <Button onClick={refetch}>Reintentar</Button>
                </div>
            </>
        );
    }

    return (
        <>
            <Topbar
                title="Ofertas disponibles"
                subtitle={`Mostrando ${filteredOffers.length} oportunidades.`}
            />

            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* FILTROS */}
                <div className="inline-flex rounded-lg bg-panel border border-graphite p-1 overflow-x-auto">
                    {[
                        { id: "all", label: "Todos" },
                        { id: "closer", label: "Closers" },
                        { id: "setter", label: "Setters" },
                        { id: "cold_caller", label: "Cold Callers" },
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setRoleFilter(f.id as RoleFilter)}
                            className={`px-4 py-1.5 text-xs rounded-lg transition whitespace-nowrap ${roleFilter === f.id ? "bg-accent text-offwhite" : "text-muted hover:bg-graphite hover:text-offwhite"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* LISTA */}
            <div className="mt-5 space-y-4">
                {filteredOffers.map((offer) => (
                    <JobOfferCard key={offer.id} offer={offer} />
                ))}

                {filteredOffers.length === 0 && (
                    <div className="bg-panel rounded-xl border border-dashed border-graphite px-6 py-10 text-center">
                        <p className="text-sm font-medium text-muted">No hay ofertas disponibles</p>
                    </div>
                )}
            </div>
        </>
    );
}
