import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Rutas", to: "/admin/routes" },
  ];

  return (
    <div className="min-h-screen bg-carbon flex flex-col">
      {/* Header */}
      <header className="bg-panel border-b border-graphite sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent text-carbon flex items-center justify-center text-sm font-display font-extrabold tracking-tight">
                  CH
                </div>
                <div>
                  <span className="font-display font-extrabold text-sm tracking-logo text-offwhite uppercase">
                    Capital Hub
                  </span>
                  <span className="ml-2 text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold uppercase">
                    Admin
                  </span>
                </div>
              </div>
              <nav className="hidden md:flex space-x-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        "px-3 py-2 text-[13px] font-medium rounded-lg transition",
                        isActive
                          ? "bg-accent text-carbon"
                          : "text-muted hover:bg-graphite hover:text-offwhite",
                      ].join(" ")
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <NavLink
                to="/home"
                className="text-[13px] text-muted hover:text-offwhite transition"
              >
                Ir a la app
              </NavLink>
              <span className="text-sm text-muted">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-muted hover:text-red-400 transition text-sm"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-8 sm:px-6">
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
