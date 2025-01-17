import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import { showToast } from "../api/toast";
import { useNavigate } from "react-router-dom";
import { addCategory } from "../api/category";
import { Category, Code, Description, ToggleOn } from "@mui/icons-material";
import Breadcrumb from "../components/common/Breadcrumb";

const statusOptions = ["Active", "Inactive"];

const AddCategory = () => {
    const [categoryData, setCategoryData] = useState({
        name: "",
        // code: "",
        description: "",
        isActive: true,
    });
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    // // Validation functions
    // const validateName = (name) => name.trim() !== "";
    // const validateCode = (code) => code.trim() !== "";
    // const validateDescription = (description) => description.trim() !== "";

    // Handle input changes with validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategoryData({ ...categoryData, [name]: value });

        // // Real-time validation
        // if (name === "name") {
        //     setValidationErrors((prev) => ({
        //         ...prev,
        //         name: validateName(value) ? "" : "Category name is required.",
        //     }));
        // } else if (name === "code") {
        //     setValidationErrors((prev) => ({
        //         ...prev,
        //         code: validateCode(value) ? "" : "Category code is required.",
        //     }));
        // } else if (name === "description") {
        //     setValidationErrors((prev) => ({
        //         ...prev,
        //         description: validateDescription(value)
        //             ? ""
        //             : "Description is required.",
        //     }));
        // }
    };

    // Handle input change for the status field
    const handleStatusChange = (e) => {
        const value = e.target.value;
        setCategoryData({ ...categoryData, isActive: value === "Active" });
    };

    const validateForm = () => {
        const errors = [];

        if (!categoryData.name.trim()) {
            errors.push("Category name is required");
        }
        if (!categoryData.description.trim()) {
            errors.push("Description is required");
        }

        if (errors.length > 0) {
            errors.forEach((error) => showToast(error, "error"));
            return false;
        }
        return true;
    };


    // Handle form submission with validation check
    const handleSubmit = async () => {
        if (!validateForm()) return;
        // const errors = {};
        // if (!validateName(categoryData.name)) errors.name = "Category name is required.";
        // if (!validateCode(categoryData.code)) errors.code = "Category code is required.";
        // if (!validateDescription(categoryData.description)) errors.description = "Description is required.";

        // if (Object.keys(errors).length > 0) {
        //     setValidationErrors(errors);
        //     showToast("Please fix the validation errors.", "error");
        //     return;
        // }

        try {
            setLoading(true);
            const response = await addCategory(categoryData);
            if (response.status === 201) {
                showToast("Category added successfully!", "success");
                navigate("/categories");
            } else {
                showToast(response.message || "Failed to add category. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error adding category:", error);
            showToast(error.response?.data?.message || "An error occurred. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Breadcrumb />
            <Typography variant="h5" sx={{ mb: "20px", textAlign: "center", fontWeight: 600 }}>
                Add New Category
            </Typography>
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    borderRadius: "10px",
                    maxWidth: "600px",
                    margin: "0 auto",
                    // backgroundColor: "#f9f9f9",
                }}
            >
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Category Name</InputLabel>
                    <TextField
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="name"
                        placeholder="Enter category name"
                        value={categoryData.name}
                        onChange={handleInputChange}
                        error={!!validationErrors.name}
                        helperText={validationErrors.name}
                        InputProps={{
                            startAdornment: <Category sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Description</InputLabel>
                    <TextField
                        variant="outlined"
                        fullWidth
                        size="small"
                        multiline
                        rows={3}
                        name="description"
                        placeholder="Enter category description"
                        value={categoryData.description}
                        onChange={handleInputChange}
                        error={!!validationErrors.description}
                        helperText={validationErrors.description}
                        InputProps={{
                            startAdornment: <Description sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Status</InputLabel>
                    <FormControl fullWidth size="small">
                        <Select
                            name="isActive"
                            value={categoryData.isActive ? "Active" : "Inactive"}
                            onChange={handleStatusChange}
                            startAdornment={<ToggleOn sx={{ color: "gray", mr: 1 }} />}
                        >
                            {statusOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
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
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                        }}
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add Category"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddCategory;
