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
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRuleByeLawDetails, updateRuleByeLawDetails } from "../api/ruleByelaws"; // Update with actual API functions
import { showToast } from "../api/toast";
import { FiEdit } from "react-icons/fi";
import Breadcrumb from "../components/common/Breadcrumb";

const SingleRuleByeLaw = () => {
    const { id } = useParams();
    const [ruleByeLaw, setRuleByeLaw] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editRuleByeLaw, setEditRuleByeLaw] = useState({});

    const typeOptions = ["Rule", "Bylaw"];
    const statusOptions = ["Active", "Inactive"];

    // Fetch Rule/Bylaw details by ID
    useEffect(() => {
        const getRuleByeLawById = async (ruleByeLawId) => {
            try {
                const response = await fetchRuleByeLawDetails(ruleByeLawId);
                setRuleByeLaw(response.data.ruleByelaw);
                setEditRuleByeLaw(response.data.ruleByelaw);
            } catch (error) {
                console.error("Failed to fetch Rule/ByeLaw details:", error);
                showToast("Failed to fetch Rule/ByeLaw details. Please try again.", "error");
            }
        };

        getRuleByeLawById(id);
    }, [id]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditRuleByeLaw((prev) => ({ ...prev, [name]: value }));
    };

    // Handle dialog open/close
    const handleEditClick = () => setEditDialogOpen(true);
    const handleDialogClose = () => setEditDialogOpen(false);

    // Save changes to the Rule/Byelaw
    const handleSaveChanges = async () => {
        try {
            const response = await fetchRuleByeLawDetails(id, editRuleByeLaw);
            if (response.status === 200) {
                setRuleByeLaw(response.data.ruleByelaw);
                setEditDialogOpen(false);
                showToast("Rule/ByeLaw details updated successfully!", "success");
            } else {
                showToast("Failed to update Rule/ByeLaw details. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to update Rule/ByeLaw details:", error);
            showToast("Failed to update Rule/ByeLaw details. Please try again.", "error");
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Rule/ByeLaw Details
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
                    {/* Rule/ByeLaw Details */}
                    <Grid item xs={12} md={7}>
                        <Typography variant="h5">{ruleByeLaw.title || "N/A"}</Typography>
                        <Typography variant="body1">
                            <strong>Description:</strong>
                            <div
                                dangerouslySetInnerHTML={{ __html: ruleByeLaw.description || "N/A" }}
                            // style={{ maxHeight: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                            />
                        </Typography>
                        <Typography variant="body1">
                            <strong>Type:</strong> {ruleByeLaw.type || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Category:</strong> {ruleByeLaw.category || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Status:</strong> {ruleByeLaw.status || "N/A"}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleEditClick}
                            sx={{ mt: 2 }}
                        >
                            Edit Rule/ByeLaw Details
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
                <DialogTitle>Edit Rule/ByeLaw Details</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Type</InputLabel>
                        <Select
                            name="type"
                            value={editRuleByeLaw.type || ""}
                            onChange={handleInputChange}
                        >
                            {typeOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="dense"
                        name="title"
                        value={editRuleByeLaw.title || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        margin="dense"
                        name="description"
                        multiline
                        rows={3}
                        value={editRuleByeLaw.description || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Category"
                        fullWidth
                        margin="dense"
                        name="category"
                        value={editRuleByeLaw.category || ""}
                        onChange={handleInputChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={editRuleByeLaw.status || ""}
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

export default SingleRuleByeLaw;
