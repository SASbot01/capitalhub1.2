import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  const isChunkError =
    error instanceof TypeError &&
    error.message?.includes("dynamically imported module");

  return (
    <div className="min-h-screen bg-appleGray flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-neutral-200 px-8 py-10 max-w-md w-full text-center shadow-sm">
        <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center text-sm font-semibold mx-auto mb-4">
          C
        </div>
        <h1 className="text-lg font-semibold text-neutral-900">
          {isChunkError ? "Nueva versión disponible" : "Algo salió mal"}
        </h1>
        <p className="text-xs text-neutral-500 mt-2">
          {isChunkError
            ? "Hay una actualización de CapitalHub. Recarga la página para continuar."
            : "Ha ocurrido un error inesperado. Intenta recargar la página."}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 rounded-full bg-black text-white text-xs hover:bg-neutral-900 transition"
          >
            Recargar página
          </button>
          <a
            href="/home"
            className="w-full px-4 py-2 rounded-full border border-neutral-200 text-xs text-neutral-700 hover:bg-neutral-50 transition"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
