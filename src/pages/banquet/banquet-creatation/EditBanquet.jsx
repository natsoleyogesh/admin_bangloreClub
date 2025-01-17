import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { FiPlus, FiTrash } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import {
    fetchBanquetDetails,
    updateBanquetDetails,
    uploadBanquetImage,
    deleteBanquetImage,
    fetchEditBanquetDetails,
} from "../../../api/banquet";
import { fetchActiveAllBanquetCategories } from "../../../api/category";
import { fetchAllActiveTaxTypes } from "../../../api/masterData/taxType";
import { fetchAllActiveAmenities } from "../../../api/masterData/amenities";
import { showToast } from "../../../api/toast";
import { PUBLIC_API_URI } from "../../../api/config";
import ReactQuill from "react-quill";
import { CurrencyRupee } from "@mui/icons-material";
import Breadcrumb from "../../../components/common/Breadcrumb";

const daysOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const statusOptions = ["Active", "Inactive"];


const EditBanquet = ({ editdata }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const imageInput = useRef(null);

    const [banquetData, setBanquetData] = useState({
        description: "",
        checkInTime: "",
        checkOutTime: "",
        maxAllowedPerRoom: "",
        priceRange: { minPrice: "", maxPrice: "" },
        pricingDetails: [{ days: [], timeSlots: [{ start: "", end: "" }], price: "" }],
        specialDayTariff: [{ special_day_name: "", startDate: "", endDate: "", extraCharge: "" }],
        taxTypes: [],
        amenities: [],
        cancellationPolicy: {
            before7Days: "",
            between7To2Days: "",
            between48To24Hours: "",
            lessThan24Hours: "",
        },
        breakfastIncluded: false,
        banquetHallSize: "",
        features: { smokingAllowed: false, petFriendly: false, accessible: false },
        status: "Active",
        pricingDetailDescription: "",
    });

    const [images, setImages] = useState([]);
    const [amenitiesOptions, setAmenitiesOptions] = useState([]);
    const [taxTypes, setTaxTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // const [loading, setLoading] = useState(false);

    useEffect(() => {
        // getBanquetById();
        fetchTaxTypes();
        fetchAmenities();
    }, []);

    useEffect(() => {
        if (id) {
            if (!loading) {
                getBanquetById(id);
            }
        }
    }, [id]);



    const fetchTaxTypes = async () => {
        try {
            const response = await fetchAllActiveTaxTypes();
            setTaxTypes(response?.data?.data || []);
        } catch (error) {
            showToast("Failed to fetch tax types.", "error");
        }
    };

    const fetchAmenities = async () => {
        try {
            const response = await fetchAllActiveAmenities();
            setAmenitiesOptions(response?.data?.data || []);
        } catch (error) {
            showToast("Failed to fetch amenities.", "error");
        }
    };
    const getBanquetById = async (id) => {
        if (!id) return; // Guard condition to prevent unnecessary calls
        setLoading(true);
        try {
            const response = await fetchEditBanquetDetails(id);
            const banquet = response?.data?.data || {};
            console.log(banquet, "dgdgdg")
            setBanquetData((prevState) => ({
                ...prevState,
                ...banquet,
                priceRange: banquet.priceRange || { minPrice: "", maxPrice: "" },
                pricingDetails: banquet.pricingDetails || [{ days: [], timeSlots: [{ start: "12:00", end: "23:00" }], price: "" }],
                specialDayTariff: banquet.specialDayTariff || [{ special_day_name: "", startDate: "", endDate: "", extraCharge: "" }],
                taxTypes: banquet.taxTypes || [],
                amenities: banquet.amenities || [],
                cancellationPolicy: banquet.cancellationPolicy || {
                    before7Days: "",
                    between7To2Days: "",
                    between48To24Hours: "",
                    lessThan24Hours: "",
                },
                features: banquet.features || { smokingAllowed: false, petFriendly: false, accessible: false },
                pricingDetailDescription: banquet.pricingDetailDescription || "",
            }));

            setImages(banquet.images || []);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch banquet details:", error);
            showToast("Failed to fetch banquet details.", "error");
        } finally {
            setLoading(false);
        }
    };



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value, "handleInputChenage")
        setBanquetData({ ...banquetData, [name]: value });
    };

    const handleSaveChanges = async () => {
        try {
            setLoading(true);
            console.log(banquetData, "banquetDataFormdata")
            const response = await updateBanquetDetails(id, banquetData);
            if (response.status === 200) {
                showToast("Banquet updated successfully.", "success");
                navigate(`/banquet/${id}`);
            }
        } catch (error) {
            showToast("Failed to update banquet details.", "error");
        } finally {
            setLoading(false);
        }
    };

    // const handleUploadImage = async (event) => {
    //     const files = Array.from(event.target.files);
    //     if (!files || files.length === 0) {
    //         showToast("No files selected.", "error");
    //         return;
    //     }

    //     const formData = new FormData();
    //     files.forEach((file) => formData.append("images", file));

    //     try {
    //         const response = await uploadBanquetImage(id, formData);
    //         if (response.status === 200) {
    //             getBanquetById();
    //             showToast("Images uploaded successfully.", "success");
    //         }
    //     } catch (error) {
    //         showToast("Failed to upload images.", "error");
    //     }
    // };

    const handleUploadImage = async (event) => {
        const files = Array.from(event.target.files); // Convert FileList to an array
        const maxSize = 100 * 1024; // 100KB in bytes

        if (!files || files.length === 0) {
            showToast("No files selected.", "error");
            return;
        }

        const validFiles = [];
        const invalidFiles = [];

        // Validate file sizes
        files.forEach((file) => {
            if (file.size <= maxSize) {
                validFiles.push(file); // Add valid files to the array
            } else {
                invalidFiles.push(file.name); // Collect names of invalid files
            }
        });

        // Show a toast for invalid files, if any
        if (invalidFiles.length > 0) {
            showToast(
                `The following files exceed 100KB and were not added: ${invalidFiles.join(", ")}`,
                "error"
            );
        }

        // If no valid files, stop the upload process
        if (validFiles.length === 0) {
            showToast("No valid files to upload.", "error");
            return;
        }

        // Create FormData and append valid files
        const formData = new FormData();
        validFiles.forEach((file) => formData.append("images", file));

        try {
            const response = await uploadBanquetImage(id, formData);
            if (response.status === 200) {
                // Refresh data and show success message
                getBanquetById(id);
                showToast("Images uploaded successfully.", "success");
            } else {
                showToast("Failed to upload images.", "error");
            }
        } catch (error) {
            console.error("Error uploading images:", error);
            showToast("Failed to upload images. Please try again.", "error");
        }
    };


    const handleDeleteImage = async (index) => {
        try {
            await deleteBanquetImage(id, index);
            getBanquetById();
            showToast("Image deleted successfully.", "success");
        } catch (error) {
            showToast("Failed to delete image.", "error");
        }
    };

    // Handle checkbox changes for Amenities
    const handleChangeAmenities = (event) => {
        const { value, checked } = event.target;
        console.log(value, checked, "datat", banquetData.amenities)
        setBanquetData((prevState) => ({
            ...prevState,
            amenities: checked
                ? [...prevState.amenities, value] // Add amenity ID if checked
                : prevState.amenities.filter((amenity) => amenity !== value), // Remove amenity ID if unchecked
        }));
    };

    // Handle checkbox changes for Amenities
    const handleChangeTaxTypes = (event) => {
        const { value, checked } = event.target;
        console.log(banquetData.taxTypes, value, checked, "banquetData.taxTypes")
        setBanquetData((prevState) => ({
            ...prevState,
            taxTypes: checked
                ? [...prevState.taxTypes, value] // Add amenity ID if checked
                : prevState.taxTypes.filter((taxType) => taxType !== value), // Remove taxType ID if unchecked
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        console.log(banquetData.breakfastIncluded, name, checked, "breakfast")
        setBanquetData({ ...banquetData, [name]: checked });
    };

    const handlePriceInputChange = (event) => {
        const { name, value } = event.target;
        console.log(banquetData.priceRange, name, value, "pricerange")
        // Update minPrice or maxPrice based on the field name
        setBanquetData((prevData) => ({
            ...prevData,
            priceRange: {
                ...prevData.priceRange,
                [name]: value,
            },
        }));
    };

    const handleFeatureChange = (e) => {
        const { name, checked } = e.target;
        console.log(banquetData.features, name, checked, "handleInputChange");
        setBanquetData({
            ...banquetData,
            features: {
                ...banquetData.features,
                [name]: checked,
            },
        });
    };

    const handleCancalletionChange = (e) => {
        const { name, value } = e.target;
        console.log(banquetData.cancellationPolicy, name, value, "handleInputChange");
        setBanquetData({
            ...banquetData,
            cancellationPolicy: {
                ...banquetData.cancellationPolicy,
                [name]: value,
            },
        });
    };

    // Handle input changes for Special Day Tariff
    const handleSpecialDayTariffChange = (e) => {
        const { name, value } = e.target;
        console.log(banquetData.specialDayTariff, name, value, "specialdaay")
        const [field, index, prop] = name.split('[').map((item) => item.replace(']', ''));

        if (index !== undefined && prop !== undefined) {
            const updatedSpecialDayTariff = [...banquetData.specialDayTariff];
            updatedSpecialDayTariff[index][prop] = value;
            setBanquetData({
                ...banquetData,
                specialDayTariff: updatedSpecialDayTariff,
            });
        }
    };

    // Add a new special day tariff entry
    const addSpecialDayTariff = () => {
        setBanquetData({
            ...banquetData,
            specialDayTariff: [
                ...banquetData.specialDayTariff,
                { special_day_name: '', startDate: '', endDate: '', extraCharge: '', description: '' },
            ],
        });
    };

    // Remove a special day tariff entry
    const removeSpecialDayTariff = (index) => {
        const updatedSpecialDayTariff = banquetData.specialDayTariff.filter((_, i) => i !== index);
        setBanquetData({
            ...banquetData,
            specialDayTariff: updatedSpecialDayTariff,
        });
    };




    const handleAddPricingDetail = () => {
        setBanquetData((prevData) => ({
            ...prevData,
            pricingDetails: [
                ...prevData.pricingDetails,
                { days: [], timeSlots: [{ start: null, end: null }], price: "" },
            ],
        }));
    };

    const handleRemovePricingDetail = (index) => {
        setBanquetData((prevData) => ({
            ...prevData,
            pricingDetails: prevData.pricingDetails.filter((_, i) => i !== index),
        }));
    };

    const handlePricingDetailChange = (index, field, value) => {
        const updatedPricingDetails = [...banquetData.pricingDetails];
        updatedPricingDetails[index][field] = value;
        setBanquetData((prevData) => ({
            ...prevData,
            pricingDetails: updatedPricingDetails,
        }));
    };

    const handleDaySelection = (index, day) => {
        const updatedPricingDetails = [...banquetData.pricingDetails];
        const currentDays = updatedPricingDetails[index].days;
        if (currentDays.includes(day)) {
            updatedPricingDetails[index].days = currentDays.filter((d) => d !== day);
        } else {
            updatedPricingDetails[index].days.push(day);
        }
        setBanquetData((prevData) => ({
            ...prevData,
            pricingDetails: updatedPricingDetails,
        }));
    };

    const handleTimeSlotChange = (pricingIndex, slotIndex, field, value) => {
        const updatedPricingDetails = [...banquetData.pricingDetails];
        updatedPricingDetails[pricingIndex].timeSlots[slotIndex][field] = value;
        setBanquetData((prevData) => ({
            ...prevData,
            pricingDetails: updatedPricingDetails,
        }));
    };

    const handleAddTimeSlot = (index) => {
        const updatedPricingDetails = [...banquetData.pricingDetails];
        updatedPricingDetails[index].timeSlots.push({ start: null, end: null });
        setBanquetData((prevData) => ({
            ...prevData,
            pricingDetails: updatedPricingDetails,
        }));
    };

    // Function to remove a specific time slot
    const handleRemoveTimeSlot = (pricingIndex, slotIndex) => {
        setBanquetData((prevData) => {
            const updatedPricingDetails = [...prevData.pricingDetails];
            const updatedTimeSlots = updatedPricingDetails[pricingIndex].timeSlots.filter(
                (_, index) => index !== slotIndex
            );
            updatedPricingDetails[pricingIndex].timeSlots = updatedTimeSlots;
            return { ...prevData, pricingDetails: updatedPricingDetails };
        });
    };

    if (loading) {
        return (
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    zIndex: 1000,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        )
    }
    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            {loading && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        zIndex: 1000,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
            <Breadcrumb />
            <Typography variant="h4">Edit Banquet</Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
                {/* Form Fields */}
                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                            {images.map((image, index) => (
                                <Box key={index} sx={{ position: "relative" }}>
                                    <img src={`${PUBLIC_API_URI}${image}`} alt="Banquet" height={120} width={120} />
                                    <IconButton onClick={() => handleDeleteImage(index)}>
                                        <FiTrash />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                        {/* <input type="file" hidden ref={imageInput} multiple onChange={handleUploadImage} />
                        <Button variant="outlined" component="label" onClick={() => imageInput.current.click()}>
                            Upload Image
                        </Button>
                        <span>only 6 files allow (less than 100kb)</span> */}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {/* Hidden file input */}
                            <input
                                type="file"
                                hidden
                                ref={imageInput}
                                multiple
                                accept="image/*"
                                onChange={handleUploadImage}
                            />

                            {/* Upload button */}
                            <Button
                                variant="outlined"
                                component="label"
                                onClick={() => imageInput.current.click()}
                            >
                                Upload Image
                            </Button>

                            {/* Small message */}
                            <Typography variant="caption" color="textSecondary">
                                Only 6 files are allowed, and each must be less than 100 KB.
                            </Typography>
                        </div>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        {/* Description */}
                        <Box sx={{ mb: 3 }}>
                            <InputLabel sx={{ fontWeight: "bold", mb: 1 }}>Pricing Details Description</InputLabel>
                            <ReactQuill
                                value={banquetData.pricingDetailDescription}
                                onChange={(value) =>
                                    setBanquetData((prev) => ({ ...prev, pricingDetailDescription: value }))
                                }
                                placeholder="Describe the pricing details"
                                style={{ height: "120px", borderRadius: "8px", marginBottom: "100px" }}
                            />
                        </Box>

                        {/* <TextField label="Description" fullWidth multiline rows={3} margin="dense" name="description" value={banquetData.description} onChange={handleInputChange} /> */}
                        <InputLabel sx={{ fontWeight: "bold", mt: 2 }}>Facilities Description</InputLabel>
                        <ReactQuill
                            value={banquetData.description || ""}
                            onChange={(value) => setBanquetData({ ...banquetData, description: value })}
                            style={{ height: "150px", marginBottom: "80px" }}
                        />
                        <TextField label="Check-In Time" type="time" fullWidth margin="dense" name="checkInTime" value={banquetData.checkInTime || ""} onChange={handleInputChange} />
                        <TextField label="Check-Out Time" type="time" fullWidth margin="dense" name="checkOutTime" value={banquetData.checkOutTime || ""} onChange={handleInputChange} />
                        <TextField label="Max Allowed Per Room" fullWidth margin="dense" name="maxAllowedPerRoom" value={banquetData.maxAllowedPerRoom || ""} onChange={handleInputChange} />
                        <TextField label="Banquet Hall Size" fullWidth margin="dense" name="banquetHallSize" value={banquetData.banquetHallSize || ""} onChange={handleInputChange} />
                        {/* Price Range */}
                        <Box sx={{ mb: 2 }}>
                            <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Min Price</InputLabel>
                            <TextField
                                placeholder="Enter minimum price"
                                fullWidth
                                margin="dense"
                                name="minPrice"
                                value={banquetData.priceRange.minPrice || ""}
                                onChange={handlePriceInputChange}

                                InputProps={{
                                    startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} />,
                                }}
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Max Price</InputLabel>
                            <TextField
                                placeholder="Enter maximum price"
                                fullWidth
                                margin="dense"
                                name="maxPrice"
                                value={banquetData.priceRange.maxPrice || ""}
                                onChange={handlePriceInputChange}

                                InputProps={{
                                    startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} />,
                                }}
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Banquet Amenities</InputLabel>
                            <FormControl fullWidth>
                                <div>
                                    {amenitiesOptions.map((amenity) => (
                                        <FormControlLabel
                                            key={amenity._id}
                                            control={
                                                <Checkbox checked={banquetData.amenities.includes(amenity._id)} onChange={handleChangeAmenities}

                                                    value={amenity._id} />
                                            }
                                            label={amenity.name}
                                        />
                                    ))}
                                </div>
                            </FormControl>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Banquet Tax Types</InputLabel>
                            <FormControl fullWidth>
                                <div>
                                    {taxTypes.map((taxType) => (
                                        <FormControlLabel
                                            key={taxType._id}
                                            control={
                                                <Checkbox checked={banquetData.taxTypes.includes(taxType._id)} onChange={handleChangeTaxTypes}

                                                    value={taxType._id} />
                                            }
                                            label={taxType.name}
                                        />
                                    ))}
                                </div>
                            </FormControl>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Breakfast Included</InputLabel>
                            <FormControlLabel
                                control={<Checkbox checked={banquetData.breakfastIncluded} onChange={handleCheckboxChange} name="breakfastIncluded" />}
                                label="Breakfast Included"
                            />
                        </Box>

                        {/* <Box sx={{ mb: 2 }}>
                            <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Permissions</InputLabel>
                            <FormControlLabel
                                control={<Checkbox checked={banquetData.features.smokingAllowed} onChange={handleFeatureChange} name="smokingAllowed" />}
                                label="Smoking Allowed"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={banquetData.features.petFriendly} onChange={handleFeatureChange} name="petFriendly" />}
                                label="Pet Friendly"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={banquetData.features.accessible} onChange={handleFeatureChange} name="accessible" />}
                                label="Accessible"
                            />
                        </Box> */}

                        {/* Cancellation Policy */}
                        <Box sx={{ mb: 2 }}>
                            <InputLabel sx={{ fontWeight: 'bold', mb: 2 }}>Cancellation Policies In (%)</InputLabel>

                            {/* Cancellation Before 7 Days */}
                            <Box sx={{ mb: 2 }}>
                                <InputLabel sx={{ fontWeight: 'medium', mb: 1 }}>Cancellation Before 7 Days</InputLabel>
                                <TextField
                                    fullWidth
                                    name="before7Days"
                                    type="text"
                                    value={banquetData.cancellationPolicy.before7Days}
                                    onChange={handleCancalletionChange}
                                    error={!!errors.before7Days}
                                    helperText={errors.before7Days}
                                />
                            </Box>

                            {/* Cancellation Between 7 to 2 Days */}
                            <Box sx={{ mb: 2 }}>
                                <InputLabel sx={{ fontWeight: 'medium', mb: 1 }}>Between 7 to 2 Days</InputLabel>
                                <TextField
                                    fullWidth
                                    name="between7To2Days"
                                    type="text"
                                    value={banquetData.cancellationPolicy.between7To2Days}
                                    onChange={handleCancalletionChange}
                                    error={!!errors.between7To2Days}
                                    helperText={errors.between7To2Days}
                                />
                            </Box>

                            {/* Cancellation Between 48 to 24 Hours */}
                            <Box sx={{ mb: 2 }}>
                                <InputLabel sx={{ fontWeight: 'medium', mb: 1 }}>Between 48 to 24 Hours</InputLabel>
                                <TextField
                                    fullWidth
                                    name="between48To24Hours"
                                    type="text"
                                    value={banquetData.cancellationPolicy.between48To24Hours}
                                    onChange={handleCancalletionChange}
                                    error={!!errors.between48To24Hours}
                                    helperText={errors.between48To24Hours}
                                />
                            </Box>

                            {/* Cancellation Less Than 24 Hours */}
                            <Box sx={{ mb: 2 }}>
                                <InputLabel sx={{ fontWeight: 'medium', mb: 1 }}>Less Than 24 Hours</InputLabel>
                                <TextField
                                    fullWidth
                                    name="lessThan24Hours"
                                    type="text"
                                    value={banquetData.cancellationPolicy.lessThan24Hours}
                                    onChange={handleCancalletionChange}
                                    error={!!errors.lessThan24Hours}
                                    helperText={errors.lessThan24Hours}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Special Day Tariff Details</InputLabel>
                            {banquetData.specialDayTariff.map((tariff, index) => (
                                <Box key={index} sx={{ display: "flex", gap: 2, margin: "5px" }}>
                                    {/* Special Day Name */}
                                    <TextField
                                        fullWidth
                                        name={`specialDayTariff[${index}][special_day_name]`}
                                        label="Special Day Name"
                                        value={tariff.special_day_name}
                                        onChange={handleSpecialDayTariffChange}
                                    />

                                    {/* Start Date */}
                                    <TextField
                                        fullWidth
                                        name={`specialDayTariff[${index}][startDate]`}
                                        label="Start Date"
                                        type="date"
                                        value={tariff.startDate ? tariff.startDate.split('T')[0] : ''}
                                        onChange={handleSpecialDayTariffChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />

                                    {/* End Date */}
                                    <TextField
                                        fullWidth
                                        name={`specialDayTariff[${index}][endDate]`}
                                        label="End Date"
                                        type="date"
                                        value={tariff.endDate ? tariff.endDate.split('T')[0] : ''}
                                        onChange={handleSpecialDayTariffChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />

                                    {/* Extra Charge */}
                                    <TextField
                                        fullWidth
                                        name={`specialDayTariff[${index}][extraCharge]`}
                                        label="Extra Charge"
                                        type="number"
                                        value={tariff.extraCharge}
                                        onChange={handleSpecialDayTariffChange}
                                    />

                                    {/* Description */}
                                    <TextField
                                        fullWidth
                                        name={`specialDayTariff[${index}][description]`}
                                        label="Description"
                                        multiline
                                        rows={1}
                                        value={tariff.description}
                                        onChange={handleSpecialDayTariffChange}
                                    />

                                    {/* Remove Button */}
                                    {banquetData.specialDayTariff.length > 1 && (
                                        <IconButton onClick={() => removeSpecialDayTariff(index)}>
                                            <FiTrash />
                                        </IconButton>
                                    )}
                                </Box>
                            ))}

                            {/* Add Button */}
                            <Box sx={{ mb: 2 }}>
                                <Button variant="contained" onClick={addSpecialDayTariff}>
                                    Add Special Day Tariff
                                </Button>
                            </Box>
                        </Box>

                        <Paper sx={{ p: 3, borderRadius: "12px", mt: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Pricing Details
                            </Typography>
                            {banquetData.pricingDetails.map((detail, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        mb: 3,
                                        p: 2,
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                    }}
                                >
                                    {/* Days Selection */}
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
                                            Select Days
                                        </Typography>
                                        {daysOptions.map((day) => (
                                            <FormControlLabel
                                                key={day}
                                                control={
                                                    <Checkbox
                                                        checked={detail.days.includes(day)}
                                                        onChange={() => handleDaySelection(index, day)}
                                                    />
                                                }
                                                label={day}
                                            />
                                        ))}
                                        {errors[`days_${index}`] && (
                                            <Typography color="error">{errors[`days_${index}`]}</Typography>
                                        )}
                                    </Box>

                                    {/* Time Slots */}
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
                                            Time Slots
                                        </Typography>
                                        {detail.timeSlots.map((slot, slotIndex) => (
                                            <Box key={slotIndex} sx={{ display: "flex", gap: 2, mb: 1 }}>
                                                <TextField
                                                    label="Start Time"
                                                    type="time"
                                                    fullWidth
                                                    margin="dense"
                                                    value={slot.start || ""}
                                                    onChange={(e) =>
                                                        handleTimeSlotChange(index, slotIndex, "start", e.target.value)
                                                    }
                                                    error={!!errors[`timeSlotStart_${index}_${slotIndex}`]}
                                                    helperText={errors[`timeSlotStart_${index}_${slotIndex}`]}
                                                />
                                                <TextField
                                                    label="End Time"
                                                    type="time"
                                                    fullWidth
                                                    margin="dense"
                                                    value={slot.end || ""}
                                                    onChange={(e) =>
                                                        handleTimeSlotChange(index, slotIndex, "end", e.target.value)
                                                    }
                                                    error={!!errors[`timeSlotEnd_${index}_${slotIndex}`]}
                                                    helperText={errors[`timeSlotEnd_${index}_${slotIndex}`]}
                                                />

                                                {detail.timeSlots.length > 1 && (
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleRemoveTimeSlot(index, slotIndex)}
                                                        size="small"
                                                        sx={{
                                                            margin: "15px"
                                                        }}
                                                    >
                                                        <FiTrash />
                                                    </Button>
                                                )}

                                                {slotIndex === detail.timeSlots.length - 1 && (
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => handleAddTimeSlot(index)}
                                                        size="small"
                                                        sx={{
                                                            margin: "15px"
                                                        }}
                                                    >
                                                        <FiPlus />
                                                    </Button>
                                                )}
                                            </Box>
                                        ))}
                                        {errors[`timeSlots_${index}`] && (
                                            <Typography color="error">
                                                {errors[`timeSlots_${index}`]}
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* Price */}
                                    <Box sx={{ mb: 2 }}>
                                        <TextField
                                            label="Price"
                                            placeholder="Enter price"
                                            value={detail.price}
                                            onChange={(e) =>
                                                handlePricingDetailChange(index, "price", e.target.value)
                                            }
                                            error={!!errors[`price_${index}`]}
                                            helperText={errors[`price_${index}`]}
                                            fullWidth
                                            size="small"
                                        />
                                    </Box>

                                    {/* Remove Pricing Detail */}
                                    <Box>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => handleRemovePricingDetail(index)}
                                        >
                                            <FiTrash /> Remove Pricing
                                        </Button>
                                    </Box>
                                </Box>
                            ))}

                            {/* Add Pricing Detail Button */}
                            <Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<FiPlus />}
                                    onClick={handleAddPricingDetail}
                                >
                                    Add Pricing Detail
                                </Button>
                            </Box>
                        </Paper>




                        <Box sx={{ mb: 2 }}>
                            <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Status</InputLabel>
                            <FormControl fullWidth margin="dense" >
                                <Select name="status" value={banquetData.status} onChange={handleInputChange} displayEmpty
                                // startAdornment={<HotelIcon sx={{ color: "gray", mr: 1 }} />}
                                >
                                    <MenuItem value="" disabled>
                                        Please Choose  Status
                                    </MenuItem>
                                    {statusOptions.map((option) => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                    </Grid>
                </Grid>

                <Button variant="contained" onClick={handleSaveChanges} sx={{ mt: 3 }} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
            </Paper>
        </Box>
    );
};

export default EditBanquet;
