import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

function ProtectedAdminRoute({ children }) {
    const user = getCurrentUser();

    console.log("ProtectedAdminRoute user:", user);

    if (!user) {
        console.log("Redirecting to login");
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "admin") {
        console.log("Redirecting to dashboard");
        return <Navigate to="/dashboard" replace />;
    }

    console.log("Rendering admin page");
    return children;
}

export default ProtectedAdminRoute;