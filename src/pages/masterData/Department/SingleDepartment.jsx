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
import { useParams } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { showToast } from "../../../api/toast";
import { fetchDepartmentDetails, updateDepartmentDetails } from "../../../api/masterData/department";
import Breadcrumb from "../../../components/common/Breadcrumb";

const SingleDepartment = () => {
    const { id } = useParams();
    const [department, setDepartment] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editDepartment, setEditDepartment] = useState({});

    const statusOptions = ["active", "inactive"];

    // Fetch department details by ID
    useEffect(() => {


        getDepartmentById(id);
    }, [id]);

    const getDepartmentById = async (departmentId) => {
        try {
            const response = await fetchDepartmentDetails(departmentId);
            setDepartment(response.data.department);
            setEditDepartment(response.data.department);
        } catch (error) {
            console.error("Failed to fetch department details:", error);
            showToast("Failed to fetch department details. Please try again.", "error");
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditDepartment((prev) => ({ ...prev, [name]: value }));
    };

    // Open and close the edit dialog
    const handleEditClick = () => setEditDialogOpen(true);
    const handleDialogClose = () => setEditDialogOpen(false);

    // Save changes to the department
    const handleSaveChanges = async () => {
        try {
            const response = await updateDepartmentDetails(id, editDepartment);
            if (response.status === 200) {
                // setDepartment(response.data.department);
                getDepartmentById(id)
                setEditDialogOpen(false);
                showToast("Department details updated successfully!", "success");
            } else {
                showToast("Failed to update department details. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to update department details:", error);
            showToast(error.response?.data?.message || "Failed to update department details. Please try again.", "error");
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Department Details
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
                    {/* Department Details Display */}
                    <Grid item xs={12}>
                        <Typography variant="h5">{department.departmentName || "N/A"}</Typography>
                        <Typography variant="body1">
                            <strong>Status:</strong> {department.status || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Created At:</strong> {new Date(department.createdAt).toLocaleDateString() || "N/A"}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleEditClick}
                            sx={{ mt: 2 }}
                        >
                            Edit Department Details
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Edit Dialog */}
            <Dialog
                open={isEditDialogOpen}
                onClose={handleDialogClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Edit Department Details</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Department Name"
                        fullWidth
                        margin="dense"
                        name="departmentName"
                        value={editDepartment.departmentName || ""}
                        onChange={handleInputChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={editDepartment.status || ""}
                            onChange={handleInputChange}
                        >
                            {statusOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
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

export default SingleDepartment;
