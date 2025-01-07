import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCategoryDetails, updateCategoryDetails } from "../api/category";
import { showToast } from "../api/toast";
import { FiEdit } from "react-icons/fi";
import Breadcrumb from "../components/common/Breadcrumb";

const SingleCategory = () => {
    const { id } = useParams();
    const [category, setCategory] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editCategory, setEditCategory] = useState({});

    // Fetch category details by ID
    const getCategoryById = async (id) => {
        try {
            const response = await fetchCategoryDetails(id);
            setCategory(response.data.category);
            setEditCategory(response.data.category);
        } catch (error) {
            console.error("Failed to fetch category details:", error);
            showToast("Failed to fetch category details. Please try again.", "error");
        }
    };

    useEffect(() => {
        getCategoryById(id);
    }, [id]);

    // Handle edit button click
    const handleEditClick = () => {
        setEditDialogOpen(true);
    };

    // Handle dialog close
    const handleDialogClose = () => {
        setEditDialogOpen(false);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditCategory({ ...editCategory, [name]: value });
    };

    // Handle save changes
    const handleSaveChanges = async () => {
        try {
            const response = await updateCategoryDetails(id, editCategory);
            if (response.status === 200 && response.data.category) {
                setCategory(response.data.category);
                setEditCategory(response.data.category);
                setEditDialogOpen(false);
                showToast("Category details updated successfully!", "success");
            }
        } catch (error) {
            console.error("Failed to update category details:", error);
            showToast("Failed to update category details. Please try again.", "error");
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Category Details
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

                    <Grid item xs={12} md={7}>
                        <Typography variant="h4">{category.name}</Typography>
                        <Typography variant="subtitle1">{category.code}</Typography>
                        <Typography variant="body1">
                            <strong>Description:</strong> {category.description}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Status:</strong> {category.isActive ? "Active" : "Inactive"}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleEditClick}
                        >
                            Edit Category
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit Category Details</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Category Name"
                        fullWidth
                        margin="dense"
                        name="name"
                        value={editCategory.name || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Category Code"
                        fullWidth
                        margin="dense"
                        name="code"
                        value={editCategory.code || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        margin="dense"
                        name="description"
                        value={editCategory.description || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Status"
                        select
                        fullWidth
                        margin="dense"
                        name="isActive"
                        value={editCategory.isActive ? "Active" : "Inactive"}
                        onChange={(e) =>
                            handleInputChange({
                                target: { name: "isActive", value: e.target.value === "Active" },
                            })
                        }
                    >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>
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

export default SingleCategory;
