// // import {
// //     Avatar,
// //     Box,
// //     Button,
// //     Chip,
// //     Dialog,
// //     DialogActions,
// //     DialogContent,
// //     DialogTitle,
// //     Grid,
// //     MenuItem,
// //     Paper,
// //     TextField,
// //     Typography,
// // } from "@mui/material";
// // import React, { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import { fetchEventDetails, updateEventDetails } from "../api/event";
// // import { PUBLIC_API_URI } from "../api/config";
// // import { showToast } from "../api/toast";
// // import { FiEdit } from "react-icons/fi";

// // const SingleRoom = () => {
// //     const { id } = useParams();
// //     const [event, setEvent] = useState({});
// //     const [isEditDialogOpen, setEditDialogOpen] = useState(false);
// //     const [editEvent, setEditEvent] = useState({});
// //     const [selectedImage, setSelectedImage] = useState(null);

// //     // Fetch event details by ID
// //     const getEventById = async (id) => {
// //         try {
// //             const response = await fetchEventDetails(id);
// //             setEvent(response.data.event);
// //             setEditEvent(response.data.event);
// //         } catch (error) {
// //             console.error("Failed to fetch event details:", error);
// //         }
// //     };

// //     useEffect(() => {
// //         getEventById(id);
// //     }, [id]);

// //     // Format time to "01:25 PM"
// //     const formatTime = (timeString) => {
// //         if (!timeString) return "N/A";
// //         const [hour, minute] = timeString.split(':').map(Number);
// //         const date = new Date();
// //         date.setHours(hour, minute);
// //         return date.toLocaleTimeString(undefined, {
// //             hour: '2-digit',
// //             minute: '2-digit',
// //             hour12: true,
// //         });
// //     };

// //     // Handle edit button click
// //     const handleEditClick = () => {
// //         setEditDialogOpen(true);
// //     };

// //     // Handle dialog close
// //     const handleDialogClose = () => {
// //         setEditDialogOpen(false);
// //         setSelectedImage(null);
// //     };

// //     // Handle form input changes
// //     const handleInputChange = (e) => {
// //         const { name, value } = e.target;
// //         setEditEvent({ ...editEvent, [name]: value });
// //     };

// //     // Handle image file selection
// //     const handleImageChange = (e) => {
// //         setSelectedImage(e.target.files[0]);
// //     };

// //     // Handle save changes
// //     const handleSaveChanges = async () => {
// //         try {
// //             const formData = new FormData();
// //             Object.entries(editEvent).forEach(([key, value]) => {
// //                 formData.append(key, value);
// //             });

// //             // Append new image if selected
// //             if (selectedImage) {
// //                 formData.append("eventImage", selectedImage);
// //             }

// //             const response = await updateEventDetails(id, formData);
// //             if (response.status === 200 && response.data.event) {
// //                 setEvent(response.data.event);
// //                 setEditEvent(response.data.event);
// //                 setEditDialogOpen(false);
// //                 showToast("Event details updated successfully!", "success");
// //             }
// //         } catch (error) {
// //             console.error("Failed to update event details:", error);
// //             showToast("Failed to update event details. Please try again.", "error");
// //         }
// //     };

// //     // Get color for status
// //     const getStatusColor = (status) => {
// //         switch (status) {
// //             case "Active":
// //                 return "primary";
// //             case "Inactive":
// //                 return "error";
// //             case "Complete":
// //                 return "success";
// //             default:
// //                 return "default";
// //         }
// //     };

// //     // Get color for RSVP status
// //     const getRsvpColor = (rsvpStatus) => {
// //         switch (rsvpStatus) {
// //             case "Attending":
// //                 return "success";
// //             case "Not Attending":
// //                 return "error";
// //             case "Maybe":
// //                 return "warning";
// //             case "Pending":
// //                 return "info";
// //             case "Cancelled":
// //                 return "default";
// //             case "N/A":
// //                 return "error";
// //             default:
// //                 return "default";
// //         }
// //     };


