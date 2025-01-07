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
import { fetchRestaurantDetails, updateRestaurantDetails } from "../../../api/masterData/restaurant";
import Breadcrumb from "../../../components/common/Breadcrumb";

const SingleRestaurant = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editRestaurant, setEditRestaurant] = useState({});

    const statusOptions = ["active", "inactive"];

    // Fetch restaurant details by ID
    useEffect(() => {


        getRestaurantById(id);
    }, [id]);

    const getRestaurantById = async (restaurantId) => {
        try {
            const response = await fetchRestaurantDetails(restaurantId);
            setRestaurant(response.data.restaurant);
            setEditRestaurant(response.data.restaurant);
        } catch (error) {
            console.error("Failed to fetch restaurant details:", error);
            showToast("Failed to fetch restaurant details. Please try again.", "error");
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditRestaurant((prev) => ({ ...prev, [name]: value }));
    };

    // Open and close the edit dialog
    const handleEditClick = () => setEditDialogOpen(true);
    const handleDialogClose = () => setEditDialogOpen(false);

    // Save changes to the restaurant
    const handleSaveChanges = async () => {
        try {
            const response = await updateRestaurantDetails(id, editRestaurant);
            if (response.status === 200) {
                // setRestaurant(response.data.restaurant);
                getRestaurantById(id)
                setEditDialogOpen(false);
                showToast("Restaurant details updated successfully!", "success");
            } else {
                showToast("Failed to update restaurant details. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to update restaurant details:", error);
            showToast(error.response?.data?.message || "Failed to update restaurant details. Please try again.", "error");
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Restaurant Details
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
                    {/* Restaurant Details Display */}
                    <Grid item xs={12}>
                        <Typography variant="h5">{restaurant.name || "N/A"}</Typography>
                        <Typography variant="body1">
                            <strong>Status:</strong> {restaurant.status || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Created At:</strong> {new Date(restaurant.createdAt).toLocaleDateString() || "N/A"}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleEditClick}
                            sx={{ mt: 2 }}
                        >
                            Edit Restaurant Details
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
                <DialogTitle>Edit Restaurant Details</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Restaurant Name"
                        fullWidth
                        margin="dense"
                        name="name"
                        value={editRestaurant.name || ""}
                        onChange={handleInputChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={editRestaurant.status || ""}
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

export default SingleRestaurant;
