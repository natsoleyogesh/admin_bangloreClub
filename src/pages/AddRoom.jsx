// import React, { useEffect, useState, useRef } from "react";
// import {
//     Box,
//     Button,
//     CircularProgress,
//     FormControl,
//     InputLabel,
//     MenuItem,
//     Paper,
//     Select,
//     TextField,
//     Typography,
//     Checkbox,
//     FormControlLabel,
//     IconButton,
// } from "@mui/material";
// import { BiImageAdd } from "react-icons/bi";
// import { FiPlus, FiTrash } from "react-icons/fi";
// import { showToast } from "../api/toast";
// import { useNavigate } from "react-router-dom";
// import { addRoom } from "../api/room";
// import { fetchAllCategories } from "../api/category";

// import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
// import NumbersIcon from "@mui/icons-material/Numbers";
// import ApartmentIcon from "@mui/icons-material/Apartment";
// import InputAdornment from "@mui/material/InputAdornment";
// import { CurrencyRupee, Description, ToggleOff } from "@mui/icons-material";
// import GroupsIcon from "@mui/icons-material/Groups";
// import SquareFootIcon from "@mui/icons-material/SquareFoot";
// import CategoryIcon from "@mui/icons-material/Category";
// import KingBedIcon from "@mui/icons-material/KingBed";
// import HotelIcon from "@mui/icons-material/Hotel";
// import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
// import PersonIcon from "@mui/icons-material/Person";
// import { fetchAllActiveTaxTypes } from "../api/masterData/taxType";
// import { fetchAllActiveAmenities } from "../api/masterData/amenities";
// import ReactQuill from "react-quill";
// import Breadcrumb from "../components/common/Breadcrumb";

// const guestTypeOptions = [
//     'Member',
//     'Member Spouse & Children',
//     'Corporate Member',
//     'Guest of Member',
//     'Affiliated Club Member',
//     'Nominee of Corporate Member',
//     'Affiliated Foreign Club Member',
//     'Foreign Guest',
// ];

// const bedTypeOptions = ['Single', 'Double', 'Queen', 'King', 'Twin', 'Sofa Bed'];
// const statusOptions = ['Active', 'Inactive',];
// const roomStatusOptions = ['Available', 'Booked', 'Under Maintenance'];


// const AddRoom = () => {
//     const [roomData, setRoomData] = useState({
//         categoryName: '',
//         description: '',
//         priceRange: { minPrice: '', maxPrice: '' },
//         pricingDetails: [{ guestType: '', price: '', description: '' }],
//         amenities: [],
//         roomSize: '',
//         bedType: '',
//         features: { smokingAllowed: false, petFriendly: false, accessible: false },
//         status: 'Active',
//         roomDetails: [{ roomNumber: '', status: "Available" }],
//         totalAvailableRoom: 1,
//         taxTypes: [],
//         checkInTime: '12:00',
//         checkOutTime: '11:00',
//         maxAllowedPerRoom: '',
//         cancellationPolicy: { before7Days: '', between7To2Days: '', between48To24Hours: '', lessThan24Hours: '' },
//         breakfastIncluded: false,
//         specialDayTariff: [],
//         extraBedPrice: '',
//     });
//     const [roomTypes, setRoomTypes] = useState([]);
//     const [images, setImages] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const imageInput = useRef(null);
//     const navigate = useNavigate();

//     // fetch the data in master table 
//     const [amenitiesOptions, setAmenitiesOptions] = useState([]);
//     const [taxTypes, setTaxTypes] = useState([]);

//     // Fetch room types (categories)
//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const response = await fetchAllCategories();
//                 setRoomTypes(response.data.categories);
//             } catch (error) {
//                 showToast("Failed to fetch room types.", "error");
//             }
//         };
//         fetchCategories();
//         fetchTaxTypes();
//         fetchAmenioties();
//     }, []);

//     const fetchTaxTypes = async () => {
//         try {
//             const response = await fetchAllActiveTaxTypes();
//             setTaxTypes(response?.data?.data);
//         } catch (error) {
//             showToast("Failed to fetch room types.", "error");
//         }
//     };

//     const fetchAmenioties = async () => {
//         try {
//             const response = await fetchAllActiveAmenities();
//             setAmenitiesOptions(response?.data?.data);
//         } catch (error) {
//             showToast("Failed to fetch room types.", "error");
//         }
//     };

//     const handleInputChange = (e) => {
//         console.log(e.target.name, "-", e.target.value, "handleInputChangew")
//         const { name, value } = e.target;
//         setRoomData({ ...roomData, [name]: value });
//         setErrors({ ...errors, [name]: "" }); // Clear error on change
//     };

//     const handlePriceInputChange = (event) => {
//         const { name, value } = event.target;

//         // Update minPrice or maxPrice based on the field name
//         setRoomData((prevData) => ({
//             ...prevData,
//             priceRange: {
//                 ...prevData.priceRange,
//                 [name]: value,
//             },
//         }));
//     };
//     // Handle input changes for both check-in and check-out times

//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files);
//         console.log(files)
//         setImages((prevImages) => [...prevImages, ...files]);
//     };

//     const handleRemoveImage = (index) => {
//         const updatedImages = images.filter((_, i) => i !== index);
//         setImages(updatedImages);
//     };

//     // Add new pricing detail
//     const handleAddPricingDetail = () => {
//         setRoomData((prevData) => ({
//             ...prevData,
//             pricingDetails: [...prevData.pricingDetails, { guestType: "", price: "", description: "" }],
//         }));
//     };

//     const handlePricingDetailChange = (index, field, value) => {
//         const updatedPricingDetails = [...roomData.pricingDetails];
//         updatedPricingDetails[index] = {
//             ...updatedPricingDetails[index],
//             [field]: value,
//         };
//         setRoomData({ ...roomData, pricingDetails: updatedPricingDetails });
//     };

//     const handleRemovePricingDetail = (index) => {
//         const updatedPricingDetails = roomData.pricingDetails.filter((_, i) => i !== index);
//         setRoomData({ ...roomData, pricingDetails: updatedPricingDetails });
//     };

//     const handleCheckboxChange = (e) => {
//         const { name, checked } = e.target;
//         setRoomData({ ...roomData, [name]: checked });
//     };

//     const validateForm = () => {
//         const newErrors = {};

//         // Validate categoryName
//         if (!roomData.categoryName) newErrors.categoryName = "Room category is required.";

//         // Validate description
//         if (!roomData.description) newErrors.description = "Room description is required.";

//         // Validate priceRange
//         const { minPrice, maxPrice } = roomData.priceRange;
//         if (!minPrice) newErrors.minPrice = "Min Price is required.";
//         else if (isNaN(minPrice) || Number(minPrice) < 0) newErrors.minPrice = "Min Price must be a valid positive number.";

