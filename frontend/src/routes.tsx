import { createBrowserRouter, Navigate } from "react-router-dom";
// 🟢 Importamos el componente de protección
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RootRedirect } from "./components/RootRedirect";
import { lazyImport } from "./utils/lazyWithRetry";
import ErrorPage from "./pages/shared/ErrorPage";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import RepLayout from "./layouts/RepLayout";
import CompanyLayout from "./layouts/CompanyLayout";
import TrainingLayout from "./layouts/TrainingLayout";

// Páginas compartidas
import HomePage from "./pages/shared/HomePage";
import NotFoundPage from "./pages/shared/NotFoundPage";

// Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// REP (comerciales)
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
        errorElement: <ErrorPage />,
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
        errorElement: <ErrorPage />,
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
        errorElement: <ErrorPage />,
        // El elemento de protección se ejecuta primero
        element: <ProtectedRoute allowedRoles={['REP', 'ADMIN']} />,
        children: [
            {
                // El Layout se carga solo si la protección pasa
                element: <RepLayout />,
                children: [
                    { path: "dashboard", element: <Navigate to="/rep/profile" replace /> },
                    { path: "profile", element: <RepProfilePage /> },
                    { path: "settings", element: <RepSettingsPage /> },
                    { path: "training", element: <RepTrainingPage /> },
                    // Redirige /rep/ a home para elegir sección
                    { index: true, element: <Navigate to="/home" replace /> },
                ],
            },
        ],
    },

    // 2.1. 🛡️ RUTAS DE MARKETPLACE (requieren acceso marketplace - T2+)
    {
        path: "/rep",
        errorElement: <ErrorPage />,
        element: <ProtectedRoute allowedRoles={['REP', 'ADMIN']} requireMarketplace />,
        children: [
            {
                element: <RepLayout />,
                children: [
                    { path: "offers", element: <RepOffersPage /> },
                    { path: "applications", element: <RepApplicationsPage /> },
                ],
            },
        ],
    },

    // 2.4. 🎓 ONBOARDING (selección ruta + formación para trial)
    {
        path: "/onboarding",
        errorElement: <ErrorPage />,
        element: <ProtectedRoute allowedRoles={['REP', 'ADMIN']} />,
        children: [
            {
                index: true,
                lazy: lazyImport(() => import("./pages/onboarding/OnboardingPage")),
            },
        ],
    },

    // 2.5. 🎓 TRAINING MODULE ROUTES (requiere T0+ - prueba incluye formación)
    {
        path: "/training",
        errorElement: <ErrorPage />,
        element: <ProtectedRoute allowedRoles={['REP', 'ADMIN']} requiredTier="T0" />,
        children: [
            {
                element: <TrainingLayout />,
                children: [
                    {
                        path: "routes",
                        lazy: lazyImport(() => import("./pages/training/RoutesPage")),
                    },
                    {
                        path: "routes/:routeId/formations",
                        lazy: lazyImport(() => import("./pages/training/FormationsPage")),
                    },
                    {
                        path: "formations/:formationId",
                        lazy: lazyImport(() => import("./pages/training/FormationDetailPage")),
                    },
                    {
                        path: "lessons/:lessonId",
                        lazy: lazyImport(() => import("./pages/training/LessonViewer")),
                    },
                    // Redirect /training to /training/routes
                    { index: true, element: <Navigate to="/training/routes" replace /> },
                ],
            },
        ],
    },

    // 2.6. 💳 SUBSCRIPTION ROUTES
    {
        path: "/upgrade",
        errorElement: <ErrorPage />,
        element: <ProtectedRoute allowedRoles={['REP', 'COMPANY', 'ADMIN']} />,
        children: [
            {
                index: true,
                lazy: lazyImport(() => import("./pages/subscription/UpgradePage")),
            },
        ],
    },
    {
        path: "/subscription/success",
        element: <ProtectedRoute allowedRoles={['REP', 'COMPANY', 'ADMIN']} />,
        children: [
            {
                index: true,
                lazy: lazyImport(() => import("./pages/subscription/SuccessPage")),
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