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
    IconButton,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { FiEdit, FiUpload } from "react-icons/fi";
import { showToast } from "../../../api/toast";
import { fetchAmenitieDetails, updateAmenitieDetails } from "../../../api/masterData/amenities";
import { PUBLIC_API_URI } from "../../../api/config";
import Breadcrumb from "../../../components/common/Breadcrumb";

const SingleAmenitie = () => {
    const { id } = useParams();
    const [amenity, setAmenity] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editAmenity, setEditAmenity] = useState({});
    const [selectedIcon, setSelectedIcon] = useState(null); // State for selected icon file

    const statusOptions = ["active", "inactive"];

    // Fetch amenity details by ID
    useEffect(() => {
        getAmenityById(id);
    }, [id]);

    const getAmenityById = async (amenityId) => {
        try {
            const response = await fetchAmenitieDetails(amenityId); // Fetch amenity details from API
            setAmenity(response.data.data);
            setEditAmenity(response.data.data);
        } catch (error) {
            console.error("Failed to fetch amenity details:", error);
            showToast("Failed to fetch amenity details. Please try again.", "error");
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditAmenity((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file change (icon upload)
    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "image/svg+xml") {
            setSelectedIcon(file); // Set selected SVG file
        } else {
            showToast("Please select a valid SVG file.", "error");
        }
    };

    // Open and close the edit dialog
    const handleEditClick = () => setEditDialogOpen(true);
    const handleDialogClose = () => setEditDialogOpen(false);

    // Save changes to the amenity
    const handleSaveChanges = async () => {
        try {
            const formData = new FormData();
            formData.append("name", editAmenity.name);
            formData.append("status", editAmenity.status);
            formData.append("icon", selectedIcon || editAmenity.icon); // If no new file, use existing icon

            const response = await updateAmenitieDetails(id, formData); // API call to update amenity
            if (response.status === 200) {
                getAmenityById(id);
                setEditDialogOpen(false);
                showToast("Amenity details updated successfully!", "success");
            } else {
                showToast("Failed to update amenity details. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to update amenity details:", error.response.data.message);
            showToast(error.response.data.message || "Failed to update amenity details. Please try again.", "error");
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Amenity Details
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
                    {/* Amenity Details Display */}
                    <Grid item xs={12}>
                        <Typography variant="h5">{amenity.name || "N/A"}</Typography>
                        <Typography variant="body1">
                            <strong>Status:</strong> {amenity.status || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Created At:</strong> {new Date(amenity.createdAt).toLocaleDateString() || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ marginTop: "10px" }}>
                            <strong>Icon:</strong> <br />
                            <img
                                // src={amenity.icon || ""}
                                src={`${PUBLIC_API_URI}${amenity.icon}`}
                                alt={amenity.name}
                                style={{ width: "30px", height: "30px", objectFit: "contain" }}
                            />
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleEditClick}
                            sx={{ mt: 2 }}
                        >
                            Edit Amenity Details
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
                <DialogTitle>Edit Amenity Details</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Amenity Name"
                        fullWidth
                        margin="dense"
                        name="name"
                        value={editAmenity.name || ""}
                        onChange={handleInputChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={editAmenity.status || ""}
                            onChange={handleInputChange}
                        >
                            {statusOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* File input for icon */}
                    <Button
                        variant="outlined"
                        component="label"
                        sx={{ mt: 2 }}
                        startIcon={<FiUpload />}
                    >
                        Upload SVG Icon
                        <input
                            type="file"
                            accept="image/svg+xml"
                            hidden
                            onChange={handleIconChange}
                        />
                    </Button>
                    {selectedIcon && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Selected Icon: {selectedIcon.name}
                        </Typography>
                    )}
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
        </Box >
    );
};

export default SingleAmenitie;
