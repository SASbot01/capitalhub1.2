// frontend/src/layouts/Sidebar.tsx
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

interface SidebarProps {
  userName: string;
  userRole: string;
}

interface MenuItem {
  label: string;
  to: string;
}

const repMenu: MenuItem[] = [
  { label: "Inicio", to: "/rep/home" },
  { label: "Dashboard", to: "/rep/dashboard" },
  { label: "Perfil", to: "/rep/profile" },
  { label: "Ofertas", to: "/rep/offers" },
  { label: "Aplicaciones", to: "/rep/applications" },
  { label: "Formación", to: "/rep/training" },
  { label: "Ajustes", to: "/rep/settings" },
];

const companyMenu: MenuItem[] = [
  { label: "Inicio", to: "/company/home" },
  { label: "Dashboard", to: "/company/dashboard" },
  { label: "Ofertas", to: "/company/jobs" },
  { label: "Aplicaciones", to: "/company/applications" },
  { label: "Ajustes", to: "/company/settings" },
];


export default function Sidebar({ userName, userRole }: SidebarProps) {
  const location = useLocation();
  const isCompany = location.pathname.startsWith("/company");
  const menu = isCompany ? companyMenu : repMenu;

  // Estado para notificaciones
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Definir la función de fetch
    const fetchNotifications = async () => {
      try {
        // Importar apiClient dinámicamente o usar fetch directo si es simple, 
        // pero mejor usar lo que ya hay. Asumimos que apiClient está disponible en el scope o importado.
        // Para no romper imports, usaremos fetch con el token.
        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        if (!token) return;

        const res = await fetch("/api/notifications/count", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPendingCount(data.pending || 0);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
    // Polling cada 60s
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-56 bg-white border-r border-neutral-200 flex flex-col justify-between py-6">
      <div>
        {/* Logo + título */}
        <div className="px-5 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-2xl bg-black text-white flex items-center justify-center text-xs font-semibold">
            C
          </div>
          <div>
            <p className="text-xs font-semibold leading-tight">CapitalHub</p>
            <p className="text-[11px] text-neutral-500 leading-tight">
              {isCompany ? "Panel empresa" : "Panel comercial"}
            </p>
          </div>
        </div>

        {/* Navegación */}
        <nav className="px-3 space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "block px-4 py-2.5 text-xs rounded-full transition flex justify-between items-center",
                  isActive
                    ? "bg-black text-white"
                    : "text-neutral-700 hover:bg-neutral-100",
                ].join(" ")
              }
            >
              <span>{item.label}</span>
              {/* Badge solo en 'Aplicaciones' si hay count > 0 */}
              {item.label === "Aplicaciones" && pendingCount > 0 && (
                <span className={`flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold ${
                  // Si el padre está activo (bg-black), el badge debe contrastar
                  // location.pathname === item.to ? 'bg-red-500 text-white' : 'bg-red-500 text-white'
                  'bg-red-500 text-white'
                  }`}>
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer usuario */}
      <div className="px-5 pt-4 border-t border-neutral-200">
        <p className="text-[11px] text-neutral-500 mb-1">Sesión iniciada</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium truncate max-w-[120px]">
              {userName}
            </p>
            <p className="text-[11px] text-neutral-500 truncate max-w-[120px]">
              {userRole}
            </p>
          </div>
          <button className="text-[11px] text-neutral-500 hover:text-neutral-900">
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  );
}
