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
import { Description, Email } from "@mui/icons-material"; // Optional for icons if necessary
import { useNavigate } from "react-router-dom";
import { addDepartment } from "../../../api/masterData/department";
import { showToast } from "../../../api/toast";
import Breadcrumb from "../../../components/common/Breadcrumb";

const statusOptions = ["active", "inactive"]; // Department status options

const AddDepartment = () => {
    const [departmentData, setDepartmentData] = useState({
        departmentName: "",
        status: "active",
        email: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDepartmentData((prev) => ({ ...prev, [name]: value }));
        // validateField(name, value);
    };

    // Validation logic for individual fields
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        // Department Name validation
        if (name === "departmentName" && !value.trim()) {
            newErrors.departmentName = "Department Name is required.";
        } else {
            delete newErrors.departmentName;
        }

        setErrors(newErrors);
    };

    // Validate the entire form before submission
    // const validateForm = () => {
    //     const validationErrors = {};

    //     if (!departmentData.departmentName) validationErrors.departmentName = "Department Name is required.";

    //     setErrors(validationErrors);
    //     return Object.keys(validationErrors).length === 0;
    // };
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        const errors = [];

        // Validate department name
        if (!departmentData.departmentName.trim()) {
            errors.push("Department Name is required.");
        }

        // Validate email
        if (!validateEmail(departmentData.email)) {
            errors.push("Invalid email address.");
        }

        // Show errors if any
        if (errors.length > 0) {
            errors.forEach((error) => showToast(error, "error"));
            return false;
        }

        return true; // Form is valid
    };


    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await addDepartment(departmentData); // Replace with your actual API call
            if (response.status === 201) {
                showToast("Department added successfully!", "success");
                navigate("/departments"); // Redirect after successful creation
            } else {
                showToast(response.message || "Failed to add department. Please try again.", "error");
            }
        } catch (error) {
            showToast(error.response?.data?.message || "An error occurred. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Breadcrumb />
            <Typography variant="h5" sx={{ mb: "20px", textAlign: "center", fontWeight: 600 }}>
                Add New Department
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
                {/* Department Name */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Department Name</InputLabel>
                    <TextField
                        placeholder="Enter Department Name"
                        fullWidth
                        name="departmentName"
                        value={departmentData.departmentName}
                        onChange={handleInputChange}
                        error={!!errors.departmentName}
                        helperText={errors.departmentName}
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
                    <InputLabel sx={{ fontWeight: "bold" }}>Email Address</InputLabel>
                    <TextField
                        placeholder="Enter email address"
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="email"
                        value={departmentData.email}
                        onChange={handleInputChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        // required
                        sx={{ marginTop: "4px" }}
                        InputProps={{ startAdornment: <Email sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>

                {/* Status */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Status</InputLabel>
                    <FormControl fullWidth>
                        <Select
                            name="status"
                            value={departmentData.status}
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
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add Department"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddDepartment;
