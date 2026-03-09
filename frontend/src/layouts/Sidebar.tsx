// frontend/src/layouts/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";

interface SidebarProps {
  userName: string;
  userRole: string;
}

interface MenuItem {
  label: string;
  to: string;
  locked?: boolean;
}

export default function Sidebar({ userName, userRole }: SidebarProps) {
  const { role } = useAuth();
  const { hasMarketplaceAccess, hasFullFormationAccess, tier } = useSubscription();
  const isCompany = role === "COMPANY";

  const repMenu: MenuItem[] = [
    { label: "Inicio", to: "/home" },
    { label: "Perfil", to: "/rep/profile" },
    { label: "Ofertas", to: "/rep/offers", locked: !hasMarketplaceAccess },
    { label: "Aplicaciones", to: "/rep/applications", locked: !hasMarketplaceAccess },
    { label: "Formación", to: "/rep/training", locked: !hasFullFormationAccess },
    { label: "Ajustes", to: "/rep/settings" },
  ];

  const companyMenu: MenuItem[] = [
    { label: "Inicio", to: "/home" },
    { label: "Dashboard", to: "/company/dashboard" },
    { label: "Ofertas", to: "/company/jobs" },
    { label: "Aplicaciones", to: "/company/applications" },
    { label: "Ajustes", to: "/company/settings" },
  ];

  const menu = isCompany ? companyMenu : repMenu;

  // Estado para notificaciones
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
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
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-56 bg-panel border-r border-graphite flex flex-col justify-between py-6">
      <div>
        {/* Logo + título */}
        <div className="px-5 mb-6 flex items-center gap-3">
          {/* CH Monogram */}
          <div className="w-8 h-8 rounded-lg bg-offwhite text-carbon flex items-center justify-center text-sm font-display font-extrabold tracking-tight">
            CH
          </div>
          <div>
            <p className="text-xs font-display font-bold tracking-logo text-offwhite uppercase">Capital Hub</p>
            <p className="text-[11px] text-muted leading-tight">
              {isCompany ? "Panel empresa" : "Panel comercial"}
            </p>
          </div>
        </div>

        {/* Navegación */}
        <nav className="px-3 space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.locked ? "/upgrade" : item.to}
              className={({ isActive }) =>
                [
                  "block px-4 py-2.5 text-xs rounded-lg transition flex justify-between items-center",
                  item.locked
                    ? "text-muted/50 cursor-not-allowed"
                    : isActive
                      ? "bg-accent text-carbon"
                      : "text-muted hover:bg-graphite hover:text-offwhite",
                ].join(" ")
              }
            >
              <span className="flex items-center gap-2">
                {item.label}
                {item.locked && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              {/* Badge solo en 'Aplicaciones' si hay count > 0 */}
              {item.label === "Aplicaciones" && !item.locked && pendingCount > 0 && (
                <span className="flex items-center justify-center min-w-[16px] h-4 px-1 rounded text-[9px] font-bold bg-accent-glow text-accent border border-accent">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Tier Badge */}
        {!isCompany && tier && (
          <div className="mx-3 mt-4 px-4 py-2 bg-graphite rounded-lg">
            <p className="text-[10px] text-muted uppercase tracking-wider">Tu plan</p>
            <p className="text-xs font-semibold text-offwhite">{tier}</p>
          </div>
        )}
      </div>

      {/* Footer usuario */}
      <div className="px-5 pt-4 border-t border-graphite">
        <p className="text-[11px] text-muted mb-1">Sesión iniciada</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-offwhite truncate max-w-[120px]">
              {userName}
            </p>
            <p className="text-[11px] text-muted truncate max-w-[120px]">
              {userRole}
            </p>
          </div>
          <button className="text-[11px] text-muted hover:text-offwhite transition">
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  );
}
