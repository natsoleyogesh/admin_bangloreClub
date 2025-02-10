import React, { useState } from "react";
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
import { showToast } from "../api/toast";
import { useNavigate } from "react-router-dom";
import { addFAQ } from "../api/faq";
import { QuestionAnswer } from "@mui/icons-material";
import Breadcrumb from "../components/common/Breadcrumb";

const statusOptions = ["Active", "Inactive"]; // FAQ status options
const categoryOptions = ["General", "Technical", "Membership"]; // FAQ category options

const AddFAQ = () => {
    const [faqData, setFaqData] = useState({
        question: "",
        answer: "",
        category: "",
        status: "Active",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFaqData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    // Validation logic for individual fields
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        // Question validation
        if (name === "question" && !value.trim()) {
            newErrors.question = "Question is required.";
        } else {
            delete newErrors.question;
        }

        // Answer validation
        if (name === "answer" && !value.trim()) {
            newErrors.answer = "Answer is required.";
        } else {
            delete newErrors.answer;
        }

        // Category validation
        if (name === "category" && !value) {
            newErrors.category = "Category is required.";
        } else {
            delete newErrors.category;
        }

        setErrors(newErrors);
    };

    // Validate the entire form before submission
    const validateForm = () => {
        const validationErrors = {};

        if (!faqData.question) validationErrors.question = "Question is required.";
        if (!faqData.answer) validationErrors.answer = "Answer is required.";
        if (!faqData.category) validationErrors.category = "Category is required.";

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await addFAQ(faqData);
            if (response.status === 201) {
                showToast("FAQ added successfully!", "success");
                navigate("/faqs");
            } else {
                showToast(response.message || "Failed to add FAQ. Please try again.", "error");
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
                Add New FAQ
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
                {/* Question */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Question</InputLabel>
                    <TextField
                        placeholder="Enter FAQ question"
                        fullWidth
                        name="question"
                        value={faqData.question}
                        onChange={handleInputChange}
                        error={!!errors.question}
                        helperText={errors.question}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <QuestionAnswer />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Answer */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Answer</InputLabel>
                    <TextField
                        placeholder="Enter FAQ answer"
                        fullWidth
                        multiline
                        rows={3}
                        name="answer"
                        value={faqData.answer}
                        onChange={handleInputChange}
                        error={!!errors.answer}
                        helperText={errors.answer}
                    />
                </Box>

                {/* Category */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Category</InputLabel>
                    <FormControl fullWidth>
                        <Select
                            name="category"
                            value={faqData.category}
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
                </Box>

                {/* Status */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Status</InputLabel>
                    <FormControl fullWidth>
                        <Select
                            name="status"
                            value={faqData.status}
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
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add FAQ"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddFAQ;
