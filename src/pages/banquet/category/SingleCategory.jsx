import React, { useEffect, useState } from "react";
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
    InputLabel,
} from "@mui/material";
import { FiEdit } from "react-icons/fi";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";


import { fetchBanquetCategoryDetails, updateBanquetCategoryDetails } from "../../../api/banquet";
import { showToast } from "../../../api/toast";
import Breadcrumb from "../../../components/common/Breadcrumb";

const SingleCategory = () => {
    const { id } = useParams();
    const [category, setCategory] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editCategory, setEditCategory] = useState({});

    // Fetch category details by ID
    const getCategoryById = async (id) => {
        try {
            const response = await fetchBanquetCategoryDetails(id);
            if (response?.data?.category) {
                setCategory(response.data.category);
                setEditCategory(response.data.category);
            }
        } catch (error) {
            console.error("Failed to fetch category details:", error);
            showToast("Failed to fetch category details. Please try again.", "error");
        }
    };

    useEffect(() => {
        getCategoryById(id);
    }, [id]);

    // Handle edit dialog open
    const handleEditClick = () => {
        setEditDialogOpen(true);
    };

    // Handle edit dialog close
    const handleDialogClose = () => {
        setEditDialogOpen(false);
    };

    // Handle input changes in the edit form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditCategory((prev) => ({ ...prev, [name]: value }));
    };

    // Save changes to the category
    const handleSaveChanges = async () => {
        try {
            const response = await updateBanquetCategoryDetails(id, editCategory);
            if (response.status === 200 && response.data.category) {
                // setCategory(response.data.category);
                // setEditCategory(response.data.category);
                getCategoryById(id);
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
            <Typography variant="h4" sx={{ mb: 3 }}>
                Banquet Category Details
            </Typography>
            <Paper
                elevation={3}
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
                        <Typography variant="h5">{category.name || "N/A"}</Typography>

                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Description:</strong>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: category.description || "N/A",
                                }}
                            />
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Status:</strong>{" "}
                            {category.status}
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
            <Dialog
                open={isEditDialogOpen}
                onClose={handleDialogClose}
                fullWidth
                maxWidth="sm"
            >
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
                    <InputLabel sx={{ fontWeight: "bold", mt: 2 }}>
                        Description
                    </InputLabel>
                    <ReactQuill
                        value={editCategory.description || ""}
                        onChange={(value) =>
                            setEditCategory((prev) => ({ ...prev, description: value }))
                        }
                        style={{ height: "150px", marginBottom: "20px" }}
                    />
                    <TextField
                        label="Status"
                        select
                        fullWidth
                        margin="dense"
                        name="status"
                        value={editCategory.status}
                        onChange={handleInputChange}
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