// //     return (
// //         <Box sx={{ pt: "80px", pb: "20px" }}>
// //             <Typography variant="h4" sx={{ mb: 2 }}>
// //                 Event Details
// //             </Typography>
// //             <Paper sx={{ p: 3, mb: 3, borderRadius: "12px", border: "1px solid", borderColor: "divider" }}>
// //                 <Grid container spacing={4}>
// //                     <Grid item xs={12} md={5}>
// //                         <Avatar
// //                             src={event.eventImage ? `${PUBLIC_API_URI}${event.eventImage}` : ""}
// //                             alt={event.eventTitle}
// //                             variant="rounded"
// //                             sx={{ width: "100%", height: "300px", objectFit: "cover" }}
// //                         />
// //                     </Grid>
// //                     <Grid item xs={12} md={7}>
// //                         <Typography variant="h4">{event.eventTitle}</Typography>
// //                         <Typography variant="subtitle1">{event.eventSubtitle}</Typography>
// //                         <Typography variant="body1">
// //                             <strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}
// //                         </Typography>
// //                         <Typography variant="body1">
// //                             <strong>Time:</strong> {formatTime(event.startTime)} - {formatTime(event.endTime)}
// //                         </Typography>
// //                         <Typography variant="body1">
// //                             <strong>Ticket Price:</strong> {event.currency} {event.ticketPrice}
// //                         </Typography>
// //                         <Typography variant="body1">
// //                             <strong>Location:</strong> {event.location}
// //                         </Typography>
// //                         <Typography variant="body1" sx={{ color: getRsvpColor(event.rsvpStatus) }}>
// //                             <strong>RSVP Status:</strong> {event.rsvpStatus}
// //                         </Typography>
// //                         <Typography variant="body1" sx={{ color: getStatusColor(event.status) }}>
// //                             <strong>Status:</strong> {event.status}
// //                         </Typography>
// //                         <Button variant="contained" color="primary" startIcon={<FiEdit />} onClick={handleEditClick}>
// //                             Edit Event
// //                         </Button>
// //                     </Grid>
// //                 </Grid>
// //             </Paper>

// //             {/* Edit Dialog */}
// //             <Dialog open={isEditDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
// //                 <DialogTitle>Edit Event Details</DialogTitle>
// //                 <DialogContent>
// //                     <TextField label="Event Title" fullWidth margin="dense" name="eventTitle" value={editEvent.eventTitle || ""} onChange={handleInputChange} />
// //                     <TextField label="Event Subtitle" fullWidth margin="dense" name="eventSubtitle" value={editEvent.eventSubtitle || ""} onChange={handleInputChange} />
// //                     <TextField label="Event Date" type="date" fullWidth margin="dense" name="eventDate" value={editEvent.eventDate?.slice(0, 10) || ""} onChange={handleInputChange} />
// //                     <TextField label="Start Time" type="time" fullWidth margin="dense" name="startTime" value={editEvent.startTime || ""} onChange={handleInputChange} />
// //                     <TextField label="End Time" type="time" fullWidth margin="dense" name="endTime" value={editEvent.endTime || ""} onChange={handleInputChange} />
// //                     <TextField label="Status" select fullWidth margin="dense" name="status" value={editEvent.status || ""} onChange={handleInputChange}>
// //                         <MenuItem value="Active">Active</MenuItem>
// //                         <MenuItem value="Inactive">Inactive</MenuItem>
// //                         <MenuItem value="Complete">Complete</MenuItem>
// //                     </TextField>
// //                     <TextField label="RSVP Status" select fullWidth margin="dense" name="rsvpStatus" value={editEvent.rsvpStatus || ""} onChange={handleInputChange}>
// //                         <MenuItem value="Attending">Attending</MenuItem>
// //                         <MenuItem value="Not Attending">Not Attending</MenuItem>
// //                         <MenuItem value="Maybe">Maybe</MenuItem>
// //                         <MenuItem value="Pending">Pending</MenuItem>
// //                         <MenuItem value="Cancelled">Cancelled</MenuItem>
// //                         <MenuItem value="N/A">N/A</MenuItem>
// //                     </TextField>
// //                     {/* <Avatar src={selectedImage ? URL.createObjectURL(selectedImage) : `${PUBLIC_API_URI}${editEvent.eventImage}`} alt="Event Image" variant="rounded" sx={{ width: "100%", height: "200px", mb: 2 }} /> */}
// //                     <Avatar
// //                         src={selectedImage ? URL.createObjectURL(selectedImage) : `${PUBLIC_API_URI}${editEvent.eventImage}`}
// //                         alt="Event Image"
// //                         variant="rounded"
// //                         sx={{ width: "100%", height: "200px", objectFit: "cover", mb: 2 }}
// //                     />
// //                     <Button variant="contained" component="label" fullWidth>
// //                         Upload New Image
// //                         <input type="file" hidden onChange={handleImageChange} />
// //                     </Button>
// //                 </DialogContent>
// //                 <DialogActions>
// //                     <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
// //                     <Button onClick={handleSaveChanges} color="primary">Save Changes</Button>
// //                 </DialogActions>
// //             </Dialog>
// //         </Box >
// //     );
// // };

