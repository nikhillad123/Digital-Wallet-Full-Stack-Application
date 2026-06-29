import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const rawUser = localStorage.getItem("user");

    console.log("Raw:", rawUser);

    const user = rawUser ? JSON.parse(rawUser) : null;

    console.log("Parsed:", user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;