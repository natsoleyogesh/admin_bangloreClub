// import React, { useState } from "react";
// import {
//     Box,
//     Button,
//     CircularProgress,
//     FormControl,
//     InputAdornment,
//     InputLabel,
//     MenuItem,
//     Paper,
//     Select,
//     TextField,
//     Typography,
// } from "@mui/material";
// import { Description, Email } from "@mui/icons-material"; // Optional for icons if necessary
// import { useNavigate } from "react-router-dom";
// import { addDepartment } from "../../../api/masterData/department";
// import { showToast } from "../../../api/toast";
// import Breadcrumb from "../../../components/common/Breadcrumb";
// import { postRequest } from "../../../api/commonAPI";

// const statusOptions = ["active", "inactive"]; // Department status options

// const AddDesignation = () => {
//     const [departmentData, setDepartmentData] = useState({
//         designationName: "",
//         status: "active",
//     });
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const navigate = useNavigate();

//     // Handle input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setDepartmentData((prev) => ({ ...prev, [name]: value }));
//         // validateField(name, value);
//     };

//     // Validation logic for individual fields
//     const validateField = (name, value) => {
//         const newErrors = { ...errors };

//         // Department Name validation
//         if (name === "designationName" && !value.trim()) {
//             newErrors.designationName = "Department Name is required.";
//         } else {
//             delete newErrors.designationName;
//         }

//         setErrors(newErrors);
//     };



//     const validateForm = () => {
//         const errors = [];

//         // Validate department name
//         if (!departmentData.designationName.trim()) {
//             errors.push("Department Name is required.");
//         }

//         // Show errors if any
//         if (errors.length > 0) {
//             errors.forEach((error) => showToast(error, "error"));
//             return false;
//         }

//         return true; // Form is valid
//     };


//     // Handle form submission
//     const handleSubmit = async () => {
//         if (!validateForm()) return;

//         setLoading(true);

//         try {
//             const response = await postRequest("designation", departmentData); // Replace with your actual API call
//             if (response.status === 201) {
//                 showToast("Department added successfully!", "success");
//                 navigate("/departments"); // Redirect after successful creation
//             } else {
//                 showToast(response.message || "Failed to add department. Please try again.", "error");
//             }
//         } catch (error) {
//             showToast(error.response?.data?.message || "An error occurred. Please try again.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
//             <Breadcrumb />
//             <Typography variant="h5" sx={{ mb: "20px", textAlign: "center", fontWeight: 600 }}>
//                 Add New Designation
//             </Typography>
//             <Paper
//                 elevation={3}
//                 sx={{
//                     p: 4,
//                     borderRadius: "10px",
//                     maxWidth: "600px",
//                     margin: "0 auto",
//                 }}
//             >
//                 {/* Department Name */}
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Designation Name</InputLabel>
//                     <TextField
//                         placeholder="Enter Department Name"
//                         fullWidth
//                         name="designationName"
//                         value={departmentData.designationName}
//                         onChange={handleInputChange}
//                         error={!!errors.designationName}
//                         helperText={errors.designationName}
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <Description />
//                                 </InputAdornment>
//                             ),
//                         }}
//                     />
//                 </Box>
//                 {/* Status */}
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Status</InputLabel>
//                     <FormControl fullWidth>
//                         <Select
//                             name="status"
//                             value={departmentData.status}
//                             onChange={handleInputChange}
//                         >
//                             {statusOptions.map((option) => (
//                                 <MenuItem key={option} value={option}>
//                                     {option}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Box>

//                 {/* Submit Button */}
//                 <Box sx={{ display: "flex", justifyContent: "center", mt: "20px" }}>
//                     <Button
//                         type="submit"
//                         variant="contained"
//                         color="primary"
//                         sx={{
//                             borderRadius: "10px",
//                             px: 4,
//                             py: 1,
//                             fontWeight: "bold",
//                         }}
//                         disabled={loading}
//                         onClick={handleSubmit}
//                     >
//                         {loading ? <CircularProgress size={20} color="inherit" /> : "Add Department"}
//                     </Button>
//                 </Box>
//             </Paper>
//         </Box>
//     );
// };

// export default AddDepartment;

import React, { useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { Description } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../api/toast";
import Breadcrumb from "../../../components/common/Breadcrumb";
import { postRequest } from "../../../api/commonAPI";

const statusOptions = ["active", "inactive"]; // Status options for designation

const AddDesignation = () => {
    const [designationData, setDesignationData] = useState({
        designationName: "",
        status: "active",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDesignationData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    // Validate individual fields
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        if (name === "designationName" && !value.trim()) {
            newErrors.designationName = "Designation Name is required.";
        } else {
            delete newErrors.designationName;
        }

        setErrors(newErrors);
    };

    // Validate the entire form
    const validateForm = () => {
        const newErrors = {};

        if (!designationData.designationName.trim()) {
            newErrors.designationName = "Designation Name is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await postRequest("/designation", designationData);
            if (response.status === 201) {
                showToast("Designation added successfully!", "success");
                navigate("/designations"); // Redirect to designations list
            } else {
                showToast(response.message || "Failed to add designation. Please try again.", "error");
            }
        } catch (error) {
            showToast(
                error.response?.data?.message || "An error occurred. Please try again.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Breadcrumb />
            <Typography
                variant="h5"
                sx={{ mb: "20px", textAlign: "center", fontWeight: 600 }}
            >
                Add New Designation
            </Typography>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: "10px",
                    maxWidth: "600px",
                    margin: "0 auto",
                }}
            >
                {/* Designation Name */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>
                        Designation Name
                    </InputLabel>
                    <TextField
                        placeholder="Enter Designation Name"
                        fullWidth
                        name="designationName"
                        value={designationData.designationName}
                        onChange={handleInputChange}
                        error={!!errors.designationName}
                        helperText={errors.designationName}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Description />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Status */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Status</InputLabel>
                    <FormControl fullWidth>
                        <Select
                            name="status"
                            value={designationData.status}
                            onChange={handleInputChange}
                        >
                            {statusOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Submit Button */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: "20px" }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                            borderRadius: "10px",
                            px: 4,
                            py: 1,
                            fontWeight: "bold",
                        }}
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add Designation"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddDesignation;

