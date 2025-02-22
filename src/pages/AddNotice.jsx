import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { DateRange, Description, CloudUpload } from "@mui/icons-material";
import { showToast } from "../api/toast";
import { useNavigate } from "react-router-dom";
import { addNotice } from "../api/clubNotice";
import ReactQuill from "react-quill";
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

const AddNotice = () => {
    const [noticeData, setNoticeData] = useState({
        title: "",
        description: "",
        expiredDate: "",
        status: "Active",
        showBanner: false
    });
    const [uploadedFile, setUploadedFile] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const fileInput = useRef(null);
    const imageInput = useRef(null);

    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNoticeData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleDescriptionChange = (value) => {
        setNoticeData({ ...noticeData, description: value });
    };

    // Handle file upload change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (file && allowedTypes.includes(file.type)) {
            setUploadedFile(file);
            setErrors((prevErrors) => ({ ...prevErrors, uploadedFile: null })); // Clear file-related errors
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                uploadedFile: "Only PDF, JPEG, JPG, PNG, and WEBP files are allowed.",
            }));
        }
    };


    // Handle file upload change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (file && allowedTypes.includes(file.type)) {
            setBannerImage(file);
            setErrors((prevErrors) => ({ ...prevErrors, bannerImage: null })); // Clear file-related errors
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                bannerImage: "Only JPEG, JPG, PNG, and WEBP files are allowed.",
            }));
        }
    };

    // Validation logic for individual fields
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        if (name === "title" && !value.trim()) {
            newErrors.title = "Title is required.";
        } else {
            delete newErrors.title;
        }

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

        if (!noticeData.title) validationErrors.title = "Title is required.";
        if (!noticeData.expiredDate) {
            validationErrors.expiredDate = "Expiration date is required.";
        } else if (new Date(noticeData.expiredDate) < new Date()) {
            validationErrors.expiredDate = "Expiration date cannot be in the past.";
        }
        if (!uploadedFile) validationErrors.uploadedFile = "A file is required.";

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);

        const formData = new FormData();
        Object.entries(noticeData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        if (uploadedFile) {
            formData.append("fileUrl", uploadedFile);
        }
        if (bannerImage) {
            formData.append("bannerImage", bannerImage);
        }

        try {
            const response = await addNotice(formData);
            if (response.status === 201) {
                showToast("Notice added successfully!", "success");
                navigate("/notices");
            } else {
                showToast(response.message || "Failed to add notice. Please try again.", "error");
            }
        } catch (error) {
            showToast(error.response?.data?.message || "An error occurred. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setNoticeData((prev) => ({ ...prev, [name]: checked }));
    };

    return (
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Breadcrumb />
            <Typography variant="h5" sx={{ mb: "20px", textAlign: "center", fontWeight: 600 }}>
                Add Upcoming Event
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
                        value={noticeData.title}
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
                    {/* <TextField
                        placeholder="Enter description"
                        fullWidth
                        multiline
                        rows={3}
                        name="description"
                        value={noticeData.description}
                        onChange={handleInputChange}
                    /> */}
                    <ReactQuill
                        value={noticeData.description}
                        onChange={handleDescriptionChange}
                        placeholder="Enter description"
                        style={{
                            height: "150px",
                            // border: "1px solid #ccc",
                            borderRadius: "8px",
                            marginBottom: "100px"
                        }}
                    />
                </Box>

                {/* Expiration Date */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Expiration Date</InputLabel>
                    <TextField
                        type="date"
                        fullWidth
                        name="expiredDate"
                        value={noticeData.expiredDate}
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
                            value={noticeData.status}
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

                <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="showBanner"
                                checked={noticeData.showBanner}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label="Show Banner In Home"
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Upload Banner Image</InputLabel>
                    <UploadBox onClick={() => imageInput.current.click()}>
                        {bannerImage ? (
                            <img
                                src={URL.createObjectURL(bannerImage)}
                                alt="BannerImage"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        ) : (
                            <Box sx={{ textAlign: "center" }}>
                                <CloudUpload style={{ fontSize: "40px", color: "#027edd" }} />
                                <Typography variant="body2" color="textSecondary">
                                    Click to upload a BannerImage (JPEG, JPG, PNG, WEBP)
                                </Typography>
                            </Box>
                        )}
                        <input
                            type="file"
                            accept=".jpeg,.jpg,.png,.webp"
                            hidden
                            ref={imageInput}
                            onChange={handleImageChange}
                        />
                    </UploadBox>
                    {errors.bannerImage && (
                        <Typography color="error" variant="body2">
                            {errors.bannerImage}
                        </Typography>
                    )}
                </Box>

                {/* Upload File */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Upload File</InputLabel>
                    <UploadBox onClick={() => fileInput.current.click()}>
                        {uploadedFile ? (
                            <Typography variant="body2">{uploadedFile.name}</Typography>
                        ) : (
                            <Box sx={{ textAlign: "center" }}>
                                <CloudUpload style={{ fontSize: "40px", color: "#027edd" }} />
                                <Typography variant="body2" color="textSecondary">
                                    Click to upload a file (PDF, JPEG, JPG, PNG, WEBP)
                                </Typography>
                            </Box>
                        )}
                        <input
                            type="file"
                            accept=".pdf,.jpeg,.jpg,.png,.webp"
                            hidden
                            ref={fileInput}
                            onChange={handleFileChange}
                        />
                    </UploadBox>
                    {errors.uploadedFile && (
                        <Typography color="error" variant="body2">
                            {errors.uploadedFile}
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
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add Upcoming Event"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddNotice;
