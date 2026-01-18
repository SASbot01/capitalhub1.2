import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { forgotPassword } from "../../api/auth";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await forgotPassword(email);
            
            if (res.success) {
                setSuccess(true);
            } else {
                setError(res.message);
            }
        } catch (err: any) {
            setError(err?.message || "Error al procesar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    // Mostrar mensaje de éxito
    if (success) {
        return (
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8">
                <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                        ¡Revisa tu correo!
                    </h2>
                    <p className="text-sm text-neutral-600 mb-6">
                        Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.
                    </p>
                    <p className="text-xs text-neutral-500 mb-6">
                        📧 Email enviado a: <span className="font-medium">{email}</span>
                    </p>
                    <Button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="w-full"
                    >
                        Volver al inicio de sesión
                    </Button>
                </div>

                {/* Nota para desarrollo */}
                <div className="mt-6 pt-4 border-t border-neutral-200">
                    <p className="text-[11px] text-neutral-500 text-center">
                        🔧 <strong>Dev:</strong> El token aparece en la consola del backend.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                    ¿Olvidaste tu contraseña?
                </h2>
                <p className="text-sm text-neutral-600">
                    Introduce tu email y te enviaremos un enlace para restablecerla.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tuemail@ejemplo.com"
                    required
                />

                {error && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-2xl px-3 py-2">
                        {error}
                    </p>
                )}

                <div className="mt-2">
                    <Button type="submit" className="w-full" disabled={loading || !email}>
                        {loading ? "Enviando..." : "Enviar enlace de recuperación"}
                    </Button>
                </div>
            </form>

            <div className="mt-4 text-center">
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-sm text-neutral-600 hover:text-neutral-900 hover:underline underline-offset-2"
                >
                    ← Volver al inicio de sesión
                </button>
            </div>
        </div>
    );
}

