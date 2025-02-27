import React, { useEffect, useState, useRef } from "react";
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
    Checkbox,
    FormControlLabel,
    IconButton,
    Grid,
} from "@mui/material";
import { BiImageAdd } from "react-icons/bi";
import { FiTrash } from "react-icons/fi";
import { showToast } from "../api/toast";
import { useNavigate, useParams } from "react-router-dom";
import { deleteRoomImage, fetchEditRoomDetails, updateRoomDetails, uploadRoomImage } from "../api/room";
import { fetchAllCategories } from "../api/category";

import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { AccessTime, AccessTimeFilled, CurrencyRupee } from "@mui/icons-material";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import CategoryIcon from "@mui/icons-material/Category";
import KingBedIcon from "@mui/icons-material/KingBed";
import HotelIcon from "@mui/icons-material/Hotel";
import { fetchAllActiveTaxTypes } from "../api/masterData/taxType";
import { fetchAllActiveAmenities } from "../api/masterData/amenities";
import ReactQuill from "react-quill";
import Breadcrumb from "../components/common/Breadcrumb";
import { PUBLIC_API_URI } from "../api/config";

const guestTypeOptions = [
    'Member',
    'Member Spouse & Children',
    'Guest of Member',
    'Corporate Member',
    'Affiliated Club Member',
    'Nominee of Corporate Member',
    'Affiliated Foreign Club Member',
    'Foreign Guest',
];

const bedTypeOptions = ['Single', 'Double', 'Queen', 'King', 'Twin', 'Sofa Bed'];
const statusOptions = ['Active', 'Inactive',];
const roomStatusOptions = ['Available', 'Booked', 'Under Maintenance'];


