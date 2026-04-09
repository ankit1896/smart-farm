import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowRole }) {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) return null; // Or a loading spinner

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    // Role-based protection
    if (allowRole && user?.selectedRole !== allowRole) {
        return <Navigate to={user?.selectedRole === "farmer" ? "/farmer/dashboard" : "/home"} />;
    }

    return children;
}