import type { FormEvent } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { login: authLogin, logout, isAuthenticated } = useAuth();

    // Limpiar sesión anterior al entrar en login
    useEffect(() => {
        if (isAuthenticated) {
            logout();
        }
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await authLogin(email, password);
            navigate("/home");
        } catch (err: any) {
            setError(err?.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-panel rounded-xl shadow-card border border-graphite p-8">
            <h2 className="text-xl font-display font-bold text-center text-offwhite mb-2">
                Iniciar sesión
            </h2>
            <p className="text-sm text-muted text-center mb-6">
                Accede a tu cuenta de CapitalHub
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tuemail@ejemplo.com"
                />

                <Input
                    label="Contraseña"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                />

                <div className="flex items-center justify-between text-xs text-muted mt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            className="rounded border-graphite bg-carbon text-accent focus:ring-accent/30"
                        />
                        <span>Recordarme</span>
                    </label>
                    <button
                        type="button"
                        className="text-muted hover:text-offwhite underline-offset-2 hover:underline"
                    >
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>

                {error && (
                    <p className="text-xs text-red-400 bg-red-900/30 border border-red-700/30 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <div className="mt-2">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
