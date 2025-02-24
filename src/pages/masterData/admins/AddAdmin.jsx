import React, { useState, useEffect } from "react";
import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Description } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { postRequest, getRequest } from "../../../api/commonAPI";
import { showToast } from "../../../api/toast";
import Breadcrumb from "../../../components/common/Breadcrumb";

const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

const AddAdmin = () => {
    const [adminData, setAdminData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [fetching, setFetching] = useState(false);
    const [activeRoles, setActiveRoles] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getActiveRoles = async () => {
            setFetching(true);
            try {
                const response = await getRequest("/roles_active");
                setActiveRoles(response.data.roles);
            } catch (error) {
                console.error("Failed to fetch roles:", error);
            } finally {
                setFetching(false);
            }
        };
        getActiveRoles();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdminData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const errors = {};
        if (!adminData.name.trim()) errors.name = "Name is required.";
        if (!adminData.password.trim()) errors.password = "Password is required.";
        if (!adminData.role) errors.role = "Please select a role.";
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(adminData.email)) {
            errors.email = "Invalid email address.";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            const response = await postRequest("/admin/create", adminData);
            if (response.status === 201) {
                showToast("Admin added successfully!", "success");
                navigate("/admins");
            } else {
                showToast(response.message || "Failed to add admin.", "error");
            }
        } catch (error) {
            showToast(error.response?.data?.message || "An error occurred.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Breadcrumb />
            <Typography variant="h5" sx={{ mb: 3, textAlign: "center", fontWeight: 600 }}>
                Add New Admin
            </Typography>
            <Paper elevation={3} sx={{ p: 4, borderRadius: "10px", maxWidth: "600px", margin: "0 auto" }}>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold" }}>Name</InputLabel>
                    <TextField
                        placeholder="Enter Name"
                        fullWidth
                        name="name"
                        value={adminData.name}
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
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold" }}>Email Address</InputLabel>
                    <TextField
                        placeholder="Enter Email Address"
                        fullWidth
                        name="email"
                        value={adminData.email}
                        onChange={handleInputChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{ startAdornment: <Email sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold" }}>Password</InputLabel>
                    <TextField
                        placeholder="Enter Password"
                        fullWidth
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={adminData.password}
                        onChange={handleInputChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                            startAdornment: (
                                <Lock sx={{ color: "gray", mr: 1 }} />
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                    <Button onClick={() => setAdminData({ ...adminData, password: generatePassword() })}>
                                        Generate
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold" }}>Select Role</InputLabel>
                    <Autocomplete
                        options={activeRoles}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) =>
                            setAdminData((prev) => ({ ...prev, role: newValue ? newValue._id : "" }))
                        }
                        loading={fetching}
                        renderInput={(params) => (
                            <TextField {...params} fullWidth error={!!errors.role} helperText={errors.role} />
                        )}
                    />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add Admin"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddAdmin;