// // export default SingleRoom;

// ///mmmmmmmmmmmmmmmm

// // import {
// //     Avatar,
// //     Box,
// //     Button,
// //     Dialog,
// //     DialogActions,
// //     DialogContent,
// //     DialogTitle,
// //     Grid,
// //     MenuItem,
// //     Paper,
// //     TextField,
// //     Typography,
// // } from "@mui/material";
// // import React, { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import { fetchRoomDetails, updateRoomDetails } from "../api/room";
// // import { PUBLIC_API_URI } from "../api/config";
// // import { showToast } from "../api/toast";
// // import { FiEdit } from "react-icons/fi";

// // const SingleRoom = () => {
// //     const { id } = useParams();
// //     const [room, setRoom] = useState({});
// //     const [isEditDialogOpen, setEditDialogOpen] = useState(false);
// //     const [editRoom, setEditRoom] = useState({});

// //     // Fetch room details by ID
// //     const getRoomById = async (id) => {
// //         try {
// //             const response = await fetchRoomDetails(id);
// //             setRoom(response.data.room);
// //             setEditRoom(response.data.room);
// //         } catch (error) {
// //             console.error("Failed to fetch room details:", error);
// //             showToast("Failed to fetch room details. Please try again.", "error");
// //         }
// //     };

// //     useEffect(() => {
// //         getRoomById(id);
// //     }, [id]);

// //     // Handle edit button click
// //     const handleEditClick = () => {
// //         setEditDialogOpen(true);
// //     };

// //     // Handle dialog close
// //     const handleDialogClose = () => {
// //         setEditDialogOpen(false);
// //     };

// //     // Handle form input changes
// //     const handleInputChange = (e) => {
// //         const { name, value } = e.target;
// //         setEditRoom({ ...editRoom, [name]: value });
// //     };

// //     // Handle save changes
// //     const handleSaveChanges = async () => {
// //         try {
// //             const response = await updateRoomDetails(id, editRoom);
// //             if (response.status === 200 && response.data.room) {
// //                 setRoom(response.data.room);
// //                 setEditRoom(response.data.room);
// //                 setEditDialogOpen(false);
// //                 showToast("Room details updated successfully!", "success");
// //             }
// //         } catch (error) {
// //             console.error("Failed to update room details:", error);
// //             showToast("Failed to update room details. Please try again.", "error");
// //         }
// //     };

// //     // Get color for room status
// //     const getStatusColor = (status) => {
// //         switch (status) {
// //             case "Available":
// //                 return "success";
// //             case "Booked":
// //                 return "warning";
// //             case "Under Maintenance":
// //                 return "error";
// //             default:
// //                 return "default";
// //         }
// //     };

