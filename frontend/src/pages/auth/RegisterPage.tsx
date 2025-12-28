import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

type UserType = "rep" | "company";

export default function RegisterPage() {
    const [userType, setUserType] = useState<UserType>("rep");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { registerRep, registerCompany } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!firstName || !lastName || !email || !password) {
            setError("Por favor, rellena todos los campos.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            setLoading(false);
            return;
        }

        try {
            const payload = { firstName, lastName, email, password };
            
            let res;
            if (userType === "rep") {
                res = await registerRep(payload);
            } else {
                res = await registerCompany(payload);
            }

            // Redirigir según el rol
            if (res.role === "REP") {
                navigate("/rep/dashboard");
            } else if (res.role === "COMPANY") {
                navigate("/company/dashboard");
            } else {
                navigate("/login");
            }

        } catch (err: any) {
            setError(err?.message || "Error al registrarse. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8">
            {/* TABS REP / COMPANY */}
            <div className="flex mb-6 bg-neutral-100 rounded-full p-1">
                <button
                    type="button"
                    onClick={() => setUserType("rep")}
                    className={`flex-1 py-2 text-sm font-medium rounded-full transition ${
                        userType === "rep"
                            ? "bg-white shadow-sm text-neutral-900"
                            : "text-neutral-500 hover:text-neutral-800"
                    }`}
                >
                    Comercial
                </button>
                <button
                    type="button"
                    onClick={() => setUserType("company")}
                    className={`flex-1 py-2 text-sm font-medium rounded-full transition ${
                        userType === "company"
                            ? "bg-white shadow-sm text-neutral-900"
                            : "text-neutral-500 hover:text-neutral-800"
                    }`}
                >
                    Empresa
                </button>
            </div>

            <h2 className="text-xl font-bold text-center mb-2">
                {userType === "rep" ? "Regístrate como Comercial" : "Registra tu Empresa"}
            </h2>
            <p className="text-sm text-neutral-500 text-center mb-6">
                {userType === "rep" 
                    ? "Encuentra oportunidades como Setter, Closer o SDR" 
                    : "Publica ofertas y encuentra el mejor talento comercial"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label={userType === "rep" ? "Nombre" : "Nombre del contacto"}
                        type="text"
                        autoComplete="given-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder={userType === "rep" ? "Tu nombre" : "Juan"}
                        required
                    />
                    <Input
                        label="Apellido"
                        type="text"
                        autoComplete="family-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Tu apellido"
                        required
                    />
                </div>

                <Input
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={userType === "rep" ? "tuemail@ejemplo.com" : "contacto@empresa.com"}
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
                    <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-2xl px-3 py-2">
                        {error}
                    </p>
                )}

                <div className="mt-4">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Registrando..." : "Crear Cuenta"}
                    </Button>
                </div>
            </form>

            <div className="mt-4 text-center text-xs text-neutral-600">
                ¿Ya tienes cuenta?{" "}
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="font-semibold text-neutral-900 hover:underline underline-offset-2"
                >
                    Iniciar Sesión
                </button>
            </div>

            {/* Info adicional según tipo */}
            <div className="mt-4 pt-3 border-t border-neutral-200 text-[11px] text-neutral-500 text-center">
                {userType === "rep" 
                    ? "🎯 Después de registrarte podrás completar tu perfil y aplicar a ofertas."
                    : "🏢 Después de registrarte podrás publicar ofertas de trabajo."}
            </div>
        </div>
    );
}
