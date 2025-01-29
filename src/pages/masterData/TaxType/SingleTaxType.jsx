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
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { showToast } from "../../../api/toast";
import { fetchTaxTypeDetails, updateTaxTypeDetails } from "../../../api/masterData/taxType";
import Breadcrumb from "../../../components/common/Breadcrumb";

const SingleTaxType = () => {
    const { id } = useParams();
    const [taxType, setTaxType] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editTaxType, setEditTaxType] = useState({});

    const statusOptions = ["active", "inactive"];

    // Fetch tax type details by ID
    useEffect(() => {


        getTaxTypeById(id);
    }, [id]);

    const getTaxTypeById = async (taxTypeId) => {
        try {
            const response = await fetchTaxTypeDetails(taxTypeId); // Fetch tax type details from API
            setTaxType(response.data.data);
            setEditTaxType(response.data.data);
        } catch (error) {
            console.error("Failed to fetch tax type details:", error);
            showToast("Failed to fetch tax type details. Please try again.", "error");
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditTaxType((prev) => ({ ...prev, [name]: value }));
    };

    // Handle checkbox changes for showExclusive
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setEditTaxType((prev) => ({ ...prev, [name]: checked }));
    };

    // Open and close the edit dialog
    const handleEditClick = () => setEditDialogOpen(true);
    const handleDialogClose = () => setEditDialogOpen(false);

    // Save changes to the tax type
    const handleSaveChanges = async () => {
        try {
            const response = await updateTaxTypeDetails(id, editTaxType); // API call to update tax type
            if (response.status === 200) {
                // setTaxType(response.data);
                getTaxTypeById(id)
                setEditDialogOpen(false);
                showToast("Tax type details updated successfully!", "success");
            } else {
                showToast("Failed to update tax type details. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to update tax type details:", error);
            showToast(error.response?.data?.message || "Failed to update tax type details. Please try again.", "error");
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Tax Type Details
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
                    {/* Tax Type Details Display */}
                    <Grid item xs={12}>
                        <Typography variant="h5">{taxType.name || "N/A"}</Typography>
                        <Typography variant="body1">
                            <strong>Status:</strong> {taxType.status || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Percentage:</strong> {taxType.percentage || "N/A"}%
                        </Typography>
                        <Typography variant="body1" >
                            <strong>Tax Is Applicable With Kids:</strong> {taxType.applyKids === true ? "Yes" : "No"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Created At:</strong> {new Date(taxType.createdAt).toLocaleDateString() || "N/A"}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleEditClick}
                            sx={{ mt: 2 }}
                        >
                            Edit Tax Type Details
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
                <DialogTitle>Edit Tax Type Details</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Tax Type Name"
                        fullWidth
                        margin="dense"
                        name="name"
                        value={editTaxType.name || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Percentage"
                        fullWidth
                        margin="dense"
                        name="percentage"
                        type="number"
                        value={editTaxType.percentage || ""}
                        // onChange={handleInputChange}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
                                handleInputChange(e); // Call your existing input handler
                            }
                        }}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={editTaxType.status || ""}
                            onChange={handleInputChange}
                        >
                            {statusOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ mb: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="applyKids"
                                    checked={editTaxType.applyKids}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label="Tax Applicable In Kids"
                        />
                    </Box>
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

export default SingleTaxType;
