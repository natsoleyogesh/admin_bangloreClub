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
import { fetchDownloadDetails, updateDownloadDetails } from "../api/download";
import { PUBLIC_API_URI } from "../api/config";
import { showToast } from "../api/toast";
import { FiEdit } from "react-icons/fi";
import ReactQuill from "react-quill";
import Breadcrumb from "../components/common/Breadcrumb";

const SingleDownload = () => {
    const { id } = useParams();
    const [download, setDownload] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editDownload, setEditDownload] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);

    // Fetch Download details by ID
    useEffect(() => {
        const getDownloadById = async (downloadId) => {
            try {
                const response = await fetchDownloadDetails(downloadId);
                setDownload(response.data.download);
                setEditDownload(response.data.download);
            } catch (error) {
                console.error("Failed to fetch download details:", error);
                showToast("Failed to fetch download details. Please try again.", "error");
            }
        };

        getDownloadById(id);
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

        setEditDownload((prev) => ({ ...prev, [name]: value }));
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
            Object.entries(editDownload).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            if (selectedFile) {
                formData.append("fileUrl", selectedFile);
            }

            const response = await updateDownloadDetails(id, formData);
            if (response.status === 200 && response.data.download) {
                setDownload(response.data.download);
                setEditDownload(response.data.download);
                setEditDialogOpen(false);
                showToast("Download details updated successfully!", "success");
            } else {
                showToast("Failed to update download details. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to update download details:", error);
            showToast("Failed to update download details. Please try again.", "error");
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Club Notice / Download Details
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
                            href={`${PUBLIC_API_URI}${download.fileUrl}`}
                            target="_blank"
                        >
                            View PDF
                        </Button>
                    </Grid>

                    {/* Download Details */}
                    <Grid item xs={12} md={7}>
                        <Typography variant="h5">{download.title || "N/A"}</Typography>
                        <Typography variant="body1">
                            <strong>Description:</strong>
                            <div
                                dangerouslySetInnerHTML={{ __html: download.description || "N/A" }}
                            // style={{ maxHeight: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                            />
                        </Typography>
                        <Typography variant="body1">
                            <strong>Status:</strong> {download.status || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Expiration Date:</strong>{" "}
                            {download.expiredDate
                                ? new Date(download.expiredDate).toLocaleDateString()
                                : "N/A"}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleEditClick}
                            sx={{ mt: 2 }}
                        >
                            Edit Club Notice / Download Details
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
                <DialogTitle>Edit Club Notice / Download Details</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="dense"
                        name="title"
                        value={editDownload.title || ""}
                        onChange={handleInputChange}
                    />
                    {/* <TextField
                        label="Description"
                        fullWidth
                        margin="dense"
                        name="description"
                        multiline
                        rows={3}
                        value={editDownload.description || ""}
                        onChange={handleInputChange}
                    /> */}
                    <ReactQuill
                        value={editDownload.description || ""}
                        onChange={(value) => setEditDownload({ ...editDownload, description: value })}
                        style={{ height: "150px", marginBottom: "100px" }}
                    />
                    <TextField
                        label="Expiration Date"
                        type="date"
                        fullWidth
                        margin="dense"
                        name="expiredDate"
                        value={
                            editDownload.expiredDate
                                ? new Date(editDownload.expiredDate).toISOString().split("T")[0]
                                : ""
                        }
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates

                    />
                    <TextField
                        label="Status"
                        select
                        fullWidth
                        margin="dense"
                        name="status"
                        value={editDownload.status || ""}
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

export default SingleDownload;
