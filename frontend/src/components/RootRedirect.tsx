import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const RootRedirect = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    return <Navigate to="/login" replace />;
};
