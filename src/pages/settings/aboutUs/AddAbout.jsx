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
// import { Description } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import { showToast } from "../../../api/toast";
// import Breadcrumb from "../../../components/common/Breadcrumb";
// import { postRequest } from "../../../api/commonAPI";

// const statusOptions = ["Active", "Inactive"]; // Status options for designation

// const AddAboutUs = () => {
//     const [aboutData, setAboutData] = useState({
//         title: "",
//         status: "Active",
//     });
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const navigate = useNavigate();

//     // Handle input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setAboutData((prev) => ({ ...prev, [name]: value }));
//         validateField(name, value);
//     };

//     // Validate individual fields
//     const validateField = (name, value) => {
//         const newErrors = { ...errors };

//         if (name === "title" && !value.trim()) {
//             newErrors.designationName = "title  is required.";
//         } else {
//             delete newErrors.designationName;
//         }

//         setErrors(newErrors);
//     };

//     // Validate the entire form
//     const validateForm = () => {
//         const newErrors = {};

//         if (!designationData.designationName.trim()) {
//             newErrors.designationName = "Designation Name is required.";
//         }

//         setErrors(newErrors);

//         return Object.keys(newErrors).length === 0;
//     };

//     // Handle form submission
//     const handleSubmit = async () => {
//         if (!validateForm()) return;

//         setLoading(true);

//         try {
//             const response = await postRequest("/designation", designationData);
//             if (response.status === 201) {
//                 showToast("Designation added successfully!", "success");
//                 navigate("/designations"); // Redirect to designations list
//             } else {
//                 showToast(response.message || "Failed to add designation. Please try again.", "error");
//             }
//         } catch (error) {
//             showToast(
//                 error.response?.data?.message || "An error occurred. Please try again.",
//                 "error"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
//             <Breadcrumb />
//             <Typography
//                 variant="h5"
//                 sx={{ mb: "20px", textAlign: "center", fontWeight: 600 }}
//             >
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
//                 {/* Designation Name */}
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>
//                         Designation Name
//                     </InputLabel>
//                     <TextField
//                         placeholder="Enter Designation Name"
//                         fullWidth
//                         name="designationName"
//                         value={designationData.designationName}
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
//                             value={designationData.status}
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
//                         {loading ? <CircularProgress size={20} color="inherit" /> : "Add About Us"}
//                     </Button>
//                 </Box>
//             </Paper>
//         </Box>
//     );
// };

// export default AddAboutUs;


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
import ReactQuill from "react-quill";

const statusOptions = ["Active", "Inactive"]; // Status options for About Us

const AddAboutUs = () => {
    const [aboutData, setAboutData] = useState({
        title: "",
        description: "",
        status: "Active",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAboutData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    // Validate individual fields
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        if (name === "title" && !value.trim()) {
            newErrors.title = "Title is required.";
        } else {
            delete newErrors.title;
        }

        setErrors(newErrors);
    };

    // Validate the entire form
    const validateForm = () => {
        const newErrors = {};

        if (!aboutData.title.trim()) {
            newErrors.title = "Title is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await postRequest("/about", aboutData);
            if (response.status === 201) {
                showToast("About Us entry added successfully!", "success");
                navigate("/aboutUs"); // Redirect to About Us list
            } else {
                showToast(response.message || "Failed to add entry. Please try again.", "error");
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

    const handleDescriptionChange = (value) => {
        setAboutData({ ...aboutData, description: value });
    };

    return (
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Breadcrumb />
            <Typography
                variant="h5"
                sx={{ mb: "20px", textAlign: "center", fontWeight: 600 }}
            >
                Add New About Us
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
                {/* Title Field */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Title</InputLabel>
                    <TextField
                        placeholder="Enter Title"
                        fullWidth
                        name="title"
                        value={aboutData.title}
                        onChange={handleInputChange}
                        error={!!errors.title}
                        helperText={errors.title}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Description />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Description</InputLabel>
                    <ReactQuill
                        value={aboutData.description}
                        onChange={handleDescriptionChange}
                        placeholder="Describe the offer"
                        style={{
                            height: "100px",
                            // border: "1px solid #ccc",
                            borderRadius: "8px",
                            marginBottom: "100px"
                        }}
                    />
                </Box>

                {/* Status Field */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Status</InputLabel>
                    <FormControl fullWidth>
                        <Select
                            name="status"
                            value={aboutData.status}
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
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add About Us"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddAboutUs;
