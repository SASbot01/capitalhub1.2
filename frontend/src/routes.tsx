import { createBrowserRouter, Navigate } from "react-router-dom";
// 🟢 Importamos el componente de protección
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RootRedirect } from "./components/RootRedirect";

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
            // Ruta raíz: Redirige inteligente
            {
                index: true,
                element: <RootRedirect />,
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

    // 1.5. 🏠 HOME PAGE (Protected - after login)
    {
        path: "/home",
        element: <ProtectedRoute allowedRoles={['REP', 'COMPANY', 'ADMIN']} />,
        children: [
            {
                index: true,
                element: <HomePage />,
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
                    { path: "dashboard", element: <RepDashboardPage /> },
                    { path: "profile", element: <RepProfilePage /> },
                    { path: "applications", element: <RepApplicationsPage /> },
                    { path: "offers", element: <RepOffersPage /> },
                    { path: "training", element: <RepTrainingPage /> },
                    { path: "settings", element: <RepSettingsPage /> },
                    // Redirige /rep/ a home para elegir sección
                    { index: true, element: <Navigate to="/home" replace /> },
                ],
            },
        ],
    },

    // 2.5. 🎓 TRAINING MODULE ROUTES (Public for demo)
    {
        path: "/training",
        children: [
            {
                path: "routes",
                lazy: () => import("./pages/training/RoutesPage").then(m => ({ Component: m.default })),
            },
            {
                path: "routes/:routeId/formations",
                lazy: () => import("./pages/training/FormationsPage").then(m => ({ Component: m.default })),
            },
            {
                path: "formations/:formationId",
                lazy: () => import("./pages/training/FormationDetailPage").then(m => ({ Component: m.default })),
            },
            {
                path: "lessons/:lessonId",
                lazy: () => import("./pages/training/LessonViewer").then(m => ({ Component: m.default })),
            },
            // Redirect /training to /training/routes
            { index: true, element: <Navigate to="/training/routes" replace /> },
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
                    { path: "dashboard", element: <CompanyDashboardPage /> },
                    { path: "jobs", element: <CompanyJobsPage /> },
                    { path: "applications", element: <CompanyApplicationsPage /> },
                    { path: "jobs/:jobId/applications", element: <CompanyJobApplicationsPage /> }, // Ruta detallada
                    { path: "reps/:repId", element: <CompanyRepProfilePage /> }, // Perfil del Rep
                    { path: "settings", element: <CompanySettingsPage /> },
                    // Redirige /company/ a home para elegir sección
                    { index: true, element: <Navigate to="/home" replace /> },
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