// //     return (
// //         <Box sx={{ pt: "80px", pb: "20px" }}>
// //             <Typography variant="h4" sx={{ mb: 2 }}>
// //                 Room Details
// //             </Typography>
// //             <Paper sx={{ p: 3, mb: 3, borderRadius: "12px", border: "1px solid", borderColor: "divider" }}>
// //                 <Grid container spacing={4}>
// //                     <Grid item xs={12} md={5}>
// //                         <Avatar
// //                             src={room.images?.[0] ? `${PUBLIC_API_URI}${room.images[0]}` : ""}
// //                             alt={room.roomName}
// //                             variant="rounded"
// //                             sx={{ width: "100%", height: "300px", objectFit: "cover" }}
// //                         />
// //                     </Grid>
// //                     <Grid item xs={12} md={7}>
// //                         <Typography variant="h4">{room.roomName}</Typography>
// //                         <Typography variant="body1">
// //                             <strong>Room Type:</strong> {room.roomType?.name}
// //                         </Typography>
// //                         <Typography variant="body1">
// //                             <strong>Room Number:</strong> {room.roomNumber}
// //                         </Typography>
// //                         <Typography variant="body1">
// //                             <strong>Floor Number:</strong> {room.floorNumber}
// //                         </Typography>
// //                         <Typography variant="body1">
// //                             <strong>Price Range:</strong> ₹{room.priceRange?.minPrice} - ₹{room.priceRange?.maxPrice}
// //                         </Typography>
// //                         <Typography variant="body1">
// //                             <strong>Capacity:</strong> {room.capacity} guests
// //                         </Typography>
// //                         <Typography variant="body1">
// //                             <strong>Amenities:</strong> {room.amenities?.join(", ")}
// //                         </Typography>
// //                         <Typography variant="body1">
// //                             <strong>Features:</strong> Smoking Allowed: {room.features?.smokingAllowed ? "Yes" : "No"}, Pet-Friendly: {room.features?.petFriendly ? "Yes" : "No"}, Accessible: {room.features?.accessible ? "Yes" : "No"}
// //                         </Typography>
// //                         <Typography variant="body1" sx={{ color: getStatusColor(room.status) }}>
// //                             <strong>Status:</strong> {room.status}
// //                         </Typography>
// //                         <Typography variant="body1">
// //                             <strong>Description:</strong> {room.description}
// //                         </Typography>
// //                         <Button variant="contained" color="primary" startIcon={<FiEdit />} onClick={handleEditClick}>
// //                             Edit Room
// //                         </Button>
// //                     </Grid>
// //                 </Grid>
// //             </Paper>

// //             {/* Edit Dialog */}
// //             <Dialog open={isEditDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
// //                 <DialogTitle>Edit Room Details</DialogTitle>
// //                 <DialogContent>
// //                     <TextField label="Room Name" fullWidth margin="dense" name="roomName" value={editRoom.roomName || ""} onChange={handleInputChange} />
// //                     <TextField label="Room Number" type="number" fullWidth margin="dense" name="roomNumber" value={editRoom.roomNumber || ""} onChange={handleInputChange} />
// //                     <TextField label="Floor Number" type="number" fullWidth margin="dense" name="floorNumber" value={editRoom.floorNumber || ""} onChange={handleInputChange} />
// //                     <TextField label="Capacity" type="number" fullWidth margin="dense" name="capacity" value={editRoom.capacity || ""} onChange={handleInputChange} />
// //                     <TextField label="Status" select fullWidth margin="dense" name="status" value={editRoom.status || ""} onChange={handleInputChange}>
// //                         <MenuItem value="Available">Available</MenuItem>
// //                         <MenuItem value="Booked">Booked</MenuItem>
// //                         <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
// //                     </TextField>
// //                     <TextField label="Description" fullWidth margin="dense" multiline rows={3} name="description" value={editRoom.description || ""} onChange={handleInputChange} />
// //                 </DialogContent>
// //                 <DialogActions>
// //                     <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
// //                     <Button onClick={handleSaveChanges} color="primary">Save Changes</Button>
// //                 </DialogActions>
// //             </Dialog>
// //         </Box>
// //     );
// // };

