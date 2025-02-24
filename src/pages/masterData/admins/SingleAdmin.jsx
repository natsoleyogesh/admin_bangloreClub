import React, { useState, useEffect } from "react";
import {
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
import { useParams, useNavigate } from "react-router-dom";
import { getRequest, putRequest } from "../../../api/commonAPI";
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

const SingleAdmin = () => {
    const { id } = useParams();
    const [adminData, setAdminData] = useState({ name: "", email: "", password: "", role: "" });
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await getRequest(`/admin/${id}`);
                if (response.status === 200) {
                    setAdminData({
                        name: response.data.admin.name,
                        email: response.data.admin.email,
                        role: response.data.admin.role._id,
                        password: "",
                    });
                } else {
                    showToast("Failed to fetch admin details", "error");
                }
            } catch (error) {
                console.error(error.response?.data?.message || "Error fetching admin:", error);
            } finally {
                setFetching(false);
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await getRequest("/roles_active");
                if (response.status === 200) {
                    setRoles(response.data.roles);
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        fetchAdmin();
        fetchRoles();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdminData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await putRequest(`/admin/update/${id}`, adminData);
            if (response.status === 200) {
                showToast("Admin updated successfully!", "success");
                navigate("/admins");
            } else {
                showToast(response.message || "Failed to update admin.", "error");
            }
        } catch (error) {
            showToast(error.response?.data?.message || "An error occurred.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <CircularProgress />;

    return (
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Breadcrumb />
            <Typography variant="h5" sx={{ mb: 3, textAlign: "center", fontWeight: 600 }}>
                Edit Admin
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
                    <InputLabel sx={{ fontWeight: "bold" }}>Role</InputLabel>
                    <FormControl fullWidth>
                        <Select
                            name="role"
                            value={adminData.role}
                            onChange={handleInputChange}
                        >
                            {roles.map((role) => (
                                <MenuItem key={role._id} value={role._id}>
                                    {role.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Update Admin"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default SingleAdmin;
