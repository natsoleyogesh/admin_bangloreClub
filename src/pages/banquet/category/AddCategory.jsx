import React, { useState } from "react";
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
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import { Category, Description, ToggleOn } from "@mui/icons-material";
import { addBanquetCategory } from "../../../api/banquet";
import { showToast } from "../../../api/toast";
import Breadcrumb from "../../../components/common/Breadcrumb";

const statusOptions = ["Active", "Inactive"];

const AddCategory = () => {
    const [categoryData, setCategoryData] = useState({
        name: "",
        description: "",
        status: "Active",
    });
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    // Validation functions
    const validateName = (name) => name.trim() !== "";
    const validateDescription = (description) => description.trim() !== "";

    // Handle input changes with validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategoryData((prev) => ({ ...prev, [name]: value }));

        // Real-time validation
        if (name === "name") {
            setValidationErrors((prev) => ({
                ...prev,
                name: validateName(value) ? "" : "Category name is required.",
            }));
        }
    };

    const handleDescriptionChange = (value) => {
        setCategoryData((prev) => ({ ...prev, description: value }));

        // Real-time validation
        setValidationErrors((prev) => ({
            ...prev,
            description: validateDescription(value) ? "" : "Description is required.",
        }));
    };

    // Handle form submission with validation check
    const handleSubmit = async () => {
        const errors = {};
        if (!validateName(categoryData.name)) errors.name = "Category name is required.";
        if (!validateDescription(categoryData.description)) errors.description = "Description is required.";

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            showToast("Please fix the validation errors.", "error");
            return;
        }

        try {
            setLoading(true);
            const response = await addBanquetCategory(categoryData);

            if (response.status === 201) {
                showToast("Category added successfully!", "success");
                navigate("/banquet-categories");
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
            <Typography
                variant="h5"
                sx={{
                    mb: "20px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "primary.main",
                }}
            >
                Add New Banquet Category
            </Typography>
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: "12px",
                    maxWidth: "600px",
                    margin: "0 auto",
                    backgroundColor: "#f9f9f9",
                }}
            >
                {/* Category Name Field */}
                <Box sx={{ mb: 3 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: 1 }}>Category Name</InputLabel>
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

                {/* Description Field */}
                <Box sx={{ mb: 3 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: 1 }}>Description</InputLabel>
                    <ReactQuill
                        value={categoryData.description}
                        onChange={handleDescriptionChange}
                        placeholder="Describe the Category"
                        style={{
                            height: "120px",
                            borderRadius: "8px",
                        }}
                    />
                    {validationErrors.description && (
                        <Typography color="error" variant="caption">
                            {validationErrors.description}
                        </Typography>
                    )}
                </Box>

                {/* Status Field */}
                <Box sx={{ mb: 3 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: 1 }}>Status</InputLabel>
                    <FormControl fullWidth size="small">
                        <Select
                            name="status"
                            value={categoryData.status}
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
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                            borderRadius: "10px",
                            px: 4,
                            py: 1.5,
                            fontWeight: "bold",
                        }}
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            "Add Category"
                        )}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddCategory;

