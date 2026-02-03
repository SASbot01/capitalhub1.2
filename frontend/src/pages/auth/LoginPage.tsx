import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

type UserType = "rep" | "company";

export default function LoginPage() {
    const [userType, setUserType] = useState<UserType>("rep");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

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
            <div className="flex mb-6 bg-carbon rounded-lg p-1">
                <button
                    type="button"
                    onClick={() => setUserType("rep")}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${userType === "rep"
                        ? "bg-accent text-offwhite"
                        : "text-muted hover:text-offwhite"
                        }`}
                >
                    Comercial
                </button>
                <button
                    type="button"
                    onClick={() => setUserType("company")}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${userType === "company"
                        ? "bg-accent text-offwhite"
                        : "text-muted hover:text-offwhite"
                        }`}
                >
                    Empresa
                </button>
            </div>

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

            <div className="mt-4 text-center text-xs text-muted">
                ¿No tienes cuenta?{" "}
                <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="font-semibold text-offwhite hover:underline underline-offset-2"
                >
                    Regístrate
                </button>
            </div>

            <div className="mt-4 pt-3 border-t border-graphite text-[11px] text-muted text-center">
                Demo: usa <span className="font-mono text-accent">admin@capitalhub.com</span> para acceso
                admin
            </div>
        </div>
    );
}
