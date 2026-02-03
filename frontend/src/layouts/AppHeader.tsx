import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/ui/Avatar";

interface MenuItem {
    label: string;
    to: string;
}

// Menu definitions
const repMenu: MenuItem[] = [
    { label: "Inicio", to: "/home" },
    { label: "Dashboard", to: "/rep/dashboard" },
    { label: "Perfil", to: "/rep/profile" },
    { label: "Ofertas", to: "/rep/offers" },
    { label: "Aplicaciones", to: "/rep/applications" },
    { label: "Formación", to: "/rep/training" },
    { label: "Ajustes", to: "/rep/settings" },
];

const companyMenu: MenuItem[] = [
    { label: "Inicio", to: "/home" },
    { label: "Dashboard", to: "/company/dashboard" },
    { label: "Ofertas", to: "/company/jobs" },
    { label: "Aplicaciones", to: "/company/applications" },
    { label: "Ajustes", to: "/company/settings" },
];

// Items to hide
const PIDDEN_ITEMS = ["Dashboard", "Formación"];

export default function AppHeader() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isCompany = location.pathname.startsWith("/company");
    const fullMenu = isCompany ? companyMenu : repMenu;

    // Filter menu items
    const menu = fullMenu.filter((item) => !PIDDEN_ITEMS.includes(item.label));

    // State for mobile menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    const userFullName = user ? user.email.split('@')[0] : "Invitado";

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

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

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <header className="bg-panel border-b border-graphite sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo & Desktop Nav */}
                    <div className="flex items-center gap-8">
                        <div className="flex-shrink-0 flex items-center gap-3">
                            {/* CH Monogram */}
                            <div className="w-8 h-8 rounded-lg bg-offwhite text-carbon flex items-center justify-center text-sm font-display font-extrabold tracking-tight">
                                CH
                            </div>
                            {/* Logo Wordmark */}
                            <span className="font-display font-extrabold text-sm tracking-logo text-offwhite uppercase hidden sm:block">
                                Capital Hub
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-1">
                            {menu.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) =>
                                        [
                                            "px-3 py-2 text-[13px] font-medium rounded-lg transition flex items-center gap-2",
                                            isActive
                                                ? "bg-accent text-offwhite"
                                                : "text-muted hover:bg-graphite hover:text-offwhite",
                                        ].join(" ")
                                    }
                                >
                                    {item.label}
                                    {item.label === "Aplicaciones" && pendingCount > 0 && (
                                        <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded text-[9px] font-bold bg-accent text-offwhite">
                                            {pendingCount}
                                        </span>
                                    )}
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    {/* User & Mobile Menu Button */}
                    <div className="flex items-center gap-4">
                        {/* User Info (Desktop) */}
                        {user && (
                            <div className="hidden sm:flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium leading-none text-offwhite">{userFullName}</p>
                                    <p className="text-[11px] text-muted mt-1 leading-none">{user.role}</p>
                                </div>
                                <Avatar initials={userFullName.substring(0, 2).toUpperCase()} />
                                <button
                                    onClick={handleLogout}
                                    className="text-muted hover:text-red-400 transition p-1"
                                    title="Cerrar sesión"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-muted hover:text-offwhite hover:bg-graphite focus:outline-none"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMobileMenuOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-graphite bg-panel">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {menu.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    [
                                        "block px-3 py-2 rounded-lg text-base font-medium flex justify-between items-center",
                                        isActive
                                            ? "bg-accent text-offwhite"
                                            : "text-muted hover:bg-graphite hover:text-offwhite",
                                    ].join(" ")
                                }
                            >
                                <span>{item.label}</span>
                                {item.label === "Aplicaciones" && pendingCount > 0 && (
                                    <span className="bg-accent text-offwhite text-[10px] font-bold px-2 py-0.5 rounded">
                                        {pendingCount}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                        {/* Mobile Logout */}
                        <button
                            onClick={handleLogout}
                            className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:bg-red-900/30"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