// // export default SingleRoom;
// //---------------------------ddddddddddddddddddddddd
// // import {
// //     Avatar,
// //     Box,
// //     Button,
// //     Dialog,
// //     DialogActions,
// //     DialogContent,
// //     DialogTitle,
// //     Grid,
// //     IconButton,
// //     MenuItem,
// //     Paper,
// //     TextField,
// //     Typography,
// // } from "@mui/material";
// // import React, { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import { fetchRoomDetails, updateRoomDetails, } from "../api/room";
// // import { fetchAllCategories } from "../api/category";
// // import { PUBLIC_API_URI } from "../api/config";
// // import { showToast } from "../api/toast";
// // import { FiEdit, FiTrash } from "react-icons/fi";

// // const SingleRoom = () => {
// //     const { id } = useParams();
// //     const [room, setRoom] = useState({});
// //     const [editRoom, setEditRoom] = useState({});
// //     const [categories, setCategories] = useState([]);
// //     const [isEditDialogOpen, setEditDialogOpen] = useState(false);

// //     // Fetch room details and categories
// //     const getRoomById = async () => {
// //         try {
// //             const response = await fetchRoomDetails(id);
// //             setRoom(response.data.room);
// //             setEditRoom(response.data.room);
// //         } catch (error) {
// //             showToast("Failed to fetch room details.", "error");
// //         }
// //     };

// //     const getCategories = async () => {
// //         try {
// //             const response = await fetchAllCategories();
// //             setCategories(response.data.categories || []);
// //         } catch (error) {
// //             showToast("Failed to fetch categories.", "error");
// //         }
// //     };

// //     useEffect(() => {
// //         getRoomById();
// //         getCategories();
// //     }, [id]);

// //     // Handle input changes
// //     const handleInputChange = (e) => {
// //         const { name, value } = e.target;
// //         setEditRoom({ ...editRoom, [name]: value });
// //     };

// //     // Handle JSON input changes for nested fields
// //     const handleJsonInputChange = (e, field) => {
// //         try {
// //             const value = JSON.parse(e.target.value);
// //             setEditRoom({ ...editRoom, [field]: value });
// //         } catch (error) {
// //             showToast("Invalid JSON format.", "error");
// //         }
// //     };

// //     // Handle amenities change
// //     const handleAmenitiesChange = (e) => {
// //         setEditRoom({ ...editRoom, amenities: e.target.value.split(",") });
// //     };

// //     // Handle image deletion
// //     const handleDeleteImage = async (index) => {
// //         try {
// //             const imagePath = editRoom.images[index];
// //             // await deleteRoomImage(id, imagePath);
// //             getRoomById();
// //             showToast("Image deleted successfully.", "success");
// //         } catch (error) {
// //             showToast("Failed to delete image.", "error");
// //         }
// //     };

// //     // Handle save changes for room details
// //     const handleSaveChanges = async () => {
// //         try {
// //             const response = await updateRoomDetails(id, editRoom);
// //             if (response.status === 200) {
// //                 setRoom(response.data.room);
// //                 setEditRoom(response.data.room);
// //                 setEditDialogOpen(false);
// //                 showToast("Room updated successfully.", "success");
// //             }
// //         } catch (error) {
// //             showToast("Failed to update room details.", "error");
// //         }
// //     };