//         if (!maxPrice) newErrors.maxPrice = "Max Price is required.";
//         else if (isNaN(maxPrice) || Number(maxPrice) < 0) newErrors.maxPrice = "Max Price must be a valid positive number.";

//         if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
//             newErrors.maxPrice = "Max Price must be greater than Min Price.";
//         }

//         // Required guest types
//         const requiredGuestTypes = ['Member', 'Member Spouse & Children', 'Guest of Member'];

//         // Validate pricingDetails
//         if (roomData.pricingDetails.length === 0) {
//             newErrors.pricingDetails = "At least one pricing detail is required.";
//         } else {
//             // Track added guest types
//             const addedGuestTypes = new Set();

//             roomData.pricingDetails.forEach((detail, index) => {
//                 if (!detail.guestType) {
//                     newErrors[`guestType_${index}`] = "Guest Type is required.";
//                 } else {
//                     // Add guest type to the set for validation
//                     addedGuestTypes.add(detail.guestType);
//                 }

//                 if (!detail.price) {
//                     newErrors[`price_${index}`] = "Price is required.";
//                 } else if (isNaN(detail.price) || Number(detail.price) < 0) {
//                     newErrors[`price_${index}`] = "Price must be a valid positive number.";
//                 }
//             });

//             // Check if all required guest types are included
//             requiredGuestTypes.forEach((requiredType) => {
//                 if (!addedGuestTypes.has(requiredType)) {
//                     newErrors.pricingDetails = `Missing required guest type: ${requiredType}.`;
//                 }
//             });
//         }


//         // Validate amenities
//         if (roomData.amenities.length === 0) {
//             newErrors.amenities = "At least one amenity is required.";
//         }

//         // Validate roomSize
//         if (!roomData.roomSize) {
//             newErrors.roomSize = "Room size is required.";
//         } else if (isNaN(roomData.roomSize) || Number(roomData.roomSize) <= 0) {
//             newErrors.roomSize = "Room size must be a valid positive number.";
//         }

//         // Validate bedType
//         if (!roomData.bedType) newErrors.bedType = "Bed type is required.";

//         // Validate features
//         if (roomData.features.smokingAllowed === undefined) {
//             newErrors.smokingAllowed = "Smoking allowed field is required.";
//         }
//         if (roomData.features.petFriendly === undefined) {
//             newErrors.petFriendly = "Pet-friendly field is required.";
//         }
//         if (roomData.features.accessible === undefined) {
//             newErrors.accessible = "Accessible field is required.";
//         }

//         // Validate status
//         if (!roomData.status) newErrors.status = "Room status is required.";

//         // Validate roomDetails
//         if (roomData.roomDetails.length === 0) {
//             newErrors.roomDetails = "At least one room detail is required.";
//         } else {
//             roomData.roomDetails.forEach((detail, index) => {
//                 if (!detail.roomNumber) {
//                     newErrors[`roomNumber_${index}`] = "Room number is required.";
//                 }
//                 if (!detail.status) {
//                     newErrors[`roomStatus_${index}`] = "Room status is required.";
//                 }
//             });
//         }

//         // Validate taxTypes
//         if (roomData.taxTypes.length === 0) {
//             newErrors.taxTypes = "At least one tax type is required.";
//         }

//         // Validate cancellationPolicy
//         const { before7Days, between7To2Days, between48To24Hours, lessThan24Hours } = roomData.cancellationPolicy;
//         if (!before7Days) newErrors.before7Days = "Cancellation policy for 'Before 7 Days' is required.";
//         if (!between7To2Days) newErrors.between7To2Days = "Cancellation policy for 'Between 7 to 2 Days' is required.";
//         if (!between48To24Hours) newErrors.between48To24Hours = "Cancellation policy for 'Between 48 to 24 Hours' is required.";
//         if (!lessThan24Hours) newErrors.lessThan24Hours = "Cancellation policy for 'Less Than 24 Hours' is required.";

//         // Validate check-in and check-out times
//         if (!roomData.checkInTime) newErrors.checkInTime = "Check-in time is required.";
//         if (!roomData.checkOutTime) newErrors.checkOutTime = "Check-out time is required.";

//         // Validate maximum occupancy per room
//         if (!roomData.maxAllowedPerRoom) {
//             newErrors.maxAllowedPerRoom = "Maximum occupancy per room is required.";
//         } else if (isNaN(roomData.maxAllowedPerRoom) || Number(roomData.maxAllowedPerRoom) <= 0) {
//             newErrors.maxAllowedPerRoom = "Maximum occupancy must be a valid positive number.";
//         }

//         // Validate breakfastIncluded
//         if (roomData.breakfastIncluded === undefined) {
//             newErrors.breakfastIncluded = "Breakfast included field is required.";
//         }

//         // Validate specialDayTariff
//         if (roomData.specialDayTariff.length > 0) {
//             roomData.specialDayTariff.forEach((tariff, index) => {
//                 if (!tariff.special_day_name) {
//                     newErrors[`specialDayName_${index}`] = "Special day name is required.";
//                 }
//                 if (!tariff.startDate) {
//                     newErrors[`startDate_${index}`] = "Start date is required.";
//                 }
//                 if (!tariff.endDate) {
//                     newErrors[`endDate_${index}`] = "End date is required.";
//                 }
//                 if (!tariff.extraCharge) {
//                     newErrors[`extraCharge_${index}`] = "Extra charge is required.";
//                 } else if (isNaN(tariff.extraCharge) || Number(tariff.extraCharge) < 0) {
//                     newErrors[`extraCharge_${index}`] = "Extra charge must be a valid positive number.";
//                 }
//             });
//         }

