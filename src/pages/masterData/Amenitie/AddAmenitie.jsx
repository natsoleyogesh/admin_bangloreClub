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
import { Description } from "@mui/icons-material"; // Optional for icons if necessary
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../api/toast";
import { addAmenitie } from "../../../api/masterData/amenities";
import Breadcrumb from "../../../components/common/Breadcrumb";

const statusOptions = ["active", "inactive"]; // Tax type status options

const AddAmenitie = () => {
    const [taxTypeData, setTaxTypeData] = useState({
        name: "",
        status: "active",
        icon: null, // To hold the selected icon file
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [iconPreview, setIconPreview] = useState(null); // State to show icon preview
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTaxTypeData((prev) => ({ ...prev, [name]: value }));
        // validateField(name, value);
    };

    // Handle file input change (SVG icon upload)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "image/svg+xml") {
            setTaxTypeData((prev) => ({ ...prev, icon: file }));
            setIconPreview(URL.createObjectURL(file)); // Set the icon preview
        } else {
            showToast("Please select a valid SVG file.", "error");
        }
    };

    // Validation logic for individual fields
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        // Tax Type Name validation
        if (name === "name" && !value.trim()) {
            newErrors.name = "Tax Type Name is required.";
        } else {
            delete newErrors.name;
        }

        setErrors(newErrors);
    };

    const validateForm = () => {
        const errors = [];

        if (!taxTypeData.name.trim()) {
            errors.push("Amenity Name is required.");
        }

        if (!taxTypeData.icon) {
            errors.push("Please select a valid SVG file.");
        }


        if (errors.length > 0) {
            errors.forEach((error) => showToast(error, "error"));
            return false;
        }
        return true;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", taxTypeData.name);
            formData.append("status", taxTypeData.status);
            if (taxTypeData.icon) formData.append("icon", taxTypeData.icon); // Append the icon if selected

            const response = await addAmenitie(formData); // API call for amenity creation
            if (response.status === 201) {
                showToast("Amenity added successfully!", "success");
                navigate("/amenities"); // Redirect after successful creation
            } else {
                showToast(response.message || "Failed to add amenity. Please try again.", "error");
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
                Add New Amenity
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
                {/* Amenity Name */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Amenity Name</InputLabel>
                    <TextField
                        placeholder="Enter Amenity Name"
                        fullWidth
                        name="name"
                        value={taxTypeData.name}
                        onChange={handleInputChange}
                        error={!!errors.name}
                        helperText={errors.name}
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
                            value={taxTypeData.status}
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

                {/* Icon Upload */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Icon (SVG Only)</InputLabel>
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ textAlign: "center", padding: "12px", fontWeight: "bold" }}
                    >
                        Upload SVG Icon
                        <input
                            type="file"
                            accept="image/svg+xml"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                    {iconPreview && (
                        <Box sx={{ mt: 2, textAlign: "center" }}>
                            <img src={iconPreview} alt="Icon Preview" style={{ width: "50px", height: "50px", objectFit: "contain" }} />
                        </Box>
                    )}
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
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add Amenity"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddAmenitie;
