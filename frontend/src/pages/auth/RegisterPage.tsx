import type { FormEvent } from "react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Input from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
    const [searchParams] = useSearchParams();
    const plan = searchParams.get("plan");
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const { registerRep } = useAuth();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Si no hay ?plan=trial, redirigir a /login
    useEffect(() => {
        if (plan !== "trial") {
            navigate("/login", { replace: true });
        }
    }, [plan, navigate]);

    // No renderizar el formulario si no hay plan válido
    if (plan !== "trial") return null;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await registerRep({ firstName, lastName, email, password, plan, token: token || undefined });
            navigate("/home");
        } catch (err: any) {
            setError(err?.message || "Error al crear la cuenta");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-panel rounded-xl shadow-card border border-graphite p-8">
            <h2 className="text-xl font-display font-bold text-center text-offwhite mb-2">
                Crear cuenta
            </h2>
            <p className="text-sm text-muted text-center mb-6">
                Prueba de 14 días — Acceso completo a formación
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Nombre"
                        type="text"
                        autoComplete="given-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Juan"
                        required
                    />
                    <Input
                        label="Apellido"
                        type="text"
                        autoComplete="family-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="García"
                        required
                    />
                </div>

                <Input
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tuemail@ejemplo.com"
                    required
                />

                <Input
                    label="Contraseña"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                />

                {error && (
                    <p className="text-xs text-red-400 bg-red-900/30 border border-red-700/30 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <div className="mt-2">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creando cuenta..." : "Crear cuenta"}
                    </Button>
                </div>

                <p className="text-xs text-muted text-center mt-4">
                    ¿Ya tienes cuenta?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-accent hover:underline"
                    >
                        Iniciar sesión
                    </button>
                </p>
            </form>
        </div>
    );
}