//         // Validate extraBedPrice
//         if (!roomData.extraBedPrice) {
//             newErrors.extraBedPrice = "Extra bed price is required.";
//         } else if (isNaN(roomData.extraBedPrice) || Number(roomData.extraBedPrice) < 0) {
//             newErrors.extraBedPrice = "Extra bed price must be a valid positive number.";
//         }
//         console.log(newErrors, "newErr---------------")
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async () => {
//         console.log(roomData, "rrrrrrrrrrrrr")
//         if (!validateForm()) return; // Prevent submission if validation fails

//         setLoading(true);

//         try {
//             const formData = new FormData();

//             // Add basic room data to formData
//             addBasicRoomDataToFormData(formData);

//             // Add pricing details to formData
//             addPricingDetailsToFormData(formData);

//             // Add amenities to formData
//             addAmenitiesToFormData(formData);

//             // Add features (JSON) to formData
//             addFeaturesToFormData(formData);

//             // Add features (JSON) to formData
//             addPriceRangeToFormData(formData);

//             // Add images to formData
//             addImagesToFormData(formData);

//             // Add special day tariff if any
//             addSpecialDayTariffToFormData(formData);

//             // Add cancellation policy to formData
//             addCancellationPolicyToFormData(formData);

//             // Add room details if any
//             addRoomDetailsToFormData(formData);

//             // Add tax types to formData
//             addTaxTypesToFormData(formData);
//             // Add images to formData
//             // images.forEach((image) => formData.append("images", image));
//             // Call the addRoom API with formData
//             const response = await addRoom(formData);

//             if (response.status === 201) {
//                 showToast("Room added successfully!", "success");
//                 navigate("/roomwith-categories");
//             } else {
//                 console.log(response, "error400")

//                 showToast(response.message || "Failed to add room.", "error");
//             }
//         } catch (error) {
//             console.log(error, "error500")
//             showToast(error.message || "An error occurred while adding the room.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Function to add basic room data to formData
//     const addBasicRoomDataToFormData = (formData) => {
//         console.log(formData, "formdat")
//         Object.entries(roomData).forEach(([key, value]) => {
//             console.log(roomData, "formdat")

//             if (key === 'cancellationPolicy' || key === 'priceRange' || key === 'pricingDetails' || key === 'amenities' || key === 'features' || key === 'specialDayTariff' || key === 'roomDetails' || key === 'taxTypes') {
//                 // Handle complex fields separately (already covered in other functions)
//                 return;
//             }
//             formData.append(key, value);
//         });
//     };

//     // Function to add pricing details to formData
//     const addPricingDetailsToFormData = (formData) => {
//         roomData.pricingDetails.forEach((detail, index) => {
//             formData.append(`pricingDetails[${index}][guestType]`, detail.guestType);
//             formData.append(`pricingDetails[${index}][price]`, detail.price);
//             formData.append(`pricingDetails[${index}][description]`, detail.description || '');
//         });
//     };

//     // Function to add amenities to formData
//     const addAmenitiesToFormData = (formData) => {
//         roomData.amenities.forEach((amenity) => formData.append('amenities', amenity));
//     };

//     // Function to add features as JSON to formData
//     const addFeaturesToFormData = (formData) => {
//         formData.append('features', JSON.stringify(roomData.features));
//     };

//     // Function to add features as JSON to formData
//     const addPriceRangeToFormData = (formData) => {
//         formData.append('priceRange', JSON.stringify(roomData.priceRange));
//     };

//     // Function to add images to formData
//     const addImagesToFormData = (formData) => {
//         images.forEach((image) => formData.append('images', image));
//     };

//     // Function to add special day tariff to formData
//     const addSpecialDayTariffToFormData = (formData) => {
//         roomData.specialDayTariff.forEach((tariff, index) => {
//             formData.append(`specialDayTariff[${index}][special_day_name]`, tariff.special_day_name);
//             formData.append(`specialDayTariff[${index}][startDate]`, tariff.startDate);
//             formData.append(`specialDayTariff[${index}][endDate]`, tariff.endDate);
//             formData.append(`specialDayTariff[${index}][extraCharge]`, tariff.extraCharge);
//         });
//     };

//     // Function to add cancellation policy to formData
//     const addCancellationPolicyToFormData = (formData) => {
//         // Object.entries(roomData.cancellationPolicy).forEach(([key, value]) => {
//         //     formData.append(`cancellationPolicy[${key}]`, value);
//         // });
//         formData.append('cancellationPolicy', JSON.stringify(roomData.cancellationPolicy));
//     };

//     // Function to add room details to formData
//     const addRoomDetailsToFormData = (formData) => {
//         roomData.roomDetails.forEach((room, index) => {
//             formData.append(`roomDetails[${index}][roomNumber]`, room.roomNumber);
//             formData.append(`roomDetails[${index}][status]`, room.status);
//         });
//     };

//     // Function to add tax types to formData
//     const addTaxTypesToFormData = (formData) => {
//         roomData.taxTypes.forEach((taxType) => formData.append('taxTypes', taxType));
//     };




//     const handleChangeTaxTypes = (event) => {
//         console.log(event.target.name, "-", event.target.value, "taxtype")

//         const { value, checked } = event.target;
//         if (checked) {
//             setRoomData({
//                 ...roomData,
//                 taxTypes: [...roomData.taxTypes, value],
//             });
//         } else {
//             setRoomData({
//                 ...roomData,
//                 taxTypes: roomData.taxTypes.filter((tax) => tax !== value),
//             });
//         }
//     };

//     // Handle checkbox changes for Amenities
//     const handleChangeAmenities = (event) => {
//         console.log(event.target.name, "-", event.target.checked, event.target.value, "amenities")

//         const { value, checked } = event.target;
//         if (checked) {
//             setRoomData({
//                 ...roomData,
//                 amenities: [...roomData.amenities, value], // Add amenity ID to array
//             });
//         } else {
//             setRoomData({
//                 ...roomData,
//                 amenities: roomData.amenities.filter((amenity) => amenity !== value), // Remove amenity ID from array
//             });
//         }
//     };

//     const handleCancalletionChange = (e) => {
//         const { name, value } = e.target;
//         console.log(name, value, "handleInputChange");
//         setRoomData({
//             ...roomData,
//             cancellationPolicy: {
//                 ...roomData.cancellationPolicy,
//                 [name]: value,
//             },
//         });
//         setErrors({ ...errors, [name]: '' }); // Clear error on change
//     };


//     // Handle change for inputs
//     const handleRoomInputChange = (e) => {
//         const { name, value } = e.target;
//         const [field, index, prop] = name.split('.');

//         if (field === 'roomDetails' && index !== undefined && prop !== undefined) {
//             const updatedRoomDetails = [...roomData.roomDetails];
//             updatedRoomDetails[parseInt(index)][prop] = value; // Update specific room detail
//             setRoomData({ ...roomData, roomDetails: updatedRoomDetails });
//         }
//     };

//     // Handle change in the totalAvailableRoom
//     const handleTotalRoomChange = (e) => {
//         const totalRooms = parseInt(e.target.value, 10);
//         const updatedRoomDetails = Array.from({ length: totalRooms }, () => ({
//             roomNumber: '',
//             status: ''
//         }));

//         setRoomData({
//             ...roomData,
//             totalAvailableRoom: totalRooms,
//             roomDetails: updatedRoomDetails,
//         });
//     };


//     // Handle change for form inputs
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         const [field, index, prop] = name.split('[').map((item) => item.replace(']', ''));

//         if (index !== undefined && prop !== undefined) {
//             const updatedSpecialDayTariff = [...roomData.specialDayTariff];
//             updatedSpecialDayTariff[index][prop] = value;
//             setRoomData({
//                 ...roomData,
//                 specialDayTariff: updatedSpecialDayTariff,
//             });
//         } else {
//             setRoomData({
//                 ...roomData,
//                 [field]: value,
//             });
//         }
//     };

//     // Add a new special day tariff entry
//     const addSpecialDayTariff = () => {
//         setRoomData({
//             ...roomData,
//             specialDayTariff: [
//                 ...roomData.specialDayTariff,
//                 { special_day_name: '', startDate: '', endDate: '', extraCharge: '' },
//             ],
//         });
//     };

//     // Remove a special day tariff entry
//     const removeSpecialDayTariff = (index) => {
//         const updatedSpecialDayTariff = roomData.specialDayTariff.filter((_, i) => i !== index);
//         setRoomData({
//             ...roomData,
//             specialDayTariff: updatedSpecialDayTariff,
//         });
//     };

//     const handleDiscriptionChange = (value) => {
//         setRoomData({ ...roomData, description: value });
//     };


//     const UploadBox = ({ onClick }) => (
//         <Box
//             onClick={onClick}
//             sx={{
//                 marginTop: 3,
//                 height: 200,
//                 borderRadius: "10px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexDirection: "column",
//                 borderStyle: "dashed",
//                 borderWidth: "2px",
//                 borderColor: "divider",
//                 cursor: "pointer",
//             }}
//         >
//             <BiImageAdd style={{ fontSize: "50px", color: "#027edd" }} />
//             <Typography>Click to upload images</Typography>
//         </Box>
//     );


//     return (
//         <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
//             <Breadcrumb />
//             <Typography variant="h5" sx={{ mb: "20px", textAlign: "center", fontWeight: 600 }}>
//                 Create New Room
//             </Typography>
//             <Paper
//                 elevation={3}
//                 sx={{
//                     p: 2,
//                     borderRadius: "10px",
//                     maxWidth: "600px",
//                     margin: "0 auto",
//                     // backgroundColor: "#f9f9f9",
//                 }}
//             >
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Type</InputLabel>
//                     <FormControl fullWidth margin="dense" error={!!errors.categoryName}>
//                         {/* <InputLabel>Room Type</InputLabel> */}
//                         <Select name="categoryName" value={roomData.categoryName} onChange={handleInputChange}
//                             startAdornment={<CategoryIcon sx={{ color: "gray", mr: 1 }} />}
//                         >
//                             <MenuItem value="" disabled>
//                                 Please Choose Room Category
//                             </MenuItem>
//                             {roomTypes.map((type) => (
//                                 <MenuItem key={type._id} value={type._id}>{type.name}</MenuItem>
//                             ))}
//                         </Select>
//                         {errors.categoryName && <Typography color="error">{errors.categoryName}</Typography>}
//                     </FormControl>
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Maxium Member Allowed PerRoom</InputLabel>
//                     <TextField
//                         placeholder="Enter Maxium Member PerRoom"
//                         fullWidth
//                         margin="dense"
//                         name="maxAllowedPerRoom"
//                         value={roomData.maxAllowedPerRoom}
//                         onChange={handleInputChange}
//                         error={!!errors.maxAllowedPerRoom}
//                         helperText={errors.maxAllowedPerRoom}
//                         InputProps={{
//                             startAdornment: <MeetingRoomIcon sx={{ color: "gray", mr: 1 }} />,
//                         }}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>ExtraBed Price</InputLabel>
//                     <TextField
//                         placeholder="Enter ExtraBed Price"
//                         fullWidth
//                         margin="dense"
//                         name="extraBedPrice"
//                         value={roomData.extraBedPrice}
//                         onChange={handleInputChange}
//                         error={!!errors.extraBedPrice}
//                         helperText={errors.extraBedPrice}
//                         InputProps={{
//                             startAdornment: <NumbersIcon sx={{ color: "gray", mr: 1 }} />,
//                         }}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Check In Time</InputLabel>
//                     <TextField
//                         type="time"
//                         placeholder="Enter Check In Time"
//                         fullWidth
//                         margin="dense"
//                         name="checkInTime"
//                         value={roomData.checkInTime}
//                         onChange={handleInputChange}
//                         error={!!errors.checkInTime}
//                         helperText={errors.checkInTime}
//                         InputProps={{
//                             startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} />,
//                         }}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Check Out Time</InputLabel>
//                     <TextField
//                         type="time"
//                         placeholder="Enter Chack Out Time"
//                         fullWidth
//                         margin="dense"
//                         name="checkOutTime"
//                         value={roomData.checkOutTime}
//                         onChange={handleInputChange}
//                         error={!!errors.checkOutTime}
//                         helperText={errors.checkOutTime}
//                         InputProps={{
//                             startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} />,
//                         }}
//                     />
//                 </Box>

//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Min Price  (Displayed in App Only)</InputLabel>
//                     <TextField
//                         placeholder="Enter minimum price"
//                         fullWidth
//                         margin="dense"
//                         name="minPrice"
//                         value={roomData.priceRange.minPrice}
//                         onChange={handlePriceInputChange}
//                         error={!!errors.minPrice}
//                         helperText={errors.minPrice}
//                         InputProps={{
//                             startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} />,
//                         }}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Max Price  (Displayed in App Only)</InputLabel>
//                     <TextField
//                         placeholder="Enter maximum price"
//                         fullWidth
//                         margin="dense"
//                         name="maxPrice"
//                         value={roomData.priceRange.maxPrice}
//                         onChange={handlePriceInputChange}
//                         error={!!errors.maxPrice}
//                         helperText={errors.maxPrice}
//                         InputProps={{
//                             startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} />,
//                         }}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Size (sq. feet)</InputLabel>
//                     <TextField
//                         placeholder="Enter room size"
//                         fullWidth
//                         margin="dense"
//                         name="roomSize"
//                         value={roomData.roomSize}
//                         onChange={handleInputChange}
//                         error={!!errors.roomSize}
//                         helperText={errors.roomSize}
//                         InputProps={{
//                             startAdornment: <SquareFootIcon sx={{ color: "gray", mr: 1 }} />,
//                         }}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Bed Type</InputLabel>
//                     <FormControl fullWidth margin="dense" error={!!errors.bedType}>
//                         {/* <InputLabel>Bed Type</InputLabel> */}
//                         <Select name="bedType" value={roomData.bedType} onChange={handleInputChange} displayEmpty
//                             startAdornment={<KingBedIcon sx={{ color: "gray", mr: 1 }} />}>
//                             <MenuItem value="" disabled>
//                                 Please Choose Bed Type
//                             </MenuItem>
//                             {bedTypeOptions.map((option) => (
//                                 <MenuItem key={option} value={option}>{option}</MenuItem>
//                             ))}
//                         </Select>
//                         {errors.bedType && <Typography color="error">{errors.bedType}</Typography>}
//                     </FormControl>
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Amenities</InputLabel>
//                     <FormControl fullWidth>
//                         {/* <InputLabel>Amenities</InputLabel> */}
//                         <div>
//                             {amenitiesOptions.map(amenity => (
//                                 <FormControlLabel
//                                     key={amenity._id}
//                                     control={
//                                         <Checkbox
//                                             checked={roomData.amenities.includes(amenity._id)}
//                                             onChange={handleChangeAmenities}
//                                             value={amenity._id}
//                                         />
//                                     }
//                                     label={amenity.name}
//                                 />
//                             ))}
//                         </div>
//                     </FormControl>
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Status</InputLabel>
//                     <FormControl fullWidth margin="dense" error={!!errors.status}>
//                         <Select name="status" value={roomData.status} onChange={handleInputChange} displayEmpty
//                             startAdornment={<HotelIcon sx={{ color: "gray", mr: 1 }} />}>
//                             <MenuItem value="" disabled>
//                                 Please Choose  Status
//                             </MenuItem>
//                             {statusOptions.map((option) => (
//                                 <MenuItem key={option} value={option}>{option}</MenuItem>
//                             ))}
//                         </Select>
//                         {errors.status && <Typography color="error">{errors.status}</Typography>}
//                     </FormControl>
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Permissions</InputLabel>
//                     <FormControlLabel
//                         control={<Checkbox checked={roomData.smokingAllowed} onChange={handleCheckboxChange} name="smokingAllowed" />}
//                         label="Smoking Allowed"
//                     />
//                     <FormControlLabel
//                         control={<Checkbox checked={roomData.petFriendly} onChange={handleCheckboxChange} name="petFriendly" />}
//                         label="Pet Friendly"
//                     />
//                     <FormControlLabel
//                         control={<Checkbox checked={roomData.accessible} onChange={handleCheckboxChange} name="accessible" />}
//                         label="Accessible"
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Pricing Details</InputLabel>
//                     {/* <Typography variant="h6">Pricing Details</Typography> */}
//                     {roomData.pricingDetails.map((detail, index) => (
//                         <Box key={index} sx={{ display: "flex", gap: 2, margin: "5px" }}>
//                             <Select
//                                 value={detail.guestType}
//                                 onChange={(e) => handlePricingDetailChange(index, "guestType", e.target.value)}
//                                 error={!!errors[`guestType_${index}`]}
//                                 displayEmpty
//                                 startAdornment={<GroupsIcon sx={{ color: "gray", mr: 1 }} />}
//                             >
//                                 <MenuItem value="" disabled>
//                                     Please Choose Guest Type
//                                 </MenuItem>
//                                 {guestTypeOptions.map((option) => (
//                                     <MenuItem key={option} value={option}><PersonIcon style={{ marginRight: 8 }} />{option}</MenuItem>
//                                 ))}
//                                 {/* </ MenuItem> */}
//                             </Select>
//                             {errors[`guestType_${index}`] && <Typography color="error">{errors[`guestType_${index}`]}</Typography>}
//                             < TextField
//                                 label="Price"
//                                 placeholder="Please Enter Price"
//                                 value={detail.price}
//                                 onChange={(e) => handlePricingDetailChange(index, "price", e.target.value)}
//                                 error={!!errors[`price_${index}`]}
//                                 InputProps={{
//                                     startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} />,
//                                 }}
//                             />
//                             {errors[`price_${index}`] && <Typography color="error">{errors[`price_${index}`]}</Typography>}
//                             <IconButton onClick={() => handleRemovePricingDetail(index)}>
//                                 <FiTrash />
//                             </IconButton>
//                         </Box>
//                     ))
//                     }
//                     <Button variant="contained" color="primary" startIcon={<FiPlus />} onClick={handleAddPricingDetail} sx={{ marginTop: '5px', borderRadius: '15px', fontSize: '10px' }}>
//                         Add Pricing Detail
//                     </Button>
//                     {/* Display General Error for Missing Required Guest Types */}
//                     {errors.pricingDetails && (
//                         <Typography color="error" sx={{ mt: 2, fontWeight: 'bold' }}>
//                             {errors.pricingDetails}
//                         </Typography>
//                     )}
//                 </Box>
//                 {/* Tax Types */}
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Applicable Tax Types</InputLabel>

//                     <FormControl fullWidth>
//                         {/* <InputLabel>Tax Types</InputLabel> */}
//                         <div>
//                             {taxTypes.map(tax => (
//                                 <FormControlLabel
//                                     key={tax._id}
//                                     control={
//                                         <Checkbox
//                                             checked={roomData.taxTypes.includes(tax._id)}
//                                             onChange={handleChangeTaxTypes}
//                                             value={tax._id}
//                                         />
//                                     }
//                                     label={tax.name}
//                                 />
//                             ))}
//                         </div>
//                     </FormControl>
//                 </Box>
//                 {/* Cancellation Policy */}
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: 'bold', mb: 2 }}>Cancellation Policies In (%)</InputLabel>

