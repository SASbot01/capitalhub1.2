import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-neutral-200 px-8 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center text-sm font-semibold mb-3">
            C
          </div>
          <h1 className="text-lg font-semibold">CapitalHub</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Inicia sesión en tu cuenta
          </p>
        </div>

        {/* Aquí se renderiza LoginPage */}
        <Outlet />
      </div>
    </div>
  );
}

