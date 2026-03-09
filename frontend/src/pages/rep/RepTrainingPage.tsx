import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RepTrainingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/training/routes", { replace: true });
    }, [navigate]);

    return null;
}
