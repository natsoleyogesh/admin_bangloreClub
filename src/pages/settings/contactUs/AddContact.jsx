import React, { useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { showToast } from "../../../api/toast";
import { postRequest } from "../../../api/commonAPI";
import LocationSelector from "../../../components/common/LocationSelector";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../components/common/Breadcrumb";

const AddContact = () => {
    const [contactData, setContactData] = useState({
        organizationName: "",
        address: {
            street: "",
            city: null,
            state: null,
            postalCode: "",
            country: "India",
        },
        phoneNumbers: [""],
        fax: "",
        email: "",
        status: "Active",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const statusOptions = ["Active", "Inactive"]; // Status dropdown options

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "street" || name === "postalCode") {
            setContactData((prev) => ({
                ...prev,
                address: { ...prev.address, [name]: value },
            }));
        } else {
            setContactData((prev) => ({ ...prev, [name]: value }));
        }
        validateField(name, value);
    };

    // Handle location change from LocationSelector
    const handleLocationChange = (updatedLocation) => {
        setContactData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                country: updatedLocation.country,
                state: updatedLocation.state,
                city: updatedLocation.city,
            },
        }));
    };

    // Handle phone number change
    const handlePhoneNumberChange = (index, value) => {
        const updatedPhoneNumbers = [...contactData.phoneNumbers];
        updatedPhoneNumbers[index] = value;
        setContactData((prev) => ({ ...prev, phoneNumbers: updatedPhoneNumbers }));
    };

    // Add a new phone number field
    const addPhoneNumberField = () => {
        setContactData((prev) => ({
            ...prev,
            phoneNumbers: [...prev.phoneNumbers, ""],
        }));
    };

    // Remove a phone number field
    const removePhoneNumberField = (index) => {
        const updatedPhoneNumbers = [...contactData.phoneNumbers];
        updatedPhoneNumbers.splice(index, 1);
        setContactData((prev) => ({ ...prev, phoneNumbers: updatedPhoneNumbers }));
    };

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        if (name === "organizationName" && !value.trim()) {
            newErrors.organizationName = "Organization Name is required.";
        } else if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
            newErrors.email = "Invalid email address.";
        } else if (name === "street" && !value.trim()) {
            newErrors.street = "Street is required.";
        } else if (name === "postalCode" && !/^\d+$/.test(value)) {
            newErrors.postalCode = "Postal Code must be a number.";
        } else if (name === "fax" && value && !/^\d+$/.test(value)) {
            newErrors.fax = "Fax must be a number.";
        } else {
            delete newErrors[name];
        }

        setErrors(newErrors);
    };

    // Validate the entire form
    const validateForm = () => {
        const newErrors = {};

        if (!contactData.organizationName.trim()) {
            newErrors.organizationName = "Organization Name is required.";
        }
        if (!contactData.email.trim() || !/\S+@\S+\.\S+/.test(contactData.email)) {
            newErrors.email = "Valid email is required.";
        }
        if (!contactData.address.street.trim()) {
            newErrors.street = "Street is required.";
        }
        if (!contactData.address.city) {
            newErrors.city = "City is required.";
        }
        if (!contactData.address.state) {
            newErrors.state = "State is required.";
        }
        if (!contactData.address.country) {
            newErrors.country = "Country is required.";
        }
        if (!contactData.address.postalCode.trim()) {
            newErrors.postalCode = "Postal Code is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await postRequest("/contact", contactData);
            if (response.status === 201) {
                showToast("Contact added successfully!", "success");
                navigate("/contactUs");
            } else {
                showToast(response.message || "Failed to add contact. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error adding contact:", error);
            showToast(
                error.response?.data?.message || "An error occurred. Please try again.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Breadcrumb />
            <Typography variant="h5" sx={{ mb: "20px", textAlign: "center", fontWeight: 600 }}>
                Add New Contact
            </Typography>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: "10px",
                    maxWidth: "600px",
                    margin: "0 auto",
                }}
            >
                {/* Organization Name */}
                <TextField
                    label="Organization Name"
                    fullWidth
                    name="organizationName"
                    value={contactData.organizationName}
                    onChange={handleInputChange}
                    error={!!errors.organizationName}
                    helperText={errors.organizationName}
                    margin="dense"
                />

                {/* Address Fields */}
                <TextField
                    label="Street"
                    fullWidth
                    name="street"
                    value={contactData.address.street}
                    onChange={handleInputChange}
                    error={!!errors.street}
                    helperText={errors.street}
                    margin="dense"
                />

                {/* Location Selector */}
                <Grid item xs={12}>
                    <InputLabel sx={{ fontWeight: "bold", mb: 1 }}>Location</InputLabel>
                    <LocationSelector
                        onLocationChange={handleLocationChange}
                        defaultLocation={{
                            country: contactData.address.country,
                            state: contactData.address.state,
                            city: contactData.address.city,
                        }}
                    />
                </Grid>

                <TextField
                    label="Postal Code"
                    fullWidth
                    name="postalCode"
                    value={contactData.address.postalCode}
                    onChange={handleInputChange}
                    onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} // Allow only numbers
                    error={!!errors.postalCode}
                    helperText={errors.postalCode}
                    margin="dense"
                />

                {/* Phone Numbers */}
                {contactData.phoneNumbers.map((phone, index) => (
                    <Grid container spacing={1} alignItems="center" key={index} sx={{ mb: 1 }}>
                        <Grid item xs={10}>
                            <TextField
                                label={`Phone Number ${index + 1}`}
                                fullWidth
                                value={phone}
                                onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                                onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} // Allow only numbers
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={2}>
                            {index > 0 && (
                                <Button
                                    color="secondary"
                                    onClick={() => removePhoneNumberField(index)}
                                    size="small"
                                >
                                    Remove
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                ))}
                <Button
                    variant="text"
                    onClick={addPhoneNumberField}
                    sx={{ mb: 2, textTransform: "none" }}
                >
                    Add Phone Number
                </Button>

                {/* Fax */}
                <TextField
                    label="Fax"
                    fullWidth
                    name="fax"
                    value={contactData.fax}
                    onChange={handleInputChange}
                    onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} // Allow only numbers
                    margin="dense"
                    error={!!errors.fax}
                    helperText={errors.fax}
                />

                {/* Email */}
                <TextField
                    label="Email"
                    fullWidth
                    name="email"
                    value={contactData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    margin="dense"
                />

                {/* Status */}
                <FormControl fullWidth margin="dense">
                    <InputLabel>Status</InputLabel>
                    <Select
                        name="status"
                        value={contactData.status}
                        onChange={handleInputChange}
                    >
                        {statusOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Submit Button */}
                <Box sx={{ textAlign: "center", mt: 3 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add Contact"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddContact;
