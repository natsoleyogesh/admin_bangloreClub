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
import { fetchFAQDetails, updateFAQDetails } from "../api/faq"; // Update with actual API functions
import { showToast } from "../api/toast";
import { FiEdit } from "react-icons/fi";
import Breadcrumb from "../components/common/Breadcrumb";

const SingleFAQ = () => {
    const { id } = useParams();
    const [faq, setFaq] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editFaq, setEditFaq] = useState({});

    const statusOptions = ["Active", "Inactive"];

    // Fetch FAQ details by ID
    useEffect(() => {
        const getFAQById = async (faqId) => {
            try {
                const response = await fetchFAQDetails(faqId);
                setFaq(response.data.faq);
                setEditFaq(response.data.faq);
            } catch (error) {
                console.error("Failed to fetch FAQ details:", error);
                showToast("Failed to fetch FAQ details. Please try again.", "error");
            }
        };

        getFAQById(id);
    }, [id]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFaq((prev) => ({ ...prev, [name]: value }));
    };

    // Open and close the edit dialog
    const handleEditClick = () => setEditDialogOpen(true);
    const handleDialogClose = () => setEditDialogOpen(false);

    // Save changes to the FAQ
    const handleSaveChanges = async () => {
        try {
            const response = await updateFAQDetails(id, editFaq);
            if (response.status === 200) {
                setFaq(response.data.faq);
                setEditDialogOpen(false);
                showToast("FAQ details updated successfully!", "success");
            } else {
                showToast("Failed to update FAQ details. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to update FAQ details:", error);
            showToast("Failed to update FAQ details. Please try again.", "error");
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                FAQ Details
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
                    {/* FAQ Details Display */}
                    <Grid item xs={12}>
                        <Typography variant="h5">{faq.question || "N/A"}</Typography>
                        <Typography variant="body1">
                            <strong>Answer:</strong> {faq.answer || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Category:</strong> {faq.category || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Status:</strong> {faq.status || "N/A"}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleEditClick}
                            sx={{ mt: 2 }}
                        >
                            Edit FAQ Details
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
                <DialogTitle>Edit FAQ Details</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Question"
                        fullWidth
                        margin="dense"
                        name="question"
                        value={editFaq.question || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Answer"
                        fullWidth
                        margin="dense"
                        name="answer"
                        multiline
                        rows={3}
                        value={editFaq.answer || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Category"
                        fullWidth
                        margin="dense"
                        name="category"
                        value={editFaq.category || ""}
                        onChange={handleInputChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={editFaq.status || ""}
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

export default SingleFAQ;
