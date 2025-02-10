import {
    Avatar,
    Box,
    Button,
    Checkbox,
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
import { formatDateTime, PUBLIC_API_URI } from "../api/config";
import { showToast } from "../api/toast";
import { FiEdit } from "react-icons/fi";
import ReactQuill from "react-quill";
import Breadcrumb from "../components/common/Breadcrumb";
import { fetchAllActiveTaxTypes } from "../api/masterData/taxType";
import { fetchEventAttendenceDetails } from "../api/getKeeper";
import Table from "../components/Table";

const SingleEvent = () => {
    const { id } = useParams();
    const [event, setEvent] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editEvent, setEditEvent] = useState({ taxTypes: [] });
    const [selectedImage, setSelectedImage] = useState(null);
    const [taxTypes, setTaxTypes] = useState([]);


    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(null);

    // Define table columns
    const columns = [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "mobileNumber", header: "Mobile Number" },

        { accessorKey: "attendanceStatus", header: "Status" },
        { accessorKey: "qrCode", header: "QR Code" },
        { accessorKey: "gatekeeperName", header: "Gate Keeper Name" },
        {
            accessorKey: "scannedAt",
            header: "Scanned At",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    // Fetch attendance data for the event
    useEffect(() => {
        fetchAllAttendance(id);
    }, [id]);

    const fetchAllAttendance = async (id) => {
        setLoading(true)
        try {
            const response = await fetchEventAttendenceDetails(id);
            if (response.status === 200) {
                setAttendance(response.data.attendees);
                setLoading(false)
            } else {
                setAttendance([]);
                setLoading(false)
            }
        } catch (err) {
            console.error("Error fetching attendance:", err);
            setAttendance([]);
            setLoading(false)
        }
    };


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

    // // Handle form input changes
    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setEditEvent({ ...editEvent, [name]: value });
    // };

    // Handle input changes and calculate totalAvailableTickets
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Update the specific field
        const updatedEventData = {
            ...editEvent,
            [name]: value,
        };

        // Calculate the total available tickets if the relevant fields are updated
        if (name === "allottedTicketsMember" || name === "allottedTicketsGuest") {
            updatedEventData.totalAvailableTickets =
                parseInt(updatedEventData.allottedTicketsMember || 0) +
                parseInt(updatedEventData.allottedTicketsGuest || 0);
        }

        setEditEvent(updatedEventData);
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

    // // Get color for RSVP status
    // const getRsvpColor = (rsvpStatus) => {
    //     switch (rsvpStatus) {
    //         case "Attending":
    //             return "success";
    //         case "Not Attending":
    //             return "error";
    //         case "Maybe":
    //             return "warning";
    //         case "Pending":
    //             return "info";
    //         case "Cancelled":
    //             return "default";
    //         case "N/A":
    //             return "error";
    //         default:
    //             return "default";
    //     }
    // };

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
                            <strong>Total Available Tickets:</strong>  {event.totalAvailableTickets}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Allotted Tickets for Members:</strong>  {event.allottedTicketsMember}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Allotted Tickets for Guests:</strong>  {event.allottedTicketsGuest}
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
                        <Typography variant="body1">
                            <strong>Spouse Member Ticket Price:</strong> ₹ {event.spouseMemberPrice}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Kids Member Ticket Price:</strong> ₹ {event.kidsMemberPrice}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Senior Dependent Member Ticket Price:</strong> ₹ {event.seniorDependentMemberPrice}
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
                        {/* <Typography variant="body1" >
                            <strong>Booking Permissioins</strong> <br />
                            <strong>Primary Member :-</strong>{event.bookingPermissionPrimary === true ? "Yes" : "No"} <br />
                            <strong>Spouse :-</strong>{event.bookingPermissionSpouse === true ? "Yes" : "No"} <br />
                            <strong>Son :-</strong>{event.bookingPermissionSon === true ? "Yes" : "No"} <br />
                            <strong>Daughter :-</strong>{event.bookingPermissionDaughter === true ? "Yes" : "No"} <br />
                            <strong>Senior Dependent Member :-</strong>{event.bookingPermissionSeniorDependent === true ? "Yes" : "No"} <br />
                        </Typography> */}
                        <Box >
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                                Booking Permissions
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={4}>
                                    <Typography variant="body2">
                                        <strong>Primary Member:</strong> {event.bookingPermissionPrimary ? "Yes" : "No"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Typography variant="body2">
                                        <strong>Spouse:</strong> {event.bookingPermissionSpouse ? "Yes" : "No"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Typography variant="body2">
                                        <strong>Child:</strong> {event.bookingPermissionChild ? "Yes" : "No"}
                                    </Typography>
                                </Grid>
                                {/* <Grid item xs={6} sm={4}>
                                    <Typography variant="body2">
                                        <strong>Daughter:</strong> {event.bookingPermissionDaughter ? "Yes" : "No"}
                                    </Typography>
                                </Grid> */}
                                <Grid item xs={6} sm={4}>
                                    <Typography variant="body2">
                                        <strong>Dependent Member:</strong> {event.bookingPermissionDependent ? "Yes" : "No"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Typography variant="body2">
                                        <strong>Senior Dependent Member:</strong> {event.bookingPermissionSeniorDependent ? "Yes" : "No"}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                <strong>About Event:</strong>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: event.aboutEvent || "N/A",
                                    }}
                                />
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                <strong>Event Guideline:</strong>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: event.guideline || "N/A",
                                    }}
                                />
                            </Typography>
                        </Box>

                        {/* <Button variant="contained" color="primary" startIcon={<FiEdit />} onClick={handleEditClick}>
                            Edit Event
                        </Button> */}
                        {new Date(event?.eventStartDate) > new Date() && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<FiEdit />}
                                onClick={handleEditClick}
                                sx={{ marginTop: "20px" }}
                            >
                                Edit Event
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            <div>Attendant Member List</div>
            <Table
                data={attendance}
                fields={columns}
                numberOfRows={attendance.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                isLoading={loading}
            />

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
                    <TextField label="Total Available Tickets" fullWidth margin="dense" name="totalAvailableTickets" value={editEvent.totalAvailableTickets || ""} disabled />
                    <TextField label="Allotted Tickets for Members" fullWidth margin="dense" name="allottedTicketsMember" value={editEvent.allottedTicketsMember || ""} onChange={handleInputChange} />
                    <TextField label="Allotted Tickets for Guests" fullWidth margin="dense" name="allottedTicketsGuest" value={editEvent.allottedTicketsGuest || ""} onChange={handleInputChange} />
                    <TextField label="Ticket Price" fullWidth margin="dense" name="ticketPrice" value={editEvent.ticketPrice || ""} onChange={handleInputChange} />
                    <TextField label="Primary Member Ticket Price" fullWidth margin="dense" name="primaryMemberPrice" value={editEvent.primaryMemberPrice || ""} onChange={handleInputChange} />
                    <TextField label="Dependent Member Ticket Price" fullWidth margin="dense" name="dependentMemberPrice" value={editEvent.dependentMemberPrice || ""} onChange={handleInputChange} />
                    <TextField label="Guest Member Ticket Price" fullWidth margin="dense" name="guestMemberPrice" value={editEvent.guestMemberPrice || ""} onChange={handleInputChange} />
                    <TextField label="Spouse Member Ticket Price" fullWidth margin="dense" name="spouseMemberPrice" value={editEvent.spouseMemberPrice || ""} onChange={handleInputChange} />
                    <TextField label="Kids Member Ticket Price" fullWidth margin="dense" name="kidsMemberPrice" value={editEvent.kidsMemberPrice || ""} onChange={handleInputChange} />
                    <TextField label="Senior Dependent Member Ticket Price" fullWidth margin="dense" name="seniorDependentMemberPrice" value={editEvent.seniorDependentMemberPrice || ""} onChange={handleInputChange} />

                    <Box sx={{ mb: 2 }}>
                        <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Booking Permissioin</InputLabel>

                        <FormControl fullWidth>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="bookingPermissionPrimary"
                                        checked={editEvent.bookingPermissionPrimary}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                                label="Primary Member"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="bookingPermissionSpouse"
                                        checked={editEvent.bookingPermissionSpouse}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                                label="Spouse"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="bookingPermissionChild"
                                        checked={editEvent.bookingPermissionChild}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                                label="Child"
                            />
                            {/* <FormControlLabel
                                control={
                                    <Checkbox
                                        name="bookingPermissionDaughter"
                                        checked={editEvent.bookingPermissionDaughter}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                                label="Daughter"
                            /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="bookingPermissionDependent"
                                        checked={editEvent.bookingPermissionDependent}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                                label="Dependent"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="bookingPermissionSeniorDependent"
                                        checked={editEvent.bookingPermissionSeniorDependent}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                                label="Senior Dependent Member"
                            />
                        </FormControl>
                    </Box>
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
                    <Box sx={{ mb: 2 }}>
                        <InputLabel sx={{ fontWeight: "bold", mt: 2 }}>About Event</InputLabel>
                        <ReactQuill
                            value={editEvent.aboutEvent || ""}
                            onChange={(value) => setEditEvent({ ...editEvent, aboutEvent: value })}
                            style={{ height: "120px", marginBottom: "100px" }}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <InputLabel sx={{ fontWeight: "bold", mt: 2 }}>Event Guideline</InputLabel>
                        <ReactQuill
                            value={editEvent.guideline || ""}
                            onChange={(value) => setEditEvent({ ...editEvent, guideline: value })}
                            style={{ height: "120px", marginBottom: "100px" }}
                        />
                    </Box>
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




// import {
//     Avatar,
//     Box,
//     Button,
//     Checkbox,
//     Chip,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     FormControl,
//     FormControlLabel,
//     Grid,
//     InputLabel,
//     MenuItem,
//     Paper,
//     TextField,
//     Typography,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { fetchEventDetails, updateEventDetails } from "../api/event";
// import { formatDateTime, PUBLIC_API_URI } from "../api/config";
// import { showToast } from "../api/toast";
// import { FiEdit } from "react-icons/fi";
// import ReactQuill from "react-quill";
// import Breadcrumb from "../components/common/Breadcrumb";
// import { fetchAllActiveTaxTypes } from "../api/masterData/taxType";
// import { fetchEventAttendenceDetails } from "../api/getKeeper";
// import Table from "../components/Table";

// const SingleEvent = () => {
//     const { id } = useParams();
//     const [event, setEvent] = useState({});
//     const [isEditDialogOpen, setEditDialogOpen] = useState(false);
//     const [editEvent, setEditEvent] = useState({ taxTypes: [] });
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [taxTypes, setTaxTypes] = useState([]);


//     const [attendance, setAttendance] = useState([]);
//     const [loading, setLoading] = useState(null);

//     // Define table columns
//     const columns = [
//         { accessorKey: "name", header: "Name" },
//         { accessorKey: "email", header: "Email" },
//         { accessorKey: "mobileNumber", header: "Mobile Number" },

//         { accessorKey: "attendanceStatus", header: "Status" },
//         { accessorKey: "qrCode", header: "QR Code" },
//         { accessorKey: "gatekeeperName", header: "Gate Keeper Name" },
//         {
//             accessorKey: "scannedAt",
//             header: "Scanned At",
//             Cell: ({ cell }) => formatDateTime(cell.getValue()),
//         },
//     ];

//     // Fetch attendance data for the event
//     useEffect(() => {
//         fetchAllAttendance(id);
//     }, [id]);

//     const fetchAllAttendance = async (id) => {
//         setLoading(true)
//         try {
//             const response = await fetchEventAttendenceDetails(id);
//             if (response.status === 200) {
//                 setAttendance(response.data.attendees);
//                 setLoading(false)
//             } else {
//                 setAttendance([]);
//                 setLoading(false)
//             }
//         } catch (err) {
//             console.error("Error fetching attendance:", err);
//             setAttendance([]);
//             setLoading(false)
//         }
//     };


//     // Fetch event details and tax types
//     useEffect(() => {
//         const fetchEventData = async () => {
//             await getEventById(id);
//             getEditEventById(id);
//             await fetchTaxTypes();
//         };
//         fetchEventData();
//     }, [id]);

//     const getEventById = async (eventId) => {
//         try {
//             const response = await fetchEventDetails(eventId);
//             const eventData = response.data.event;
//             setEvent(eventData);
//             // setEditEvent({ ...eventData, taxTypes: eventData.taxTypes || [] });
//         } catch (error) {
//             showToast("Failed to fetch event details.", "error");
//         }
//     };


//     const fetchTaxTypes = async () => {
//         try {
//             const response = await fetchAllActiveTaxTypes();
//             setTaxTypes(response?.data?.data || []);
//         } catch (error) {
//             showToast("Failed to fetch tax types.", "error");
//         }
//     };


//     const getEditEventById = async (eventId) => {
//         try {
//             const response = await fetchEventDetails(eventId, "edit");
//             const eventData = response.data.event;
//             // setEvent(eventData);
//             setEditEvent({ ...eventData, taxTypes: eventData.taxTypes || [] });
//         } catch (error) {
//             showToast("Failed to fetch event details.", "error");
//         }
//     };


//     // useEffect(() => {
//     //     getEventById(id);
//     //     fetchTaxTypes();
//     // }, [id]);

//     // Format time to "01:25 PM"
//     const formatTime = (timeString) => {
//         if (!timeString) return "N/A";
//         const [hour, minute] = timeString.split(':').map(Number);
//         const date = new Date();
//         date.setHours(hour, minute);
//         return date.toLocaleTimeString(undefined, {
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: true,
//         });
//     };

//     // Handle edit button click
//     const handleEditClick = () => {
//         setEditDialogOpen(true);
//     };

//     // Handle dialog close
//     const handleDialogClose = () => {
//         setEditDialogOpen(false);
//         setSelectedImage(null);
//     };

//     // // Handle form input changes
//     // const handleInputChange = (e) => {
//     //     const { name, value } = e.target;
//     //     setEditEvent({ ...editEvent, [name]: value });
//     // };

//     // Handle input changes and calculate totalAvailableTickets
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;

//         // Update the specific field
//         const updatedEventData = {
//             ...editEvent,
//             [name]: value,
//         };

//         // Calculate the total available tickets if the relevant fields are updated
//         if (name === "allottedTicketsMember" || name === "allottedTicketsGuest") {
//             updatedEventData.totalAvailableTickets =
//                 parseInt(updatedEventData.allottedTicketsMember || 0) +
//                 parseInt(updatedEventData.allottedTicketsGuest || 0);
//         }

//         setEditEvent(updatedEventData);
//     };


//     // Handle image file selection
//     const handleImageChange = (e) => {
//         setSelectedImage(e.target.files[0]);
//     };

//     // Handle save changes
//     const handleSaveChanges = async () => {
//         try {
//             const formData = new FormData();
//             Object.entries(editEvent).forEach(([key, value]) => {
//                 formData.append(key, value);
//             });

//             // Append new image if selected
//             if (selectedImage) {
//                 formData.append("eventImage", selectedImage);
//             }

//             const response = await updateEventDetails(id, formData);
//             if (response.status === 200 && response.data.event) {
//                 getEventById(id)
//                 // setEvent(response.data.event);
//                 // setEditEvent(response.data.event);
//                 setEditDialogOpen(false);
//                 showToast("Event details updated successfully!", "success");
//             }
//         } catch (error) {
//             console.error("Failed to update event details:", error);
//             showToast("Failed to update event details. Please try again.", "error");
//         }
//     };

//     // Get color for status
//     const getStatusColor = (status) => {
//         switch (status) {
//             case "Active":
//                 return "primary";
//             case "Inactive":
//                 return "error";
//             case "Complete":
//                 return "success";
//             default:
//                 return "default";
//         }
//     };

//     // Get color for RSVP status
//     const getRsvpColor = (rsvpStatus) => {
//         switch (rsvpStatus) {
//             case "Attending":
//                 return "success";
//             case "Not Attending":
//                 return "error";
//             case "Maybe":
//                 return "warning";
//             case "Pending":
//                 return "info";
//             case "Cancelled":
//                 return "default";
//             case "N/A":
//                 return "error";
//             default:
//                 return "default";
//         }
//     };
//     const handleChangeTaxTypes = (event) => {
//         const { value, checked } = event.target;
//         setEditEvent((prev) => ({
//             ...prev,
//             taxTypes: checked
//                 ? [...prev.taxTypes, value]
//                 : prev.taxTypes.filter((taxType) => taxType !== value),
//         }));
//     };

//     const handleCheckboxChange = (e) => {
//         const { name, checked } = e.target;
//         setEditEvent((prev) => ({ ...prev, [name]: checked }));
//     };

//     console.log(editEvent, "editEvent")
//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Breadcrumb />
//             <Typography variant="h4" sx={{ mb: 2 }}>
//                 Event Details
//             </Typography>
//             <Paper sx={{ p: 3, mb: 3, borderRadius: "12px", border: "1px solid", borderColor: "divider" }}>
//                 <Grid container spacing={4}>
//                     <Grid item xs={12} md={5}>
//                         <Avatar
//                             src={event.eventImage ? `${PUBLIC_API_URI}${event.eventImage}` : ""}
//                             alt={event.eventTitle}
//                             variant="rounded"
//                             sx={{ width: "100%", height: "300px", objectFit: "cover" }}
//                         />
//                     </Grid>
//                     {/* <Grid item xs={12} md={7}>
//                         <Typography variant="h4">{event.eventTitle}</Typography>
//                         <Typography variant="subtitle1">{event.eventSubtitle}</Typography>
//                         <Typography variant="body1">
//                             <strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Time:</strong> {formatTime(event.startTime)} - {formatTime(event.endTime)}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Total Available Tickets:</strong>  {event.totalAvailableTickets}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Allotted Tickets for Members:</strong>  {event.allottedTicketsMember}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Allotted Tickets for Guests:</strong>  {event.allottedTicketsGuest}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Ticket Price:</strong> ₹ {event.ticketPrice}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Primary Member Ticket Price:</strong> ₹ {event.primaryMemberPrice}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Dependent Member Ticket Price:</strong> ₹ {event.dependentMemberPrice}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Guest Member Ticket Price:</strong> ₹ {event.guestMemberPrice}
//                         </Typography>
//                         {event.taxTypes && event.taxTypes.length > 0 ? (
//                             event.taxTypes.map((tax, index) => (
//                                 <Typography key={index} variant="body1">
//                                     <strong>{tax.name}:</strong> {tax.percentage}%
//                                 </Typography>
//                             ))
//                         ) : (
//                             <Typography variant="body1">No tax information available.</Typography>
//                         )}
//                         <Typography variant="body1">
//                             <strong>Location:</strong> {event.location}
//                         </Typography>
//                         <Typography variant="body1" sx={{ color: getStatusColor(event.status) }}>
//                             <strong>Status:</strong> {event.status}
//                         </Typography>
//                         <Typography variant="body1" >
//                             <strong>Show Banner Home:</strong> {event.showBanner === true ? "Yes" : "No"}
//                         </Typography>
//                         <Box >
//                             <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
//                                 Booking Permissions
//                             </Typography>
//                             <Grid container spacing={2}>
//                                 <Grid item xs={6} sm={4}>
//                                     <Typography variant="body2">
//                                         <strong>Primary Member:</strong> {event.bookingPermissionPrimary ? "Yes" : "No"}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={6} sm={4}>
//                                     <Typography variant="body2">
//                                         <strong>Spouse:</strong> {event.bookingPermissionSpouse ? "Yes" : "No"}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={6} sm={4}>
//                                     <Typography variant="body2">
//                                         <strong>Son:</strong> {event.bookingPermissionSon ? "Yes" : "No"}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={6} sm={4}>
//                                     <Typography variant="body2">
//                                         <strong>Daughter:</strong> {event.bookingPermissionDaughter ? "Yes" : "No"}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={6} sm={4}>
//                                     <Typography variant="body2">
//                                         <strong>Senior Dependent Member:</strong> {event.bookingPermissionSeniorDependent ? "Yes" : "No"}
//                                     </Typography>
//                                 </Grid>
//                             </Grid>
//                         </Box>

//                         <Button variant="contained" color="primary" startIcon={<FiEdit />} onClick={handleEditClick}>
//                             Edit Event
//                         </Button>
//                     </Grid> */}
//                     <Grid item xs={12} md={7}>
//                         <Typography variant="h4">{event.eventTitle}</Typography>
//                         <Typography variant="subtitle1">{event.eventSubtitle}</Typography>
//                         <Typography variant="body1">
//                             <strong>Date:</strong> {new Date(event.eventStartDate).toLocaleDateString()} - {new Date(event.eventEndDate).toLocaleDateString()}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Time:</strong> {formatTime(event.startTime)} - {formatTime(event.endTime)}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Total Available Tickets:</strong> {event.totalAvailableTickets}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Allotted Tickets for Members:</strong> {event.allottedTicketsMember}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Allotted Tickets for Guests:</strong> {event.allottedTicketsGuest}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Base Ticket Price:</strong> ₹ {event.ticketPrice}
//                         </Typography>

//                         {/* Member Prices Section */}
//                         {event.memberPrices &&
//                             Object.entries(event.memberPrices).map(([memberType, details], index) => (
//                                 <Box key={index} sx={{ mb: 2 }}>
//                                     <Typography variant="body1">
//                                         <strong>{memberType.replace(/([A-Z])/g, " $1").trim()}:</strong> ₹ {details.price}
//                                     </Typography>
//                                     {details.taxTypes && details.taxTypes.length > 0 ? (
//                                         details.taxTypes.map((tax, taxIndex) => (
//                                             <Typography key={taxIndex} variant="body2" sx={{ ml: 2 }}>
//                                                 - <strong>{tax.name}:</strong> {tax.percentage}%
//                                             </Typography>
//                                         ))
//                                     ) : (
//                                         <Typography variant="body2" sx={{ ml: 2 }}>No tax information available.</Typography>
//                                     )}
//                                 </Box>
//                             ))}

//                         <Typography variant="body1">
//                             <strong>Location:</strong> {event.location}
//                         </Typography>
//                         <Typography variant="body1" sx={{ color: getStatusColor(event.status) }}>
//                             <strong>Status:</strong> {event.status}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Show Banner Home:</strong> {event.showBanner ? "Yes" : "No"}
//                         </Typography>

//                         {/* Booking Permissions */}
//                         <Box>
//                             <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
//                                 Booking Permissions
//                             </Typography>
//                             <Grid container spacing={2}>
//                                 <Grid item xs={6} sm={4}>
//                                     <Typography variant="body2">
//                                         <strong>Primary Member:</strong> {event.bookingPermissionPrimary ? "Yes" : "No"}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={6} sm={4}>
//                                     <Typography variant="body2">
//                                         <strong>Spouse:</strong> {event.bookingPermissionSpouse ? "Yes" : "No"}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={6} sm={4}>
//                                     <Typography variant="body2">
//                                         <strong>Son:</strong> {event.bookingPermissionSon ? "Yes" : "No"}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={6} sm={4}>
//                                     <Typography variant="body2">
//                                         <strong>Daughter:</strong> {event.bookingPermissionDaughter ? "Yes" : "No"}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={6} sm={4}>
//                                     <Typography variant="body2">
//                                         <strong>Dependent Member:</strong> {event.bookingPermissionDependent ? "Yes" : "No"}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={6} sm={4}>
//                                     <Typography variant="body2">
//                                         <strong>Senior Dependent Member:</strong> {event.bookingPermissionSeniorDependent ? "Yes" : "No"}
//                                     </Typography>
//                                 </Grid>
//                             </Grid>
//                         </Box>

//                         <Button variant="contained" color="primary" startIcon={<FiEdit />} onClick={handleEditClick}>
//                             Edit Event
//                         </Button>
//                     </Grid>

//                 </Grid>
//             </Paper>

//             <div>Attendant Member List</div>
//             <Table
//                 data={attendance}
//                 fields={columns}
//                 numberOfRows={attendance.length}
//                 enableTopToolBar
//                 enableBottomToolBar
//                 enablePagination
//                 enableRowSelection
//                 enableColumnFilters
//                 enableEditing
//                 enableColumnDragging
//                 isLoading={loading}
//             />

//             {/* Edit Dialog */}
//             <Dialog open={isEditDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
//                 <DialogTitle>Edit Event Details</DialogTitle>
//                 <DialogContent>
//                     <TextField label="Event Title" fullWidth margin="dense" name="eventTitle" value={editEvent.eventTitle || ""} onChange={handleInputChange} />
//                     <TextField label="Event Subtitle" fullWidth margin="dense" name="eventSubtitle" value={editEvent.eventSubtitle || ""} onChange={handleInputChange} />
//                     <TextField label="Event Start Date" type="date" fullWidth margin="dense" name="eventStartDate" value={editEvent.eventStartDate?.slice(0, 10) || ""}
//                         inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates
//                         onChange={handleInputChange} />
//                     <TextField label="Event End Date" type="date"
//                         fullWidth margin="dense" name="eventEndDate" value={editEvent.eventEndDate?.slice(0, 10) || ""}
//                         inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates
//                         onChange={handleInputChange} />
//                     <TextField label="Start Time" type="time" fullWidth margin="dense" name="startTime" value={editEvent.startTime || ""} onChange={handleInputChange} />
//                     <TextField label="End Time" type="time" fullWidth margin="dense" name="endTime" value={editEvent.endTime || ""} onChange={handleInputChange} />
//                     <TextField label="Total Available Tickets" fullWidth margin="dense" name="totalAvailableTickets" value={editEvent.totalAvailableTickets || ""} disabled />
//                     <TextField label="Allotted Tickets for Members" fullWidth margin="dense" name="allottedTicketsMember" value={editEvent.allottedTicketsMember || ""} onChange={handleInputChange} />
//                     <TextField label="Allotted Tickets for Guests" fullWidth margin="dense" name="allottedTicketsGuest" value={editEvent.allottedTicketsGuest || ""} onChange={handleInputChange} />
//                     <TextField label="Ticket Price" fullWidth margin="dense" name="ticketPrice" value={editEvent.ticketPrice || ""} onChange={handleInputChange} />
//                     <TextField label="Primary Member Ticket Price" fullWidth margin="dense" name="primaryMemberPrice" value={editEvent.primaryMemberPrice || ""} onChange={handleInputChange} />
//                     <TextField label="Dependent Member Ticket Price" fullWidth margin="dense" name="dependentMemberPrice" value={editEvent.dependentMemberPrice || ""} onChange={handleInputChange} />
//                     <TextField label="Guest Member Ticket Price" fullWidth margin="dense" name="guestMemberPrice" value={editEvent.guestMemberPrice || ""} onChange={handleInputChange} />
//                     <Box sx={{ mb: 2 }}>
//                         <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Booking Permissioin</InputLabel>

//                         <FormControl fullWidth>
//                             <FormControlLabel
//                                 control={
//                                     <Checkbox
//                                         name="bookingPermissionPrimary"
//                                         checked={editEvent.bookingPermissionPrimary}
//                                         onChange={handleCheckboxChange}
//                                     />
//                                 }
//                                 label="Primary Member"
//                             />
//                             <FormControlLabel
//                                 control={
//                                     <Checkbox
//                                         name="bookingPermissionSpouse"
//                                         checked={editEvent.bookingPermissionSpouse}
//                                         onChange={handleCheckboxChange}
//                                     />
//                                 }
//                                 label="Spouse"
//                             />
//                             <FormControlLabel
//                                 control={
//                                     <Checkbox
//                                         name="bookingPermissionSon"
//                                         checked={editEvent.bookingPermissionSon}
//                                         onChange={handleCheckboxChange}
//                                     />
//                                 }
//                                 label="Son"
//                             />
//                             <FormControlLabel
//                                 control={
//                                     <Checkbox
//                                         name="bookingPermissionDaughter"
//                                         checked={editEvent.bookingPermissionDaughter}
//                                         onChange={handleCheckboxChange}
//                                     />
//                                 }
//                                 label="Daughter"
//                             />
//                             <FormControlLabel
//                                 control={
//                                     <Checkbox
//                                         name="bookingPermissionSeniorDependent"
//                                         checked={editEvent.bookingPermissionSeniorDependent}
//                                         onChange={handleCheckboxChange}
//                                     />
//                                 }
//                                 label="Senior Dependent Member"
//                             />
//                         </FormControl>
//                     </Box>
//                     <Box sx={{ mb: 2 }}>
//                         <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Event Tax Types</InputLabel>
//                         {/* <FormControl fullWidth sx={{ mt: 2 }}>
//                             <div>
//                                 {taxTypes.map((taxType) => (
//                                     <FormControlLabel
//                                         key={taxType._id}
//                                         control={
//                                             <Checkbox
//                                                 checked={editEvent.taxTypes.includes(taxType._id)}
//                                                 onChange={handleChangeTaxTypes}
//                                                 value={taxType._id}
//                                             />
//                                         }
//                                         label={taxType.name}
//                                     />
//                                 ))}
//                             </div>
//                         </FormControl> */}
//                     </Box>
//                     <Box sx={{ mb: 2 }}>
//                         <InputLabel sx={{ fontWeight: "bold", mt: 2 }}>About Event</InputLabel>
//                         <ReactQuill
//                             value={editEvent.aboutEvent || ""}
//                             onChange={(value) => setEditEvent({ ...editEvent, aboutEvent: value })}
//                             style={{ height: "120px", marginBottom: "100px" }}
//                         />
//                     </Box>
//                     <TextField label="Status" select fullWidth margin="dense" name="status" value={editEvent.status || ""} onChange={handleInputChange}>
//                         <MenuItem value="Active">Active</MenuItem>
//                         <MenuItem value="Inactive">Inactive</MenuItem>
//                         <MenuItem value="Complete">Complete</MenuItem>
//                     </TextField>
//                     {/* <Avatar src={selectedImage ? URL.createObjectURL(selectedImage) : `${PUBLIC_API_URI}${editEvent.eventImage}`} alt="Event Image" variant="rounded" sx={{ width: "100%", height: "200px", mb: 2 }} /> */}
//                     <Box sx={{ mb: 2 }}>
//                         <FormControlLabel
//                             control={
//                                 <Checkbox
//                                     name="showBanner"
//                                     checked={editEvent.showBanner}
//                                     onChange={handleCheckboxChange}
//                                 />
//                             }
//                             label="Show Banner In Home"
//                         />
//                     </Box>
//                     <Avatar
//                         src={selectedImage ? URL.createObjectURL(selectedImage) : `${PUBLIC_API_URI}${editEvent.eventImage}`}
//                         alt="Event Image"
//                         variant="rounded"
//                         sx={{ width: "100%", height: "200px", objectFit: "cover", mb: 2 }}
//                     />
//                     <Button variant="contained" component="label" fullWidth>
//                         Upload New Image
//                         <input type="file" hidden onChange={handleImageChange} />
//                     </Button>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
//                     <Button onClick={handleSaveChanges} color="primary">Save Changes</Button>
//                 </DialogActions>
//             </Dialog>
//         </Box >
//     );
// };

// export default SingleEvent;

//working NEW CODE =-----------------------------------------------------------
// import {
//     Avatar,
//     Box,
//     Button,
//     Checkbox,
//     Chip,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     FormControl,
//     FormControlLabel,
//     Grid,
//     InputLabel,
//     MenuItem,
//     Paper,
//     TextField,
//     Typography,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { fetchEventDetails, updateEventDetails } from "../api/event";
// import { formatDateTime, PUBLIC_API_URI } from "../api/config";
// import { showToast } from "../api/toast";
// import { FiEdit } from "react-icons/fi";
// import ReactQuill from "react-quill";
// import Breadcrumb from "../components/common/Breadcrumb";
// import { fetchAllActiveTaxTypes } from "../api/masterData/taxType";
// import { fetchEventAttendenceDetails } from "../api/getKeeper";
// import Table from "../components/Table";

// const SingleEvent = () => {
//     const { id } = useParams();
//     const [event, setEvent] = useState({});
//     const [isEditDialogOpen, setEditDialogOpen] = useState(false);
//     const [editEvent, setEditEvent] = useState({ memberPrices: {} });
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [taxTypes, setTaxTypes] = useState([]);


//     const [attendance, setAttendance] = useState([]);
//     const [loading, setLoading] = useState(null);

//     // Define table columns
//     const columns = [
//         { accessorKey: "name", header: "Name" },
//         { accessorKey: "email", header: "Email" },
//         { accessorKey: "mobileNumber", header: "Mobile Number" },

//         { accessorKey: "attendanceStatus", header: "Status" },
//         { accessorKey: "qrCode", header: "QR Code" },
//         { accessorKey: "gatekeeperName", header: "Gate Keeper Name" },
//         {
//             accessorKey: "scannedAt",
//             header: "Scanned At",
//             Cell: ({ cell }) => formatDateTime(cell.getValue()),
//         },
//     ];

//     // Fetch attendance data for the event
//     useEffect(() => {
//         fetchAllAttendance(id);
//     }, [id]);

//     const fetchAllAttendance = async (id) => {
//         setLoading(true)
//         try {
//             const response = await fetchEventAttendenceDetails(id);
//             if (response.status === 200) {
//                 setAttendance(response.data.attendees);
//                 setLoading(false)
//             } else {
//                 setAttendance([]);
//                 setLoading(false)
//             }
//         } catch (err) {
//             console.error("Error fetching attendance:", err);
//             setAttendance([]);
//             setLoading(false)
//         }
//     };


//     // Fetch event details and tax types
//     useEffect(() => {
//         const fetchEventData = async () => {
//             await getEventById(id);
//             getEditEventById(id);
//             await fetchTaxTypes();
//         };
//         fetchEventData();
//     }, [id]);

//     const getEventById = async (eventId) => {
//         try {
//             const response = await fetchEventDetails(eventId);
//             const eventData = response.data.event;
//             setEvent(eventData);
//             // setEditEvent({ ...eventData, taxTypes: eventData.taxTypes || [] });
//         } catch (error) {
//             showToast("Failed to fetch event details.", "error");
//         }
//     };


//     const fetchTaxTypes = async () => {
//         try {
//             const response = await fetchAllActiveTaxTypes();
//             setTaxTypes(response?.data?.data || []);
//         } catch (error) {
//             showToast("Failed to fetch tax types.", "error");
//         }
//     };


//     const getEditEventById = async (eventId) => {
//         try {
//             const response = await fetchEventDetails(eventId, "edit");
//             const eventData = response.data.event;
//             // setEvent(eventData);
//             setEditEvent({ ...eventData, taxTypes: eventData.taxTypes || [] });
//         } catch (error) {
//             showToast("Failed to fetch event details.", "error");
//         }
//     };


//     // useEffect(() => {
//     //     getEventById(id);
//     //     fetchTaxTypes();
//     // }, [id]);

//     // Format time to "01:25 PM"
//     const formatTime = (timeString) => {
//         if (!timeString) return "N/A";
//         const [hour, minute] = timeString.split(':').map(Number);
//         const date = new Date();
//         date.setHours(hour, minute);
//         return date.toLocaleTimeString(undefined, {
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: true,
//         });
//     };

//     // Handle edit button click
//     const handleEditClick = () => {
//         setEditDialogOpen(true);
//     };

//     // Handle dialog close
//     const handleDialogClose = () => {
//         setEditDialogOpen(false);
//         setSelectedImage(null);
//     };

//     // // Handle form input changes
//     // const handleInputChange = (e) => {
//     //     const { name, value } = e.target;
//     //     setEditEvent({ ...editEvent, [name]: value });
//     // };

//     // Handle input changes and calculate totalAvailableTickets
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;

//         // Update the specific field
//         const updatedEventData = {
//             ...editEvent,
//             [name]: value,
//         };

//         // Calculate the total available tickets if the relevant fields are updated
//         if (name === "allottedTicketsMember" || name === "allottedTicketsGuest") {
//             updatedEventData.totalAvailableTickets =
//                 parseInt(updatedEventData.allottedTicketsMember || 0) +
//                 parseInt(updatedEventData.allottedTicketsGuest || 0);
//         }

//         setEditEvent(updatedEventData);
//     };


//     // Handle image file selection
//     const handleImageChange = (e) => {
//         setSelectedImage(e.target.files[0]);
//     };

//     // Handle save changes
//     const handleSaveChanges = async () => {
//         try {
//             const formData = new FormData();
//             Object.entries(editEvent).forEach(([key, value]) => {
//                 if (key === "memberPrices") {
//                     formData.append(
//                         "memberPrices",
//                         JSON.stringify(value) // Send memberPrices as a JSON string
//                     );
//                 } else {
//                     formData.append(key, value);
//                 }
//             });

//             // Append new image if selected
//             if (selectedImage) {
//                 formData.append("eventImage", selectedImage);
//             }

//             const response = await updateEventDetails(id, formData);
//             if (response.status === 200 && response.data.event) {
//                 setEvent(response.data.event);
//                 setEditDialogOpen(false);
//                 showToast("Event details updated successfully!", "success");
//             }
//         } catch (error) {
//             console.error("Failed to update event details:", error);
//             showToast("Failed to update event details. Please try again.", "error");
//         }
//     };

//     // Get color for status
//     const getStatusColor = (status) => {
//         switch (status) {
//             case "Active":
//                 return "primary";
//             case "Inactive":
//                 return "error";
//             case "Complete":
//                 return "success";
//             default:
//                 return "default";
//         }
//     };

//     // Get color for RSVP status
//     const getRsvpColor = (rsvpStatus) => {
//         switch (rsvpStatus) {
//             case "Attending":
//                 return "success";
//             case "Not Attending":
//                 return "error";
//             case "Maybe":
//                 return "warning";
//             case "Pending":
//                 return "info";
//             case "Cancelled":
//                 return "default";
//             case "N/A":
//                 return "error";
//             default:
//                 return "default";
//         }
//     };
//     const handleChangeTaxTypes = (event) => {
//         const { value, checked } = event.target;
//         setEditEvent((prev) => ({
//             ...prev,
//             taxTypes: checked
//                 ? [...prev.taxTypes, value]
//                 : prev.taxTypes.filter((taxType) => taxType !== value),
//         }));
//     };

//     const handleCheckboxChange = (e) => {
//         const { name, checked } = e.target;
//         setEditEvent((prev) => ({ ...prev, [name]: checked }));
//     };

//     console.log(editEvent, "editEvent")
//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Breadcrumb />
//             <Typography variant="h4" sx={{ mb: 2 }}>
//                 Event Details
//             </Typography>
//             <Paper sx={{ p: 3, mb: 3, borderRadius: "12px", border: "1px solid", borderColor: "divider" }}>
//                 <Grid container spacing={4}>
//                     <Grid item xs={12} md={5}>
//                         <Avatar
//                             src={event.eventImage ? `${PUBLIC_API_URI}${event.eventImage}` : ""}
//                             alt={event.eventTitle}
//                             variant="rounded"
//                             sx={{ width: "100%", height: "300px", objectFit: "cover" }}
//                         />
//                     </Grid>
//                     <Grid item xs={12} md={7}>
//                         <Typography variant="h4">{event.eventTitle}</Typography>
//                         <Typography variant="subtitle1">{event.eventSubtitle}</Typography>
//                         <Typography variant="body1">
//                             <strong>Date:</strong> {new Date(event.eventStartDate).toLocaleDateString()} - {new Date(event.eventEndDate).toLocaleDateString()}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Time:</strong> {formatTime(event.startTime)} - {formatTime(event.endTime)}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Total Available Tickets:</strong> {event.totalAvailableTickets}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Allotted Tickets for Members:</strong> {event.allottedTicketsMember}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Allotted Tickets for Guests:</strong> {event.allottedTicketsGuest}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Base Ticket Price:</strong> ₹ {event.ticketPrice}
//                         </Typography>

//                         {/* Member Prices Section */}
//                         {event.memberPrices &&
//                             Object.entries(event.memberPrices).map(([memberType, details], index) => (
//                                 <Box key={index} sx={{ mb: 2 }}>
//                                     <Typography variant="body1">
//                                         <strong>{memberType.replace(/([A-Z])/g, " $1").trim()}:</strong> ₹ {details.price}
//                                     </Typography>
//                                     {details.taxTypes && details.taxTypes.length > 0 ? (
//                                         details.taxTypes.map((tax, taxIndex) => (
//                                             <Typography key={taxIndex} variant="body2" sx={{ ml: 2 }}>
//                                                 - <strong>{tax.name}:</strong> {tax.percentage}%
//                                             </Typography>
//                                         ))
//                                     ) : (
//                                         <Typography variant="body2" sx={{ ml: 2 }}>No tax information available.</Typography>
//                                     )}
//                                 </Box>
//                             ))}

//                         <Typography variant="body1">
//                             <strong>Location:</strong> {event.location}
//                         </Typography>
//                         <Typography variant="body1" sx={{ color: getStatusColor(event.status) }}>
//                             <strong>Status:</strong> {event.status}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Show Banner Home:</strong> {event.showBanner ? "Yes" : "No"}
//                         </Typography>

//                         {/* Booking Permissions */}
//                         <Box>
//                             <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
//                                 Booking Permissions
//                             </Typography>
//                             <Grid container spacing={2}>
//                                 <Grid item xs={6} sm={4}>
//                                     <Typography variant="body2">
//                                         <strong>Primary Member:</strong> {event.bookingPermissionPrimary ? "Yes" : "No"}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={6} sm={4}>
//                                     <Typography variant="body2">
//                                         <strong>Spouse:</strong> {event.bookingPermissionSpouse ? "Yes" : "No"}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={6} sm={4}>
//                                     <Typography variant="body2">
//                                         <strong>Son:</strong> {event.bookingPermissionSon ? "Yes" : "No"}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={6} sm={4}>
//                                     <Typography variant="body2">
//                                         <strong>Daughter:</strong> {event.bookingPermissionDaughter ? "Yes" : "No"}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={6} sm={4}>
//                                     <Typography variant="body2">
//                                         <strong>Dependent Member:</strong> {event.bookingPermissionDependent ? "Yes" : "No"}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={6} sm={4}>
//                                     <Typography variant="body2">
//                                         <strong>Senior Dependent Member:</strong> {event.bookingPermissionSeniorDependent ? "Yes" : "No"}
//                                     </Typography>
//                                 </Grid>
//                             </Grid>
//                         </Box>

//                         <Button variant="contained" color="primary" startIcon={<FiEdit />} onClick={handleEditClick}>
//                             Edit Event
//                         </Button>
//                     </Grid>

//                 </Grid>
//             </Paper>

//             <div>Attendant Member List</div>
//             <Table
//                 data={attendance}
//                 fields={columns}
//                 numberOfRows={attendance.length}
//                 enableTopToolBar
//                 enableBottomToolBar
//                 enablePagination
//                 enableRowSelection
//                 enableColumnFilters
//                 enableEditing
//                 enableColumnDragging
//                 isLoading={loading}
//             />

//             {/* Edit Dialog */}
//             <Dialog open={isEditDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
//                 <DialogTitle>Edit Event Details</DialogTitle>
//                 <DialogContent>
//                     <TextField label="Event Title" fullWidth margin="dense" name="eventTitle" value={editEvent.eventTitle || ""} onChange={handleInputChange} />
//                     <TextField label="Event Subtitle" fullWidth margin="dense" name="eventSubtitle" value={editEvent.eventSubtitle || ""} onChange={handleInputChange} />
//                     <TextField label="Event Start Date" type="date" fullWidth margin="dense" name="eventStartDate" value={editEvent.eventStartDate?.slice(0, 10) || ""}
//                         inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates
//                         onChange={handleInputChange} />
//                     <TextField label="Event End Date" type="date"
//                         fullWidth margin="dense" name="eventEndDate" value={editEvent.eventEndDate?.slice(0, 10) || ""}
//                         inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates
//                         onChange={handleInputChange} />
//                     <TextField label="Start Time" type="time" fullWidth margin="dense" name="startTime" value={editEvent.startTime || ""} onChange={handleInputChange} />
//                     <TextField label="End Time" type="time" fullWidth margin="dense" name="endTime" value={editEvent.endTime || ""} onChange={handleInputChange} />
//                     <TextField label="Total Available Tickets" fullWidth margin="dense" name="totalAvailableTickets" value={editEvent.totalAvailableTickets || ""} disabled />
//                     <TextField label="Allotted Tickets for Members" fullWidth margin="dense" name="allottedTicketsMember" value={editEvent.allottedTicketsMember || ""} onChange={handleInputChange} />
//                     <TextField label="Allotted Tickets for Guests" fullWidth margin="dense" name="allottedTicketsGuest" value={editEvent.allottedTicketsGuest || ""} onChange={handleInputChange} />
//                     <TextField label="Ticket Price" fullWidth margin="dense" name="ticketPrice" value={editEvent.ticketPrice || ""} onChange={handleInputChange} />
//                     <TextField label="Primary Member Ticket Price" fullWidth margin="dense" name="primaryMemberPrice" value={editEvent.primaryMemberPrice || ""} onChange={handleInputChange} />
//                     <TextField label="Dependent Member Ticket Price" fullWidth margin="dense" name="dependentMemberPrice" value={editEvent.dependentMemberPrice || ""} onChange={handleInputChange} />
//                     <TextField label="Guest Member Ticket Price" fullWidth margin="dense" name="guestMemberPrice" value={editEvent.guestMemberPrice || ""} onChange={handleInputChange} />
//                     <Box sx={{ mb: 2 }}>
//                         <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Booking Permissioin</InputLabel>

//                         <FormControl fullWidth>
//                             <FormControlLabel
//                                 control={
//                                     <Checkbox
//                                         name="bookingPermissionPrimary"
//                                         checked={editEvent.bookingPermissionPrimary}
//                                         onChange={handleCheckboxChange}
//                                     />
//                                 }
//                                 label="Primary Member"
//                             />
//                             <FormControlLabel
//                                 control={
//                                     <Checkbox
//                                         name="bookingPermissionSpouse"
//                                         checked={editEvent.bookingPermissionSpouse}
//                                         onChange={handleCheckboxChange}
//                                     />
//                                 }
//                                 label="Spouse"
//                             />
//                             <FormControlLabel
//                                 control={
//                                     <Checkbox
//                                         name="bookingPermissionSon"
//                                         checked={editEvent.bookingPermissionSon}
//                                         onChange={handleCheckboxChange}
//                                     />
//                                 }
//                                 label="Son"
//                             />
//                             <FormControlLabel
//                                 control={
//                                     <Checkbox
//                                         name="bookingPermissionDaughter"
//                                         checked={editEvent.bookingPermissionDaughter}
//                                         onChange={handleCheckboxChange}
//                                     />
//                                 }
//                                 label="Daughter"
//                             />
//                             <FormControlLabel
//                                 control={
//                                     <Checkbox
//                                         name="bookingPermissionSeniorDependent"
//                                         checked={editEvent.bookingPermissionSeniorDependent}
//                                         onChange={handleCheckboxChange}
//                                     />
//                                 }
//                                 label="Senior Dependent Member"
//                             />
//                         </FormControl>
//                     </Box>
//                     <Box sx={{ mb: 2 }}>
//                         <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Event Tax Types</InputLabel>
//                         {/* <FormControl fullWidth sx={{ mt: 2 }}>
//                             <div>
//                                 {taxTypes.map((taxType) => (
//                                     <FormControlLabel
//                                         key={taxType._id}
//                                         control={
//                                             <Checkbox
//                                                 checked={editEvent.taxTypes.includes(taxType._id)}
//                                                 onChange={handleChangeTaxTypes}
//                                                 value={taxType._id}
//                                             />
//                                         }
//                                         label={taxType.name}
//                                     />
//                                 ))}
//                             </div>
//                         </FormControl> */}
//                     </Box>
//                     <Box sx={{ mb: 2 }}>
//                         <InputLabel sx={{ fontWeight: "bold", mt: 2 }}>About Event</InputLabel>
//                         <ReactQuill
//                             value={editEvent.aboutEvent || ""}
//                             onChange={(value) => setEditEvent({ ...editEvent, aboutEvent: value })}
//                             style={{ height: "120px", marginBottom: "100px" }}
//                         />
//                     </Box>
//                     <TextField label="Status" select fullWidth margin="dense" name="status" value={editEvent.status || ""} onChange={handleInputChange}>
//                         <MenuItem value="Active">Active</MenuItem>
//                         <MenuItem value="Inactive">Inactive</MenuItem>
//                         <MenuItem value="Complete">Complete</MenuItem>
//                     </TextField>
//                     {/* <Avatar src={selectedImage ? URL.createObjectURL(selectedImage) : `${PUBLIC_API_URI}${editEvent.eventImage}`} alt="Event Image" variant="rounded" sx={{ width: "100%", height: "200px", mb: 2 }} /> */}
//                     <Box sx={{ mb: 2 }}>
//                         <FormControlLabel
//                             control={
//                                 <Checkbox
//                                     name="showBanner"
//                                     checked={editEvent.showBanner}
//                                     onChange={handleCheckboxChange}
//                                 />
//                             }
//                             label="Show Banner In Home"
//                         />
//                     </Box>
//                     <Avatar
//                         src={selectedImage ? URL.createObjectURL(selectedImage) : `${PUBLIC_API_URI}${editEvent.eventImage}`}
//                         alt="Event Image"
//                         variant="rounded"
//                         sx={{ width: "100%", height: "200px", objectFit: "cover", mb: 2 }}
//                     />
//                     <Button variant="contained" component="label" fullWidth>
//                         Upload New Image
//                         <input type="file" hidden onChange={handleImageChange} />
//                     </Button>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
//                     <Button onClick={handleSaveChanges} color="primary">Save Changes</Button>
//                 </DialogActions>
//             </Dialog>
//         </Box >
//     );
// };

// export default SingleEvent;


