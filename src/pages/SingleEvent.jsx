import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEventDetails, updateEventDetails } from "../api/event";
import { PUBLIC_API_URI } from "../api/config";
import { showToast } from "../api/toast";
import { FiEdit } from "react-icons/fi";
import ReactQuill from "react-quill";
import Breadcrumb from "../components/common/Breadcrumb";
import { fetchAllActiveTaxTypes } from "../api/masterData/taxType";

const SingleEvent = () => {
    const { id } = useParams();
    const [event, setEvent] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editEvent, setEditEvent] = useState({ taxTypes: [] });
    const [selectedImage, setSelectedImage] = useState(null);
    const [taxTypes, setTaxTypes] = useState([]);

    // Fetch event details and tax types
    useEffect(() => {
        const fetchEventData = async () => {
            await getEventById(id);
            getEditEventById(id);
            await fetchTaxTypes();
        };
        fetchEventData();
    }, [id]);

    const getEventById = async (eventId) => {
        try {
            const response = await fetchEventDetails(eventId);
            const eventData = response.data.event;
            setEvent(eventData);
            // setEditEvent({ ...eventData, taxTypes: eventData.taxTypes || [] });
        } catch (error) {
            showToast("Failed to fetch event details.", "error");
        }
    };


    const fetchTaxTypes = async () => {
        try {
            const response = await fetchAllActiveTaxTypes();
            setTaxTypes(response?.data?.data || []);
        } catch (error) {
            showToast("Failed to fetch tax types.", "error");
        }
    };


    const getEditEventById = async (eventId) => {
        try {
            const response = await fetchEventDetails(eventId, "edit");
            const eventData = response.data.event;
            // setEvent(eventData);
            setEditEvent({ ...eventData, taxTypes: eventData.taxTypes || [] });
        } catch (error) {
            showToast("Failed to fetch event details.", "error");
        }
    };


    // useEffect(() => {
    //     getEventById(id);
    //     fetchTaxTypes();
    // }, [id]);

    // Format time to "01:25 PM"
    const formatTime = (timeString) => {
        if (!timeString) return "N/A";
        const [hour, minute] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hour, minute);
        return date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    // Handle edit button click
    const handleEditClick = () => {
        setEditDialogOpen(true);
    };

    // Handle dialog close
    const handleDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedImage(null);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditEvent({ ...editEvent, [name]: value });
    };

    // Handle image file selection
    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    // Handle save changes
    const handleSaveChanges = async () => {
        try {
            const formData = new FormData();
            Object.entries(editEvent).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Append new image if selected
            if (selectedImage) {
                formData.append("eventImage", selectedImage);
            }

            const response = await updateEventDetails(id, formData);
            if (response.status === 200 && response.data.event) {
                getEventById(id)
                // setEvent(response.data.event);
                // setEditEvent(response.data.event);
                setEditDialogOpen(false);
                showToast("Event details updated successfully!", "success");
            }
        } catch (error) {
            console.error("Failed to update event details:", error);
            showToast("Failed to update event details. Please try again.", "error");
        }
    };

    // Get color for status
    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return "primary";
            case "Inactive":
                return "error";
            case "Complete":
                return "success";
            default:
                return "default";
        }
    };

    // Get color for RSVP status
    const getRsvpColor = (rsvpStatus) => {
        switch (rsvpStatus) {
            case "Attending":
                return "success";
            case "Not Attending":
                return "error";
            case "Maybe":
                return "warning";
            case "Pending":
                return "info";
            case "Cancelled":
                return "default";
            case "N/A":
                return "error";
            default:
                return "default";
        }
    };

    // Handle checkbox changes for Amenities
    // const handleChangeTaxTypes = (event) => {
    //     const { value, checked } = event.target;
    //     console.log(editEvent.taxTypes, value, checked, "banquetData.taxTypes")
    //     setEditEvent((prevState) => ({
    //         ...prevState,
    //         taxTypes: checked
    //             ? [...prevState.taxTypes, value] // Add amenity ID if checked
    //             : prevState.taxTypes.filter((taxType) => taxType !== value), // Remove taxType ID if unchecked
    //     }));
    // };

    const handleChangeTaxTypes = (event) => {
        const { value, checked } = event.target;
        setEditEvent((prev) => ({
            ...prev,
            taxTypes: checked
                ? [...prev.taxTypes, value]
                : prev.taxTypes.filter((taxType) => taxType !== value),
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setEditEvent((prev) => ({ ...prev, [name]: checked }));
    };

    console.log(editEvent, "editEvent")
    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Event Details
            </Typography>
            <Paper sx={{ p: 3, mb: 3, borderRadius: "12px", border: "1px solid", borderColor: "divider" }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <Avatar
                            src={event.eventImage ? `${PUBLIC_API_URI}${event.eventImage}` : ""}
                            alt={event.eventTitle}
                            variant="rounded"
                            sx={{ width: "100%", height: "300px", objectFit: "cover" }}
                        />
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Typography variant="h4">{event.eventTitle}</Typography>
                        <Typography variant="subtitle1">{event.eventSubtitle}</Typography>
                        <Typography variant="body1">
                            <strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Time:</strong> {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Total Ticket:</strong> ₹ {event.availableTickets}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Ticket Price:</strong> ₹ {event.ticketPrice}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Primary Member Ticket Price:</strong> ₹ {event.primaryMemberPrice}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Dependent Member Ticket Price:</strong> ₹ {event.dependentMemberPrice}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Guest Member Ticket Price:</strong> ₹ {event.guestMemberPrice}
                        </Typography>
                        {event.taxTypes && event.taxTypes.length > 0 ? (
                            event.taxTypes.map((tax, index) => (
                                <Typography key={index} variant="body1">
                                    <strong>{tax.name}:</strong> {tax.percentage}%
                                </Typography>
                            ))
                        ) : (
                            <Typography variant="body1">No tax information available.</Typography>
                        )}
                        <Typography variant="body1">
                            <strong>Location:</strong> {event.location}
                        </Typography>
                        <Typography variant="body1" sx={{ color: getStatusColor(event.status) }}>
                            <strong>Status:</strong> {event.status}
                        </Typography>
                        <Typography variant="body1" >
                            <strong>Show Banner Home:</strong> {event.showBanner === true ? "Yes" : "No"}
                        </Typography>
                        <Button variant="contained" color="primary" startIcon={<FiEdit />} onClick={handleEditClick}>
                            Edit Event
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit Event Details</DialogTitle>
                <DialogContent>
                    <TextField label="Event Title" fullWidth margin="dense" name="eventTitle" value={editEvent.eventTitle || ""} onChange={handleInputChange} />
                    <TextField label="Event Subtitle" fullWidth margin="dense" name="eventSubtitle" value={editEvent.eventSubtitle || ""} onChange={handleInputChange} />
                    <TextField label="Event Start Date" type="date" fullWidth margin="dense" name="eventStartDate" value={editEvent.eventStartDate?.slice(0, 10) || ""}
                        inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates
                        onChange={handleInputChange} />
                    <TextField label="Event End Date" type="date"
                        fullWidth margin="dense" name="eventEndDate" value={editEvent.eventEndDate?.slice(0, 10) || ""}
                        inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates
                        onChange={handleInputChange} />
                    <TextField label="Start Time" type="time" fullWidth margin="dense" name="startTime" value={editEvent.startTime || ""} onChange={handleInputChange} />
                    <TextField label="End Time" type="time" fullWidth margin="dense" name="endTime" value={editEvent.endTime || ""} onChange={handleInputChange} />
                    <TextField label="Acailable Ticket" fullWidth margin="dense" name="availableTickets" value={editEvent.availableTickets || ""} onChange={handleInputChange} />
                    <TextField label="Ticket Price" fullWidth margin="dense" name="ticketPrice" value={editEvent.ticketPrice || ""} onChange={handleInputChange} />
                    <TextField label="Primary Member Ticket Price" fullWidth margin="dense" name="primaryMemberPrice" value={editEvent.primaryMemberPrice || ""} onChange={handleInputChange} />
                    <TextField label="Dependent Member Ticket Price" fullWidth margin="dense" name="dependentMemberPrice" value={editEvent.dependentMemberPrice || ""} onChange={handleInputChange} />
                    <TextField label="Guest Member Ticket Price" fullWidth margin="dense" name="guestMemberPrice" value={editEvent.guestMemberPrice || ""} onChange={handleInputChange} />
                    {/* <TextField label="Tax Rate In %" fullWidth margin="dense" name="taxRate" value={editEvent.taxRate || ""} onChange={handleInputChange} /> */}
                    {/* Use ReactQuill for About Event */}
                    <Box sx={{ mb: 2 }}>
                        <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Event Tax Types</InputLabel>
                        {/* <FormControl fullWidth>
                            <div>
                                {taxTypes.map((taxType) => (
                                    <FormControlLabel
                                        key={taxType._id}
                                        control={
                                            <Checkbox checked={editEvent.taxTypes.includes(taxType._id)} onChange={handleChangeTaxTypes}

                                                value={taxType._id} />
                                        }
                                        label={taxType.name}
                                    />
                                ))}
                            </div>
                        </FormControl> */}
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <div>
                                {taxTypes.map((taxType) => (
                                    <FormControlLabel
                                        key={taxType._id}
                                        control={
                                            <Checkbox
                                                checked={editEvent.taxTypes.includes(taxType._id)}
                                                onChange={handleChangeTaxTypes}
                                                value={taxType._id}
                                            />
                                        }
                                        label={taxType.name}
                                    />
                                ))}
                            </div>
                        </FormControl>
                    </Box>
                    <InputLabel sx={{ fontWeight: "bold", mt: 2 }}>About Event</InputLabel>
                    <ReactQuill
                        value={editEvent.aboutEvent || ""}
                        onChange={(value) => setEditEvent({ ...editEvent, aboutEvent: value })}
                        style={{ height: "150px", marginBottom: "50px" }}
                    />
                    <TextField label="Status" select fullWidth margin="dense" name="status" value={editEvent.status || ""} onChange={handleInputChange}>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                        <MenuItem value="Complete">Complete</MenuItem>
                    </TextField>
                    {/* <Avatar src={selectedImage ? URL.createObjectURL(selectedImage) : `${PUBLIC_API_URI}${editEvent.eventImage}`} alt="Event Image" variant="rounded" sx={{ width: "100%", height: "200px", mb: 2 }} /> */}
                    <Box sx={{ mb: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="showBanner"
                                    checked={editEvent.showBanner}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label="Show Banner In Home"
                        />
                    </Box>
                    <Avatar
                        src={selectedImage ? URL.createObjectURL(selectedImage) : `${PUBLIC_API_URI}${editEvent.eventImage}`}
                        alt="Event Image"
                        variant="rounded"
                        sx={{ width: "100%", height: "200px", objectFit: "cover", mb: 2 }}
                    />
                    <Button variant="contained" component="label" fullWidth>
                        Upload New Image
                        <input type="file" hidden onChange={handleImageChange} />
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSaveChanges} color="primary">Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default SingleEvent;


