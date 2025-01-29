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
import { addRestaurant } from "../../../api/masterData/restaurant"; // Adjust the API path
import { showToast } from "../../../api/toast";
import Breadcrumb from "../../../components/common/Breadcrumb";
import ReactQuill from "react-quill";
import { postRequest } from "../../../api/commonAPI";

const AddRole = () => {
    const [roleData, setRoleData] = useState({
        name: "",
        description: "",
        status: true,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRoleData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    // Validation logic for individual fields
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        if (name === "name" && !value.trim()) {
            newErrors.name = "Role name is required.";
        } else {
            delete newErrors[name];
        }

        setErrors(newErrors);
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};
        if (!roleData.name.trim()) {
            newErrors.name = "Role name is required.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            showToast("Please fix the errors before submitting.", "error");
            return false;
        }
        return true;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await postRequest("/roles", roleData); // Adjust the API function name if needed
            if (response.status === 201) {
                showToast("Role added successfully!", "success");
                navigate("/roles"); // Redirect to the roles page
            } else {
                showToast(response.message || "Failed to add role. Please try again.", "error");
            }
        } catch (error) {
            showToast(error.response?.data?.message || "An error occurred. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Handle ReactQuill editor change
    const handleEditorChange = (value) => {
        setRoleData((prev) => ({ ...prev, description: value }));
    };

    return (
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Breadcrumb />
            <Typography
                variant="h5"
                sx={{ mb: "20px", textAlign: "center", fontWeight: "bold" }}
            >
                Add New Role
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
                {/* Role Name */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Role Name</InputLabel>
                    <TextField
                        placeholder="Enter Role Name"
                        fullWidth
                        name="name"
                        value={roleData.name}
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

                {/* Role Description */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Description</InputLabel>
                    <ReactQuill
                        value={roleData.description}
                        onChange={handleEditorChange}
                        placeholder="Describe the Role"
                        style={{
                            height: "150px",
                            borderRadius: "8px",
                            marginBottom: "20px",
                        }}
                    />
                </Box>

                {/* Role Status */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Status</InputLabel>
                    <FormControl fullWidth>
                        <Select
                            name="status"
                            value={roleData.status}
                            onChange={handleInputChange}
                        >
                            <MenuItem value={true}>Active</MenuItem>
                            <MenuItem value={false}>Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Submit Button */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: "20px" }}>
                    <Button
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
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add Role"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddRole;
