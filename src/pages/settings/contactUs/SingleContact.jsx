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
    CircularProgress,
} from "@mui/material";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { showToast } from "../../../api/toast";
import { getRequest, putRequest } from "../../../api/commonAPI";
import Breadcrumb from "../../../components/common/Breadcrumb";
import LocationSelector from "../../../components/common/LocationSelector";
import { formatDateMoment } from "../../../api/config";

const SingleContact = () => {
    const { id } = useParams(); // Get contact ID from route params
    const [contact, setContact] = useState({});
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editContactData, setEditContactData] = useState({});
    const [loading, setLoading] = useState(false);

    const statusOptions = ["Active", "Inactive"];

    // Fetch contact details by ID
    useEffect(() => {
        fetchContactDetails(id);
    }, [id]);

    const fetchContactDetails = async (contactId) => {
        try {
            const response = await getRequest(`/contact/${contactId}`);
            if (response?.data?.contact) {
                setContact(response.data.contact);
                setEditContactData(response.data.contact);
            }
        } catch (error) {
            console.error("Failed to fetch contact details:", error);
            showToast("Failed to fetch contact details. Please try again.", "error");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "street" || name === "postalCode") {
            setEditContactData((prev) => ({
                ...prev,
                address: { ...prev.address, [name]: value },
            }));
        } else {
            setEditContactData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Handle location change from LocationSelector
    const handleLocationChange = (updatedLocation) => {
        setEditContactData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                country: updatedLocation.country,
                state: updatedLocation.state,
                city: updatedLocation.city,
            },
        }));
    };

    // Open and close the edit dialog
    const handleEditClick = () => setIsEditDialogOpen(true);
    const handleDialogClose = () => setIsEditDialogOpen(false);

    // Validate the form fields
    const validateForm = () => {
        if (!editContactData.organizationName?.trim()) {
            showToast("Organization Name is required.", "error");
            return false;
        }
        if (!editContactData.email?.trim() || !/\S+@\S+\.\S+/.test(editContactData.email)) {
            showToast("Valid email is required.", "error");
            return false;
        }
        if (!editContactData.address?.street?.trim()) {
            showToast("Street address is required.", "error");
            return false;
        }
        if (!editContactData.address?.city) {
            showToast("City is required.", "error");
            return false;
        }
        if (!editContactData.address?.state) {
            showToast("State is required.", "error");
            return false;
        }
        if (!editContactData.address?.country) {
            showToast("Country is required.", "error");
            return false;
        }
        return true;
    };

    // Save changes to the contact
    const handleSaveChanges = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await putRequest(`/contact/${id}`, editContactData);
            if (response.status === 200) {
                fetchContactDetails(id); // Refresh contact details
                setIsEditDialogOpen(false);
                showToast("Contact details updated successfully!", "success");
            } else {
                showToast("Failed to update contact details. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to update contact details:", error);
            showToast(
                error.response?.data?.message || "An error occurred. Please try again.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Contact Details
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
                    <Grid item xs={12}>
                        <Typography variant="h5">{contact.organizationName || "N/A"}</Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Email:</strong> {contact.email || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Phone Numbers:</strong>{" "}
                            {contact.phoneNumbers?.join(", ") || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Address:</strong>{" "}
                            {`${contact.address?.street || ""}, ${contact.address?.city || ""}, ${contact.address?.state || ""
                                }-${contact.address?.postalCode || ""}, ${contact.address?.country || ""}`}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Status:</strong> {contact.status || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Created At:</strong>{" "}
                            {contact.createdAt
                                ? formatDateMoment(contact.createdAt)
                                : "N/A"}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleEditClick}
                            sx={{ mt: 2 }}
                        >
                            Edit Contact Details
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
                <DialogTitle>Edit Contact Details</DialogTitle>
                <DialogContent>
                    {/* Organization Name */}
                    <TextField
                        label="Organization Name"
                        fullWidth
                        margin="dense"
                        name="organizationName"
                        value={editContactData.organizationName || ""}
                        onChange={handleInputChange}
                    />

                    {/* Email */}
                    <TextField
                        label="Email"
                        fullWidth
                        margin="dense"
                        name="email"
                        value={editContactData.email || ""}
                        onChange={handleInputChange}
                    />

                    {/* Phone Numbers */}
                    <Box>
                        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                            Phone Numbers
                        </Typography>
                        {editContactData.phoneNumbers?.map((phone, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    mb: 2,
                                }}
                            >
                                <TextField
                                    label={`Phone Number ${index + 1}`}
                                    fullWidth
                                    margin="dense"
                                    value={phone}
                                    onChange={(e) => {
                                        const updatedPhoneNumbers = [...editContactData.phoneNumbers];
                                        updatedPhoneNumbers[index] = e.target.value;
                                        setEditContactData((prev) => ({
                                            ...prev,
                                            phoneNumbers: updatedPhoneNumbers,
                                        }));
                                    }}
                                    onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} // Allow only numbers
                                />
                                {/* Trash Icon to Remove Phone Number */}
                                <Button
                                    color="error"
                                    onClick={() => {
                                        const updatedPhoneNumbers = [...editContactData.phoneNumbers];
                                        updatedPhoneNumbers.splice(index, 1); // Remove the phone number at this index
                                        setEditContactData((prev) => ({
                                            ...prev,
                                            phoneNumbers: updatedPhoneNumbers,
                                        }));
                                    }}
                                    sx={{ minWidth: "40px", minHeight: "40px" }}
                                >
                                    <FiTrash2 />
                                </Button>
                            </Box>
                        ))}

                        {/* Add Phone Number Button */}
                        <Button
                            variant="outlined"
                            startIcon={<FiPlus />}
                            onClick={() => {
                                setEditContactData((prev) => ({
                                    ...prev,
                                    phoneNumbers: [...prev.phoneNumbers, ""], // Add an empty phone number field
                                }));
                            }}
                            sx={{ mt: 2 }}
                        >
                            Add Phone Number
                        </Button>
                    </Box>

                    {/* Address Fields */}
                    <TextField
                        label="Street"
                        fullWidth
                        margin="dense"
                        name="street"
                        value={editContactData.address?.street || ""}
                        onChange={handleInputChange}
                    />

                    <TextField
                        label="Postal Code"
                        fullWidth
                        margin="dense"
                        name="postalCode"
                        value={editContactData.address?.postalCode || ""}
                        onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} // Allow only numbers
                        onChange={handleInputChange}
                    />
                    {/* Location Selector */}
                    <InputLabel sx={{ fontWeight: "bold", mt: 2 }}>Location</InputLabel>
                    <LocationSelector
                        onLocationChange={handleLocationChange}
                        defaultLocation={{
                            country: editContactData.address?.country,
                            state: editContactData.address?.state,
                            city: editContactData.address?.city,
                        }}
                    />

                    {/* Fax */}
                    <TextField
                        label="Fax"
                        fullWidth
                        name="fax"
                        value={editContactData.fax}
                        onChange={handleInputChange}
                        onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} // Allow only numbers
                        margin="dense"
                    />

                    {/* Status */}
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={editContactData.status || ""}
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
                    <Button
                        onClick={handleSaveChanges}
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SingleContact;