const EditRoom = () => {
    const { id } = useParams();
    const [roomData, setRoomData] = useState({
        categoryName: '',
        description: '',
        priceRange: { minPrice: '', maxPrice: '' },
        // pricingDetails: [{ guestType: '', price: '', description: '' }],
        pricingDetails: [],
        amenities: [],
        roomSize: '',
        bedType: '',
        features: { smokingAllowed: false, petFriendly: false, accessible: false },
        status: 'Active',
        roomDetails: [],
        totalAvailableRoom: 1,
        taxTypes: [],
        checkInTime: '12:00',
        checkOutTime: '23:00',
        maxAllowedPerRoom: '',
        cancellationPolicy: { before7Days: '', between7To2Days: '', between48To24Hours: '', lessThan24Hours: '' },
        breakfastIncluded: false,
        specialDayTariff: [],
        extraBedPrice: '',
        pricingDetailDescription: ""
    });
    const [roomTypes, setRoomTypes] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const imageInput = useRef(null);
    const navigate = useNavigate();

    // fetch the data in master table 
    const [amenitiesOptions, setAmenitiesOptions] = useState([]);
    const [taxTypes, setTaxTypes] = useState([]);

    // Fetch room types (categories)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetchAllCategories();
                setRoomTypes(response.data.categories);
            } catch (error) {
                showToast("Failed to fetch room types.", "error");
            }
        };
        fetchCategories();
        fetchTaxTypes();
        fetchAmenioties();
        // getRoomById(id);
    }, [id]);

    useEffect(() => {
        if (id) {
            if (!loading) {
                getRoomById(id);
            }
        }
    }, [id]);





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

    const getRoomById = async () => {
        if (!id) return; // Guard condition to prevent unnecessary calls
        setLoading(true);
        try {
            const response = await fetchEditRoomDetails(id);
            const room = response?.data?.data;
            setRoomData({
                categoryName: room.categoryName,
                description: room.description,
                priceRange: room.priceRange,
                // pricingDetails: [{ guestType: '', price: '', description: '' }],
                pricingDetails: room.pricingDetails,
                amenities: room.amenities,
                roomSize: room.roomSize,
                bedType: room.bedType,
                features: room.features,
                status: room.status,
                roomDetails: room.roomDetails,
                totalAvailableRoom: room.totalAvailableRoom,
                taxTypes: room.taxTypes,
                checkInTime: room.checkInTime,
                checkOutTime: room.checkOutTime,
                maxAllowedPerRoom: room.maxAllowedPerRoom,
                cancellationPolicy: room.cancellationPolicy,
                breakfastIncluded: room.breakfastIncluded,
                specialDayTariff: room.specialDayTariff,
                extraBedPrice: room.extraBedPrice,
                pricingDetailDescription: room.pricingDetailDescription,
            });
            setImages(room.images)
            setLoading(false);
        } catch (error) {
            showToast("Failed to fetch room details.", "error");
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        console.log(e.target.name, "-", e.target.value, "handleInputChangew")
        const { name, value } = e.target;
        setRoomData({ ...roomData, [name]: value });
        setErrors({ ...errors, [name]: "" }); // Clear error on change
    };

    const handlePriceInputChange = (event) => {
        const { name, value } = event.target;

        // Update minPrice or maxPrice based on the field name
        setRoomData((prevData) => ({
            ...prevData,
            priceRange: {
                ...prevData.priceRange,
                [name]: value,
            },
        }));
    };
    // Handle input changes for both check-in and check-out times

    // const handleImageChange = (e) => {
    //     const files = Array.from(e.target.files);
    //     console.log(files)
    //     setImages((prevImages) => [...prevImages, ...files]);
    // };

    // const handleRemoveImage = (index) => {
    //     const updatedImages = images.filter((_, i) => i !== index);
    //     setImages(updatedImages);
    // };

    // // Add new pricing detail
    // const handleAddPricingDetail = () => {
    //     setRoomData((prevData) => ({
    //         ...prevData,
    //         pricingDetails: [...prevData.pricingDetails, { guestType: "", price: "", description: "" }],
    //     }));
    // };

    // const handlePricingDetailChange = (index, field, value) => {
    //     const updatedPricingDetails = [...roomData.pricingDetails];
    //     updatedPricingDetails[index] = {
    //         ...updatedPricingDetails[index],
    //         [field]: value,
    //     };
    //     setRoomData({ ...roomData, pricingDetails: updatedPricingDetails });
    // };

    // const handleRemovePricingDetail = (index) => {
    //     const updatedPricingDetails = roomData.pricingDetails.filter((_, i) => i !== index);
    //     setRoomData({ ...roomData, pricingDetails: updatedPricingDetails });
    // };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setRoomData({ ...roomData, [name]: checked });
    };
    // const validateForm = () => {
    //     const errors = [];

    //     // Validate categoryName
    //     if (!roomData.categoryName.trim()) {
    //         errors.push("Room category is required.");
    //     }

    //     // Validate description
    //     if (!roomData.description.trim()) {
    //         errors.push("Room description is required.");
    //     }

    //     // Validate priceRange
    //     const { minPrice, maxPrice } = roomData.priceRange;
    //     if (!minPrice) {
    //         errors.push("Min Price is required.");
    //     } else if (isNaN(minPrice) || Number(minPrice) < 0) {
    //         errors.push("Min Price must be a valid positive number.");
    //     }

    //     if (!maxPrice) {
    //         errors.push("Max Price is required.");
    //     } else if (isNaN(maxPrice) || Number(maxPrice) < 0) {
    //         errors.push("Max Price must be a valid positive number.");
    //     }

    //     if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    //         errors.push("Max Price must be greater than Min Price.");
    //     }

    //     // Validate pricingDetails
    //     if (roomData.pricingDetails.length === 0) {
    //         errors.push("At least one pricing detail is required.");
    //     } else {
    //         const requiredGuestTypes = ['Member', 'Member Spouse & Children', 'Guest of Member'];
    //         const addedGuestTypes = new Set();

    //         roomData.pricingDetails.forEach((detail) => {
    //             if (!detail.guestType.trim()) {
    //                 errors.push("Guest Type is required.");
    //             } else {
    //                 addedGuestTypes.add(detail.guestType);
    //             }

    //             if (!detail.price) {
    //                 errors.push("Price is required for all guest types.");
    //             } else if (isNaN(detail.price) || Number(detail.price) < 0) {
    //                 errors.push("Price must be a valid positive number.");
    //             }
    //         });

    //         // Check if all required guest types are included
    //         requiredGuestTypes.forEach((requiredType) => {
    //             if (!addedGuestTypes.has(requiredType)) {
    //                 errors.push(`Missing required guest type: ${requiredType}.`);
    //             }
    //         });
    //     }

    //     // Validate amenities
    //     if (roomData.amenities.length === 0) {
    //         errors.push("At least one amenity is required.");
    //     }

    //     // Validate roomSize
    //     if (!roomData.roomSize) {
    //         errors.push("Room size is required.");
    //     } else if (isNaN(roomData.roomSize) || Number(roomData.roomSize) <= 0) {
    //         errors.push("Room size must be a valid positive number.");
    //     }

    //     // Validate bedType
    //     if (!roomData.bedType) {
    //         errors.push("Bed type is required.");
    //     }

    //     // Validate roomDetails
    //     if (roomData.roomDetails.length === 0) {
    //         errors.push("At least one room detail is required.");
    //     } else {
    //         roomData.roomDetails.forEach((detail, index) => {
    //             if (!detail.roomNumber.trim()) {
    //                 errors.push(`Room number is required for Room ${index + 1}.`);
    //             }
    //             if (!detail.status) {
    //                 errors.push(`Room status is required for Room ${index + 1}.`);
    //             }
    //         });
    //     }

    //     // Validate taxTypes
    //     if (roomData.taxTypes.length === 0) {
    //         errors.push("At least one tax type is required.");
    //     }

    //     // Validate cancellationPolicy
    //     const { before7Days, between7To2Days, between48To24Hours, lessThan24Hours } = roomData.cancellationPolicy;
    //     if (!before7Days.trim()) {
    //         errors.push("Cancellation policy for 'Before 7 Days' is required.");
    //     }
    //     if (!between7To2Days.trim()) {
    //         errors.push("Cancellation policy for 'Between 7 to 2 Days' is required.");
    //     }
    //     if (!between48To24Hours.trim()) {
    //         errors.push("Cancellation policy for 'Between 48 to 24 Hours' is required.");
    //     }
    //     if (!lessThan24Hours.trim()) {
    //         errors.push("Cancellation policy for 'Less Than 24 Hours' is required.");
    //     }

    //     // Validate check-in and check-out times
    //     if (!roomData.checkInTime.trim()) {
    //         errors.push("Check-in time is required.");
    //     }
    //     if (!roomData.checkOutTime.trim()) {
    //         errors.push("Check-out time is required.");
    //     }

    //     // Validate maxAllowedPerRoom
    //     if (!roomData.maxAllowedPerRoom) {
    //         errors.push("Maximum occupancy per room is required.");
    //     } else if (isNaN(roomData.maxAllowedPerRoom) || Number(roomData.maxAllowedPerRoom) <= 0) {
    //         errors.push("Maximum occupancy must be a valid positive number.");
    //     }

    //     // Validate breakfastIncluded
    //     if (roomData.breakfastIncluded === undefined) {
    //         errors.push("Breakfast included field is required.");
    //     }

    //     // Validate specialDayTariff
    //     if (roomData.specialDayTariff.length > 0) {
    //         roomData.specialDayTariff.forEach((tariff, index) => {
    //             if (!tariff.special_day_name.trim()) {
    //                 errors.push(`Special day name is required for Special Day ${index + 1}.`);
    //             }
    //             if (!tariff.startDate.trim()) {
    //                 errors.push(`Start date is required for Special Day ${index + 1}.`);
    //             }
    //             if (!tariff.endDate.trim()) {
    //                 errors.push(`End date is required for Special Day ${index + 1}.`);
    //             }
    //             if (!tariff.extraCharge) {
    //                 errors.push(`Extra charge is required for Special Day ${index + 1}.`);
    //             } else if (isNaN(tariff.extraCharge) || Number(tariff.extraCharge) <= 0 || Number(tariff.extraCharge) > 100) {
    //                 errors.push(`Extra charge must be a valid number between 0 and 100 for Special Day ${index + 1}.`);
    //             }
    //         });
    //     }

    //     // Validate extraBedPrice
    //     if (!roomData.extraBedPrice) {
    //         errors.push("Extra bed price is required.");
    //     } else if (isNaN(roomData.extraBedPrice) || Number(roomData.extraBedPrice) < 0) {
    //         errors.push("Extra bed price must be a valid positive number.");
    //     }

    //     // Show all errors as toast messages
    //     if (errors.length > 0) {
    //         errors.forEach((error) => showToast(error, "error"));
    //         return false;
    //     }

    //     return true;
    // };


    // const handleSubmit = async () => {
    //     console.log(roomData, "rrrrrrrrrrrrr")
    //     if (!validateForm()) return; // Prevent submission if validation fails

    //     setLoading(true);

    //     try {
    //         const formData = new FormData();

    //         // Add basic room data to formData
    //         addBasicRoomDataToFormData(formData);

    //         // Add pricing details to formData
    //         addPricingDetailsToFormData(formData);

    //         // Add amenities to formData
    //         addAmenitiesToFormData(formData);

    //         // Add features (JSON) to formData
    //         addFeaturesToFormData(formData);

    //         // Add features (JSON) to formData
    //         addPriceRangeToFormData(formData);

    //         // Add images to formData
    //         addImagesToFormData(formData);

    //         // Add special day tariff if any
    //         addSpecialDayTariffToFormData(formData);

    //         // Add cancellation policy to formData
    //         addCancellationPolicyToFormData(formData);

    //         // Add room details if any
    //         addRoomDetailsToFormData(formData);

    //         // Add tax types to formData
    //         addTaxTypesToFormData(formData);
    //         // Add images to formData
    //         // images.forEach((image) => formData.append("images", image));
    //         // Call the addRoom API with formData
    //         const response = await addRoom(formData);

    //         if (response.status === 201) {
    //             showToast("Room added successfully!", "success");
    //             navigate("/roomwith-categories");
    //         } else {
    //             console.log(response, "error400")

    //             showToast(response.message || "Failed to add room.", "error");
    //         }
    //     } catch (error) {
    //         console.log(error, "error500")
    //         showToast(error.message || "An error occurred while adding the room.", "error");
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const validateForm = () => {
        const errors = [];
        // Validate specialDayTariff
        if (roomData.specialDayTariff.length > 0) {
            roomData.specialDayTariff.forEach((tariff, index) => {
                if (!tariff.special_day_name.trim()) {
                    errors.push(`Special day name is required for Special Day ${index + 1}.`);
                }
                if (!tariff.startDate.trim()) {
                    errors.push(`Start date is required for Special Day ${index + 1}.`);
                }
                if (!tariff.endDate.trim()) {
                    errors.push(`End date is required for Special Day ${index + 1}.`);
                }
                if (!tariff.extraCharge) {
                    errors.push(`Extra charge is required for Special Day ${index + 1}.`);
                } else if (isNaN(tariff.extraCharge) || Number(tariff.extraCharge) <= 0 || Number(tariff.extraCharge) > 100) {
                    errors.push(`Extra charge must be a valid number between 0 and 100 for Special Day ${index + 1}.`);
                }
            });
        }
        // Show all errors as toast messages
        if (errors.length > 0) {
            errors.forEach((error) => showToast(error, "error"));
            return false;
        }

        return true;
    };


    const handleSubmit = async () => {
        console.log(roomData, "roomData")
        if (!validateForm()) return; // Prevent submission if validation fails
        setLoading(true);
        try {
            const response = await updateRoomDetails(id, roomData);
            if (response.status === 200) {
                getRoomById()
                showToast("Room updated successfully.", "success");
                // navigate("/rooms");
                navigate(`/roomwith-category/${id}`);
            }
        } catch (error) {
            showToast("Failed to update room.", "error");
        } finally {
            setLoading(false);
        }
    };

    // // Function to add basic room data to formData
    // const addBasicRoomDataToFormData = (formData) => {
    //     console.log(formData, "formdat")
    //     Object.entries(roomData).forEach(([key, value]) => {
    //         console.log(roomData, "formdat")

    //         if (key === 'cancellationPolicy' || key === 'priceRange' || key === 'pricingDetails' || key === 'amenities' || key === 'features' || key === 'specialDayTariff' || key === 'roomDetails' || key === 'taxTypes') {
    //             // Handle complex fields separately (already covered in other functions)
    //             return;
    //         }
    //         formData.append(key, value);
    //     });
    // };

    // // Function to add pricing details to formData
    // const addPricingDetailsToFormData = (formData) => {
    //     roomData.pricingDetails.forEach((detail, index) => {
    //         formData.append(`pricingDetails[${index}][guestType]`, detail.guestType);
    //         formData.append(`pricingDetails[${index}][price]`, detail.price);
    //         formData.append(`pricingDetails[${index}][description]`, detail.description || '');
    //     });
    // };

    // // Function to add amenities to formData
    // const addAmenitiesToFormData = (formData) => {
    //     roomData.amenities.forEach((amenity) => formData.append('amenities', amenity));
    // };

    // // Function to add features as JSON to formData
    // const addFeaturesToFormData = (formData) => {
    //     formData.append('features', JSON.stringify(roomData.features));
    // };

    // // Function to add features as JSON to formData
    // const addPriceRangeToFormData = (formData) => {
    //     formData.append('priceRange', JSON.stringify(roomData.priceRange));
    // };

    // // Function to add images to formData
    // const addImagesToFormData = (formData) => {
    //     images.forEach((image) => formData.append('images', image));
    // };

    // // Function to add special day tariff to formData
    // const addSpecialDayTariffToFormData = (formData) => {
    //     roomData.specialDayTariff.forEach((tariff, index) => {
    //         formData.append(`specialDayTariff[${index}][special_day_name]`, tariff.special_day_name);
    //         formData.append(`specialDayTariff[${index}][startDate]`, tariff.startDate);
    //         formData.append(`specialDayTariff[${index}][endDate]`, tariff.endDate);
    //         formData.append(`specialDayTariff[${index}][extraCharge]`, tariff.extraCharge);
    //     });
    // };

    // // Function to add cancellation policy to formData
    // const addCancellationPolicyToFormData = (formData) => {
    //     // Object.entries(roomData.cancellationPolicy).forEach(([key, value]) => {
    //     //     formData.append(`cancellationPolicy[${key}]`, value);
    //     // });
    //     formData.append('cancellationPolicy', JSON.stringify(roomData.cancellationPolicy));
    // };

    // // Function to add room details to formData
    // const addRoomDetailsToFormData = (formData) => {
    //     roomData.roomDetails.forEach((room, index) => {
    //         formData.append(`roomDetails[${index}][roomNumber]`, room.roomNumber);
    //         formData.append(`roomDetails[${index}][status]`, room.status);
    //     });
    // };

    // // Function to add tax types to formData
    // const addTaxTypesToFormData = (formData) => {
    //     roomData.taxTypes.forEach((taxType) => formData.append('taxTypes', taxType));
    // };




    const handleChangeTaxTypes = (event) => {
        console.log(event.target.name, "-", event.target.value, "taxtype")

        const { value, checked } = event.target;
        if (checked) {
            setRoomData({
                ...roomData,
                taxTypes: [...roomData.taxTypes, value],
            });
        } else {
            setRoomData({
                ...roomData,
                taxTypes: roomData.taxTypes.filter((tax) => tax !== value),
            });
        }
    };

    // Handle checkbox changes for Amenities
    const handleChangeAmenities = (event) => {
        console.log(event.target.name, "-", event.target.checked, event.target.value, "amenities")

        const { value, checked } = event.target;
        if (checked) {
            setRoomData({
                ...roomData,
                amenities: [...roomData.amenities, value], // Add amenity ID to array
            });
        } else {
            setRoomData({
                ...roomData,
                amenities: roomData.amenities.filter((amenity) => amenity !== value), // Remove amenity ID from array
            });
        }
    };

    const handleCancalletionChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value, "handleInputChange");
        setRoomData({
            ...roomData,
            cancellationPolicy: {
                ...roomData.cancellationPolicy,
                [name]: value,
            },
        });
        setErrors({ ...errors, [name]: '' }); // Clear error on change
    };


    // // Handle change for inputs
    // const handleRoomInputChange = (e) => {
    //     const { name, value } = e.target;
    //     const [field, index, prop] = name.split('.');

    //     if (field === 'roomDetails' && index !== undefined && prop !== undefined) {
    //         const updatedRoomDetails = [...roomData.roomDetails];
    //         updatedRoomDetails[parseInt(index)][prop] = value; // Update specific room detail
    //         setRoomData({ ...roomData, roomDetails: updatedRoomDetails });
    //     }
    // };

    // // Handle change in the totalAvailableRoom
    // const handleTotalRoomChange = (e) => {
    //     const totalRooms = parseInt(e.target.value, 10);
    //     const updatedRoomDetails = Array.from({ length: totalRooms }, () => ({
    //         roomNumber: '',
    //         status: ''
    //     }));

    //     setRoomData({
    //         ...roomData,
    //         totalAvailableRoom: totalRooms,
    //         roomDetails: updatedRoomDetails,
    //     });
    // };

    const handleRoomDetailsChange = (index, field, value) => {
        const updatedRoomDetails = [...roomData.roomDetails];
        if (!updatedRoomDetails[index]) {
            updatedRoomDetails[index] = { roomNumber: "", status: "Available" };
        }
        updatedRoomDetails[index][field] = value;
        setRoomData({ ...roomData, roomDetails: updatedRoomDetails });
    };

    const handleTotalRoomChange = (e) => {
        const totalRooms = parseInt(e.target.value, 10);
        const updatedRoomDetails = [...roomData.roomDetails];

        if (totalRooms > updatedRoomDetails.length) {
            const newRooms = Array.from({
                length: totalRooms - updatedRoomDetails.length,
            }).map(() => ({ roomNumber: "", status: "Available" }));
            updatedRoomDetails.push(...newRooms);
        } else {
            updatedRoomDetails.splice(totalRooms);
        }

        setRoomData({
            ...roomData,
            totalAvailableRoom: totalRooms,
            roomDetails: updatedRoomDetails,
        });
    };



    // Handle change for form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        const [field, index, prop] = name.split('[').map((item) => item.replace(']', ''));

        if (index !== undefined && prop !== undefined) {
            const updatedSpecialDayTariff = [...roomData.specialDayTariff];
            updatedSpecialDayTariff[index][prop] = value;
            setRoomData({
                ...roomData,
                specialDayTariff: updatedSpecialDayTariff,
            });
        } else {
            setRoomData({
                ...roomData,
                [field]: value,
            });
        }
    };

    // Add a new special day tariff entry
    const addSpecialDayTariff = () => {
        setRoomData({
            ...roomData,
            specialDayTariff: [
                ...roomData.specialDayTariff,
                { special_day_name: '', startDate: '', endDate: '', extraCharge: '' },
            ],
        });
    };

    // Remove a special day tariff entry
    const removeSpecialDayTariff = (index) => {
        const updatedSpecialDayTariff = roomData.specialDayTariff.filter((_, i) => i !== index);
        setRoomData({
            ...roomData,
            specialDayTariff: updatedSpecialDayTariff,
        });
    };

    const handleDiscriptionChange = (value) => {
        setRoomData({ ...roomData, description: value });
    };

    const handlePricingDiscriptionChange = (value) => {
        setRoomData({ ...roomData, pricingDetailDescription: value });
    };


    const handleGuestCheckboxChange = (guestType, isChecked) => {
        if (isChecked) {
            // Add the guestType to pricingDetails if selected
            setRoomData((prevData) => ({
                ...prevData,
                pricingDetails: [
                    ...prevData.pricingDetails,
                    { guestType, price: '', description: '' },
                ],
            }));
        } else {
            // Remove the guestType from pricingDetails if unchecked
            setRoomData((prevData) => ({
                ...prevData,
                pricingDetails: prevData.pricingDetails.filter(
                    (detail) => detail.guestType !== guestType
                ),
            }));
        }
    };

    const handlePriceChange = (guestType, price) => {
        // Update the price for the specific guestType
        setRoomData((prevData) => ({
            ...prevData,
            pricingDetails: prevData.pricingDetails.map((detail) =>
                detail.guestType === guestType ? { ...detail, price } : detail
            ),
        }));
    };

    const handleDescriptionChange = (guestType, description) => {
        // Update the description for the specific guestType
        setRoomData((prevData) => ({
            ...prevData,
            pricingDetails: prevData.pricingDetails.map((detail) =>
                detail.guestType === guestType ? { ...detail, description } : detail
            ),
        }));
    };


    // const UploadBox = ({ onClick }) => (
    //     <Box
    //         onClick={onClick}
    //         sx={{
    //             marginTop: 3,
    //             height: 200,
    //             borderRadius: "10px",
    //             display: "flex",
    //             alignItems: "center",
    //             justifyContent: "center",
    //             flexDirection: "column",
    //             borderStyle: "dashed",
    //             borderWidth: "2px",
    //             borderColor: "divider",
    //             cursor: "pointer",
    //         }}
    //     >
    //         <BiImageAdd style={{ fontSize: "50px", color: "#027edd" }} />
    //         <Typography>Click to upload images</Typography>
    //     </Box>
    // );


    // // Handle image upload
    // const handleUploadImage = async (event) => {
    //     const files = Array.from(event.target.files);

    //     // Check if files are selected
    //     if (!files || files.length === 0) {
    //         showToast("No files selected.", "error");
    //         return;
    //     }

    //     //   const files = Array.from(e.target.files); // Convert FileList to an array
    //     const maxSize = 100 * 1024; // 100KB in bytes

    //     const validFiles = [];
    //     const invalidFiles = [];

    //     files.forEach((file) => {
    //         if (file.size <= maxSize) {
    //             validFiles.push(file); // Add valid files to the array
    //         } else {
    //             invalidFiles.push(file.name); // Collect names of invalid files
    //         }
    //     });

    //     if (invalidFiles.length > 0) {
    //         showToast(
    //             `The following files exceed 100KB and were not added:\n${invalidFiles.join(", ")}`,
    //             "error" // Assuming "error" is the type of toast for errors
    //         );
    //     }


    //     // Create FormData and append selected images
    //     const formData = new FormData();
    //     files.forEach((file) => formData.append("images", file));

    //     try {
    //         // Upload the images
    //         const response = await uploadRoomImage(id, formData);

    //         if (response.status === 200) {
    //             // Fetch the latest room details after image upload
    //             await getRoomById();
    //             navigate(`/roomwith-category/${id}`);
    //             showToast("Images uploaded successfully.", "success");
    //         } else {
    //             showToast(response.data.message || "Failed to upload images.", "error");
    //         }
    //     } catch (error) {
    //         console.error("Image upload error:", error);
    //         showToast(error.response?.data?.message || "Failed to upload images. Please try again.", "error");
    //     }
    // };
    // Handle image upload
    const handleUploadImage = async (event) => {
        const files = Array.from(event.target.files); // Convert FileList to an array
        // const maxSize = 100 * 1024; // 100KB in bytes
        const maxSize = 20 * 1024 * 1024; // 20 MB in bytes


        // Check if files are selected
        if (!files || files.length === 0) {
            showToast("No files selected.", "error");
            return;
        }

        // Separate valid and invalid files based on size
        const validFiles = [];
        const invalidFiles = [];

        files.forEach((file) => {
            if (file.size <= maxSize) {
                validFiles.push(file);
            } else {
                invalidFiles.push(file.name);
            }
        });

        // Show a toast if there are invalid files
        if (invalidFiles.length > 0) {
            showToast(
                `The following files exceed 100KB and were not added:\n${invalidFiles.join(", ")}`,
                "error"
            );
            return;
        }

        // // If no valid files exist, exit the function
        // if (validFiles.length === 0) {
        //     showToast("No valid files to upload.", "error");
        //     return;
        // }

        // Create FormData and append valid files
        const formData = new FormData();
        validFiles.forEach((file) => formData.append("images", file));

        try {
            // Upload the images
            const response = await uploadRoomImage(id, formData);

            // Handle response
            if (response.status === 200) {
                // Fetch the latest room details and navigate
                await getRoomById(); // Assuming this updates the room details
                navigate(`/roomwith-category/${id}`);
                showToast("Images uploaded successfully.", "success");
            } else {
                showToast(response.data.message || "Failed to upload images.", "error");
            }
        } catch (error) {
            // Handle errors
            console.error("Image upload error:", error);
            showToast(
                error.response?.data?.message || "Failed to upload images. Please try again.",
                "error"
            );
        }
    };



    // Handle image deletion by index
    const handleDeleteImage = async (index) => {
        try {
            const updatedImages = images.filter((_, i) => i !== index);
            // const updatedData = { ...roomData, images: updatedImages };
            await deleteRoomImage(id, index);
            getRoomById()
            showToast("Image deleted successfully.", "success");
            navigate(`/roomwith-category/${id}`);
            // setRoomData(updatedData);
        } catch (error) {
            console.log(error)
            showToast("Failed to delete image.", "error");
        }
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
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Breadcrumb />
            <Typography variant="h5" sx={{ mb: "20px", textAlign: "center", fontWeight: 600 }}>
                Edit Room
            </Typography>
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    borderRadius: "10px",
                    maxWidth: "600px",
                    margin: "0 auto",
                    // backgroundColor: "#f9f9f9",
                }}
            >
                <Grid item xs={12} md={5}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {images?.map((image, index) => (
                            <Box key={index} sx={{ position: "relative" }}>
                                <img
                                    src={`${PUBLIC_API_URI}${image}`}
                                    // sx={{ width: 20, height: 20 }}
                                    height={120}
                                    width={120}
                                />
                                <IconButton onClick={() => handleDeleteImage(index)}>
                                    <FiTrash />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                    <input type="file" hidden ref={imageInput} multiple onChange={handleUploadImage} />
                    <Button variant="outlined" component="label" onClick={() => imageInput.current.click()}>
                        Upload New Images
                    </Button>
                </Grid>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Type</InputLabel>
                    <FormControl fullWidth margin="dense" error={!!errors.categoryName}>
                        {/* <InputLabel>Room Type</InputLabel> */}
                        <Select name="categoryName" value={roomData.categoryName} onChange={handleInputChange}
                            startAdornment={<CategoryIcon sx={{ color: "gray", mr: 1 }} />}
                        >
                            <MenuItem value="" disabled>
                                Please Choose Room Category
                            </MenuItem>
                            {roomTypes.map((type) => (
                                <MenuItem key={type._id} value={type._id}>{type.name}</MenuItem>
                            ))}
                        </Select>
                        {errors.categoryName && <Typography color="error">{errors.categoryName}</Typography>}
                    </FormControl>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Maxium Member Allowed PerRoom</InputLabel>
                    <TextField
                        placeholder="Enter Maxium Member PerRoom"
                        fullWidth
                        margin="dense"
                        name="maxAllowedPerRoom"
                        value={roomData.maxAllowedPerRoom}
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
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>ExtraBed Price</InputLabel>
                    <TextField
                        placeholder="Enter ExtraBed Price"
                        fullWidth
                        margin="dense"
                        name="extraBedPrice"
                        value={roomData.extraBedPrice}
                        onChange={handleInputChange}
                        error={!!errors.extraBedPrice}
                        helperText={errors.extraBedPrice}
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
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Check In Time</InputLabel>
                    <TextField
                        type="time"
                        placeholder="Enter Check In Time"
                        fullWidth
                        margin="dense"
                        name="checkInTime"
                        value={roomData.checkInTime}
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
                        value={roomData.checkOutTime}
                        onChange={handleInputChange}
                        error={!!errors.checkOutTime}
                        helperText={errors.checkOutTime}
                        InputProps={{
                            startAdornment: <AccessTime sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Min Price  (Displayed in App Only)</InputLabel>
                    <TextField
                        placeholder="Enter minimum price"
                        fullWidth
                        margin="dense"
                        name="minPrice"
                        value={roomData.priceRange.minPrice}
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
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Max Price  (Displayed in App Only)</InputLabel>
                    <TextField
                        placeholder="Enter maximum price"
                        fullWidth
                        margin="dense"
                        name="maxPrice"
                        value={roomData.priceRange.maxPrice}
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
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Size (sq. feet)</InputLabel>
                    <TextField
                        placeholder="Enter room size"
                        fullWidth
                        margin="dense"
                        name="roomSize"
                        value={roomData.roomSize}
                        onChange={handleInputChange}
                        error={!!errors.roomSize}
                        helperText={errors.roomSize}
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
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Bed Type</InputLabel>
                    <FormControl fullWidth margin="dense" error={!!errors.bedType}>
                        {/* <InputLabel>Bed Type</InputLabel> */}
                        <Select name="bedType" value={roomData.bedType} onChange={handleInputChange} displayEmpty
                            startAdornment={<KingBedIcon sx={{ color: "gray", mr: 1 }} />}>
                            <MenuItem value="" disabled>
                                Please Choose Bed Type
                            </MenuItem>
                            {bedTypeOptions.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                        {errors.bedType && <Typography color="error">{errors.bedType}</Typography>}
                    </FormControl>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Amenities</InputLabel>
                    <FormControl fullWidth>
                        {/* <InputLabel>Amenities</InputLabel> */}
                        <div>
                            {amenitiesOptions.map(amenity => (
                                <FormControlLabel
                                    key={amenity._id}
                                    control={
                                        <Checkbox
                                            checked={roomData.amenities.includes(amenity._id)}
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
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Status</InputLabel>
                    <FormControl fullWidth margin="dense" error={!!errors.status}>
                        <Select name="status" value={roomData.status} onChange={handleInputChange} displayEmpty
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
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Permissions</InputLabel>
                    <FormControlLabel
                        control={<Checkbox checked={roomData.smokingAllowed} onChange={handleCheckboxChange} name="smokingAllowed" />}
                        label="Smoking Allowed"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={roomData.petFriendly} onChange={handleCheckboxChange} name="petFriendly" />}
                        label="Pet Friendly"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={roomData.accessible} onChange={handleCheckboxChange} name="accessible" />}
                        label="Accessible"
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Pricing</InputLabel>
                    {guestTypeOptions.map((guestType) => (
                        <Box
                            key={guestType}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                mb: 2,
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={(e) =>
                                            handleGuestCheckboxChange(guestType, e.target.checked)
                                        }
                                        checked={roomData.pricingDetails.some(
                                            (detail) => detail.guestType === guestType
                                        )}
                                    />
                                }
                                label={guestType}
                            />
                            {roomData.pricingDetails.some(
                                (detail) => detail.guestType === guestType
                            ) && (
                                    <Box sx={{ ml: 4 }}>
                                        <TextField
                                            placeholder="Enter Price"
                                            value={
                                                roomData.pricingDetails.find(
                                                    (detail) => detail.guestType === guestType
                                                )?.price || ''
                                            }
                                            onChange={(e) =>
                                                handlePriceChange(guestType, e.target.value)
                                            }
                                            sx={{ mb: 2, }}
                                            InputProps={{
                                                startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} />,
                                            }}
                                            type="number"
                                            inputProps={{
                                                min: 0, // Set minimum value
                                            }}
                                        />
                                        <TextField
                                            placeholder="Enter Description"
                                            value={
                                                roomData.pricingDetails.find(
                                                    (detail) => detail.guestType === guestType
                                                )?.description || ''
                                            }
                                            onChange={(e) =>
                                                handleDescriptionChange(guestType, e.target.value)
                                            }
                                            sx={{ mb: 2, ml: 2 }}
                                        />
                                    </Box>
                                )}
                        </Box>
                    ))}
                    {errors.pricingDetails && (
                        <Typography color="error" sx={{ mt: 2, fontWeight: 'bold' }}>
                            {errors.pricingDetails}
                        </Typography>
                    )}
                </Box>
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
                                            checked={roomData.taxTypes.includes(tax._id)}
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
                            value={roomData.cancellationPolicy.before7Days}
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
                            value={roomData.cancellationPolicy.between7To2Days}
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
                            value={roomData.cancellationPolicy.between48To24Hours}
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
                            value={roomData.cancellationPolicy.lessThan24Hours}
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
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Breakfast Included</InputLabel>
                    <FormControlLabel
                        control={<Checkbox checked={roomData.breakfastIncluded} onChange={handleCheckboxChange} name="breakfastIncluded" />}
                        label="Breakfast Included"
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Special Day Tarrif Details</InputLabel>
                    {roomData.specialDayTariff.map((tariff, index) => (
                        <Box key={index} sx={{ display: "block", gap: 2, margin: "5px" }}>
                            <TextField
                                fullWidth
                                name={`specialDayTariff[${index}][special_day_name]`}
                                label="Special Day Name"
                                value={tariff.special_day_name}
                                onChange={handleChange}
                                style={{ margin: "5px" }}
                            />
                            {/* <TextField
                                fullWidth
                                name={`specialDayTariff[${index}][startDate]`}
                                label="Start Date"
                                type="date"
                                value={tariff.startDate ? new Date(tariff.startDate).toISOString().split("T")[0] : ""}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{ min: new Date(tariff.startDate).toISOString().split("T")[0] }} // Allow only today and future dates
                                style={{ margin: "5px" }}
                            />
                            <TextField
                                fullWidth
                                name={`specialDayTariff[${index}][endDate]`}
                                label="End Date"
                                type="date"
                                // value={tariff.endDate}
                                value={tariff.endDate ? new Date(tariff.endDate).toISOString().split("T")[0] : ""}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{ min: new Date(tariff.endDate).toISOString().split("T")[0] }} // Allow only today and future dates
                                style={{ margin: "5px" }}
                            /> */}
                            <TextField
                                fullWidth
                                name={`specialDayTariff[${index}][startDate]`}
                                label="Start Date"
                                type="date"
                                value={tariff.startDate && !isNaN(new Date(tariff.startDate).getTime())
                                    ? new Date(tariff.startDate).toISOString().split("T")[0]
                                    : ""}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    min: tariff.startDate && !isNaN(new Date(tariff.startDate).getTime())
                                        ? new Date(tariff.startDate).toISOString().split("T")[0]
                                        : new Date().toISOString().split("T")[0]
                                }}
                                style={{ margin: "5px" }}
                            />
                            <TextField
                                fullWidth
                                name={`specialDayTariff[${index}][endDate]`}
                                label="End Date"
                                type="date"
                                value={tariff.endDate && !isNaN(new Date(tariff.endDate).getTime())
                                    ? new Date(tariff.endDate).toISOString().split("T")[0]
                                    : ""}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    min: tariff.endDate && !isNaN(new Date(tariff.endDate).getTime())
                                        ? new Date(tariff.endDate).toISOString().split("T")[0]
                                        : new Date().toISOString().split("T")[0]
                                }}
                                style={{ margin: "5px" }}
                            />

                            <TextField
                                fullWidth
                                name={`specialDayTariff[${index}][extraCharge]`}
                                label="Extra Charge In %"
                                type="number"
                                value={tariff.extraCharge}
                                // onChange={handleChange}
                                style={{ margin: "5px" }}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
                                        handleChange(e); // Call your existing input handler
                                    }
                                }}
                                inputProps={{
                                    min: 0, // Set minimum value
                                    max: 100, // Set maximum value
                                }}
                            />

                            {/* Remove Button */}
                            {roomData.specialDayTariff.length > 0 && (
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


                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Facilities Description</InputLabel>
                    <ReactQuill
                        name="description"
                        value={roomData.description}
                        onChange={handleDiscriptionChange}
                        placeholder="Enter Room Facilities"
                        style={{
                            height: "100px",
                            // border: "1px solid #ccc",
                            borderRadius: "8px",
                            marginBottom: "100px"
                        }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}> Pricing Detail Description</InputLabel>
                    <ReactQuill
                        name=" pricingDetailDescription"
                        value={roomData.pricingDetailDescription}
                        onChange={handlePricingDiscriptionChange}
                        placeholder="Enter Room  Pricing Detail Description"
                        style={{
                            height: "100px",
                            // border: "1px solid #ccc",
                            borderRadius: "8px",
                            marginBottom: "100px"
                        }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Total Available Rooms</InputLabel>
                    <TextField
                        type="number"
                        fullWidth
                        margin="dense"
                        name="totalAvailableRoom"
                        value={roomData.totalAvailableRoom}
                        onChange={handleTotalRoomChange}
                    />

                    {roomData.roomDetails.map((room, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room {index + 1} - Room Number</InputLabel>
                            <TextField
                                fullWidth
                                margin="dense"
                                name={`roomDetails.${index}.roomNumber`}
                                value={room.roomNumber}
                                onChange={(e) =>
                                    handleRoomDetailsChange(index, "roomNumber", e.target.value)
                                }
                                type="number"
                                inputProps={{
                                    min: 0, // Set minimum value
                                }}
                            />

                            <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room {index + 1} - Status</InputLabel>
                            <FormControl fullWidth margin="dense">
                                <Select
                                    name={`roomDetails.${index}.status`}
                                    value={room.status}
                                    onChange={(e) =>
                                        handleRoomDetailsChange(index, "status", e.target.value)
                                    }
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        Please Choose Status
                                    </MenuItem>
                                    {roomStatusOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    ))}
                </Box>

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
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                        }}
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Update Room"}
                    </Button>
                </Box>
            </Paper >
        </Box >
    );
};

export default EditRoom;