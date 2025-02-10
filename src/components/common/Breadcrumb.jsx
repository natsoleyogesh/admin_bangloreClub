// import React from "react";
// import { Box, Button, Typography, Breadcrumbs, Link } from "@mui/material";
// import { useNavigate, useLocation } from "react-router-dom";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// const Breadcrumb = ({ onBack }) => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     const pathSegments = location.pathname.split("/").filter((segment) => segment);

//     const breadcrumbRoutes = pathSegments.map((segment, index) => ({
//         label: segment.charAt(0).toUpperCase() + segment.slice(1),
//         path: `/${pathSegments.slice(0, index + 1).join("/")}`,
//     }));

//     return (
//         <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//             <Button
//                 variant="outlined"
//                 startIcon={<ArrowBackIcon />}
//                 onClick={() => navigate(-1)}
//                 sx={{ mr: 2 }}
//             >
//                 Go Back
//             </Button>

//             <Breadcrumbs aria-label="breadcrumb">
//                 {breadcrumbRoutes.map((route, index) => (
//                     <Link
//                         key={index}
//                         underline="hover"
//                         color={index === breadcrumbRoutes.length - 1 ? "text.primary" : "inherit"}
//                         onClick={() => navigate(route.path)}
//                         sx={{ cursor: route.path ? "pointer" : "default" }}
//                     >
//                         {route.label}
//                     </Link>
//                 ))}
//             </Breadcrumbs>
//         </Box>
//     );
// };


// export default Breadcrumb;


import React from "react";
import { Box, Button, Breadcrumbs, Link } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Breadcrumb = ({ onBack }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Split and process the path segments for breadcrumbs
    const pathSegments = location.pathname.split("/").filter((segment) => segment);
    const breadcrumbRoutes = pathSegments.map((segment, index) => ({
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "), // Capitalize and replace dashes with spaces
        path: `/${pathSegments.slice(0, index + 1).join("/")}`,
    }));

    if (pathSegments.includes("login") || pathSegments.includes("signup")) {
        return null; // Do not render breadcrumbs
    }
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#f8f9fa",
                padding: "5px 10px",
                borderRadius: "20px",
                boxShadow: "0 1px 4px rgba(61, 56, 56, 0.1)",
                mb: 3,
            }}
        >
            {/* Back Button */}
            <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={onBack || (() => navigate(-1))}
                sx={{
                    textTransform: "none",
                    backgroundColor: "#007bff",
                    borderRadius: "20px",
                    color: "#fff",
                    "&:hover": {
                        backgroundColor: "#0056b3",
                    },
                }}
            >
                Go Back
            </Button>

            {/* Breadcrumb Links */}
            <Breadcrumbs
                aria-label="breadcrumb"
                separator="›"
                sx={{
                    fontSize: "0.875rem",
                    "& a": {
                        textDecoration: "none",
                        color: "#e74c3c",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    },
                    "& .MuiTypography-root": {
                        color: "#e74c3c",
                        fontWeight: "bold",
                    },
                }}
            >
                {breadcrumbRoutes.map((route, index) => (
                    <Link
                        key={index}
                        // onClick={() => route.path && navigate(route.path)}
                        sx={{
                            cursor: route.path ? "pointer" : "default",
                            color: index === breadcrumbRoutes.length - 1 ? "green" : "green",
                            fontWeight: index === breadcrumbRoutes.length - 1 ? "bold" : "normal",
                        }}
                    >
                        {route.label}
                    </Link>
                ))}
            </Breadcrumbs>
        </Box>
    );
};

export default Breadcrumb;