//                     {/* Cancellation Before 7 Days */}
//                     <Box sx={{ mb: 2 }}>
//                         <InputLabel sx={{ fontWeight: 'medium', mb: 1 }}>Cancellation Before 7 Days</InputLabel>
//                         <TextField
//                             fullWidth
//                             name="before7Days"
//                             type="text"
//                             value={roomData.cancellationPolicy.before7Days}
//                             onChange={handleCancalletionChange}
//                             error={!!errors.before7Days}
//                             helperText={errors.before7Days}
//                         />
//                     </Box>

//                     {/* Cancellation Between 7 to 2 Days */}
//                     <Box sx={{ mb: 2 }}>
//                         <InputLabel sx={{ fontWeight: 'medium', mb: 1 }}>Between 7 to 2 Days</InputLabel>
//                         <TextField
//                             fullWidth
//                             name="between7To2Days"
//                             type="text"
//                             value={roomData.cancellationPolicy.between7To2Days}
//                             onChange={handleCancalletionChange}
//                             error={!!errors.between7To2Days}
//                             helperText={errors.between7To2Days}
//                         />
//                     </Box>

//                     {/* Cancellation Between 48 to 24 Hours */}
//                     <Box sx={{ mb: 2 }}>
//                         <InputLabel sx={{ fontWeight: 'medium', mb: 1 }}>Between 48 to 24 Hours</InputLabel>
//                         <TextField
//                             fullWidth
//                             name="between48To24Hours"
//                             type="text"
//                             value={roomData.cancellationPolicy.between48To24Hours}
//                             onChange={handleCancalletionChange}
//                             error={!!errors.between48To24Hours}
//                             helperText={errors.between48To24Hours}
//                         />
//                     </Box>

