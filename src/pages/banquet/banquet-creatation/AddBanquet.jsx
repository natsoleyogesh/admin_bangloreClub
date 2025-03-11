import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import { addBanquet, fetchActiveAllBanquetCategories } from "../../../api/banquet";
import { showToast } from "../../../api/toast";
import { CurrencyRupee, Work } from "@mui/icons-material";
import { fetchAllActiveTaxTypes } from "../../../api/masterData/taxType";
import { fetchAllActiveAmenities } from "../../../api/masterData/amenities";
import { FiTrash, FiPlus } from "react-icons/fi";
import { BiImageAdd } from "react-icons/bi";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CategoryIcon from "@mui/icons-material/Category";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import HotelIcon from "@mui/icons-material/Hotel";
import Breadcrumb from "../../../components/common/Breadcrumb";

const statusOptions = ["Active", "Inactive"];
const BillableOptions = [true, false];

const daysOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const AddBanquet = () => {
    const [banquetData, setBanquetData] = useState({
        banquetName: "",
        description: "",
        // checkInTime: "09:00",  // 12:00 PM
        // checkOutTime: "21:00",  // 11:00 AM
        maxAllowedPerRoom: "",
        minAllowedPerRoom: "",
        priceRange: { minPrice: "", maxPrice: "" },
        pricingDetails: [{ days: [], timeSlots: [{ start: "09:00", end: "21:00" }], price: "" }],
        amenities: [],
        taxTypes: [],
        breakfastIncluded: false,
        banquetHallSize: "",
        cancellationPolicy: {
            before7Days: "",
            between7To2Days: "",
            between48To24Hours: "",
            lessThan24Hours: "",
        },
        features: { smokingAllowed: false, petFriendly: false, accessible: false },
        specialDayTariff: [],
        pricingDetailDescription: "",
        status: 'Active',
        billable: true,
        guideline: "",
        priority: 1,
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const imageInput = useRef(null);
    const navigate = useNavigate();
    const [banquetNames, setBanquetNames] = useState([]);
    // fetch the data in master table 
    const [amenitiesOptions, setAmenitiesOptions] = useState([]);
    const [taxTypes, setTaxTypes] = useState([]);
    const [errors, setErrors] = useState({});

    // Fetch room types (categories)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetchActiveAllBanquetCategories();
                setBanquetNames(response.data.categories);
            } catch (error) {
                showToast("Failed to fetch room types.", "error");
            }
        };
        fetchCategories();
        fetchTaxTypes();
        fetchAmenioties();
    }, []);

    const fetchTaxTypes = async () => {
        try {
            const response = await fetchAllActiveTaxTypes();
            setTaxTypes(response?.data?.data);
        } catch (error) {
            showToast("Failed to fetch room types.", "error");
        }
    };

    const fetchAmenioties = async () => {
        try {
            const response = await fetchAllActiveAmenities();
            setAmenitiesOptions(response?.data?.data);
        } catch (error) {
            showToast("Failed to fetch room types.", "error");
        }
    };




    const handleInputChange = (e) => {
        console.log(e.target.name, "-", e.target.value, "handleInputChangew")
        const { name, value } = e.target;
        setBanquetData({ ...banquetData, [name]: value });
        setErrors({ ...errors, [name]: "" }); // Clear error on change
    };

    const handleImageChange = (e) => {
        // Ensure files are selected
        if (!e.target.files || e.target.files.length === 0) {
            showToast("No files selected.", "warning");
            return;
        }

        // Convert FileList to an array
        const files = Array.from(e.target.files);
        const maxSize = 20 * 1024 * 1024; // 20 MB in bytes

        // Separate valid and invalid files
        const validFiles = [];
        const invalidFiles = [];

        files.forEach((file) => {
            if (file.size <= maxSize) {
                validFiles.push(file);
            } else {
                invalidFiles.push(file.name);
            }
        });

        // Show a toast for invalid files, if any
        if (invalidFiles.length > 0) {
            showToast(
                `The following files exceed 100KB and were not added: ${invalidFiles.join(", ")}`,
                "error"
            );
        }


        setImages((prevImages) => [...prevImages, ...validFiles]);

    };


    const handleRemoveImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };


    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setBanquetData({ ...banquetData, [name]: checked });
    };

    const handleChangeTaxTypes = (event) => {
        console.log(event.target.name, "-", event.target.value, "taxtype")

        const { value, checked } = event.target;
        if (checked) {
            setBanquetData({
                ...banquetData,
                taxTypes: [...banquetData.taxTypes, value],
            });
        } else {
            setBanquetData({
                ...banquetData,
                taxTypes: banquetData.taxTypes.filter((tax) => tax !== value),
            });
        }
    };

    // Handle checkbox changes for Amenities
    const handleChangeAmenities = (event) => {
        console.log(event.target.name, "-", event.target.checked, event.target.value, "amenities")

        const { value, checked } = event.target;
        if (checked) {
            setBanquetData({
                ...banquetData,
                amenities: [...banquetData.amenities, value], // Add amenity ID to array
            });
        } else {
            setBanquetData({
                ...banquetData,
                amenities: banquetData.amenities.filter((amenity) => amenity !== value), // Remove amenity ID from array
            });
        }
    };


    // const handleFeatureChange = (e) => {
    //     const { name, checked } = e.target;
    //     console.log(name, checked, "handleInputChange");
    //     setBanquetData({
    //         ...banquetData,
    //         features: {
    //             ...banquetData.features,
    //             [name]: checked,
    //         },
    //     });
    // };

    const handleCancalletionChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value, "handleInputChange");
        setBanquetData({
            ...banquetData,
            cancellationPolicy: {
                ...banquetData.cancellationPolicy,
                [name]: value,
            },
        });
        setErrors({ ...errors, [name]: '' }); // Clear error on change
    };

    // Handle change for form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        const [field, index, prop] = name.split('[').map((item) => item.replace(']', ''));

        if (index !== undefined && prop !== undefined) {
            const updatedSpecialDayTariff = [...banquetData.specialDayTariff];
            updatedSpecialDayTariff[index][prop] = value;
            setBanquetData({
                ...banquetData,
                specialDayTariff: updatedSpecialDayTariff,
            });
        } else {
            setBanquetData({
                ...banquetData,
                [field]: value,
            });
        }
    };

    // Add a new special day tariff entry
    const addSpecialDayTariff = () => {
        setBanquetData({
            ...banquetData,
            specialDayTariff: [
                ...banquetData.specialDayTariff,
                { special_day_name: '', startDate: '', endDate: '', extraCharge: '' },
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


    const handlePriceInputChange = (event) => {
        const { name, value } = event.target;

        // Update minPrice or maxPrice based on the field name
        setBanquetData((prevData) => ({
            ...prevData,
            priceRange: {
                ...prevData.priceRange,
                [name]: value,
            },
        }));
    };


    const validateForm = () => {
        const newErrors = {};
        // Validate banquetName
        if (!banquetData.banquetName) newErrors.banquetName = "Banquet category is required.";

        // Validate description
        if (!banquetData.description) newErrors.description = "Banquet description is required.";
        if (!banquetData.guideline) newErrors.guideline = "Banquet guideline is required.";


        // // Validate check-in and check-out times
        // if (!banquetData.checkInTime) newErrors.checkInTime = "Check-in time is required.";
        // if (!banquetData.checkOutTime) newErrors.checkOutTime = "Check-out time is required.";

        // Validate maximum occupancy per room
        if (!banquetData.maxAllowedPerRoom) {
            newErrors.maxAllowedPerRoom = "Maximum occupancy per banquet is required.";
        } else if (isNaN(banquetData.maxAllowedPerRoom) || Number(banquetData.maxAllowedPerRoom) <= 0) {
            newErrors.maxAllowedPerRoom = "Maximum occupancy must be a valid positive number.";
        }

        // Validate maximum occupancy per room
        if (!banquetData.minAllowedPerRoom) {
            newErrors.minAllowedPerRoom = "Minimum occupancy per banquet is required.";
        } else if (isNaN(banquetData.minAllowedPerRoom) || Number(banquetData.minAllowedPerRoom) <= 0) {
            newErrors.minAllowedPerRoom = "Minimum occupancy must be a valid positive number.";
        }



        // Validate priceRange
        const { minPrice, maxPrice } = banquetData.priceRange;
        if (!minPrice) newErrors.minPrice = "Min Price is required.";
        else if (isNaN(minPrice) || Number(minPrice) < 0) newErrors.minPrice = "Min Price must be a valid positive number.";

        if (!maxPrice) newErrors.maxPrice = "Max Price is required.";
        else if (isNaN(maxPrice) || Number(maxPrice) < 0) newErrors.maxPrice = "Max Price must be a valid positive number.";

        if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
            newErrors.maxPrice = "Max Price must be greater than Min Price.";
        }

        // Validate amenities
        if (banquetData.amenities.length === 0) {
            newErrors.amenities = "At least one amenity is required.";
        }

        // // Validate features
        // if (banquetData.features.smokingAllowed === undefined) {
        //     newErrors.smokingAllowed = "Smoking allowed field is required.";
        // }
        // if (banquetData.features.petFriendly === undefined) {
        //     newErrors.petFriendly = "Pet-friendly field is required.";
        // }
        // if (banquetData.features.accessible === undefined) {
        //     newErrors.accessible = "Accessible field is required.";
        // }


        // Validate taxTypes
        if (banquetData.taxTypes.length === 0) {
            newErrors.taxTypes = "At least one tax type is required.";
        }

        // Validate cancellationPolicy
        const { before7Days, between7To2Days, between48To24Hours, lessThan24Hours } = banquetData.cancellationPolicy;
        if (!before7Days) newErrors.before7Days = "Cancellation policy for 'Before 7 Days' is required.";
        if (!between7To2Days) newErrors.between7To2Days = "Cancellation policy for 'Between 7 to 2 Days' is required.";
        if (!between48To24Hours) newErrors.between48To24Hours = "Cancellation policy for 'Between 48 to 24 Hours' is required.";
        if (!lessThan24Hours) newErrors.lessThan24Hours = "Cancellation policy for 'Less Than 24 Hours' is required.";



        // Validate specialDayTariff
        if (banquetData.specialDayTariff.length > 0) {
            // newErrors.specialDayTariff = "please add the special day tariff"
            banquetData.specialDayTariff.forEach((tariff, index) => {
                if (!tariff.special_day_name) {
                    newErrors[`specialDayName_${index}`] = "Special day name is required.";
                }
                if (!tariff.startDate) {
                    newErrors[`startDate_${index}`] = "Start date is required.";
                }
                if (!tariff.endDate) {
                    newErrors[`endDate_${index}`] = "End date is required.";
                }
                if (!tariff.extraCharge) {
                    newErrors[`extraCharge_${index}`] = "Extra charge is required.";
                } else if (isNaN(tariff.extraCharge) || Number(tariff.extraCharge) < 0) {
                    newErrors[`extraCharge_${index}`] = "Extra charge must be a valid positive number.";
                }
            });
        }


        // Validate banquetHallSize
        if (!banquetData.banquetHallSize) {
            newErrors.banquetHallSize = "Banquet size is required.";
        } else if (isNaN(banquetData.banquetHallSize) || Number(banquetData.banquetHallSize) <= 0) {
            newErrors.banquetHallSize = "Banquet size must be a valid positive number.";
        }


        // Validate status
        if (!banquetData.status) newErrors.status = "Banquet status is required.";
        if (banquetData.billable === undefined) newErrors.billable = "Banquet Is Billable Or Non-Billable It Is Required.";



        console.log(newErrors, "newErr---------------")
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }








    const handleSubmit = async () => {
        console.log(banquetData, "banq")

        if (!validateForm()) return; // Prevent submission if validation fails

        setLoading(true);
        try {
            // setLoading(true);
            console.log(banquetData, "banq")

            const formData = new FormData();

            addBasicBanquetDataToFormData(formData);

            // Add amenities to formData
            addAmenitiesToFormData(formData);

            // Add features (JSON) to formData
            addFeaturesToFormData(formData);

            // Add features (JSON) to formData
            addPriceRangeToFormData(formData);

            // Add images to formData
            addImagesToFormData(formData);

            // Add special day tariff if any
            addSpecialDayTariffToFormData(formData);

            // Add cancellation policy to formData
            addCancellationPolicyToFormData(formData);

            // add pricindeails
            addPricingDetailsToFormData(formData);

            addTaxTypesToFormData(formData);

            // formData.append("images", images);

            const response = await addBanquet(formData);
            console.log(response, "ggg")

            if (response.status === 201) {
                showToast("Banquet added successfully!", "success");
                navigate("/banquets");
            } else if (response.status === 400) {
                showToast(response.response.data.message || "Failed to add banquet. Please try again.", "error");
            }
        } catch (error) {
            console.log("Error adding banquet:", error.response?.data?.message);
            showToast(error.response?.data?.message || "An error occurred. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };



    // Function to add basic room data to formData
    const addBasicBanquetDataToFormData = (formData) => {
        console.log(formData, "formdat")
        Object.entries(banquetData).forEach(([key, value]) => {
            console.log(banquetData, "formdat")

            if (key === 'cancellationPolicy' || key === 'priceRange' || key === 'pricingDetails' || key === 'features' || key === 'specialDayTariff' || key === "taxTypes" || key === "amenities") {
                // Handle complex fields separately (already covered in other functions)
                return;
            }
            formData.append(key, value);
        });
    };


    // // Function to add pricing details to formData
    const addPricingDetailsToFormData = (formData) => {
        banquetData.pricingDetails.forEach((detail, index) => {
            // Add selected days
            detail.days.forEach((day, dayIndex) => {
                formData.append(`pricingDetails[${index}][days][${dayIndex}]`, day);
            });

            // Add time slots
            detail.timeSlots.forEach((slot, slotIndex) => {
                formData.append(`pricingDetails[${index}][timeSlots][${slotIndex}][start]`, slot.start || "");
                formData.append(`pricingDetails[${index}][timeSlots][${slotIndex}][end]`, slot.end || "");
            });

            // Add price
            formData.append(`pricingDetails[${index}][price]`, detail.price || "");
        });
    };

    // Function to add amenities to formData
    const addAmenitiesToFormData = (formData) => {
        // banquetData.amenities.forEach((amenity) => formData.append('amenities', JSON.stringify(amenity)));
        banquetData.amenities.forEach((amenity, index) => {
            formData.append(`amenities[${index}]`, amenity);
        });
    };

    // Function to add features as JSON to formData
    const addFeaturesToFormData = (formData) => {
        formData.append('features', JSON.stringify(banquetData.features));
    };

    // Function to add features as JSON to formData
    const addPriceRangeToFormData = (formData) => {
        formData.append('priceRange', JSON.stringify(banquetData.priceRange));
    };

    // Function to add images to formData
    const addImagesToFormData = (formData) => {
        images.forEach((image) => formData.append('images', image));
    };

    // Function to add special day tariff to formData
    const addSpecialDayTariffToFormData = (formData) => {
        banquetData.specialDayTariff.forEach((tariff, index) => {
            formData.append(`specialDayTariff[${index}][special_day_name]`, tariff.special_day_name);
            formData.append(`specialDayTariff[${index}][startDate]`, tariff.startDate);
            formData.append(`specialDayTariff[${index}][endDate]`, tariff.endDate);
            formData.append(`specialDayTariff[${index}][extraCharge]`, tariff.extraCharge);
        });
    };

    // Function to add cancellation policy to formData
    const addCancellationPolicyToFormData = (formData) => {
        // Object.entries(banquetData.cancellationPolicy).forEach(([key, value]) => {
        //     formData.append(`cancellationPolicy[${key}]`, value);
        // });
        formData.append('cancellationPolicy', JSON.stringify(banquetData.cancellationPolicy));
    };


    // Function to add tax types to formData
    const addTaxTypesToFormData = (formData) => {
        // banquetData.taxTypes.forEach((taxType) => formData.append('taxTypes', JSON.stringify(taxType)));
        banquetData.taxTypes.forEach((taxType, index) => {
            formData.append(`taxTypes[${index}]`, taxType);
        });
    };



    const handleAddPricingDetail = () => {
        setBanquetData((prevData) => ({
            ...prevData,
            pricingDetails: [
                ...prevData.pricingDetails,
                { days: [], timeSlots: [{ start: "12:00", end: "23:00" }], price: "" },
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

    // const handleAddTimeSlot = (index) => {
    //     const updatedPricingDetails = [...banquetData.pricingDetails];
    //     updatedPricingDetails[index].timeSlots.push({ start: null, end: null });
    //     setBanquetData((prevData) => ({
    //         ...prevData,
    //         pricingDetails: updatedPricingDetails,
    //     }));
    // };

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



    const UploadBox = ({ onClick }) => (
        <Box
            onClick={onClick}
            sx={{
                marginTop: 3,
                height: 200,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                borderStyle: "dashed",
                borderWidth: "2px",
                borderColor: "divider",
                cursor: "pointer",
            }}
        >
            <BiImageAdd style={{ fontSize: "50px", color: "#027edd" }} />
            <Typography>Click to upload images</Typography>
        </Box>
    );


    return (
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Breadcrumb />
            <Typography
                variant="h5"
                sx={{
                    mb: "20px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "primary.main",
                }}
            >
                Add New Banquet
            </Typography>
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: "12px",
                    maxWidth: "600px",
                    margin: "0 auto",
                    backgroundColor: "#f9f9f9",
                }}
            >
                {/* Banquet Name */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Banquet Type</InputLabel>
                    <FormControl fullWidth margin="dense" error={!!errors.banquetName}>
                        {/* <InputLabel>Room Type</InputLabel> */}
                        <Select name="banquetName" value={banquetData.banquetName} onChange={handleInputChange}
                            startAdornment={<CategoryIcon sx={{ color: "gray", mr: 1 }} />}
                        >
                            <MenuItem value="" disabled>
                                Please Choose Banquet Category
                            </MenuItem>
                            {banquetNames.map((type) => (
                                <MenuItem key={type._id} value={type._id}>{type.name}</MenuItem>
                            ))}
                        </Select>
                        {errors.banquetName && <Typography color="error">{errors.banquetName}</Typography>}
                    </FormControl>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel>Priority</InputLabel>
                    <TextField
                        fullWidth
                        name="priority"
                        value={banquetData.priority}
                        onChange={handleInputChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Work />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Description */}
                <Box sx={{ mb: 3 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: 1 }}>Banquet Facilities Description</InputLabel>
                    <ReactQuill
                        value={banquetData.description}
                        onChange={(value) =>
                            setBanquetData((prev) => ({ ...prev, description: value }))
                        }
                        placeholder="Describe the banquet facilities"
                        style={{ height: "120px", borderRadius: "8px", marginBottom: "80px" }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Minimum Allowed Guest</InputLabel>
                    <TextField
                        placeholder="Enter Minimum Allowed PerRoom"
                        fullWidth
                        margin="dense"
                        name="minAllowedPerRoom"
                        value={banquetData.minAllowedPerRoom}
                        onChange={handleInputChange}
                        error={!!errors.minAllowedPerRoom}
                        helperText={errors.minAllowedPerRoom}
                        InputProps={{
                            startAdornment: <MeetingRoomIcon sx={{ color: "gray", mr: 1 }} />,
                        }}
                        type="number"
                        inputProps={{
                            min: 0, // Set minimum value
                        }}
                    />
                </Box>


                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Maxium Allowed Guest</InputLabel>
                    <TextField
                        placeholder="Enter Maxium Allowed PerRoom"
                        fullWidth
                        margin="dense"
                        name="maxAllowedPerRoom"
                        value={banquetData.maxAllowedPerRoom}
                        onChange={handleInputChange}
                        error={!!errors.maxAllowedPerRoom}
                        helperText={errors.maxAllowedPerRoom}
                        InputProps={{
                            startAdornment: <MeetingRoomIcon sx={{ color: "gray", mr: 1 }} />,
                        }}
                        type="number"
                        inputProps={{
                            min: 0, // Set minimum value
                        }}
                    />
                </Box>

                {/* Check-In and Check-Out Time */}
                {/* <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Check In Time</InputLabel>
                    <TextField
                        type="time"
                        placeholder="Enter Check In Time"
                        fullWidth
                        margin="dense"
                        name="checkInTime"
                        value={banquetData.checkInTime}
                        onChange={handleInputChange}
                        error={!!errors.checkInTime}
                        helperText={errors.checkInTime}
                        InputProps={{
                            startAdornment: <AccessTimeFilled sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Check Out Time</InputLabel>
                    <TextField
                        type="time"
                        placeholder="Enter Chack Out Time"
                        fullWidth
                        margin="dense"
                        name="checkOutTime"
                        value={banquetData.checkOutTime}
                        onChange={handleInputChange}
                        error={!!errors.checkOutTime}
                        helperText={errors.checkOutTime}
                        InputProps={{
                            startAdornment: <AccessTime sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box> */}

                {/* Price Range */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Min Price (App Display Only)</InputLabel>
                    <TextField
                        placeholder="Enter minimum price"
                        fullWidth
                        margin="dense"
                        name="minPrice"
                        value={banquetData.priceRange.minPrice}
                        onChange={handlePriceInputChange}
                        error={!!errors.minPrice}
                        helperText={errors.minPrice}
                        InputProps={{
                            startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} />,
                        }}
                        type="number"
                        inputProps={{
                            min: 0, // Set minimum value
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Max Price (App Display Only)</InputLabel>
                    <TextField
                        placeholder="Enter maximum price"
                        fullWidth
                        margin="dense"
                        name="maxPrice"
                        value={banquetData.priceRange.maxPrice}
                        onChange={handlePriceInputChange}
                        error={!!errors.maxPrice}
                        helperText={errors.maxPrice}
                        InputProps={{
                            startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} />,
                        }}
                        type="number"
                        inputProps={{
                            min: 0, // Set minimum value
                        }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Hall Size(sq. feet)</InputLabel>
                    <TextField
                        placeholder="Enter hall size"
                        fullWidth
                        margin="dense"
                        name="banquetHallSize"
                        value={banquetData.banquetHallSize}
                        onChange={handleInputChange}
                        error={!!errors.banquetHallSize}
                        helperText={errors.banquetHallSize}
                        InputProps={{
                            startAdornment: <SquareFootIcon sx={{ color: "gray", mr: 1 }} />,
                        }}
                        type="number"
                        inputProps={{
                            min: 0, // Set minimum value
                        }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Banquet Amenities</InputLabel>
                    <FormControl fullWidth>
                        {/* <InputLabel>Amenities</InputLabel> */}
                        <div>
                            {amenitiesOptions.map(amenity => (
                                <FormControlLabel
                                    key={amenity._id}
                                    control={
                                        <Checkbox
                                            checked={banquetData.amenities.includes(amenity._id)}
                                            onChange={handleChangeAmenities}
                                            value={amenity._id}
                                        />
                                    }
                                    label={amenity.name}
                                />
                            ))}
                        </div>
                    </FormControl>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Banquet Status</InputLabel>
                    <FormControl fullWidth margin="dense" error={!!errors.status}>
                        <Select name="status" value={banquetData.status} onChange={handleInputChange} displayEmpty
                            startAdornment={<HotelIcon sx={{ color: "gray", mr: 1 }} />}>
                            <MenuItem value="" disabled>
                                Please Choose  Status
                            </MenuItem>
                            {statusOptions.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                        {errors.status && <Typography color="error">{errors.status}</Typography>}
                    </FormControl>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Billable Type</InputLabel>
                    <FormControl fullWidth margin="dense" error={!!errors.billable}>
                        <Select name="billable" value={banquetData.billable} onChange={handleInputChange} displayEmpty
                            startAdornment={<HotelIcon sx={{ color: "gray", mr: 1 }} />}>
                            <MenuItem value="" disabled>
                                Please Select Billable Type
                            </MenuItem>
                            {BillableOptions.map((option) => (
                                <MenuItem key={option} value={option}>{option ? "Billable" : "Non-Billable"}</MenuItem>
                            ))}
                        </Select>
                        {errors.billable && <Typography color="error">{errors.billable}</Typography>}
                    </FormControl>
                </Box>

                {/* <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Banquet Permissions</InputLabel>
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

                                        {/* {slotIndex === detail.timeSlots.length - 1 && (
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
                                        )} */}
                                    </Box>
                                ))}
                                {/* {errors[`timeSlots_${index}`] && (
                                    <Typography color="error">
                                        {errors[`timeSlots_${index}`]}
                                    </Typography>
                                )} */}
                            </Box>

                            {/* Price */}
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    type="number"
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
                                    inputProps={{
                                        min: 0, // Set minimum value
                                    }}
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


                {/* Tax Types */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Applicable Tax Types</InputLabel>

                    <FormControl fullWidth>
                        {/* <InputLabel>Tax Types</InputLabel> */}
                        <div>
                            {taxTypes.map(tax => (
                                <FormControlLabel
                                    key={tax._id}
                                    control={
                                        <Checkbox
                                            checked={banquetData.taxTypes.includes(tax._id)}
                                            onChange={handleChangeTaxTypes}
                                            value={tax._id}
                                        />
                                    }
                                    label={tax.name}
                                />
                            ))}
                        </div>
                    </FormControl>
                </Box>

                {/* Cancellation Policy */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: 'bold', mb: 2 }}>Cancellation Policies In (%)</InputLabel>

                    {/* Cancellation Before 7 Days */}
                    <Box sx={{ mb: 2 }}>
                        <InputLabel sx={{ fontWeight: 'medium', mb: 1 }}>Cancellation Before 7 Days</InputLabel>
                        <TextField
                            fullWidth
                            name="before7Days"
                            type="number"
                            value={banquetData.cancellationPolicy.before7Days}
                            // onChange={handleCancalletionChange}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
                                    handleCancalletionChange(e); // Call your existing input handler
                                }
                            }}
                            inputProps={{
                                min: 0, // Set minimum value
                                max: 100, // Set maximum value
                            }}
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
                            type="number"
                            value={banquetData.cancellationPolicy.between7To2Days}
                            // onChange={handleCancalletionChange}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
                                    handleCancalletionChange(e); // Call your existing input handler
                                }
                            }}
                            inputProps={{
                                min: 0, // Set minimum value
                                max: 100, // Set maximum value
                            }}
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
                            type="number"
                            value={banquetData.cancellationPolicy.between48To24Hours}
                            // onChange={handleCancalletionChange}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
                                    handleCancalletionChange(e); // Call your existing input handler
                                }
                            }}
                            inputProps={{
                                min: 0, // Set minimum value
                                max: 100, // Set maximum value
                            }}
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
                            type="number"
                            value={banquetData.cancellationPolicy.lessThan24Hours}
                            // onChange={handleCancalletionChange}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
                                    handleCancalletionChange(e); // Call your existing input handler
                                }
                            }}
                            inputProps={{
                                min: 0, // Set minimum value
                                max: 100, // Set maximum value
                            }}
                            error={!!errors.lessThan24Hours}
                            helperText={errors.lessThan24Hours}
                        />
                    </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Banquet Breakfast Included</InputLabel>
                    <FormControlLabel
                        control={<Checkbox checked={banquetData.breakfastIncluded} onChange={handleCheckboxChange} name="breakfastIncluded" />}
                        label="Breakfast Included"
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Special Day Tarrif Details</InputLabel>
                    {banquetData.specialDayTariff.map((tariff, index) => (
                        <Box key={index} sx={{ display: "block", gap: 2, margin: "5px" }}>
                            <TextField
                                fullWidth
                                name={`specialDayTariff[${index}][special_day_name]`}
                                label="Special Day Name"
                                value={tariff.special_day_name}
                                onChange={handleChange}
                                error={!!errors[`specialDayName_${index}`]}
                                helperText={errors[`specialDayName_${index}`]}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                name={`specialDayTariff[${index}][startDate]`}
                                label="Start Date"
                                type="date"
                                value={tariff.startDate}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={!!errors[`startDate_${index}`]}
                                helperText={errors[`startDate_${index}`]}
                                inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                name={`specialDayTariff[${index}][endDate]`}
                                label="End Date"
                                type="date"
                                value={tariff.endDate}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={!!errors[`endDate_${index}`]}
                                helperText={errors[`endDate_${index}`]}
                                inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                name={`specialDayTariff[${index}][extraCharge]`}
                                label="Extra Charge In %"
                                type="number"
                                value={tariff.extraCharge}
                                // onChange={handleChange}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
                                        handleChange(e); // Call your existing input handler
                                    }
                                }}
                                error={!!errors[`extraCharge_${index}`]}
                                helperText={errors[`extraCharge_${index}`]}
                                sx={{ mb: 2 }}
                                inputProps={{
                                    min: 0, // Set minimum value
                                    max: 100, // Set maximum value
                                }}
                            />

                            {/* Remove Button */}
                            {banquetData.specialDayTariff.length > 0 && (
                                <IconButton onClick={() => removeSpecialDayTariff(index)}>
                                    <FiTrash />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                    {errors.specialDayTariff && <Typography color="error">{errors.specialDayTariff}</Typography>}

                    {/* Add Button */}
                    <Box sx={{ mb: 2 }}>
                        <Button variant="contained" onClick={addSpecialDayTariff}>
                            Add Special Day Tariff
                        </Button>
                    </Box>
                </Box>

                {/* Description */}
                <Box sx={{ mb: 3 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: 1 }}>Pricing Details Description</InputLabel>
                    <ReactQuill
                        value={banquetData.pricingDetailDescription}
                        onChange={(value) =>
                            setBanquetData((prev) => ({ ...prev, pricingDetailDescription: value }))
                        }
                        placeholder="Describe the banquet"
                        style={{ height: "120px", borderRadius: "8px", marginBottom: "100px" }}
                    />
                </Box>

                {/* Description */}
                <Box sx={{ mb: 3 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: 1 }}>Banquet Guidelines</InputLabel>
                    <ReactQuill
                        value={banquetData.guideline}
                        onChange={(value) =>
                            setBanquetData((prev) => ({ ...prev, guideline: value }))
                        }
                        placeholder="Describe the banquet guidelines"
                        style={{ height: "120px", borderRadius: "8px", marginBottom: "100px" }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Banquet Images(upload max. 5 images & less than 100kb)</InputLabel>
                    <UploadBox onClick={() => imageInput.current.click()} />
                    <input type="file" hidden ref={imageInput} multiple onChange={handleImageChange} />

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                        {images.map((image, index) => (
                            <Box key={index} sx={{ position: "relative" }}>
                                <img src={URL.createObjectURL(image)} alt="Room" style={{ width: 100, height: 100, borderRadius: 8 }} />
                                <IconButton onClick={() => handleRemoveImage(index)} sx={{ position: "absolute", top: 0, right: 0 }}>
                                    <FiTrash color="red" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Submit Button */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                            borderRadius: "10px",
                            px: 4,
                            py: 1,
                            fontWeight: "bold",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                        }}
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            "Add Banquet"
                        )}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddBanquet;
