import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import Avatar from "../components/ui/Avatar";

interface MenuItem {
    label: string;
    to: string;
    locked?: boolean;
}

export default function AppHeader() {
    const { user, role, logout } = useAuth();
    const { hasMarketplaceAccess, coinBalance } = useSubscription();
    const navigate = useNavigate();
    const location = useLocation();
    const isCompany = role === "COMPANY";

    const repMenu: MenuItem[] = [
        { label: "Inicio", to: "/home" },
        { label: "Perfil", to: "/rep/profile" },
        { label: "Ofertas", to: "/rep/offers", locked: !hasMarketplaceAccess },
        { label: "Aplicaciones", to: "/rep/applications", locked: !hasMarketplaceAccess },
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
                                    to={item.locked ? "/upgrade" : item.to}
                                    className={({ isActive }) =>
                                        [
                                            "px-3 py-2 text-[13px] font-medium rounded-lg transition flex items-center gap-1.5",
                                            item.locked
                                                ? "text-muted/50"
                                                : isActive
                                                    ? "bg-accent text-carbon"
                                                    : "text-muted hover:bg-graphite hover:text-offwhite",
                                        ].join(" ")
                                    }
                                >
                                    {item.label}
                                    {item.locked && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {item.label === "Aplicaciones" && !item.locked && pendingCount > 0 && (
                                        <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded text-[9px] font-bold bg-accent text-carbon">
                                            {pendingCount}
                                        </span>
                                    )}
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    {/* User & Mobile Menu Button */}
                    <div className="flex items-center gap-4">
                        {/* Coin Balance (Desktop) */}
                        {user && !isCompany && (
                            <div className="hidden sm:flex items-center gap-1.5 bg-graphite px-3 py-1.5 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="12" cy="12" r="10" />
                                    <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#1a1a1a" fontWeight="bold">C</text>
                                </svg>
                                <span className="text-sm font-bold text-offwhite">{coinBalance}</span>
                            </div>
                        )}

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
                                to={item.locked ? "/upgrade" : item.to}
                                className={({ isActive }) =>
                                    [
                                        "block px-3 py-2 rounded-lg text-base font-medium flex justify-between items-center",
                                        item.locked
                                            ? "text-muted/50"
                                            : isActive
                                                ? "bg-accent text-carbon"
                                                : "text-muted hover:bg-graphite hover:text-offwhite",
                                    ].join(" ")
                                }
                            >
                                <span className="flex items-center gap-2">
                                    {item.label}
                                    {item.locked && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </span>
                                {item.label === "Aplicaciones" && !item.locked && pendingCount > 0 && (
                                    <span className="bg-accent text-carbon text-[10px] font-bold px-2 py-0.5 rounded">
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
