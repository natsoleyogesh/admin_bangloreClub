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
import { addRestaurant } from "../../../api/masterData/restaurant"; // Adjust the import to point to the correct API for restaurant
import { showToast } from "../../../api/toast";
import Breadcrumb from "../../../components/common/Breadcrumb";

const statusOptions = ["active", "inactive"]; // Restaurant status options

const AddRestaurant = () => {
    const [restaurantData, setRestaurantData] = useState({
        name: "",
        status: "active",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRestaurantData((prev) => ({ ...prev, [name]: value }));
        // validateField(name, value);
    };

    // Validation logic for individual fields
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        // Restaurant Name validation
        if (name === "name" && !value.trim()) {
            newErrors.name = "Restaurant Name is required.";
        } else {
            delete newErrors.name;
        }

        setErrors(newErrors);
    };

    // Validate the entire form before submission
    // const validateForm = () => {
    //     const validationErrors = {};

    //     if (!restaurantData.name) validationErrors.name = "Restaurant Name is required.";

    //     setErrors(validationErrors);
    //     return Object.keys(validationErrors).length === 0;
    // };

    const validateForm = () => {
        const errors = [];

        if (!restaurantData.name.trim()) {
            errors.push("Restaurant Name is required.");
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
            const response = await addRestaurant(restaurantData); // API call for restaurant creation
            if (response.status === 201) {
                showToast("Restaurant added successfully!", "success");
                navigate("/restaurants"); // Redirect after successful creation
            } else {
                showToast(response.message || "Failed to add restaurant. Please try again.", "error");
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
                Add New Restaurant
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
                {/* Restaurant Name */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Restaurant Name</InputLabel>
                    <TextField
                        placeholder="Enter Restaurant Name"
                        fullWidth
                        name="name"
                        value={restaurantData.name}
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
                            value={restaurantData.status}
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
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add Restaurant"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddRestaurant;
