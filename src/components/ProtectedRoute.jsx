// // src/components/ProtectedRoute.jsx

// import React from "react";
// import { Navigate } from "react-router-dom";
// import axios from "axios";

// const ProtectedRoute = ({ children }) => {
//     const token = localStorage.getItem("token") || sessionStorage.getItem("token");
//     if (token) {
//         axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     }
//     if (!token) {
//         return <Navigate to="/login" />;
//     }

//     return children;
// };

// export default ProtectedRoute;


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();

    // Get token and role from storage
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const role = localStorage.getItem("role") || sessionStorage.getItem("role");

    // Set Axios Authorization header
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    useEffect(() => {
        // Redirect based on role
        if (!token) {
            navigate("/login");
        } else if (role === "gatekeeper") {
            // navigate("/gatekeeper/qrScanner");
            // navigate("/gatekeeper/events");

        }
    }, [navigate, token, role]);

    // Render children only for non-gatekeeper roles
    // if (role === "gatekeeper") return null; // Avoid rendering children for gatekeeper role

    return children;
};

export default ProtectedRoute;
