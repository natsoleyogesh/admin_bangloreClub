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
import { BiFileAdd } from "react-icons/bi";
import { showToast } from "../api/toast";
import { useNavigate } from "react-router-dom";
import { addRuleByeLaw } from "../api/ruleByelaws";
import { Description, Category, Gavel } from "@mui/icons-material";
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
const typeOptions = ["Rule", "Byelaw"]; // Dropdown options for Rule or Bylaw
const categoryOptions = ["Club Rule", "Club ByeLaw"]; // Sample categories

const AddRuleByeLaw = () => {
    const [ruleByeLawData, setRuleByeLawData] = useState({
        title: "",
        description: "",
        category: "",
        type: "",
        status: "Active",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRuleByeLawData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleDescriptionChange = (value) => {
        setRuleByeLawData({ ...ruleByeLawData, description: value });
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

        // Type validation
        if (name === "type" && !value) {
            newErrors.type = "Type is required.";
        } else {
            delete newErrors.type;
        }

        // // Category validation
        // if (name === "category" && !value) {
        //     newErrors.category = "Category is required.";
        // } else {
        //     delete newErrors.category;
        // }

        setErrors(newErrors);
    };

    // Validate the entire form before submission
    const validateForm = () => {
        const validationErrors = {};

        if (!ruleByeLawData.title) validationErrors.title = "Title is required.";
        if (!ruleByeLawData.type) validationErrors.type = "Type is required.";
        // if (!ruleByeLawData.category) validationErrors.category = "Category is required.";

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await addRuleByeLaw(ruleByeLawData);
            if (response.status === 201) {
                showToast("Rule/Bylaw added successfully!", "success");
                // navigate("/ruleByeLaw");
                // Navigate based on the 'type' of the rule
                if (ruleByeLawData.type === "Rule") {
                    navigate("/rules"); // Navigate to the 'rules' page
                } else if (ruleByeLawData.type === "Byelaw") {
                    navigate("/byeLaws"); // Navigate to the 'byelaws' page
                }
            } else {
                showToast(response.message || "Failed to add Rule/Bylaw. Please try again.", "error");
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
                Add New Rule/Bylaw
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
                        value={ruleByeLawData.title}
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
                        value={ruleByeLawData.description}
                        onChange={handleInputChange}
                    /> */}
                    <ReactQuill
                        value={ruleByeLawData.description}
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

                {/* Category */}
                {/* <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Category</InputLabel>
                    <FormControl fullWidth>
                        <Select
                            name="category"
                            value={ruleByeLawData.category}
                            onChange={handleInputChange}
                            error={!!errors.category}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Please select category
                            </MenuItem>
                            {categoryOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {errors.category && (
                        <Typography color="error" variant="body2">
                            {errors.category}
                        </Typography>
                    )}
                </Box> */}

                {/* Type */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Type</InputLabel>
                    <FormControl fullWidth>
                        <Select
                            name="type"
                            value={ruleByeLawData.type}
                            onChange={handleInputChange}
                            error={!!errors.type}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Please select type
                            </MenuItem>
                            {typeOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {errors.type && (
                        <Typography color="error" variant="body2">
                            {errors.type}
                        </Typography>
                    )}
                </Box>
                {/* Status */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Status</InputLabel>
                    <FormControl fullWidth>
                        <Select
                            name="status"
                            value={ruleByeLawData.status}
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
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add Rule/Bylaw"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddRuleByeLaw;
