import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Topbar from "../../layouts/Topbar";
import { fetchRepProfile, RepProfileResponse } from "../../api/rep";

const roleLabels: Record<string, string> = {
    CLOSER: "Closer",
    SETTER: "Setter",
    COLD_CALLER: "Cold Caller / SDR"
};

export default function CompanyRepProfilePage() {
    const { repId } = useParams<{ repId: string }>();
    const [profile, setProfile] = useState<RepProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadProfile();
    }, [repId]);

    const loadProfile = async () => {
        if (!repId) return;

        try {
            setLoading(true);
            setError(null);
            const data = await fetchRepProfile(Number(repId));
            setProfile(data);
        } catch (err: any) {
            setError(err.message || "Error al cargar el perfil");
            console.error("Error loading rep profile:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 mb-10">
                <Topbar title="Perfil del Rep" subtitle="Cargando información..." />
                <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-neutral-500">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="space-y-6 mb-10">
                <Topbar title="Perfil del Rep" subtitle="Error al cargar" />
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <p className="text-sm text-red-700">Error: {error || "Perfil no encontrado"}</p>
                    <button
                        onClick={loadProfile}
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
                title={profile.fullName}
                subtitle={roleLabels[profile.roleType] || profile.roleType}
            />

            {/* INFORMACIÓN PRINCIPAL */}
            <section className="bg-white rounded-3xl border border-neutral-200 px-6 py-5 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        {profile.avatarUrl ? (
                            <img
                                src={profile.avatarUrl}
                                alt={profile.fullName}
                                className="w-32 h-32 rounded-full object-cover border-2 border-neutral-200"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-neutral-200 flex items-center justify-center">
                                <span className="text-4xl font-bold text-neutral-500">
                                    {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Información básica */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-neutral-900">{profile.fullName}</h2>
                        <p className="text-sm text-neutral-600 mt-1">{roleLabels[profile.roleType]}</p>

                        <div className="mt-4 space-y-2">
                            {profile.email && (
                                <p className="text-sm text-neutral-700">
                                    <span className="font-medium">Email:</span> {profile.email}
                                </p>
                            )}
                            {profile.phone && (
                                <p className="text-sm text-neutral-700">
                                    <span className="font-medium">Teléfono:</span> {profile.phone}
                                </p>
                            )}
                            {(profile.city || profile.country) && (
                                <p className="text-sm text-neutral-700">
                                    <span className="font-medium">Ubicación:</span> {[profile.city, profile.country].filter(Boolean).join(', ')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                    <div className="mt-6 pt-6 border-t border-neutral-200">
                        <h3 className="text-sm font-semibold text-neutral-900 mb-2">Biografía</h3>
                        <p className="text-sm text-neutral-700 whitespace-pre-wrap">{profile.bio}</p>
                    </div>
                )}
            </section>

            {/* ENLACES Y RECURSOS */}
            <section className="bg-white rounded-3xl border border-neutral-200 px-6 py-5 shadow-sm">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">Enlaces y Recursos</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.linkedinUrl && (
                        <a
                            href={profile.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition"
                        >
                            <span className="text-2xl">💼</span>
                            <div>
                                <p className="text-sm font-medium text-neutral-900">LinkedIn</p>
                                <p className="text-xs text-neutral-500">Ver perfil profesional</p>
                            </div>
                        </a>
                    )}

                    {profile.portfolioUrl && (
                        <a
                            href={profile.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition"
                        >
                            <span className="text-2xl">🌐</span>
                            <div>
                                <p className="text-sm font-medium text-neutral-900">Portfolio</p>
                                <p className="text-xs text-neutral-500">Ver trabajos anteriores</p>
                            </div>
                        </a>
                    )}

                    {profile.introVideoUrl && (
                        <a
                            href={profile.introVideoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition"
                        >
                            <span className="text-2xl">🎥</span>
                            <div>
                                <p className="text-sm font-medium text-neutral-900">Video de Presentación</p>
                                <p className="text-xs text-neutral-500">Ver introducción</p>
                            </div>
                        </a>
                    )}

                    {profile.bestCallUrl && (
                        <a
                            href={profile.bestCallUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition"
                        >
                            <span className="text-2xl">📞</span>
                            <div>
                                <p className="text-sm font-medium text-neutral-900">Mejor Llamada</p>
                                <p className="text-xs text-neutral-500">Escuchar grabación</p>
                            </div>
                        </a>
                    )}
                </div>

                {!profile.linkedinUrl && !profile.portfolioUrl && !profile.introVideoUrl && !profile.bestCallUrl && (
                    <p className="text-sm text-neutral-500 text-center py-4">
                        No hay enlaces disponibles
                    </p>
                )}
            </section>
        </div>
    );
}
