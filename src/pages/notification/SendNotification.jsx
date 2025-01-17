
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
    IconButton,
} from "@mui/material";
import { Description } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete"; // Import Delete icon
import { useNavigate } from "react-router-dom";
import { sendNotification } from "../../api/notification";
import ReactQuill from "react-quill";
import { showToast } from "../../api/toast";

const departmentOptions = ["Offer", "Event"]; // Updated department options
const sendToOptions = ["All"]; // Send To dropdown with only one option

const SendNotification = () => {
    const [notificationData, setNotificationData] = useState({
        title: "",
        send_to: "All",
        push_message: "",
        department: "",
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNotificationData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file input change (Image Upload)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const maxSize = 100 * 1024; // 100KB in bytes

        if (file) {
            if (file.size <= maxSize) {
                setNotificationData((prev) => ({ ...prev, image: file }));
                setImagePreview(URL.createObjectURL(file)); // Set the image preview
            } else {
                showToast("File size must be less than 100KB.", "error");
            }
        } else {
            showToast("Please select a valid image file.", "error");
        }
    };

    // Handle removing the selected image
    const handleRemoveImage = () => {
        setNotificationData((prev) => ({ ...prev, image: null })); // Remove image from state
        setImagePreview(null); // Remove the preview
    };

    const validateForm = () => {
        const errors = {};

        if (!notificationData.title.trim()) {
            errors.title = "Notification Title is required.";
            showToast(errors.title, "error");
        }
        if (!notificationData.push_message.trim()) {
            errors.push_message = "Push message is required.";
            showToast(errors.push_message, "error");
        }
        if (!notificationData.department.trim()) {
            errors.department = "Please select a department.";
            showToast(errors.department, "error");
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", notificationData.title);
            formData.append("send_to", notificationData.send_to);
            formData.append("push_message", notificationData.push_message);
            formData.append("department", notificationData.department);
            if (notificationData.image) {
                formData.append("image", notificationData.image); // Append image if selected
            }

            const response = await sendNotification(formData); // API call to send notification
            if (response.status === 201) {
                showToast("Notification sent successfully!", "success");
                navigate("/notifications"); // Redirect after success
            } else {
                showToast(response.message || "Failed to send notification. Please try again.", "error");
            }
        } catch (error) {
            showToast(
                error.response?.data?.message || "An error occurred while sending the notification.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Typography variant="h5" sx={{ mb: "20px", textAlign: "center", fontWeight: 600 }}>
                Send Custom Notification
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
                {/* Notification Title */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Notification Title</InputLabel>
                    <TextField
                        placeholder="Enter Notification Title"
                        fullWidth
                        name="title"
                        value={notificationData.title}
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

                {/* Send To */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Send To</InputLabel>
                    <FormControl fullWidth>
                        <Select
                            name="send_to"
                            value={notificationData.send_to}
                            onChange={handleInputChange}
                            disabled // Disable dropdown since there's only one option
                        >
                            {sendToOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Push Message */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Push Message</InputLabel>
                    <ReactQuill
                        value={notificationData.push_message}
                        onChange={(value) =>
                            setNotificationData((prev) => ({ ...prev, push_message: value }))
                        }
                        placeholder="Please write the Notification Message"
                        style={{ height: "120px", borderRadius: "8px", marginBottom: "80px" }}
                    />
                </Box>

                {/* Department */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Department</InputLabel>
                    <FormControl fullWidth>
                        <Select
                            name="department"
                            value={notificationData.department}
                            onChange={handleInputChange}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Please select The Department
                            </MenuItem>
                            {departmentOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Image Upload */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Image (Optional)</InputLabel>
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ textAlign: "center", padding: "12px", fontWeight: "bold" }}
                    >
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                    {imagePreview && (
                        <Box sx={{ mt: 2, textAlign: "center", position: "relative" }}>
                            <img
                                src={imagePreview}
                                alt="Image Preview"
                                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                            />
                            <IconButton
                                onClick={handleRemoveImage}
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    backgroundColor: "white",
                                    boxShadow: 1,
                                }}
                            >
                                <DeleteIcon color="error" />
                            </IconButton>
                        </Box>
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
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Send Notification"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default SendNotification;
