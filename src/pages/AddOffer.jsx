import styled from "@emotion/styled";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { BiImageAdd } from "react-icons/bi";
import { showToast } from "../api/toast";
import { useNavigate } from "react-router-dom";
import { addOffer } from "../api/offer";
import { CalendarToday, Description, Category, Code, CurrencyRupee, Event, Info, Percent } from "@mui/icons-material";
import ReactQuill from "react-quill";
import Breadcrumb from "../components/common/Breadcrumb";
import { fetchAllActiveDepartments } from "../api/masterData/department";

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

const statusOptions = ["Active", "Expired", "Upcoming", "Inactive"];
const typeOptions = ["New", "Current"];
const departmentOptions = ["Recharge", "Purchase", "Subscription", "Entertainment", "Other"];

const AddOffer = () => {
    const [offerData, setOfferData] = useState({
        title: "",
        description: "",
        couponCode: "",
        discountPercentage: "",
        discountAmount: "",
        startDate: "",
        endDate: "",
        type: "",
        department: "",
        status: "Active",
        termsAndConditions: "",
        showExclusive: false,
        discountOffer: false,
        showBanner: false
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const imageInput = useRef(null);
    const navigate = useNavigate();

    const [activeDepartments, setActiveDepartments] = useState([]);

    useEffect(() => {
        getActiveDepartments()
    }, [])

    const getActiveDepartments = async () => {
        try {
            const department = await fetchAllActiveDepartments();
            console.log(department, "hh")
            setActiveDepartments(department.data.activeDepartments);

        } catch (error) {
            console.error("Failed to fetch members :", error);
            showToast("Failed to fetch Members. Please try again.", "error");
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOfferData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleTermChange = (value) => {
        setOfferData({ ...offerData, termsAndConditions: value });
    };

    const handleDescriptionChange = (value) => {
        setOfferData({ ...offerData, description: value });
    };

    // Handle checkbox changes for showExclusive
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setOfferData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    // Validation logic
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        // Title validation
        if (name === "title" && !value.trim()) {
            newErrors.title = "Title is required.";
        } else {
            delete newErrors.title;
        }

        // Start date validation
        if (name === "startDate" && !value.trim()) {
            newErrors.startDate = "Start date is required.";
        } else {
            delete newErrors.startDate;
        }

        // End date validation
        if (name === "endDate" && !value.trim()) {
            newErrors.endDate = "End date is required.";
        } else if (name === "endDate" && new Date(value) < new Date(offerData.startDate)) {
            newErrors.endDate = "End date cannot be earlier than start date.";
        } else {
            delete newErrors.endDate;
        }

        // Discount percentage validation
        if (name === "discountPercentage" && (isNaN(value) || value < 0)) {
            newErrors.discountPercentage = "Discount percentage must be a positive number.";
        } else {
            delete newErrors.discountPercentage;
        }

        setErrors(newErrors);
    };

    const validateForm = () => {
        const validationErrors = {};

        // Required fields
        if (!offerData.title) validationErrors.title = "Title is required.";
        if (!offerData.startDate) validationErrors.startDate = "Start date is required.";
        if (!offerData.endDate) validationErrors.endDate = "End date is required.";
        if (!offerData.discountPercentage) validationErrors.discountPercentage = "Discount percentage is required.";
        if (!offerData.type) validationErrors.type = "Offer type is required.";
        if (!offerData.department) validationErrors.department = "Department is required.";

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);

        const formData = new FormData();
        Object.entries(offerData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        if (image) {
            formData.append("bannerImage", image);
        }

        try {
            const response = await addOffer(formData);
            if (response.status === 201) {
                showToast("Offer added successfully!", "success");
                navigate("/offers");
            } else {
                showToast(response.message || "Failed to add offer. Please try again.", "error");
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
                Create New Offer
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
                        placeholder="Enter offer title"
                        fullWidth
                        name="title"
                        value={offerData.title}
                        onChange={handleInputChange}
                        error={!!errors.title}
                        helperText={errors.title}
                        InputProps={{
                            startAdornment: <Event sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>

                {/* Description */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Description</InputLabel>
                    {/* <TextField
                        placeholder="Describe the offer"
                        fullWidth
                        multiline
                        rows={3}
                        name="description"
                        value={offerData.description}
                        onChange={handleInputChange}
                        InputProps={{
                            startAdornment: <Description sx={{ color: "gray", mr: 1 }} />,
                        }}
                    /> */}
                    <ReactQuill
                        value={offerData.description}
                        onChange={handleDescriptionChange}
                        placeholder="Describe the offer"
                        style={{
                            height: "100px",
                            // border: "1px solid #ccc",
                            borderRadius: "8px",
                            marginBottom: "100px"
                        }}
                    />
                </Box>

                {/* Start Date */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Start Date</InputLabel>
                    <TextField
                        type="date"
                        fullWidth
                        name="startDate"
                        value={offerData.startDate}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                        inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates

                    />
                </Box>

                {/* End Date */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>End Date</InputLabel>
                    <TextField
                        type="date"
                        fullWidth
                        name="endDate"
                        value={offerData.endDate}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                        inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates

                    />
                </Box>

                {/* Discount Percentage */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Discount Percentage</InputLabel>
                    <TextField
                        type="number"
                        placeholder="Enter discount percentage"
                        fullWidth
                        name="discountPercentage"
                        value={offerData.discountPercentage}
                        onChange={handleInputChange}
                        error={!!errors.discountPercentage}
                        helperText={errors.discountPercentage}
                        InputProps={{ startAdornment: <Percent sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                {/* Discount Amount */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Discount Amount</InputLabel>
                    <TextField
                        type="number"
                        placeholder="Enter discount amount"
                        fullWidth
                        name="discountAmount"
                        value={offerData.discountAmount}
                        onChange={handleInputChange}
                        // error={!!errors.discountAmount}
                        // helperText={errors.discountAmount}
                        InputProps={{ startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>

                {/* Coupon Code */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Coupon Code</InputLabel>
                    <TextField
                        placeholder="Enter coupon code"
                        fullWidth
                        name="couponCode"
                        value={offerData.couponCode}
                        onChange={handleInputChange}
                        InputProps={{ startAdornment: <Code sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                {/* Type */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Type</InputLabel>
                    <FormControl fullWidth error={!!errors.type}>
                        <Select
                            name="type"
                            value={offerData.type || ""}
                            onChange={handleInputChange}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Please choose the type
                            </MenuItem>
                            {typeOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.type && (
                            <Typography color="error" variant="body2">
                                {errors.type}
                            </Typography>
                        )}
                    </FormControl>
                </Box>

                {/* Department */}
                {/* <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Department</InputLabel>
                    <FormControl fullWidth error={!!errors.department}>
                        <Select
                            name="department"
                            value={offerData.department || ""}
                            onChange={handleInputChange}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Please choose the department
                            </MenuItem>
                            {departmentOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.department && (
                            <Typography color="error" variant="body2">
                                {errors.department}
                            </Typography>
                        )}
                    </FormControl>
                </Box> */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Department</InputLabel>
                    <FormControl fullWidth error={!!errors.department}>
                        <Select
                            name="department"
                            value={offerData.department || ""}
                            onChange={handleInputChange}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Select department
                            </MenuItem>
                            {activeDepartments.map((option) => (
                                <MenuItem key={option._id} value={option._id}>
                                    {option.departmentName}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.department && (
                            <Typography color="error" variant="body2">
                                {errors.department}
                            </Typography>
                        )}
                    </FormControl>
                </Box>

                {/* Status */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Status</InputLabel>
                    <FormControl fullWidth error={!!errors.status}>
                        <Select
                            name="status"
                            value={offerData.status || ""}
                            onChange={handleInputChange}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Please choose the status
                            </MenuItem>
                            {statusOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.status && (
                            <Typography color="error" variant="body2">
                                {errors.status}
                            </Typography>
                        )}
                    </FormControl>
                </Box>


                {/* Terms and Conditions */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Terms and Conditions</InputLabel>
                    {/* <TextField
                        placeholder="Enter terms and conditions"
                        fullWidth
                        multiline
                        rows={4}
                        name="termsAndConditions"
                        value={offerData.termsAndConditions}
                        onChange={handleInputChange}
                        InputProps={{
                            startAdornment: <Info sx={{ color: "gray", mr: 1 }} />,
                        }}
                    /> */}
                    <ReactQuill
                        value={offerData.termsAndConditions}
                        onChange={handleTermChange}
                        placeholder="Enter terms and conditions"
                        style={{
                            height: "150px",
                            // border: "1px solid #ccc",
                            borderRadius: "8px",
                            marginBottom: "100px"
                        }}
                    />
                </Box>
                {/* Show Exclusive Checkbox */}
                <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="showExclusive"
                                checked={offerData.showExclusive}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label="Show Exclusive"
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="discountOffer"
                                checked={offerData.discountOffer}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label="Discount Offer"
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="showBanner"
                                checked={offerData.showBanner}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label="Show Banner In Home"
                    />
                </Box>

                {/* Offer Image */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Offer Image</InputLabel>
                    <UploadBox onClick={() => imageInput.current.click()}>
                        {image ? (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Offer"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        ) : (
                            <Box sx={{ textAlign: "center" }}>
                                <BiImageAdd style={{ fontSize: "40px", color: "#027edd" }} />
                                <Typography variant="body2" color="textSecondary">
                                    Click to upload offer image
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    (JPG, PNG, GIF)
                                </Typography>
                            </Box>
                        )}
                        <input type="file" hidden ref={imageInput} onChange={handleImageChange} />
                    </UploadBox>
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
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add Offer"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddOffer;
