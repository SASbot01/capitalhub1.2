import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-carbon bg-grid flex items-center justify-center">
      <div className="w-full max-w-md bg-panel rounded-xl shadow-card border border-graphite px-8 py-10">
        <div className="flex flex-col items-center mb-6">
          {/* CH Monogram */}
          <div className="w-12 h-12 rounded-lg bg-offwhite text-carbon flex items-center justify-center text-lg font-display font-extrabold tracking-tight mb-4">
            CH
          </div>
          {/* Logo Wordmark */}
          <h1 className="font-display font-extrabold text-lg tracking-logo text-offwhite uppercase">
            Capital Hub
          </h1>
          <p className="text-xs text-muted mt-2">
            Inicia sesión en tu cuenta
          </p>
        </div>

        {/* Aquí se renderiza LoginPage */}
        <Outlet />
      </div>
    </div>
  );
}
