import type { FormEvent } from "react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Input from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { resetPassword, validateResetToken } from "../../api/auth";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tokenError, setTokenError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    // Validar token al cargar la página
    useEffect(() => {
        const checkToken = async () => {
            if (!token) {
                setTokenError("No se proporcionó un token válido.");
                setValidating(false);
                return;
            }

            try {
                const res = await validateResetToken(token);
                if (!res.success) {
                    setTokenError(res.message);
                }
            } catch (err: any) {
                setTokenError(err?.message || "Token inválido o expirado.");
            } finally {
                setValidating(false);
            }
        };

        checkToken();
    }, [token]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validaciones del lado del cliente
        if (newPassword.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);

        try {
            const res = await resetPassword(token, newPassword);
            
            if (res.success) {
                setSuccess(true);
            } else {
                setError(res.message);
            }
        } catch (err: any) {
            setError(err?.message || "Error al restablecer la contraseña.");
        } finally {
            setLoading(false);
        }
    };

    // Estado de carga mientras validamos el token
    if (validating) {
        return (
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm text-neutral-600">Validando enlace...</p>
                </div>
            </div>
        );
    }

    // Token inválido o expirado
    if (tokenError) {
        return (
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                        Enlace inválido
                    </h2>
                    <p className="text-sm text-neutral-600 mb-6">
                        {tokenError}
                    </p>
                    <div className="space-y-3">
                        <Button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="w-full"
                        >
                            Solicitar nuevo enlace
                        </Button>
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="w-full text-sm text-neutral-600 hover:text-neutral-900 hover:underline underline-offset-2"
                        >
                            Volver al inicio de sesión
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Contraseña actualizada exitosamente
    if (success) {
        return (
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8">
                <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                        ¡Contraseña actualizada!
                    </h2>
                    <p className="text-sm text-neutral-600 mb-6">
                        Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
                    </p>
                    <Button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="w-full"
                    >
                        Ir a iniciar sesión
                    </Button>
                </div>
            </div>
        );
    }

    // Formulario de nueva contraseña
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                    Nueva contraseña
                </h2>
                <p className="text-sm text-neutral-600">
                    Introduce tu nueva contraseña para acceder a tu cuenta.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Nueva contraseña"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                />

                <Input
                    label="Confirmar contraseña"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                />

                {/* Indicador de fortaleza básico */}
                {newPassword.length > 0 && (
                    <div className="text-xs">
                        <span className={newPassword.length >= 6 ? "text-emerald-600" : "text-amber-600"}>
                            {newPassword.length >= 6 ? "✓" : "○"} Mínimo 6 caracteres
                        </span>
                    </div>
                )}

                {error && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-2xl px-3 py-2">
                        {error}
                    </p>
                )}

                <div className="mt-2">
                    <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loading || !newPassword || !confirmPassword}
                    >
                        {loading ? "Actualizando..." : "Restablecer contraseña"}
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