//                     {/* Cancellation Less Than 24 Hours */}
//                     <Box sx={{ mb: 2 }}>
//                         <InputLabel sx={{ fontWeight: 'medium', mb: 1 }}>Less Than 24 Hours</InputLabel>
//                         <TextField
//                             fullWidth
//                             name="lessThan24Hours"
//                             type="text"
//                             value={roomData.cancellationPolicy.lessThan24Hours}
//                             onChange={handleCancalletionChange}
//                             error={!!errors.lessThan24Hours}
//                             helperText={errors.lessThan24Hours}
//                         />
//                     </Box>
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Breakfast Included</InputLabel>
//                     <FormControlLabel
//                         control={<Checkbox checked={roomData.breakfastIncluded} onChange={handleCheckboxChange} name="breakfastIncluded" />}
//                         label="Breakfast Included"
//                     />
//                 </Box>

//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Special Day Tarrif Details</InputLabel>
//                     {roomData.specialDayTariff.map((tariff, index) => (
//                         <Box key={index} sx={{ display: "block", gap: 2, margin: "5px" }}>
//                             <TextField
//                                 fullWidth
//                                 name={`specialDayTariff[${index}][special_day_name]`}
//                                 label="Special Day Name"
//                                 value={tariff.special_day_name}
//                                 onChange={handleChange}
//                                 style={{ margin: "5px" }}
//                             />
//                             <TextField
//                                 fullWidth
//                                 name={`specialDayTariff[${index}][startDate]`}
//                                 label="Start Date"
//                                 type="date"
//                                 value={tariff.startDate}
//                                 onChange={handleChange}
//                                 InputLabelProps={{
//                                     shrink: true,
//                                 }}
//                                 inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates
//                                 style={{ margin: "5px" }}
//                             />
//                             <TextField
//                                 fullWidth
//                                 name={`specialDayTariff[${index}][endDate]`}
//                                 label="End Date"
//                                 type="date"
//                                 value={tariff.endDate}
//                                 onChange={handleChange}
//                                 InputLabelProps={{
//                                     shrink: true,
//                                 }}
//                                 inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates
//                                 style={{ margin: "5px" }}
//                             />
//                             <TextField
//                                 fullWidth
//                                 name={`specialDayTariff[${index}][extraCharge]`}
//                                 label="Extra Charge In %"
//                                 type="number"
//                                 value={tariff.extraCharge}
//                                 onChange={handleChange}
//                                 style={{ margin: "5px" }}
//                             />

