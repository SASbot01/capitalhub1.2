export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-appleGray flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-neutral-200 px-8 py-10 max-w-md w-full text-center shadow-sm">
        <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center text-sm font-semibold mx-auto mb-4">
          C
        </div>
        <h1 className="text-lg font-semibold text-neutral-900">
          Página no encontrada
        </h1>
        <p className="text-xs text-neutral-500 mt-2">
          La ruta que has intentado abrir no existe dentro de CapitalHub.
        </p>
        <p className="text-xs text-neutral-500">
          Vuelve a tu panel o inicia sesión de nuevo.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <a
            href="/login"
            className="w-full px-4 py-2 rounded-full bg-black text-white text-xs hover:bg-neutral-900 transition"
          >
            Ir al login
          </a>
          <a
            href="/rep/home"
            className="w-full px-4 py-2 rounded-full border border-neutral-200 text-xs text-neutral-700 hover:bg-neutral-50 transition"
          >
            Ir a mi inicio (rep)
          </a>
        </div>
      </div>
    </div>
  );
}