// //     return (
// //         <Box sx={{ pt: "80px", pb: "20px" }}>
// //             <Typography variant="h4">Room Details</Typography>
// //             <Paper sx={{ p: 3, mb: 3 }}>
// //                 <Grid container spacing={4}>
// //                     <Grid item xs={12} md={5}>
// <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
//     {room.images?.map((image, index) => (
//         <Box key={index} sx={{ position: "relative" }}>
//             <Avatar
//                 src={`${PUBLIC_API_URI}${image}`}
//                 sx={{ width: 120, height: 120 }}
//             />
//             <IconButton onClick={() => handleDeleteImage(index)}>
//                 <FiTrash />
//             </IconButton>
//         </Box>
//     ))}
// </Box>
// //                     </Grid>
// //                     <Typography variant="h5">{room.roomName}</Typography>
// //                     <Typography>Room Number: {room.roomNumber}</Typography>
// //                     <Typography>Floor Number: {room.floorNumber}</Typography>
// //                     <Typography>Room Type: {room.roomType?.name}</Typography>
// //                     <Typography>Price Range: ₹{room.priceRange?.minPrice} - ₹{room.priceRange?.maxPrice}</Typography>
// //                     <Typography>Capacity: {room.capacity}</Typography>
// //                     <Typography>Amenities: {room.amenities?.join(", ")}</Typography>
// //                     <Typography>Room Size: {room.roomSize} sq ft</Typography>
// //                     <Typography>Bed Type: {room.bedType}</Typography>
// //                     <Typography>Status: {room.status}</Typography>
// //                     <Typography>Description: {room.description}</Typography>
// //                     <Typography>Features:
// //                         Smoking Allowed: {room.features?.smokingAllowed ? "Yes" : "No"},
// //                         Pet Friendly: {room.features?.petFriendly ? "Yes" : "No"},
// //                         Accessible: {room.features?.accessible ? "Yes" : "No"}
// //                     </Typography>
// //                     <Grid item xs={12} md={7}>
// //                         <Button variant="contained" onClick={() => setEditDialogOpen(true)}>Edit Room</Button>
// //                     </Grid>
// //                 </Grid>
// //             </Paper>

// //             {/* Edit Dialog */}
// //             <Dialog open={isEditDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth>
// //                 <DialogTitle>Edit Room</DialogTitle>
// //                 <DialogContent>
// //                     <TextField label="Room Name" fullWidth margin="dense" name="roomName" value={editRoom.roomName || ""} onChange={handleInputChange} />
// //                     <TextField label="Room Number" fullWidth margin="dense" name="roomNumber" value={editRoom.roomNumber || ""} onChange={handleInputChange} />
// //                     <TextField label="Floor Number" fullWidth margin="dense" name="floorNumber" value={editRoom.floorNumber || ""} onChange={handleInputChange} />
// //                     <TextField label="Room Type" select fullWidth margin="dense" name="roomType" value={editRoom.roomType || ""} onChange={handleInputChange}>
// //                         {categories.map((category) => (
// //                             <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
// //                         ))}
// //                     </TextField>
// //                     <TextField label="Price Range (JSON)" fullWidth margin="dense" onChange={(e) => handleJsonInputChange(e, "priceRange")} defaultValue={JSON.stringify(editRoom.priceRange || {})} />
// //                     <TextField label="Pricing Details (JSON)" fullWidth margin="dense" onChange={(e) => handleJsonInputChange(e, "pricingDetails")} defaultValue={JSON.stringify(editRoom.pricingDetails || [])} />
// //                     <TextField label="Capacity" fullWidth margin="dense" name="capacity" value={editRoom.capacity || ""} onChange={handleInputChange} />
// //                     <TextField label="Amenities" fullWidth margin="dense" value={editRoom.amenities?.join(",")} onChange={handleAmenitiesChange} />
// //                     <TextField label="Room Size" fullWidth margin="dense" name="roomSize" value={editRoom.roomSize || ""} onChange={handleInputChange} />
// //                     <TextField label="Bed Type" fullWidth margin="dense" name="bedType" value={editRoom.bedType || ""} onChange={handleInputChange} />
// //                     <TextField label="Features (JSON)" fullWidth margin="dense" onChange={(e) => handleJsonInputChange(e, "features")} defaultValue={JSON.stringify(editRoom.features || {})} />
// //                     <TextField label="Status" select fullWidth margin="dense" name="status" value={editRoom.status || ""} onChange={handleInputChange}>
// //                         <MenuItem value="Available">Available</MenuItem>
// //                         <MenuItem value="Booked">Booked</MenuItem>
// //                         <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
// //                     </TextField>
// //                     <TextField label="Description" fullWidth margin="dense" multiline rows={3} name="description" value={editRoom.description || ""} onChange={handleInputChange} />
// //                 </DialogContent>
// //                 <DialogActions>
// //                     <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
// //                     <Button onClick={handleSaveChanges}>Save</Button>
// //                 </DialogActions>
// //             </Dialog>
// //         </Box>
// //     );
// // };