//                             {/* Remove Button */}
//                             {roomData.specialDayTariff.length > 0 && (
//                                 <IconButton onClick={() => removeSpecialDayTariff(index)}>
//                                     <FiTrash />
//                                 </IconButton>
//                             )}
//                         </Box>
//                     ))}

//                     {/* Add Button */}
//                     <Box sx={{ mb: 2 }}>
//                         <Button variant="contained" onClick={addSpecialDayTariff}>
//                             Add Special Day Tariff
//                         </Button>
//                     </Box>
//                 </Box>


//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Facilities</InputLabel>
//                     <ReactQuill
//                         name="description"
//                         value={roomData.description}
//                         onChange={handleDiscriptionChange}
//                         placeholder="Enter Room Facilities"
//                         style={{
//                             height: "100px",
//                             // border: "1px solid #ccc",
//                             borderRadius: "8px",
//                             marginBottom: "100px"
//                         }}
//                     />
//                 </Box>

//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Images</InputLabel>
//                     <UploadBox onClick={() => imageInput.current.click()} />
//                     <input type="file" hidden ref={imageInput} multiple onChange={handleImageChange} />

//                     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
//                         {images.map((image, index) => (
//                             <Box key={index} sx={{ position: "relative" }}>
//                                 <img src={URL.createObjectURL(image)} alt="Room" style={{ width: 100, height: 100, borderRadius: 8 }} />
//                                 <IconButton onClick={() => handleRemoveImage(index)} sx={{ position: "absolute", top: 0, right: 0 }}>
//                                     <FiTrash color="red" />
//                                 </IconButton>
//                             </Box>
//                         ))}
//                     </Box>
//                 </Box>

//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: 'bold', mb: '4px' }}>Total Available Rooms</InputLabel>
//                     <TextField
//                         type="number"
//                         fullWidth
//                         margin="dense"
//                         name="totalAvailableRoom"
//                         value={roomData.totalAvailableRoom}
//                         onChange={handleTotalRoomChange}
//                     />

//                     {roomData.roomDetails.map((room, index) => (
//                         <Box key={index} sx={{ mb: 2 }}>
//                             <InputLabel sx={{ fontWeight: 'bold', mb: '4px' }}>Room {index + 1} - Room Number</InputLabel>
//                             <TextField
//                                 fullWidth
//                                 margin="dense"
//                                 name={`roomDetails.${index}.roomNumber`}
//                                 value={room.roomNumber}
//                                 onChange={handleRoomInputChange}
//                             />

//                             <InputLabel sx={{ fontWeight: 'bold', mb: '4px' }}>Room {index + 1} - Status</InputLabel>
//                             <FormControl fullWidth margin="dense">
//                                 <Select
//                                     name={`roomDetails.${index}.status`}
//                                     value={room.status}
//                                     onChange={handleRoomInputChange}
//                                     displayEmpty
//                                 >
//                                     <MenuItem value="" disabled>
//                                         Please Choose Status
//                                     </MenuItem>
//                                     {roomStatusOptions.map((option) => (
//                                         <MenuItem key={option} value={option}>
//                                             {option}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                         </Box>
//                     ))}
//                 </Box>

//                 <Box sx={{ display: "flex", justifyContent: "center", mt: "20px" }}>
//                     <Button
//                         type="submit"
//                         variant="contained"
//                         color="primary"
//                         sx={{
//                             borderRadius: "10px",
//                             px: 4,
//                             py: 1,
//                             fontWeight: "bold",
//                             boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
//                         }}
//                         disabled={loading}
//                         onClick={handleSubmit}
//                     >
//                         {loading ? <CircularProgress size={20} color="inherit" /> : "Add Room"}
//                     </Button>
//                 </Box>
//             </Paper >
//         </Box >
//     );
// };

// export default AddRoom;


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
} from "@mui/material";
import { BiImageAdd } from "react-icons/bi";
import { FiPlus, FiTrash } from "react-icons/fi";
import { showToast } from "../api/toast";
import { useNavigate } from "react-router-dom";
import { addRoom } from "../api/room";
import { fetchAllCategories } from "../api/category";

import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import NumbersIcon from "@mui/icons-material/Numbers";
import ApartmentIcon from "@mui/icons-material/Apartment";
import InputAdornment from "@mui/material/InputAdornment";
import { AccessTime, AccessTimeFilled, CurrencyRupee, Description, ToggleOff } from "@mui/icons-material";
import GroupsIcon from "@mui/icons-material/Groups";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import CategoryIcon from "@mui/icons-material/Category";
import KingBedIcon from "@mui/icons-material/KingBed";
import HotelIcon from "@mui/icons-material/Hotel";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import PersonIcon from "@mui/icons-material/Person";
import { fetchAllActiveTaxTypes } from "../api/masterData/taxType";
import { fetchAllActiveAmenities } from "../api/masterData/amenities";
import ReactQuill from "react-quill";
import Breadcrumb from "../components/common/Breadcrumb";

const guestTypeOptions = [
    'Member',
    'Member Spouse & Children',
    'Corporate Member',
    'Guest of Member',
    'Affiliated Club Member',
    'Nominee of Corporate Member',
    'Affiliated Foreign Club Member',
    'Foreign Guest',
];

