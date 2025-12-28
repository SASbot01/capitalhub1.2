import { createBrowserRouter, Navigate } from "react-router-dom";
// 🟢 Importamos el componente de protección
import { ProtectedRoute } from "./components/ProtectedRoute";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import RepLayout from "./layouts/RepLayout";
import CompanyLayout from "./layouts/CompanyLayout";

// Páginas compartidas
import HomePage from "./pages/shared/HomePage";
import NotFoundPage from "./pages/shared/NotFoundPage";

// Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// REP (comerciales)
import RepDashboardPage from "./pages/rep/RepDashboardPage";
import RepProfilePage from "./pages/rep/RepProfilePage";
import RepApplicationsPage from "./pages/rep/RepApplicationsPage";
import RepOffersPage from "./pages/rep/RepOffersPage";
import RepTrainingPage from "./pages/rep/RepTrainingPage";
import RepSettingsPage from "./pages/rep/RepSettingsPage";

// COMPANY (empresas)
import CompanyDashboardPage from "./pages/company/CompanyDashboardPage";
import CompanyJobsPage from "./pages/company/CompanyJobsPage";
import CompanyApplicationsPage from "./pages/company/CompanyApplicationsPage";
import CompanySettingsPage from "./pages/company/CompanySettingsPage";
// ✅ Asumiendo que también necesitas una vista de aplicaciones por trabajo
import CompanyJobApplicationsPage from "./pages/company/CompanyJobApplicationsPage";
import CompanyRepProfilePage from "./pages/company/CompanyRepProfilePage";

// 🟢 Exportamos el objeto router final
export const router = createBrowserRouter([
    // 1. Rutas Públicas/Auth
    {
        path: "/", // Add path for top-level Auth route
        element: <AuthLayout />,
        children: [
            // Ruta raíz que redirige al login
            {
                index: true,
                element: <Navigate to="/login" replace />,
            },
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "register",
                element: <RegisterPage />,
            },
        ],
    },

    // 2. 🛡️ RUTAS PROTEGIDAS DE REP
    {
        path: "/rep",
        // El elemento de protección se ejecuta primero
        element: <ProtectedRoute allowedRoles={['REP', 'ADMIN']} />,
        children: [
            {
                // El Layout se carga solo si la protección pasa
                element: <RepLayout />,
                children: [
                    { path: "home", element: <HomePage userType="rep" /> },
                    { path: "dashboard", element: <RepDashboardPage /> },
                    { path: "profile", element: <RepProfilePage /> },
                    { path: "applications", element: <RepApplicationsPage /> },
                    { path: "offers", element: <RepOffersPage /> },
                    { path: "training", element: <RepTrainingPage /> },
                    { path: "settings", element: <RepSettingsPage /> },
                    // Redirige /rep/ al dashboard
                    { index: true, element: <Navigate to="/rep/dashboard" replace /> },
                ],
            },
        ],
    },

    // 3. 🛡️ RUTAS PROTEGIDAS DE COMPANY
    {
        path: "/company",
        // El elemento de protección se ejecuta primero
        element: <ProtectedRoute allowedRoles={['COMPANY', 'ADMIN']} />,
        children: [
            {
                // El Layout se carga solo si la protección pasa
                element: <CompanyLayout />,
                children: [
                    { path: "home", element: <HomePage userType="company" /> },
                    { path: "dashboard", element: <CompanyDashboardPage /> },
                    { path: "jobs", element: <CompanyJobsPage /> },
                    { path: "applications", element: <CompanyApplicationsPage /> },
                    { path: "jobs/:jobId/applications", element: <CompanyJobApplicationsPage /> }, // Ruta detallada
                    { path: "reps/:repId", element: <CompanyRepProfilePage /> }, // Perfil del Rep
                    { path: "settings", element: <CompanySettingsPage /> },
                    // Redirige /company/ al dashboard
                    { index: true, element: <Navigate to="/company/dashboard" replace /> },
                ],
            },
        ],
    },

    // 4. Fallback (404)
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);