// // export default SingleRoom;

// import {
//     Avatar,
//     Box,
//     Button,
//     Grid,
//     IconButton,
//     Paper,
//     Typography,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { fetchRoomDetails } from "../api/room";
// import { showToast } from "../api/toast";
// import { PUBLIC_API_URI } from "../api/config";
// import { FiEdit, FiTrash } from "react-icons/fi";

// const SingleRoom = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [room, setRoom] = useState({});

//     // Fetch room details
//     const getRoomById = async () => {
//         try {
//             const response = await fetchRoomDetails(id);
//             setRoom(response.data.room);
//         } catch (error) {
//             showToast("Failed to fetch room details.", "error");
//         }
//     };

//     useEffect(() => {
//         getRoomById();
//     }, [id]);

//     // Navigate to Edit Room component
//     const handleEditRoom = () => {
//         navigate(`/room/edit/${id}`);
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Typography variant="h4">Room Details</Typography>
//             <Paper sx={{ p: 3, mb: 3 }}>
//                 <Grid container spacing={4}>
//                     <Grid item xs={12} md={5}>
//                         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
//                             {room.images?.map((image, index) => (
//                                 <Box key={index} sx={{ position: "relative" }}>
//                                     <img
//                                         src={`${PUBLIC_API_URI}${image}`}
//                                         // sx={{ width: 120, height: 120 }}
//                                         height={120}
//                                         width={120}
//                                     />
//                                 </Box>
//                             ))}
//                         </Box>
//                     </Grid>
//                     <Grid item xs={12} md={7}>
//                         <Typography variant="h5">{room.roomName}</Typography>
//                         <Typography>Room Number: {room.roomNumber}</Typography>
//                         <Typography>Floor Number: {room.floorNumber}</Typography>
//                         <Typography>Room Type: {room.roomType?.name}</Typography>
//                         <Typography>Price Range: ₹{room.priceRange?.minPrice} - ₹{room.priceRange?.maxPrice}</Typography>
//                         <Typography>Capacity: {room.capacity}</Typography>
//                         <Typography>Amenities: {room.amenities?.join(", ")}</Typography>
//                         <Typography>Room Size: {room.roomSize} sq ft</Typography>
//                         <Typography>Bed Type: {room.bedType}</Typography>
//                         <Typography>Status: {room.status}</Typography>
//                         <Typography>Description: {room.description}</Typography>
//                         <Typography>Features:
//                             Smoking Allowed: {room.features?.smokingAllowed ? "Yes" : "No"},
//                             Pet Friendly: {room.features?.petFriendly ? "Yes" : "No"},
//                             Accessible: {room.features?.accessible ? "Yes" : "No"}
//                         </Typography>
//                         <Button variant="contained" onClick={handleEditRoom}>
//                             Edit Room
//                         </Button>
//                     </Grid>
//                 </Grid>
//             </Paper>
//         </Box>
//     );
// };

// export default SingleRoom;


import {
    Avatar,
    Box,
    Button,
    Grid,
    IconButton,
    Paper,
    Typography,
    Divider
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRoomDetails } from "../api/room";
import { showToast } from "../api/toast";
import { PUBLIC_API_URI } from "../api/config";
import { FiEdit, FiTrash } from "react-icons/fi";
import Breadcrumb from "../components/common/Breadcrumb";

const SingleRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState({});

    // Fetch room details
    const getRoomById = async () => {
        try {
            const response = await fetchRoomDetails(id);
            setRoom(response.data.data);
        } catch (error) {
            showToast("Failed to fetch room details.", "error");
        }
    };

    useEffect(() => {
        getRoomById();
    }, [id]);

    // Navigate to Edit Room component
    const handleEditRoom = () => {
        navigate(`/room/edit/${id}`);
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4">Room Details</Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={4}>
                    {/* Image Section */}
                    <Grid item xs={12} md={5}>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                            {room.images?.map((image, index) => (
                                <Box key={index} sx={{ position: "relative" }}>
                                    <img
                                        src={`${PUBLIC_API_URI}${image}`}
                                        height={120}
                                        width={120}
                                        alt={`Room Image ${index + 1}`}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    {/* Room Details Section */}
                    <Grid item xs={12} md={7}>
                        <Typography variant="h5">{room.categoryName?.name}</Typography>
                        <Typography variant="body1">Room Number: {room.roomDetails?.map(r => r.roomNumber).join(", ")}</Typography>
                        <Typography>Room Type: {room.categoryName?.name}</Typography>
                        <Typography>Price Range: ₹{room.priceRange?.minPrice} - ₹{room.priceRange?.maxPrice}</Typography>
                        <Typography>Capacity: {room.maxAllowedPerRoom}</Typography>
                        {/* <Typography>Amenities: {room.amenities?.map(am => am.name).join(", ")}</Typography> */}
                        <Typography variant="h  6">Room Amenities</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                            {room.amenities?.map((amenity, index) => (
                                <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <img
                                        src={`${PUBLIC_API_URI}${amenity.icon}`}
                                        alt={amenity.name}
                                        style={{ width: 20, height: 20 }}
                                    />
                                    <Typography variant="body2">{amenity.name}</Typography>
                                </Box>
                            ))}
                        </Box>
                        <Typography>Room Size: {room.roomSize} sq ft</Typography>
                        <Typography>Bed Type: {room.bedType}</Typography>
                        <Typography>Status: {room.status}</Typography>
                        <Typography>Description:

                            <div
                                dangerouslySetInnerHTML={{
                                    __html: room?.description || "N/A",
                                }}
                            /></Typography>

                        <Typography variant="h6">Features:</Typography>
                        <Typography>
                            Smoking Allowed: {room.features?.smokingAllowed ? "Yes" : "No"},
                            Pet Friendly: {room.features?.petFriendly ? "Yes" : "No"},
                            Accessible: {room.features?.accessible ? "Yes" : "No"}
                        </Typography>

                        {/* Special Day Tariffs */}
                        {room.specialDayTariff?.length > 0 && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6">Special Day Tariffs:</Typography>
                                {room.specialDayTariff.map((specialDay, index) => (
                                    <Typography key={index}>
                                        {specialDay.special_day_name}: {specialDay.extraCharge}% extra
                                        from {new Date(specialDay.startDate).toLocaleDateString()}
                                        to {new Date(specialDay.endDate).toLocaleDateString()}
                                    </Typography>
                                ))}
                            </>
                        )}

                        {/* Pricing Details */}
                        {room.pricingDetails?.length > 0 && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6">Pricing Details:</Typography>
                                {room.pricingDetails.map((pricing, index) => (
                                    <Typography key={index}>
                                        {pricing.guestType}: ₹{pricing.price}
                                    </Typography>
                                ))}
                            </>
                        )}

                        {/* Extra Bed Price */}
                        {room.extraBedPrice && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6">Extra Bed Price:</Typography>
                                <Typography>₹{room.extraBedPrice}</Typography>
                            </>
                        )}

                        {/* Cancellation Policy */}
                        {room.cancellationPolicy && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6">Cancellation Policy:</Typography>
                                <Typography>
                                    Before 7 Days: {room.cancellationPolicy.before7Days}% cancellation charge
                                </Typography>
                                <Typography>
                                    Between 7 to 2 Days: {room.cancellationPolicy.between7To2Days}% cancellation charge
                                </Typography>
                                <Typography>
                                    Between 48 to 24 Hours: {room.cancellationPolicy.between48To24Hours}% cancellation charge
                                </Typography>
                                <Typography>
                                    Less than 24 Hours: {room.cancellationPolicy.lessThan24Hours}% cancellation charge
                                </Typography>
                            </>
                        )}

                        <Button variant="contained" onClick={handleEditRoom} sx={{ mt: 2 }}>
                            Edit Room
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default SingleRoom;
