import { useState, useMemo } from "react";
import Topbar from "../../layouts/Topbar";
import { useFetch } from '../../hooks/useFetch';
import { Button } from "../../components/ui/Button";
import { applyToJob } from '../../api/applications';

// ---------------------------------------------------
// TIPOS (Ajustados para coincidir con lo que envía Java)
// ---------------------------------------------------
type RoleFilter = "all" | "closer" | "setter" | "cold_caller";

interface JobOffer {
    id: number;
    title: string;
    companyName: string;
    // Java envía "SETTER", "CLOSER" (Mayúsculas). Permitimos string para evitar errores.
    role: string;
    model: string;
    salaryHint: string;
    type: string;
    description: string;
    // Java envía "CALENDLY" (Mayúsculas) o null.
    callTool: string;
    callLink: string;
    active: boolean;
}

// ---------------------------------------------------
// TARJETA DE OFERTA
// ---------------------------------------------------
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
            // Abrir link tras aplicar exitosamente
            window.open(offer.callLink, "_blank", "noopener,noreferrer");
        } catch (err: any) {
            console.error(err);
            // Manejo seguro del mensaje de error
            // Manejo seguro del mensaje de error
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
        return role; // Fallback
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
        ? '✅ Formulario Abierto'
        : 'Rellenar formulario';

    return (
        <article className="bg-white rounded-3xl border border-neutral-200 px-6 py-5 shadow-sm flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                    <h2 className="text-sm font-semibold">{offer.title}</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                        {offer.companyName} · {offer.type}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-1">
                        Rol: {roleLabel(offer.role)}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-[11px] text-neutral-400 mb-1">Modelo de pago</p>
                    <p className="text-xs font-medium text-neutral-800">{offer.model}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{offer.salaryHint}</p>
                </div>
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed">
                {offer.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-neutral-100">
                <p className="text-[11px] text-neutral-500">
                    Entrevista vía <span className="font-medium">{callToolLabel(offer.callTool)}</span>.
                </p>

                <div className="flex gap-2">
                    <Button
                        onClick={handleApply}
                        disabled={loading} // Quitamos 'applied' del disabled para permitir re-clicks si quieren ver el link
                        className={`px-3 py-1.5 text-xs rounded-full transition ${applied
                            ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                            : "bg-black text-white hover:bg-neutral-900"
                            }`}
                    >
                        {loading ? "Procesando..." : buttonText}
                    </Button>
                </div>
            </div>
            {error && <p className="text-[10px] text-red-500 mt-1 sm:text-right">{error}</p>}
        </article>
    );
};

// ---------------------------------------------------
// PÁGINA PRINCIPAL
// ---------------------------------------------------
export default function RepOffersPage() {
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

    // useFetch tipado con JobOffer[]
    const { data: offers, isLoading, error, refetch } = useFetch<JobOffer[]>('/api/rep/jobs', true);

    const filteredOffers = useMemo(() => {
        if (!offers) return [];

        return offers.filter((offer) => {
            // Protección contra nulos
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
                <div className="text-center py-10 text-neutral-500">Cargando ofertas disponibles...</div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Topbar title="Ofertas disponibles" subtitle="Error de conexión" />
                <div className="text-center py-10">
                    <p className="text-red-600 mb-4">No se pudieron cargar las ofertas.</p>
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
                <div className="inline-flex rounded-full bg-white border border-neutral-200 p-1 shadow-sm overflow-x-auto">
                    {[
                        { id: "all", label: "Todos" },
                        { id: "closer", label: "Closers" },
                        { id: "setter", label: "Setters" },
                        { id: "cold_caller", label: "Cold Callers" },
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setRoleFilter(f.id as RoleFilter)}
                            className={`px-4 py-1.5 text-xs rounded-full transition whitespace-nowrap ${roleFilter === f.id ? "bg-black text-white" : "text-neutral-700 hover:bg-neutral-100"
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
                    <div className="bg-white rounded-3xl border border-dashed border-neutral-200 px-6 py-10 text-center">
                        <p className="text-sm font-medium text-neutral-700">No hay ofertas disponibles</p>
                    </div>
                )}
            </div>
        </>
    );
}