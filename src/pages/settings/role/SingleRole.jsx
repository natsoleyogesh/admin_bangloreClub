import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    TextField,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { showToast } from "../../../api/toast";
import { fetchRestaurantDetails, updateRestaurantDetails } from "../../../api/masterData/restaurant";
import Breadcrumb from "../../../components/common/Breadcrumb";
import ReactQuill from "react-quill";
import { getRequest, putRequest } from "../../../api/commonAPI";

const SingleRole = () => {
    const { id } = useParams();
    const [role, setRole] = useState({});
    const [editRole, setEditRole] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);

    const navigate = useNavigate()

    // Fetch role details on component mount
    useEffect(() => {
        fetchRoleDetails(id);
    }, [id]);

    // Fetch role details by ID
    const fetchRoleDetails = async (roleId) => {
        try {
            const response = await getRequest(`/roles/${roleId}`);
            const roleData = response.data.role;
            setRole(roleData);
            setEditRole(roleData);
        } catch (error) {
            console.error("Failed to fetch role details:", error);
            // showToast("Failed to fetch role details. Please try again.", "error");
        }
    };

    // Handle input changes in the edit dialog
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditRole((prev) => ({ ...prev, [name]: value }));
    };

    // Handle ReactQuill editor changes
    const handleDescriptionChange = (value) => {
        setEditRole((prev) => ({ ...prev, description: value }));
    };

    // Open and close the edit dialog
    const handleEditClick = () => setEditDialogOpen(true);
    const handleDialogClose = () => setEditDialogOpen(false);

    const handleViewClick = () => {
        navigate(`/permission/${id}`)
    }


    // Save changes to the role
    const handleSaveChanges = async () => {
        try {
            const response = await putRequest(`/roles/${id}`, editRole);
            if (response.status === 200) {
                showToast("Role details updated successfully!", "success");
                fetchRoleDetails(id); // Refresh role details
                setEditDialogOpen(false);
            } else {
                showToast("Failed to update role details. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to update role details:", error);
            showToast(error.response?.data?.message || "Failed to update role details. Please try again.", "error");
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Role Details
            </Typography>
            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Typography variant="h5">{role.name || "N/A"}</Typography>
                        <Typography variant="body1">
                            <strong>Description:</strong>
                            <div dangerouslySetInnerHTML={{ __html: role.description || "N/A" }} />
                        </Typography>
                        <Typography variant="body1">
                            <strong>Status:</strong>{" "}
                            {role.status ? "Active" : "Inactive"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Created At:</strong>{" "}
                            {role.createdAt
                                ? new Date(role.createdAt).toLocaleDateString()
                                : "N/A"}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleEditClick}
                            sx={{ mt: 2 }}
                        >
                            Edit Role Details
                        </Button>
                    </Grid>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiEdit />}
                        onClick={handleViewClick}
                        sx={{ mt: 2 }}
                    >
                        View Permissoin
                    </Button>
                </Grid>
            </Paper>

            {/* Edit Dialog */}
            <Dialog
                open={isEditDialogOpen}
                onClose={handleDialogClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Edit Role Details</DialogTitle>
                <DialogContent>
                    {/* Role Name */}
                    <TextField
                        label="Role Name"
                        fullWidth
                        margin="dense"
                        name="name"
                        value={editRole.name || ""}
                        onChange={handleInputChange}
                    />

                    {/* Description */}
                    <Box sx={{ mb: 2 }}>
                        <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>
                            Description
                        </InputLabel>
                        <ReactQuill
                            value={editRole.description || ""}
                            onChange={handleDescriptionChange}
                            placeholder="Enter Role Description"
                            style={{
                                height: "150px",
                                borderRadius: "8px",
                                marginBottom: "20px",
                            }}
                        />
                    </Box>

                    {/* Status */}
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={editRole.status || ""}
                            onChange={handleInputChange}
                        >
                            <MenuItem value={true}>Active</MenuItem>
                            <MenuItem value={false}>Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveChanges} color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SingleRole;