const bedTypeOptions = ['Single', 'Double', 'Queen', 'King', 'Twin', 'Sofa Bed'];
const statusOptions = ['Active', 'Inactive',];
const roomStatusOptions = ['Available', 'Booked', 'Under Maintenance'];


const AddRoom = () => {
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
        roomDetails: [{ roomNumber: '', status: "Available" }],
        totalAvailableRoom: 1,
        taxTypes: [],
        checkInTime: '09:00',
        checkOutTime: '21:00',
        maxAllowedPerRoom: '',
        cancellationPolicy: { before7Days: '', between7To2Days: '', between48To24Hours: '', lessThan24Hours: '' },
        breakfastIncluded: false,
        specialDayTariff: [],
        extraBedPrice: '',
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
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files); // Convert FileList to an array
        const maxSize = 100 * 1024; // 100KB in bytes

        const validFiles = [];
        const invalidFiles = [];

        files.forEach((file) => {
            if (file.size <= maxSize) {
                validFiles.push(file); // Add valid files to the array
            } else {
                invalidFiles.push(file.name); // Collect names of invalid files
            }
        });

        if (invalidFiles.length > 0) {
            showToast(
                `The following files exceed 100KB and were not added:\n${invalidFiles.join(", ")}`,
                "error" // Assuming "error" is the type of toast for errors
            );
        }

        // Add valid files to the images state
        setImages((prevImages) => [...prevImages, ...validFiles]);
    };


    const handleRemoveImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };

    // Add new pricing detail
    const handleAddPricingDetail = () => {
        setRoomData((prevData) => ({
            ...prevData,
            pricingDetails: [...prevData.pricingDetails, { guestType: "", price: "", description: "" }],
        }));
    };

    const handlePricingDetailChange = (index, field, value) => {
        const updatedPricingDetails = [...roomData.pricingDetails];
        updatedPricingDetails[index] = {
            ...updatedPricingDetails[index],
            [field]: value,
        };
        setRoomData({ ...roomData, pricingDetails: updatedPricingDetails });
    };

    const handleRemovePricingDetail = (index) => {
        const updatedPricingDetails = roomData.pricingDetails.filter((_, i) => i !== index);
        setRoomData({ ...roomData, pricingDetails: updatedPricingDetails });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setRoomData({ ...roomData, [name]: checked });
    };
    const validateForm = () => {
        const errors = [];

        // Validate categoryName
        if (!roomData.categoryName.trim()) {
            errors.push("Room category is required.");
        }

        // Validate description
        if (!roomData.description.trim()) {
            errors.push("Room description is required.");
        }

        // Validate priceRange
        const { minPrice, maxPrice } = roomData.priceRange;
        if (!minPrice) {
            errors.push("Min Price is required.");
        } else if (isNaN(minPrice) || Number(minPrice) < 0) {
            errors.push("Min Price must be a valid positive number.");
        }

        if (!maxPrice) {
            errors.push("Max Price is required.");
        } else if (isNaN(maxPrice) || Number(maxPrice) < 0) {
            errors.push("Max Price must be a valid positive number.");
        }

        if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
            errors.push("Max Price must be greater than Min Price.");
        }

        // Validate pricingDetails
        if (roomData.pricingDetails.length === 0) {
            errors.push("At least one pricing detail is required.");
        } else {
            const requiredGuestTypes = ['Member', 'Member Spouse & Children', 'Guest of Member'];
            const addedGuestTypes = new Set();

            roomData.pricingDetails.forEach((detail) => {
                if (!detail.guestType.trim()) {
                    errors.push("Guest Type is required.");
                } else {
                    addedGuestTypes.add(detail.guestType);
                }

                if (!detail.price) {
                    errors.push("Price is required for all guest types.");
                } else if (isNaN(detail.price) || Number(detail.price) < 0) {
                    errors.push("Price must be a valid positive number.");
                }
            });

            // Check if all required guest types are included
            requiredGuestTypes.forEach((requiredType) => {
                if (!addedGuestTypes.has(requiredType)) {
                    errors.push(`Missing required guest type: ${requiredType}.`);
                }
            });
        }

        // Validate amenities
        if (roomData.amenities.length === 0) {
            errors.push("At least one amenity is required.");
        }

        // Validate roomSize
        if (!roomData.roomSize) {
            errors.push("Room size is required.");
        } else if (isNaN(roomData.roomSize) || Number(roomData.roomSize) <= 0) {
            errors.push("Room size must be a valid positive number.");
        }

        // Validate bedType
        if (!roomData.bedType) {
            errors.push("Bed type is required.");
        }

        // Validate roomDetails
        if (roomData.roomDetails.length === 0) {
            errors.push("At least one room detail is required.");
        } else {
            roomData.roomDetails.forEach((detail, index) => {
                if (!detail.roomNumber.trim()) {
                    errors.push(`Room number is required for Room ${index + 1}.`);
                }
                if (!detail.status) {
                    errors.push(`Room status is required for Room ${index + 1}.`);
                }
            });
        }

        // Validate taxTypes
        if (roomData.taxTypes.length === 0) {
            errors.push("At least one tax type is required.");
        }

        // Validate cancellationPolicy
        const { before7Days, between7To2Days, between48To24Hours, lessThan24Hours } = roomData.cancellationPolicy;
        if (!before7Days.trim()) {
            errors.push("Cancellation policy for 'Before 7 Days' is required.");
        }
        if (!between7To2Days.trim()) {
            errors.push("Cancellation policy for 'Between 7 to 2 Days' is required.");
        }
        if (!between48To24Hours.trim()) {
            errors.push("Cancellation policy for 'Between 48 to 24 Hours' is required.");
        }
        if (!lessThan24Hours.trim()) {
            errors.push("Cancellation policy for 'Less Than 24 Hours' is required.");
        }

        // Validate check-in and check-out times
        if (!roomData.checkInTime.trim()) {
            errors.push("Check-in time is required.");
        }
        if (!roomData.checkOutTime.trim()) {
            errors.push("Check-out time is required.");
        }

        // Validate maxAllowedPerRoom
        if (!roomData.maxAllowedPerRoom) {
            errors.push("Maximum occupancy per room is required.");
        } else if (isNaN(roomData.maxAllowedPerRoom) || Number(roomData.maxAllowedPerRoom) <= 0) {
            errors.push("Maximum occupancy must be a valid positive number.");
        }

        // Validate breakfastIncluded
        if (roomData.breakfastIncluded === undefined) {
            errors.push("Breakfast included field is required.");
        }

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
                } else if (isNaN(tariff.extraCharge) || Number(tariff.extraCharge) < 0) {
                    errors.push(`Extra charge must be a valid positive number for Special Day ${index + 1}.`);
                }
            });
        }

        // Validate extraBedPrice
        if (!roomData.extraBedPrice) {
            errors.push("Extra bed price is required.");
        } else if (isNaN(roomData.extraBedPrice) || Number(roomData.extraBedPrice) < 0) {
            errors.push("Extra bed price must be a valid positive number.");
        }

        // Show all errors as toast messages
        if (errors.length > 0) {
            errors.forEach((error) => showToast(error, "error"));
            return false;
        }

        return true;
    };


    const handleSubmit = async () => {
        console.log(roomData, "rrrrrrrrrrrrr")
        if (!validateForm()) return; // Prevent submission if validation fails

        setLoading(true);

        try {
            const formData = new FormData();

            // Add basic room data to formData
            addBasicRoomDataToFormData(formData);

            // Add pricing details to formData
            addPricingDetailsToFormData(formData);

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

            // Add room details if any
            addRoomDetailsToFormData(formData);

            // Add tax types to formData
            addTaxTypesToFormData(formData);
            // Add images to formData
            // images.forEach((image) => formData.append("images", image));
            // Call the addRoom API with formData
            const response = await addRoom(formData);

            if (response.status === 201) {
                showToast("Room added successfully!", "success");
                navigate("/roomwith-categories");
            } else {
                console.log(response, "error400")

                showToast(response.message || "Failed to add room.", "error");
            }
        } catch (error) {
            console.log(error, "error500")
            showToast(error.message || "An error occurred while adding the room.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Function to add basic room data to formData
    const addBasicRoomDataToFormData = (formData) => {
        console.log(formData, "formdat")
        Object.entries(roomData).forEach(([key, value]) => {
            console.log(roomData, "formdat")

            if (key === 'cancellationPolicy' || key === 'priceRange' || key === 'pricingDetails' || key === 'amenities' || key === 'features' || key === 'specialDayTariff' || key === 'roomDetails' || key === 'taxTypes') {
                // Handle complex fields separately (already covered in other functions)
                return;
            }
            formData.append(key, value);
        });
    };

    // Function to add pricing details to formData
    const addPricingDetailsToFormData = (formData) => {
        roomData.pricingDetails.forEach((detail, index) => {
            formData.append(`pricingDetails[${index}][guestType]`, detail.guestType);
            formData.append(`pricingDetails[${index}][price]`, detail.price);
            formData.append(`pricingDetails[${index}][description]`, detail.description || '');
        });
    };

    // Function to add amenities to formData
    const addAmenitiesToFormData = (formData) => {
        roomData.amenities.forEach((amenity) => formData.append('amenities', amenity));
    };

    // Function to add features as JSON to formData
    const addFeaturesToFormData = (formData) => {
        formData.append('features', JSON.stringify(roomData.features));
    };

    // Function to add features as JSON to formData
    const addPriceRangeToFormData = (formData) => {
        formData.append('priceRange', JSON.stringify(roomData.priceRange));
    };

    // Function to add images to formData
    const addImagesToFormData = (formData) => {
        images.forEach((image) => formData.append('images', image));
    };

    // Function to add special day tariff to formData
    const addSpecialDayTariffToFormData = (formData) => {
        roomData.specialDayTariff.forEach((tariff, index) => {
            formData.append(`specialDayTariff[${index}][special_day_name]`, tariff.special_day_name);
            formData.append(`specialDayTariff[${index}][startDate]`, tariff.startDate);
            formData.append(`specialDayTariff[${index}][endDate]`, tariff.endDate);
            formData.append(`specialDayTariff[${index}][extraCharge]`, tariff.extraCharge);
        });
    };

    // Function to add cancellation policy to formData
    const addCancellationPolicyToFormData = (formData) => {
        // Object.entries(roomData.cancellationPolicy).forEach(([key, value]) => {
        //     formData.append(`cancellationPolicy[${key}]`, value);
        // });
        formData.append('cancellationPolicy', JSON.stringify(roomData.cancellationPolicy));
    };

    // Function to add room details to formData
    const addRoomDetailsToFormData = (formData) => {
        roomData.roomDetails.forEach((room, index) => {
            formData.append(`roomDetails[${index}][roomNumber]`, room.roomNumber);
            formData.append(`roomDetails[${index}][status]`, room.status);
        });
    };

    // Function to add tax types to formData
    const addTaxTypesToFormData = (formData) => {
        roomData.taxTypes.forEach((taxType) => formData.append('taxTypes', taxType));
    };




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


    // Handle change for inputs
    const handleRoomInputChange = (e) => {
        const { name, value } = e.target;
        const [field, index, prop] = name.split('.');

        if (field === 'roomDetails' && index !== undefined && prop !== undefined) {
            const updatedRoomDetails = [...roomData.roomDetails];
            updatedRoomDetails[parseInt(index)][prop] = value; // Update specific room detail
            setRoomData({ ...roomData, roomDetails: updatedRoomDetails });
        }
    };

    // Handle change in the totalAvailableRoom
    const handleTotalRoomChange = (e) => {
        const totalRooms = parseInt(e.target.value, 10);
        const updatedRoomDetails = Array.from({ length: totalRooms }, () => ({
            roomNumber: '',
            status: ''
        }));

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
            <Typography variant="h5" sx={{ mb: "20px", textAlign: "center", fontWeight: 600 }}>
                Create New Room
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
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Guest Type Pricing</InputLabel>
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
                            type="text"
                            value={roomData.cancellationPolicy.before7Days}
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
                            value={roomData.cancellationPolicy.between7To2Days}
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
                            value={roomData.cancellationPolicy.between48To24Hours}
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
                            value={roomData.cancellationPolicy.lessThan24Hours}
                            onChange={handleCancalletionChange}
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
                                inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates
                                style={{ margin: "5px" }}
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
                                inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates
                                style={{ margin: "5px" }}
                            />
                            <TextField
                                fullWidth
                                name={`specialDayTariff[${index}][extraCharge]`}
                                label="Extra Charge In %"
                                type="number"
                                value={tariff.extraCharge}
                                onChange={handleChange}
                                style={{ margin: "5px" }}
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
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Facilities</InputLabel>
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
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Images (less than 100kb)</InputLabel>
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

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: 'bold', mb: '4px' }}>Total Available Rooms</InputLabel>
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
                            <InputLabel sx={{ fontWeight: 'bold', mb: '4px' }}>Room {index + 1} - Room Number</InputLabel>
                            <TextField
                                fullWidth
                                margin="dense"
                                name={`roomDetails.${index}.roomNumber`}
                                value={room.roomNumber}
                                onChange={handleRoomInputChange}
                            />

                            <InputLabel sx={{ fontWeight: 'bold', mb: '4px' }}>Room {index + 1} - Status</InputLabel>
                            <FormControl fullWidth margin="dense">
                                <Select
                                    name={`roomDetails.${index}.status`}
                                    value={room.status}
                                    onChange={handleRoomInputChange}
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
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add Room"}
                    </Button>
                </Box>
            </Paper >
        </Box >
    );
};

export default AddRoom;