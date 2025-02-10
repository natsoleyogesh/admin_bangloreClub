import styled from "@emotion/styled";
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    Paper,
    TextField,
    Typography,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { BiImageAdd } from "react-icons/bi";
import { showToast } from "../api/toast";
import { useNavigate } from "react-router-dom";
import { addEvent } from "../api/event";
import { AccessTime, AccessTimeFilled, AirplaneTicket, CurrencyRupee, CalendarToday, Description, Event, LocationOn, People } from "@mui/icons-material";
import ReactQuill from "react-quill";
import Breadcrumb from "../components/common/Breadcrumb";
import { fetchAllActiveTaxTypes } from "../api/masterData/taxType";


// const rsvpOptions = ["Attending", "Not Attending", "Maybe", "Pending", "Cancelled", "N/A"];
// const currencyOptions = ["INR", "USD", "EUR", "GBP"];
// const statusOptions = ["Active", "Inactive", "Complete"];

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

const AddEvent = () => {
    const [eventData, setEventData] = useState({
        eventTitle: "",
        eventSubtitle: "",
        eventStartDate: "",
        eventEndDate: "",
        startTime: "09:00", // Default: 12:00 AM
        endTime: "21:00", // Default: 11:00 PM
        ticketPrice: 0,
        // availableTickets: "",
        location: "",
        aboutEvent: "",
        guideline: "",
        organizer: "",
        status: "Active",
        primaryMemberPrice: "",
        dependentMemberPrice: "",
        guestMemberPrice: "",
        kidsMemberPrice: "",
        spouseMemberPrice: "",
        seniorDependentMemberPrice: "",
        taxTypes: [],
        showBanner: false,
        allottedTicketsGuest: 0,
        allottedTicketsMember: 0,
        totalAvailableTickets: 0,
        bookingPermissionPrimary: true,
        bookingPermissionSpouse: false,
        bookingPermissionChild: false,
        // bookingPermissionDaughter: false,
        bookingPermissionDependent: false,
        bookingPermissionSeniorDependent: false,
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [taxTypes, setTaxTypes] = useState([]);
    const imageInput = useRef(null);
    const navigate = useNavigate();

    // // Handle input changes and validate fields
    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setEventData({ ...eventData, [name]: value });
    //     // validateField(name, value);
    // };
    // Handle input changes and calculate totalAvailableTickets
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Update the specific field
        const updatedEventData = {
            ...eventData,
            [name]: value,
        };

        // Calculate the total available tickets if the relevant fields are updated
        if (name === "allottedTicketsMember" || name === "allottedTicketsGuest") {
            updatedEventData.totalAvailableTickets =
                parseInt(updatedEventData.allottedTicketsMember || 0) +
                parseInt(updatedEventData.allottedTicketsGuest || 0);
        }

        setEventData(updatedEventData);
    };


    useEffect(() => {
        fetchTaxTypes();
    }, [])

    const fetchTaxTypes = async () => {
        try {
            const response = await fetchAllActiveTaxTypes();
            setTaxTypes(response?.data?.data);
        } catch (error) {
            showToast("Failed to fetch room types.", "error");
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };
    // Handle the rich text editor changes
    const handleEditorChange = (value) => {
        setEventData({ ...eventData, aboutEvent: value });
    };

    const handleGuidLineChange = (value) => {
        setEventData({ ...eventData, guideline: value });
    };

    const handleChangeTaxTypes = (event) => {
        console.log(event.target.name, "-", event.target.value, "taxtype")

        const { value, checked } = event.target;
        if (checked) {
            setEventData({
                ...eventData,
                taxTypes: [...eventData.taxTypes, value],
            });
        } else {
            setEventData({
                ...eventData,
                taxTypes: eventData.taxTypes.filter((tax) => tax !== value),
            });
        }
    };

    // // Field validation function
    // const validateField = (name, value) => {
    //     const newErrors = { ...errors };

    //     // Validate event title
    //     if (name === "eventTitle" && !value) {
    //         newErrors.eventTitle = "Event title is required.";
    //     } else if (name === "eventTitle") {
    //         delete newErrors.eventTitle;
    //     }

    //     // Validate event date
    //     if (name === "eventStartDate" && value) {
    //         const selectedDate = new Date(value);
    //         const currentDate = new Date();
    //         if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
    //             newErrors.eventStartDate = "Event start date cannot be in the past.";
    //         } else {
    //             delete newErrors.eventStartDate;
    //         }
    //     }

    //     // Validate end time
    //     if (name === "endTime" && value && eventData.startTime) {
    //         const start = new Date(`1970-01-01T${eventData.startTime}:00`);
    //         const end = new Date(`1970-01-01T${value}:00`);
    //         const oneHourLater = new Date(start.getTime() + 60 * 60 * 1000);

    //         if (end <= oneHourLater) {
    //             newErrors.endTime = "End time must be at least 1 hour after start time.";
    //         } else {
    //             delete newErrors.endTime;
    //         }
    //     }

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };

    const validateForm = () => {
        const validationErrors = [];

        // Validate event title
        if (!eventData.eventTitle) {
            validationErrors.push("Event title is required.");
        }

        // Validate event start date
        if (!eventData.eventStartDate) {
            validationErrors.push("Event start date is required.");
        } else {
            const selectedDate = new Date(eventData.eventStartDate);
            const currentDate = new Date();
            if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
                validationErrors.push("Event start date cannot be in the past.");
            }
        }

        // Validate event end date
        if (!eventData.eventEndDate) {
            validationErrors.push("Event end date is required.");
        } else if (eventData.eventStartDate) {
            const startDate = new Date(eventData.eventStartDate);
            const endDate = new Date(eventData.eventEndDate);
            if (endDate < startDate) {
                validationErrors.push("Event end date cannot be earlier than the start date.");
            }
        }

        // Validate start time
        if (!eventData.startTime) {
            validationErrors.push("Start time is required.");
        }

        // Validate end time
        if (!eventData.endTime) {
            validationErrors.push("End time is required.");
        } else if (eventData.startTime) {
            const start = new Date(`1970-01-01T${eventData.startTime}:00`);
            const end = new Date(`1970-01-01T${eventData.endTime}:00`);
            const oneHourLater = new Date(start.getTime() + 60 * 60 * 1000);

            if (end <= oneHourLater) {
                validationErrors.push("End time must be at least 1 hour after start time.");
            }
        }

        // Validate ticket price
        if (!eventData.ticketPrice) {
            validationErrors.push("Ticket price is required.");
        } else if (isNaN(eventData.ticketPrice) || Number(eventData.ticketPrice) < 0) {
            validationErrors.push("Ticket price must be a valid positive number.");
        }

        // Validate available tickets
        if (!eventData.allottedTicketsMember) {
            validationErrors.push("Allotted Tickets For Member are required.");
        } else if (isNaN(eventData.allottedTicketsMember) || Number(eventData.allottedTicketsMember) <= 0) {
            validationErrors.push("Allotted Tickets For Member must be a valid positive number.");
        }
        // Validate available tickets
        if (!eventData.allottedTicketsGuest) {
            validationErrors.push("Allotted Tickets For Guest are required.");
        } else if (isNaN(eventData.allottedTicketsGuest) || Number(eventData.allottedTicketsGuest) <= 0) {
            validationErrors.push("Allotted Tickets For Guest must be a valid positive number.");
        }

        // Validate location
        if (!eventData.location) {
            validationErrors.push("Location is required.");
        }

        // Validate about event
        if (!eventData.aboutEvent) {
            validationErrors.push("About event is required.");
        }

        // Validate organizer
        if (!eventData.organizer) {
            validationErrors.push("Organizer information is required.");
        }

        // Validate status
        if (!eventData.status) {
            validationErrors.push("Event status is required.");
        }

        // Validate primary member price
        if (!eventData.primaryMemberPrice) {
            validationErrors.push("Primary member ticket price is required.");
        }

        // Validate dependent member price
        if (!eventData.dependentMemberPrice) {
            validationErrors.push("Dependent member ticket price is required.");
        }

        // Validate guest member price
        if (!eventData.guestMemberPrice) {
            validationErrors.push("Guest member ticket price is required.");
        }

        // Validate guest member price
        if (!eventData.kidsMemberPrice) {
            validationErrors.push("Kids Member ticket price is required.");
        }

        // Validate guest member price
        if (!eventData.spouseMemberPrice) {
            validationErrors.push("Spouse member ticket price is required.");
        }

        // Validate guest member price
        if (!eventData.seniorDependentMemberPrice) {
            validationErrors.push("Senior Dependent member ticket price is required.");
        }


        // Validate taxTypes
        if (eventData.taxTypes.length === 0) {
            validationErrors.push("At least one tax type is required.");
        }



        // Show toast messages for all errors
        if (validationErrors.length > 0) {
            validationErrors.forEach((error) => showToast(error, "error"));
            return false;
        }

        return true;
    };



    const handleSubmit = async () => {
        if (!validateForm()) return; // Prevent submission if validation fails


        setLoading(true);


        const formData = new FormData();

        addBasicBanquetDataToFormData(formData)
        addTaxTypesToFormData(formData);

        // Object.entries(eventData).forEach(([key, value]) => {
        //     formData.append(key, value);
        // });

        if (image) {
            formData.append("eventImage", image);
        }

        try {
            const response = await addEvent(formData);
            if (response.status === 201) {
                showToast("Event added successfully!", "success");
                navigate("/events");
            } else {
                showToast(response.message || "Failed to add event. Please try again.", "error");
            }
        } catch (error) {
            showToast(error.response?.data?.message || "An error occurred. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Function to add tax types to formData
    const addTaxTypesToFormData = (formData) => {
        // banquetData.taxTypes.forEach((taxType) => formData.append('taxTypes', JSON.stringify(taxType)));
        eventData.taxTypes.forEach((taxType, index) => {
            formData.append(`taxTypes[${index}]`, taxType);
        });
    };



    // Function to add basic room data to formData
    const addBasicBanquetDataToFormData = (formData) => {
        console.log(formData, "formdat")
        Object.entries(eventData).forEach(([key, value]) => {
            console.log(eventData, "formdat")

            if (key === "taxTypes") {
                // Handle complex fields separately (already covered in other functions)
                return;
            }
            formData.append(key, value);
        });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setEventData((prev) => ({ ...prev, [name]: checked }));
    };

    return (
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Breadcrumb />
            <Typography variant="h5" sx={{ mb: "20px", textAlign: "center", fontWeight: 600 }}>
                Create New Event
            </Typography>
            {/* <Paper sx={{ p: 4, maxWidth: "600px", mx: "auto", borderRadius: "16px", boxShadow: 3 }}> */}
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
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Event Title</InputLabel>
                    <TextField
                        // label="Event Title"
                        placeholder="Enter event title"
                        fullWidth
                        name="eventTitle"
                        value={eventData.eventTitle}
                        onChange={handleInputChange}
                        required
                        error={!!errors.eventTitle}
                        helperText={errors.eventTitle}
                        InputProps={{
                            startAdornment: <Event sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Event Subtitle</InputLabel>
                    <TextField
                        placeholder="Enter event subtitle"
                        fullWidth
                        name="eventSubtitle"
                        value={eventData.eventSubtitle}
                        onChange={handleInputChange}
                        InputProps={{ startAdornment: <Description sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Event Start Date</InputLabel>
                    <TextField
                        type="date"
                        fullWidth
                        name="eventStartDate"
                        value={eventData.eventStartDate}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        required
                        inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates
                        error={!!errors.eventStartDate}
                        helperText={errors.eventStartDate}
                        InputProps={{ startAdornment: <CalendarToday sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Event End Date</InputLabel>
                    <TextField
                        type="date"
                        fullWidth
                        name="eventEndDate"
                        value={eventData.eventEndDate}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        required
                        inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates
                        error={!!errors.eventEndDate}
                        helperText={errors.eventEndDate}
                        InputProps={{ startAdornment: <CalendarToday sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Start Time</InputLabel>
                    <TextField
                        type="time"
                        fullWidth
                        name="startTime"
                        value={eventData.startTime}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        required
                        error={!!errors.startTime}
                        helperText={errors.startTime}
                        InputProps={{ startAdornment: <AccessTimeFilled sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>End Time</InputLabel>
                    <TextField
                        type="time"
                        fullWidth
                        name="endTime"
                        value={eventData.endTime}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        required
                        error={!!errors.endTime}
                        helperText={errors.endTime}
                        InputProps={{ startAdornment: <AccessTime sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Ticket Price</InputLabel>
                    <TextField
                        type="number"
                        placeholder="Enter ticket price"
                        fullWidth
                        name="ticketPrice"
                        value={eventData.ticketPrice}
                        onChange={handleInputChange}
                        error={!!errors.ticketPrice}
                        helperText={errors.ticketPrice}
                        InputProps={{ startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Primary Member Ticket Price</InputLabel>
                    <TextField
                        type="number"
                        placeholder="Enter primery member ticket price"
                        fullWidth
                        name="primaryMemberPrice"
                        value={eventData.primaryMemberPrice}
                        onChange={handleInputChange}
                        error={!!errors.primaryMemberPrice}
                        helperText={errors.primaryMemberPrice}
                        InputProps={{ startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}> Dependent Member Ticket Price</InputLabel>
                    <TextField
                        type="number"
                        placeholder="Enter Dependent Member ticket price"
                        fullWidth
                        name="dependentMemberPrice"
                        value={eventData.dependentMemberPrice}
                        onChange={handleInputChange}
                        error={!!errors.dependentMemberPrice}
                        helperText={errors.dependentMemberPrice}
                        InputProps={{ startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}> Guest Member Ticket Price</InputLabel>
                    <TextField
                        type="number"
                        placeholder="Enter Guest Member ticket price"
                        fullWidth
                        name="guestMemberPrice"
                        value={eventData.guestMemberPrice}
                        onChange={handleInputChange}
                        error={!!errors.guestMemberPrice}
                        helperText={errors.guestMemberPrice}
                        InputProps={{ startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}> Spouse Member Ticket Price</InputLabel>
                    <TextField
                        type="number"
                        placeholder="Enter Spouse Member ticket price"
                        fullWidth
                        name="spouseMemberPrice"
                        value={eventData.spouseMemberPrice}
                        onChange={handleInputChange}
                        error={!!errors.spouseMemberPrice}
                        helperText={errors.spouseMemberPrice}
                        InputProps={{ startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}> Kids Member Ticket Price</InputLabel>
                    <TextField
                        type="number"
                        placeholder="Enter Kids Member ticket price"
                        fullWidth
                        name="kidsMemberPrice"
                        value={eventData.kidsMemberPrice}
                        onChange={handleInputChange}
                        error={!!errors.kidsMemberPrice}
                        helperText={errors.kidsMemberPrice}
                        InputProps={{ startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}> Senior Dependent Member Ticket Price</InputLabel>
                    <TextField
                        type="number"
                        placeholder="Enter Senior Dependent Member ticket price"
                        fullWidth
                        name="seniorDependentMemberPrice"
                        value={eventData.seniorDependentMemberPrice}
                        onChange={handleInputChange}
                        error={!!errors.seniorDependentMemberPrice}
                        helperText={errors.seniorDependentMemberPrice}
                        InputProps={{ startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} /> }}
                    />
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
                                            checked={eventData.taxTypes.includes(tax._id)}
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
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Allotted Tickets for Members</InputLabel>
                    <TextField
                        type="number"
                        placeholder="Enter number of Allotted Tickets for Members"
                        fullWidth
                        name="allottedTicketsMember"
                        value={eventData.allottedTicketsMember}
                        onChange={handleInputChange}
                        error={!!errors.allottedTicketsMember}
                        helperText={errors.allottedTicketsMember}
                        InputProps={{ startAdornment: <AirplaneTicket sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Allotted Tickets for Guests</InputLabel>
                    <TextField
                        type="number"
                        placeholder="Enter number of Allotted Tickets for Guests"
                        fullWidth
                        name="allottedTicketsGuest"
                        value={eventData.allottedTicketsGuest}
                        onChange={handleInputChange}
                        error={!!errors.allottedTicketsGuest}
                        helperText={errors.allottedTicketsGuest}
                        InputProps={{ startAdornment: <AirplaneTicket sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Total Available Tickets</InputLabel>
                    <TextField
                        type="number"
                        placeholder="Total Available Tickets"
                        fullWidth
                        name="totalAvailableTickets"
                        value={eventData.totalAvailableTickets}
                        InputProps={{ startAdornment: <AirplaneTicket sx={{ color: "gray", mr: 1 }} /> }}
                        disabled
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Booking Permissioin</InputLabel>

                    <FormControl fullWidth>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="bookingPermissionPrimary"
                                    checked={eventData.bookingPermissionPrimary}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label="Primary Member"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="bookingPermissionSpouse"
                                    checked={eventData.bookingPermissionSpouse}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label="Spouse"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="bookingPermissionChild"
                                    checked={eventData.bookingPermissionChild}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label="Child"
                        />
                        {/* <FormControlLabel
                            control={
                                <Checkbox
                                    name="bookingPermissionDaughter"
                                    checked={eventData.bookingPermissionDaughter}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label="Daughter"
                        /> */}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="bookingPermissionDependent"
                                    checked={eventData.bookingPermissionDependent}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label="Dependent"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="bookingPermissionSeniorDependent"
                                    checked={eventData.bookingPermissionSeniorDependent}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label="Senior Dependent Member"
                        />
                    </FormControl>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Location</InputLabel>
                    <TextField
                        placeholder="Enter event location"
                        fullWidth
                        name="location"
                        value={eventData.location}
                        onChange={handleInputChange}
                        error={!!errors.location}
                        helperText={errors.location}
                        InputProps={{ startAdornment: <LocationOn sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>About Event</InputLabel>
                    <ReactQuill
                        value={eventData.aboutEvent}
                        onChange={handleEditorChange}
                        placeholder="Describe the event"
                        style={{
                            height: "150px",
                            // border: "1px solid #ccc",
                            borderRadius: "8px",
                            marginBottom: "80px"
                        }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Event Guideline</InputLabel>
                    <ReactQuill
                        value={eventData.guideline}
                        onChange={handleGuidLineChange}
                        placeholder="Describe the event guideline"
                        style={{
                            height: "150px",
                            // border: "1px solid #ccc",
                            borderRadius: "8px",
                            marginBottom: "80px"
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Organizer</InputLabel>
                    <TextField
                        placeholder="Enter organizer name"
                        fullWidth
                        name="organizer"
                        value={eventData.organizer}
                        onChange={handleInputChange}
                        error={!!errors.organizer}
                        helperText={errors.organizer}
                        InputProps={{ startAdornment: <People sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="showBanner"
                                checked={eventData.showBanner}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label="Show Banner In Home"
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Event Image</InputLabel>
                    <UploadBox onClick={() => imageInput.current.click()}>
                        {image ? (
                            <img src={URL.createObjectURL(image)} alt="Event" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <Box sx={{ textAlign: "center" }}>
                                <BiImageAdd style={{ fontSize: "40px", color: "#027edd" }} />
                                <Typography variant="body2" color="textSecondary">
                                    Click to upload Event image
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    (JPG, PNG, GIF)
                                </Typography>
                            </Box>
                        )}
                        <input type="file" hidden ref={imageInput} onChange={handleImageChange} />
                    </UploadBox>
                </Box>
                {/* <Box sx={{ mb: 2 }}>
                    <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Create Event"}
                    </Button>
                </Box> */}
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
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add Event"}
                    </Button>
                </Box>

            </Paper>
        </Box>
    );
};

export default AddEvent;


// OLD_CODE==============================

// import styled from "@emotion/styled";
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
//     Grid,
//     FormControlLabel,
//     Checkbox,
// } from "@mui/material";
// import React, { useEffect, useRef, useState } from "react";
// import { BiImageAdd } from "react-icons/bi";
// import { showToast } from "../api/toast";
// import { useNavigate } from "react-router-dom";
// import { addEvent } from "../api/event";
// import { AccessTime, AccessTimeFilled, AirplaneTicket, CurrencyRupee, CalendarToday, Description, Event, LocationOn, People } from "@mui/icons-material";
// import ReactQuill from "react-quill";
// import Breadcrumb from "../components/common/Breadcrumb";
// import { fetchAllActiveTaxTypes } from "../api/masterData/taxType";

// const rsvpOptions = ["Attending", "Not Attending", "Maybe", "Pending", "Cancelled", "N/A"];
// const statusOptions = ["Active", "Inactive", "Complete"];

// const UploadBox = styled(Box)(({ theme }) => ({
//     marginTop: 20,
//     height: 180,
//     borderRadius: "12px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "column",
//     border: `2px dashed ${theme.palette.divider}`,
//     cursor: "pointer",
//     backgroundColor: theme.palette.background.paper,
//     transition: "0.3s",
//     "&:hover": {
//         backgroundColor: theme.palette.action.hover,
//     },
// }));

// const AddEvent = () => {
//     const [eventData, setEventData] = useState({
//         eventTitle: "",
//         eventSubtitle: "",
//         eventStartDate: "",
//         eventEndDate: "",
//         startTime: "09:00",
//         endTime: "21:00",
//         ticketPrice: 0,
//         memberPrices: {
//             primaryMemberPrice: { price: 0, taxTypes: [] },
//             dependentMemberPrice: { price: 0, taxTypes: [] },
//             guestMemberPrice: { price: 0, taxTypes: [] },
//             kidsMemberPrice: { price: 0, taxTypes: [] },
//             spouseMemberPrice: { price: 0, taxTypes: [] },
//             seniorDependentMemberPrice: { price: 0, taxTypes: [] },
//         },
//         allottedTicketsMember: 0,
//         allottedTicketsGuest: 0,
//         totalAvailableTickets: 0,
//         rsvpStatus: "N/A",
//         location: "",
//         aboutEvent: "",
//         organizer: "",
//         status: "Active",
//         showBanner: false,
//         bookingPermissionPrimary: true,
//         bookingPermissionSpouse: false,
//         bookingPermissionSon: false,
//         bookingPermissionDaughter: false,
//         bookingPermissionDependent: false,
//         bookingPermissionSeniorDependent: false,
//     });
//     const [image, setImage] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [taxTypes, setTaxTypes] = useState([]);
//     const imageInput = useRef(null);
//     const navigate = useNavigate();
//     const [errors, setErrors] = useState({});

//     useEffect(() => {
//         fetchTaxTypes();
//     }, []);

//     const fetchTaxTypes = async () => {
//         try {
//             const response = await fetchAllActiveTaxTypes();
//             setTaxTypes(response?.data?.data);
//         } catch (error) {
//             showToast("Failed to fetch tax types.", "error");
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         const updatedEventData = { ...eventData, [name]: value };

//         if (name === "allottedTicketsMember" || name === "allottedTicketsGuest") {
//             updatedEventData.totalAvailableTickets =
//                 parseInt(updatedEventData.allottedTicketsMember || 0) +
//                 parseInt(updatedEventData.allottedTicketsGuest || 0);
//         }

//         setEventData(updatedEventData);
//     };

//     const handleMemberPriceChange = (e, priceKey) => {
//         const { name, value } = e.target;
//         console.log(`Updating ${priceKey} -> ${name}: ${value}`);
//         setEventData((prev) => ({
//             ...prev,
//             memberPrices: {
//                 ...prev.memberPrices,
//                 [priceKey]: {
//                     ...prev.memberPrices[priceKey],
//                     [name]: value, // This will now correctly update the "price" property
//                 },
//             },
//         }));
//     };

//     const handleTaxTypeChange = (priceKey, taxTypeId, checked) => {
//         setEventData((prev) => {
//             const currentTaxTypes = prev.memberPrices[priceKey].taxTypes;
//             return {
//                 ...prev,
//                 memberPrices: {
//                     ...prev.memberPrices,
//                     [priceKey]: {
//                         ...prev.memberPrices[priceKey],
//                         taxTypes: checked
//                             ? [...currentTaxTypes, taxTypeId]
//                             : currentTaxTypes.filter((id) => id !== taxTypeId),
//                     },
//                 },
//             };
//         });
//     };

//     const handleEditorChange = (value) => {
//         setEventData({ ...eventData, aboutEvent: value });
//     };

//     const handleCheckboxChange = (e) => {
//         const { name, checked } = e.target;
//         setEventData((prev) => ({ ...prev, [name]: checked }));
//     };

//     const handleImageChange = (e) => {
//         setImage(e.target.files[0]);
//     };

//     // Field validation function
//     const validateField = (name, value) => {
//         const newErrors = { ...errors };

//         // Validate event title
//         if (name === "eventTitle" && !value) {
//             newErrors.eventTitle = "Event title is required.";
//         } else if (name === "eventTitle") {
//             delete newErrors.eventTitle;
//         }

//         // Validate event date
//         if (name === "eventStartDate" && value) {
//             const selectedDate = new Date(value);
//             const currentDate = new Date();
//             if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
//                 newErrors.eventStartDate = "Event start date cannot be in the past.";
//             } else {
//                 delete newErrors.eventStartDate;
//             }
//         }

//         // Validate end time
//         if (name === "endTime" && value && eventData.startTime) {
//             const start = new Date(`1970-01-01T${eventData.startTime}:00`);
//             const end = new Date(`1970-01-01T${value}:00`);
//             const oneHourLater = new Date(start.getTime() + 60 * 60 * 1000);

//             if (end <= oneHourLater) {
//                 newErrors.endTime = "End time must be at least 1 hour after start time.";
//             } else {
//                 delete newErrors.endTime;
//             }
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const validateForm = () => {
//         const errors = [];

//         if (!eventData.eventTitle) errors.push("Event title is required.");
//         if (!eventData.eventStartDate) errors.push("Event start date is required.");
//         if (!eventData.eventEndDate) errors.push("Event end date is required.");
//         if (!eventData.startTime) errors.push("Start time is required.");
//         if (!eventData.endTime) errors.push("End time is required.");

//         if (eventData.totalAvailableTickets <= 0)
//             errors.push("Total available tickets must be greater than 0.");

//         if (!eventData.location) errors.push("Location is required.");
//         if (!eventData.aboutEvent) errors.push("About event is required.");
//         if (!eventData.organizer) errors.push("Organizer is required.");

//         if (errors.length > 0) {
//             errors.forEach((err) => showToast(err, "error"));
//             return false;
//         }

//         return true;
//     };

//     const handleSubmit = async () => {
//         if (!validateForm()) return;

//         setLoading(true);
//         const formData = new FormData();

//         formData.append("eventTitle", eventData.eventTitle);
//         formData.append("eventSubtitle", eventData.eventSubtitle);
//         formData.append("eventStartDate", eventData.eventStartDate);
//         formData.append("eventEndDate", eventData.eventEndDate);
//         formData.append("startTime", eventData.startTime);
//         formData.append("endTime", eventData.endTime);
//         formData.append("ticketPrice", eventData.ticketPrice);

//         // Add memberPrices
//         Object.entries(eventData.memberPrices).forEach(([key, value]) => {
//             formData.append(`memberPrices[${key}][price]`, value.price);
//             value.taxTypes.forEach((taxId, index) => {
//                 formData.append(`memberPrices[${key}][taxTypes][${index}]`, taxId);
//             });
//         });

//         formData.append("allottedTicketsMember", eventData.allottedTicketsMember);
//         formData.append("allottedTicketsGuest", eventData.allottedTicketsGuest);
//         formData.append("totalAvailableTickets", eventData.totalAvailableTickets);
//         formData.append("rsvpStatus", eventData.rsvpStatus);
//         formData.append("location", eventData.location);
//         formData.append("aboutEvent", eventData.aboutEvent);
//         formData.append("organizer", eventData.organizer);
//         formData.append("status", eventData.status);
//         formData.append("showBanner", eventData.showBanner);
//         formData.append("bookingPermissionPrimary", eventData.bookingPermissionPrimary);
//         formData.append("bookingPermissionSpouse", eventData.bookingPermissionSpouse);
//         formData.append("bookingPermissionSon", eventData.bookingPermissionSon);
//         formData.append("bookingPermissionDaughter", eventData.bookingPermissionDaughter);
//         formData.append("bookingPermissionDependent", eventData.bookingPermissionDependent);
//         formData.append("bookingPermissionSeniorDependent", eventData.bookingPermissionSeniorDependent);

//         if (image) {
//             formData.append("eventImage", image);
//         }

//         try {
//             const response = await addEvent(formData);
//             if (response.status === 201) {
//                 showToast("Event added successfully!", "success");
//                 navigate("/events");
//             } else {
//                 showToast(response.message || "Failed to add event. Please try again.", "error");
//             }
//         } catch (error) {
//             showToast(error.response?.data?.message || "An error occurred. Please try again.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
//             <Breadcrumb />
//             <Typography variant="h5" sx={{ mb: "20px", textAlign: "center", fontWeight: 600 }}>
//                 Create New Event
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
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Event Title</InputLabel>
//                     <TextField
//                         // label="Event Title"
//                         placeholder="Enter event title"
//                         fullWidth
//                         name="eventTitle"
//                         value={eventData.eventTitle}
//                         onChange={handleInputChange}
//                         required
//                         error={!!errors.eventTitle}
//                         helperText={errors.eventTitle}
//                         InputProps={{
//                             startAdornment: <Event sx={{ color: "gray", mr: 1 }} />,
//                         }}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Event Subtitle</InputLabel>
//                     <TextField
//                         placeholder="Enter event subtitle"
//                         fullWidth
//                         name="eventSubtitle"
//                         value={eventData.eventSubtitle}
//                         onChange={handleInputChange}
//                         InputProps={{ startAdornment: <Description sx={{ color: "gray", mr: 1 }} /> }}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Event Start Date</InputLabel>
//                     <TextField
//                         type="date"
//                         fullWidth
//                         name="eventStartDate"
//                         value={eventData.eventStartDate}
//                         onChange={handleInputChange}
//                         InputLabelProps={{ shrink: true }}
//                         required
//                         inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates
//                         error={!!errors.eventStartDate}
//                         helperText={errors.eventStartDate}
//                         InputProps={{ startAdornment: <CalendarToday sx={{ color: "gray", mr: 1 }} /> }}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Event End Date</InputLabel>
//                     <TextField
//                         type="date"
//                         fullWidth
//                         name="eventEndDate"
//                         value={eventData.eventEndDate}
//                         onChange={handleInputChange}
//                         InputLabelProps={{ shrink: true }}
//                         required
//                         inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates
//                         error={!!errors.eventEndDate}
//                         helperText={errors.eventEndDate}
//                         InputProps={{ startAdornment: <CalendarToday sx={{ color: "gray", mr: 1 }} /> }}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Start Time</InputLabel>
//                     <TextField
//                         type="time"
//                         fullWidth
//                         name="startTime"
//                         value={eventData.startTime}
//                         onChange={handleInputChange}
//                         InputLabelProps={{ shrink: true }}
//                         required
//                         error={!!errors.startTime}
//                         helperText={errors.startTime}
//                         InputProps={{ startAdornment: <AccessTimeFilled sx={{ color: "gray", mr: 1 }} /> }}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>End Time</InputLabel>
//                     <TextField
//                         type="time"
//                         fullWidth
//                         name="endTime"
//                         value={eventData.endTime}
//                         onChange={handleInputChange}
//                         InputLabelProps={{ shrink: true }}
//                         required
//                         error={!!errors.endTime}
//                         helperText={errors.endTime}
//                         InputProps={{ startAdornment: <AccessTime sx={{ color: "gray", mr: 1 }} /> }}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Ticket Price</InputLabel>
//                     <TextField
//                         type="number"
//                         placeholder="Enter ticket price"
//                         fullWidth
//                         name="ticketPrice"
//                         value={eventData.ticketPrice}
//                         onChange={handleInputChange}
//                         error={!!errors.ticketPrice}
//                         helperText={errors.ticketPrice}
//                         InputProps={{ startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} /> }}
//                         inputProps={{
//                             min: 0, // Set minimum value
//                         }}
//                     />
//                 </Box>
//                 {/* <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Primary Member Ticket Price</InputLabel>
//                     <TextField
//                         type="number"
//                         placeholder="Enter primery member ticket price"
//                         fullWidth
//                         name="primaryMemberPrice"
//                         value={eventData.primaryMemberPrice}
//                         onChange={handleInputChange}
//                         error={!!errors.primaryMemberPrice}
//                         helperText={errors.primaryMemberPrice}
//                         InputProps={{ startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} /> }}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}> Dependent MemberTicket Price</InputLabel>
//                     <TextField
//                         type="number"
//                         placeholder="Enter Dependent Member ticket price"
//                         fullWidth
//                         name="dependentMemberPrice"
//                         value={eventData.dependentMemberPrice}
//                         onChange={handleInputChange}
//                         error={!!errors.dependentMemberPrice}
//                         helperText={errors.dependentMemberPrice}
//                         InputProps={{ startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} /> }}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}> Guest MemberTicket Price</InputLabel>
//                     <TextField
//                         type="number"
//                         placeholder="Enter Guest Member ticket price"
//                         fullWidth
//                         name="guestMemberPrice"
//                         value={eventData.guestMemberPrice}
//                         onChange={handleInputChange}
//                         error={!!errors.guestMemberPrice}
//                         helperText={errors.guestMemberPrice}
//                         InputProps={{ startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} /> }}
//                     />
//                 </Box> */}
//                 {Object.keys(eventData.memberPrices).map((priceKey) => (
//                     <Box key={priceKey} sx={{ mb: 2 }}>
//                         <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>
//                             {priceKey.replace(/([A-Z])/g, " $1").trim()} Ticket Price
//                         </InputLabel>
//                         <TextField
//                             type="number"
//                             placeholder={`Enter ${priceKey.replace(/([A-Z])/g, " $1").trim()} ticket price`}
//                             fullWidth
//                             name="price" // Set the name explicitly to "price"
//                             value={eventData.memberPrices[priceKey].price}
//                             onChange={(e) => handleMemberPriceChange(e, priceKey)}
//                             InputProps={{
//                                 startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} />,
//                             }}
//                             inputProps={{
//                                 min: 0, // Set minimum value

//                             }}
//                         />
//                         <InputLabel sx={{ fontWeight: "bold", mt: 2 }}>Applicable Tax Types</InputLabel>
//                         <FormControl fullWidth>
//                             <div>
//                                 {taxTypes.map((tax) => (
//                                     <FormControlLabel
//                                         key={tax._id}
//                                         control={
//                                             <Checkbox
//                                                 checked={eventData.memberPrices[priceKey].taxTypes.includes(tax._id)}
//                                                 onChange={(e) =>
//                                                     handleTaxTypeChange(priceKey, tax._id, e.target.checked)
//                                                 }
//                                             />
//                                         }
//                                         label={tax.name}
//                                     />
//                                 ))}
//                             </div>
//                         </FormControl>
//                     </Box>
//                 ))}


//                 {/* Tax Types */}
//                 {/* <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Applicable Tax Types</InputLabel>

//                     <FormControl fullWidth>
//                         <div>
//                             {taxTypes.map(tax => (
//                                 <FormControlLabel
//                                     key={tax._id}
//                                     control={
//                                         <Checkbox
//                                             checked={eventData.taxTypes.includes(tax._id)}
//                                             onChange={handleChangeTaxTypes}
//                                             value={tax._id}
//                                         />
//                                     }
//                                     label={tax.name}
//                                 />
//                             ))}
//                         </div>
//                     </FormControl>
//                 </Box> */}
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Allotted Tickets for Members</InputLabel>
//                     <TextField
//                         type="number"
//                         placeholder="Enter number of Allotted Tickets for Members"
//                         fullWidth
//                         name="allottedTicketsMember"
//                         value={eventData.allottedTicketsMember}
//                         onChange={handleInputChange}
//                         error={!!errors.allottedTicketsMember}
//                         helperText={errors.allottedTicketsMember}
//                         InputProps={{ startAdornment: <AirplaneTicket sx={{ color: "gray", mr: 1 }} /> }}
//                         inputProps={{
//                             min: 0, // Set minimum value

//                         }}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Allotted Tickets for Guests</InputLabel>
//                     <TextField
//                         type="number"
//                         placeholder="Enter number of Allotted Tickets for Guests"
//                         fullWidth
//                         name="allottedTicketsGuest"
//                         value={eventData.allottedTicketsGuest}
//                         onChange={handleInputChange}
//                         error={!!errors.allottedTicketsGuest}
//                         helperText={errors.allottedTicketsGuest}
//                         InputProps={{ startAdornment: <AirplaneTicket sx={{ color: "gray", mr: 1 }} /> }}
//                         inputProps={{
//                             min: 0, // Set minimum value

//                         }}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Total Available Tickets</InputLabel>
//                     <TextField
//                         type="number"
//                         placeholder="Total Available Tickets"
//                         fullWidth
//                         name="totalAvailableTickets"
//                         value={eventData.totalAvailableTickets}
//                         InputProps={{ startAdornment: <AirplaneTicket sx={{ color: "gray", mr: 1 }} /> }}
//                         disabled
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Booking Permissioin</InputLabel>

//                     <FormControl fullWidth>
//                         <FormControlLabel
//                             control={
//                                 <Checkbox
//                                     name="bookingPermissionPrimary"
//                                     checked={eventData.bookingPermissionPrimary}
//                                     onChange={handleCheckboxChange}
//                                 />
//                             }
//                             label="Primary Member"
//                         />
//                         <FormControlLabel
//                             control={
//                                 <Checkbox
//                                     name="bookingPermissionSpouse"
//                                     checked={eventData.bookingPermissionSpouse}
//                                     onChange={handleCheckboxChange}
//                                 />
//                             }
//                             label="Spouse"
//                         />
//                         <FormControlLabel
//                             control={
//                                 <Checkbox
//                                     name="bookingPermissionSon"
//                                     checked={eventData.bookingPermissionSon}
//                                     onChange={handleCheckboxChange}
//                                 />
//                             }
//                             label="Son"
//                         />
//                         <FormControlLabel
//                             control={
//                                 <Checkbox
//                                     name="bookingPermissionDaughter"
//                                     checked={eventData.bookingPermissionDaughter}
//                                     onChange={handleCheckboxChange}
//                                 />
//                             }
//                             label="Daughter"
//                         />
//                         <FormControlLabel
//                             control={
//                                 <Checkbox
//                                     name="bookingPermissionDependent"
//                                     checked={eventData.bookingPermissionDependent}
//                                     onChange={handleCheckboxChange}
//                                 />
//                             }
//                             label="Dependent"
//                         />
//                         <FormControlLabel
//                             control={
//                                 <Checkbox
//                                     name="bookingPermissionSeniorDependent"
//                                     checked={eventData.bookingPermissionSeniorDependent}
//                                     onChange={handleCheckboxChange}
//                                 />
//                             }
//                             label="Senior Dependent "
//                         />
//                     </FormControl>
//                 </Box>

//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Location</InputLabel>
//                     <TextField
//                         placeholder="Enter event location"
//                         fullWidth
//                         name="location"
//                         value={eventData.location}
//                         onChange={handleInputChange}
//                         error={!!errors.location}
//                         helperText={errors.location}
//                         InputProps={{ startAdornment: <LocationOn sx={{ color: "gray", mr: 1 }} /> }}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>About Event</InputLabel>
//                     <ReactQuill
//                         value={eventData.aboutEvent}
//                         onChange={handleEditorChange}
//                         placeholder="Describe the event"
//                         style={{
//                             height: "150px",
//                             // border: "1px solid #ccc",
//                             borderRadius: "8px",
//                             marginBottom: "80px"
//                         }}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Organizer</InputLabel>
//                     <TextField
//                         placeholder="Enter organizer name"
//                         fullWidth
//                         name="organizer"
//                         value={eventData.organizer}
//                         onChange={handleInputChange}
//                         error={!!errors.organizer}
//                         helperText={errors.organizer}
//                         InputProps={{ startAdornment: <People sx={{ color: "gray", mr: 1 }} /> }}
//                     />
//                 </Box>

//                 <Box sx={{ mb: 2 }}>
//                     <FormControlLabel
//                         control={
//                             <Checkbox
//                                 name="showBanner"
//                                 checked={eventData.discountOffer}
//                                 onChange={handleCheckboxChange}
//                             />
//                         }
//                         label="Show Banner In Home"
//                     />
//                 </Box>

//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Event Image</InputLabel>
//                     <UploadBox onClick={() => imageInput.current.click()}>
//                         {image ? (
//                             <img src={URL.createObjectURL(image)} alt="Event" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                         ) : (
//                             <Box sx={{ textAlign: "center" }}>
//                                 <BiImageAdd style={{ fontSize: "40px", color: "#027edd" }} />
//                                 <Typography variant="body2" color="textSecondary">
//                                     Click to upload Event image
//                                 </Typography>
//                                 <Typography variant="caption" color="textSecondary">
//                                     (JPG, PNG, GIF)
//                                 </Typography>
//                             </Box>
//                         )}
//                         <input type="file" hidden ref={imageInput} onChange={handleImageChange} />
//                     </UploadBox>
//                 </Box>
//                 {/* <Box sx={{ mb: 2 }}>
//                     <Button
//                         type="button"
//                         variant="contained"
//                         color="primary"
//                         fullWidth
//                         onClick={handleSubmit}
//                         disabled={loading}
//                     >
//                         {loading ? <CircularProgress size={24} color="inherit" /> : "Create Event"}
//                     </Button>
//                 </Box> */}
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
//                         {loading ? <CircularProgress size={20} color="inherit" /> : "Add Event"}
//                     </Button>
//                 </Box>

//             </Paper>
//         </Box>
//     )

// }

// export default AddEvent;