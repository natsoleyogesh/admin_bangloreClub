import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    IconButton,
    FormHelperText,
} from "@mui/material";
import { BiImageAdd } from "react-icons/bi";
import { FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { addFoodAndBeverage } from "../api/foodAndBeverage";
import { showToast } from "../api/toast";
import ReactQuill from "react-quill";
import Breadcrumb from "../components/common/Breadcrumb";
import { fetchAllActiveRestaurants } from "../api/masterData/restaurant";
import { formatTo24Hour } from "../api/config";

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

// const statusOptions = ["Active", "Inactive"];
const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const menuOption = ["Buffet Menu", "A la carte Menu", "Both Menu"];
const menuTypeOption = ["Breakfast", "Lunch", "Dinner", "Brunch", "Snacks", "Beverages", "Fine Dining", "Cafe Bistro", "Bar Lounge"]

const AddFoodAndBeverage = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "Active",
        timings: [{ menu: "Buffet Menu", menuType: "Breakfast", startDay: "Mon", endDay: "Sun", startTime: "09:00", endTime: "21:00" }],
        extansion_no: "",
        location: "",
    });
    const [bannerImages, setBannerImages] = useState([]);
    const [mainmenu, setMainmenu] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors] = useState({});
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);

    const fetchRestaurants = async () => {
        try {
            const response = await fetchAllActiveRestaurants();
            setRestaurants(response?.data?.activeRestaurants || []);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
            showToast(error.message || "Failed to fetch restaurants.", "error");
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // const validateForm = () => {
    //     let formErrors = {};
    //     if (!formData.name) formErrors.name = "Name is required.";
    //     if (!formData.location) formErrors.location = "Location is required.";
    //     if (!formData.extansion_no) formErrors.extansion_no = "Extension number is required.";
    //     if (!formData.description) formErrors.description = "Description is required.";

    //     if (formData.timings.some((timing) => !timing.startDay || !timing.endDay || !timing.startTime || !timing.endTime)) {
    //         formErrors.timings = "All timing fields are required.";
    //     }

    //     if (!bannerImages.length) formErrors.bannerImages = "At least one banner image is required.";
    //     if (!mainmenu) formErrors.mainmenu = "Main menu file is required.";

    //     setErrors(formErrors);
    //     return Object.keys(formErrors).length === 0;
    // };

    const validateForm = () => {
        let formErrors = {};
        if (!formData.name) formErrors.name = "Name is required.";
        if (!formData.location) formErrors.location = "Location is required.";
        if (!formData.extansion_no) formErrors.extansion_no = "Extension number is required.";
        if (!formData.description) formErrors.description = "Description is required.";

        if (formData.timings.some((timing) => !timing.menu || !timing.menuType || !timing.startDay || !timing.endDay || !timing.startTime || !timing.endTime)) {
            formErrors.timings = "All timing fields are required.";
        }

        if (!bannerImages.length) formErrors.bannerImages = "At least one banner image is required.";
        if (!mainmenu) formErrors.mainmenu = "Main menu file is required.";

        // setErrors(formErrors);

        // Show errors using showToast
        Object.values(formErrors).forEach((errorMessage) => {
            showToast(errorMessage, "error");
        });

        return Object.keys(formErrors).length === 0; // Return true if no errors
    };


    const handleCategoryTimingChange = (timingIndex, field, value) => {
        const updatedTimings = [...formData.timings];
        updatedTimings[timingIndex][field] = value;
        setFormData((prev) => ({ ...prev, timings: updatedTimings }));
    };

    const handleDayChange = (timingIndex, field, value) => {
        const updatedTimings = [...formData.timings];
        updatedTimings[timingIndex][field] = value;
        setFormData((prev) => ({ ...prev, timings: updatedTimings }));
    };

    // const handleCategoryMenuChange = (timingIndex, field, value) => {
    //     const updatedTimings = [...formData.timings];
    //     updatedTimings[timingIndex][field] = value;
    //     setFormData((prev) => ({ ...prev, timings: updatedTimings }));
    // };


    const addCategoryTiming = () => {
        setFormData((prev) => ({
            ...prev,
            timings: [...prev.timings, { menu: "Buffet Menu", menuType: "Breakfast", startDay: "Mon", endDay: "Sun", startTime: "09:00", endTime: "21:00" }],
        }));
    };

    const removeCategoryTiming = (timingIndex) => {
        const updatedTimings = formData.timings.filter((_, index) => index !== timingIndex);
        setFormData((prev) => ({ ...prev, timings: updatedTimings }));
    };

    const handleBannerImageChange = (e) => {
        const files = Array.from(e.target.files);
        setBannerImages((prev) => [...prev, ...files]);
    };

    const handleRemoveBannerImage = (index) => {
        setBannerImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleMainmenuChange = (e) => {
        setMainmenu(e.target.files[0]);
    };

    const handleRemoveMainmenu = () => {
        setMainmenu(null);
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        const data = new FormData();

        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("location", formData.location);
        data.append("extansion_no", formData.extansion_no);
        data.append("status", formData.status);
        data.append("timings", JSON.stringify(formData.timings));

        bannerImages.forEach((file) => data.append("bannerImage", file));
        if (mainmenu) data.append("mainmenu", mainmenu);

        try {
            const response = await addFoodAndBeverage(data);
            if (response.status === 201) {
                showToast("Food & Beverage category added successfully!", "success");
                navigate("/foodAndBeverages");
            } else {
                showToast("Failed to add Food & Beverage category.", "error");
            }
        } catch (error) {
            console.error("Error adding Food & Beverage:", error);
            showToast("An error occurred while adding Food & Beverage.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDescriptionChange = (value) => {
        setFormData({ ...formData, description: value });
    };

    return (
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Breadcrumb />
            <Typography variant="h5" sx={{ mb: "20px", textAlign: "center", fontWeight: "bold" }}>
                Add New Food & Beverage
            </Typography>
            <Paper elevation={3} sx={{ p: 4, borderRadius: "10px", maxWidth: "800px", margin: "0 auto" }}>
                <FormControl fullWidth margin="dense" error={Boolean(errors.name)}>
                    <InputLabel>Restaurant Type</InputLabel>
                    <Select name="name" value={formData.name} onChange={handleInputChange}>
                        <MenuItem value="" disabled>
                            Please Choose Restaurant Category
                        </MenuItem>
                        {restaurants.map((type) => (
                            <MenuItem key={type._id} value={type._id}>
                                {type.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.name && <FormHelperText>{errors.name}</FormHelperText>}
                </FormControl>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Description</InputLabel>
                    <ReactQuill
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        placeholder="Enter Description"
                        style={{
                            height: "100px",
                            // border: "1px solid #ccc",
                            borderRadius: "8px",
                            marginBottom: "80px"
                        }}
                    />
                    {errors.description && <FormHelperText error>{errors.description}</FormHelperText>}
                </Box>

                <TextField
                    label="Location"
                    fullWidth
                    margin="dense"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    error={Boolean(errors.location)}
                    helperText={errors.location}
                />

                <TextField
                    label="Extension Number"
                    fullWidth
                    margin="dense"
                    name="extansion_no"
                    value={formData.extansion_no}
                    onChange={handleInputChange}
                    error={Boolean(errors.extansion_no)}
                    helperText={errors.extansion_no}
                />

                <Box>
                    {formData.timings.map((timing, timingIndex) => (
                        <Box key={timingIndex} sx={{ display: "flex", gap: 2, mt: 2 }}>
                            <FormControl fullWidth error={Boolean(errors.timings)}>
                                <InputLabel>Menu</InputLabel>
                                <Select
                                    value={timing.menu}
                                    onChange={(e) => handleDayChange(timingIndex, "menu", e.target.value)}
                                >
                                    {menuOption.map((menu) => (
                                        <MenuItem key={menu} value={menu}>
                                            {menu}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth error={Boolean(errors.timings)}>
                                <InputLabel>Menu Type</InputLabel>
                                <Select
                                    value={timing.menuType}
                                    onChange={(e) => handleDayChange(timingIndex, "menuType", e.target.value)}
                                >
                                    {menuTypeOption.map((menuType) => (
                                        <MenuItem key={menuType} value={menuType}>
                                            {menuType}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth error={Boolean(errors.timings)}>
                                <InputLabel>Start Day</InputLabel>
                                <Select
                                    value={timing.startDay}
                                    onChange={(e) => handleDayChange(timingIndex, "startDay", e.target.value)}
                                >
                                    {dayOptions.map((day) => (
                                        <MenuItem key={day} value={day}>
                                            {day}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>End Day</InputLabel>
                                <Select
                                    value={timing.endDay}
                                    onChange={(e) => handleDayChange(timingIndex, "endDay", e.target.value)}
                                >
                                    {dayOptions.map((day) => (
                                        <MenuItem key={day} value={day}>
                                            {day}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Start Time"
                                type="time"
                                value={timing.startTime}
                                onChange={(e) => handleCategoryTimingChange(timingIndex, "startTime", formatTo24Hour(e.target.value))}
                                placeholder="e.g., 12:00 AM"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true, // Ensures the label doesn't overlap the input
                                }}
                            />

                            <TextField
                                label="End Time"
                                type="time"
                                value={timing.endTime}
                                onChange={(e) => handleCategoryTimingChange(timingIndex, "endTime", formatTo24Hour(e.target.value))}
                                placeholder="e.g., 11:00 PM"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true, // Ensures the label doesn't overlap the input
                                }}
                            />


                            <IconButton color="error" onClick={() => removeCategoryTiming(timingIndex)}>
                                <FiTrash />
                            </IconButton>
                        </Box>
                    ))}
                </Box>

                <Button variant="outlined" sx={{ mt: 2 }} onClick={addCategoryTiming}>
                    Add Timing
                </Button>

                <UploadBox onClick={() => document.getElementById("bannerImageInput").click()}>
                    <input
                        type="file"
                        id="bannerImageInput"
                        multiple
                        style={{ display: "none" }}
                        onChange={handleBannerImageChange}
                    />
                    <BiImageAdd size={30} />
                    <Typography variant="body2">Click to upload banner images</Typography>
                    {errors.bannerImages && <FormHelperText error>{errors.bannerImages}</FormHelperText>}
                </UploadBox>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                    {bannerImages.map((image, index) => (
                        <Box key={index} sx={{ position: "relative" }}>
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Banner"
                                style={{ width: 100, height: 100, borderRadius: 8 }}
                            />
                            <IconButton
                                onClick={() => handleRemoveBannerImage(index)}
                                sx={{ position: "absolute", top: 0, right: 0 }}
                            >
                                <FiTrash color="red" />
                            </IconButton>
                        </Box>
                    ))}
                </Box>

                <UploadBox onClick={() => document.getElementById("mainmenuInput").click()}>
                    <input
                        type="file"
                        id="mainmenuInput"
                        accept="application/pdf"
                        style={{ display: "none" }}
                        onChange={handleMainmenuChange}
                    />
                    <BiImageAdd size={30} />
                    <Typography variant="body2">Click to upload main menu</Typography>
                    {errors.mainmenu && <FormHelperText error>{errors.mainmenu}</FormHelperText>}
                </UploadBox>

                {mainmenu && (
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                        <Typography variant="body2">{mainmenu.name}</Typography>
                        <IconButton onClick={handleRemoveMainmenu} color="error">
                            <FiTrash />
                        </IconButton>
                    </Box>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, width: "100%" }}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Add Food & Beverage"}
                </Button>
            </Paper>
        </Box>
    );
};

export default AddFoodAndBeverage;

