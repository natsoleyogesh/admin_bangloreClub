import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { BiImageAdd } from "react-icons/bi";
import { showToast } from "../api/toast";
import { useNavigate } from "react-router-dom";
import { Description, DateRange, CloudUpload } from "@mui/icons-material";
import { addCOM } from "../api/com";
import Breadcrumb from "../components/common/Breadcrumb";

const UploadBox = styled(Box)(({ theme }) => ({
    marginTop: 20,
    height: 180,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    border: `2px dashed ${theme.palette.divider}`,
    cursor: "pointer",
    backgroundColor: theme.palette.background.paper,
    transition: "0.3s",
    "&:hover": {
        backgroundColor: theme.palette.action.hover,
    },
}));

const statusOptions = ["Active", "Inactive"];

const AddCOM = () => {
    const [comData, setComData] = useState({
        title: "",
        description: "",
        expiredDate: "",
        status: "Active",
    });
    const [pdfFile, setPdfFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const fileInput = useRef(null);
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setComData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    // Handle file upload change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdfFile(file);
            setErrors((prevErrors) => ({ ...prevErrors, pdfFile: null })); // Clear file-related errors
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                pdfFile: "Only PDF files are allowed.",
            }));
        }
    };

    // Validation logic for individual fields
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        // Title validation
        if (name === "title" && !value.trim()) {
            newErrors.title = "Title is required.";
        } else {
            delete newErrors.title;
        }

        // Expired date validation
        if (name === "expiredDate") {
            const selectedDate = new Date(value);
            const currentDate = new Date();

            if (!value) {
                newErrors.expiredDate = "Expiration date is required.";
            } else if (selectedDate < currentDate) {
                newErrors.expiredDate = "Expiration date cannot be in the past.";
            } else {
                delete newErrors.expiredDate;
            }
        }

        setErrors(newErrors);
    };

    // Validate the entire form before submission
    const validateForm = () => {
        const validationErrors = {};

        if (!comData.title) validationErrors.title = "Title is required.";
        if (!comData.expiredDate) {
            validationErrors.expiredDate = "Expiration date is required.";
        } else if (new Date(comData.expiredDate) < new Date()) {
            validationErrors.expiredDate = "Expiration date cannot be in the past.";
        }
        if (!pdfFile) validationErrors.pdfFile = "A PDF file is required.";

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);

        const formData = new FormData();
        Object.entries(comData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        if (pdfFile) {
            formData.append("fileUrl", pdfFile);
        }

        try {
            const response = await addCOM(formData);
            if (response.status === 201) {
                showToast("Download added successfully!", "success");
                navigate("/downloads");
            } else {
                showToast(response.message || "Failed to add download. Please try again.", "error");
            }
        } catch (error) {
            showToast(error.response?.data?.message || "An error occurred. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Breadcrumb />
            <Typography variant="h5" sx={{ mb: "20px", textAlign: "center", fontWeight: 600 }}>
                Add New Consideration Of Membership
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
                {/* Title */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Title</InputLabel>
                    <TextField
                        placeholder="Enter title"
                        fullWidth
                        name="title"
                        value={comData.title}
                        onChange={handleInputChange}
                        error={!!errors.title}
                        helperText={errors.title}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Description />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Description */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Description</InputLabel>
                    <TextField
                        placeholder="Enter description"
                        fullWidth
                        multiline
                        rows={3}
                        name="description"
                        value={comData.description}
                        onChange={handleInputChange}
                    />
                </Box>

                {/* Expiration Date */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Expiration Date</InputLabel>
                    <TextField
                        type="date"
                        fullWidth
                        name="expiredDate"
                        value={comData.expiredDate}
                        onChange={handleInputChange}
                        error={!!errors.expiredDate}
                        helperText={errors.expiredDate}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <DateRange />
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates

                    />
                </Box>

                {/* Status */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Status</InputLabel>
                    <FormControl fullWidth>
                        <Select
                            name="status"
                            value={comData.status}
                            onChange={handleInputChange}
                        >
                            {statusOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Upload PDF File */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Upload PDF</InputLabel>
                    <UploadBox onClick={() => fileInput.current.click()}>
                        {pdfFile ? (
                            <Typography variant="body2">{pdfFile.name}</Typography>
                        ) : (
                            <Box sx={{ textAlign: "center" }}>
                                <BiImageAdd style={{ fontSize: "40px", color: "#027edd" }} />
                                <Typography variant="body2" color="textSecondary">
                                    Click to upload PDF
                                </Typography>
                            </Box>
                        )}
                        <input
                            type="file"
                            accept="application/pdf"
                            hidden
                            ref={fileInput}
                            onChange={handleFileChange}
                        />
                    </UploadBox>
                    {errors.pdfFile && (
                        <Typography color="error" variant="body2">
                            {errors.pdfFile}
                        </Typography>
                    )}
                </Box>

                {/* Submit Button */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: "20px" }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                            borderRadius: "10px",
                            px: 4,
                            py: 1,
                            fontWeight: "bold",
                        }}
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add Download"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddCOM;
