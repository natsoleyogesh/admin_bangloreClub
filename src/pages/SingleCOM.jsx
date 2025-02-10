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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PUBLIC_API_URI } from "../api/config";
import { showToast } from "../api/toast";
import { FiEdit } from "react-icons/fi";
import { fetchCOMDetails, updateCOMDetails } from "../api/com";
import Breadcrumb from "../components/common/Breadcrumb";

const SingleCOM = () => {
    const { id } = useParams();
    const [com, setCOM] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editCom, setEditCom] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);

    // Fetch Download details by ID
    useEffect(() => {
        const getCOMById = async (comId) => {
            try {
                const response = await fetchCOMDetails(comId);
                setCOM(response.data.com);
                setEditCom(response.data.com);
            } catch (error) {
                console.error("Failed to fetch Consideration Of Membership details:", error);
                showToast("Failed to fetch Consideration Of Membership details. Please try again.", "error");
            }
        };

        getCOMById(id);
    }, [id]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Expired date validation
        if (name === "expiredDate") {
            const selectedDate = new Date(value);
            const currentDate = new Date();

            if (selectedDate < currentDate) {
                showToast("Expiration date cannot be in the past.", "error");
                return;
            }
        }

        setEditCom((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
        } else {
            showToast("Only PDF files are allowed.", "error");
        }
    };

    // Handle dialog open/close
    const handleEditClick = () => setEditDialogOpen(true);
    const handleDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedFile(null);
    };

    // Save changes to the download
    const handleSaveChanges = async () => {
        try {
            const formData = new FormData();
            Object.entries(editCom).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            if (selectedFile) {
                formData.append("fileUrl", selectedFile);
            }

            const response = await updateCOMDetails(id, formData);
            if (response.status === 200 && response.data.com) {
                setCOM(response.data.com);
                setEditCom(response.data.com);
                setEditDialogOpen(false);
                showToast("Consideration Of Membership details updated successfully!", "success");
            } else {
                showToast("Failed to update Consideration Of Membership details. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to update Consideration Of Membership details:", error);
            showToast("Failed to update Consideration Of Membership details. Please try again.", "error");
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Consideration Of Membership Details
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
                    {/* Download File Preview */}
                    <Grid item xs={12} md={5}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            href={`${PUBLIC_API_URI}${com.fileUrl}`}
                            target="_blank"
                        >
                            View PDF
                        </Button>
                    </Grid>

                    {/* Download Details */}
                    <Grid item xs={12} md={7}>
                        <Typography variant="h5">{com.title || "N/A"}</Typography>
                        <Typography variant="body1">
                            <strong>Description:</strong> {com.description || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Status:</strong> {com.status || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Expiration Date:</strong>{" "}
                            {com.expiredDate
                                ? new Date(com.expiredDate).toLocaleDateString()
                                : "N/A"}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleEditClick}
                            sx={{ mt: 2 }}
                        >
                            Edit Consideration Of Membership Details
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
                <DialogTitle>Edit Consideration Of Membership Details</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="dense"
                        name="title"
                        value={editCom.title || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        margin="dense"
                        name="description"
                        multiline
                        rows={3}
                        value={editCom.description || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Expiration Date"
                        type="date"
                        fullWidth
                        margin="dense"
                        name="expiredDate"
                        value={
                            editCom.expiredDate
                                ? new Date(editCom.expiredDate).toISOString().split("T")[0]
                                : ""
                        }
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Status"
                        select
                        fullWidth
                        margin="dense"
                        name="status"
                        value={editCom.status || ""}
                        onChange={handleInputChange}
                    >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>

                    <Button variant="contained" component="label" fullWidth>
                        Upload New PDF
                        <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
                    </Button>
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

export default SingleCOM;
