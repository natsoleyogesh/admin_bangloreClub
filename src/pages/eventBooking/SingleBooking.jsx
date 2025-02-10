import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    TextField,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Chip,
    Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { showToast } from "../../api/toast";
import { FiEdit } from "react-icons/fi";
import { fetchBookingDetails, updateBookingDetails } from "../../api/event";
import Breadcrumb from "../../components/common/Breadcrumb";
import { formatDateMoment, formatDateTime, formatTime } from "../../api/config";


// Status options for the booking status dropdown
const statusOptions = ['Cancelled', "Confirmed"];
// Payment options for the payment status dropdown
const paymentOptions = ['Pending', 'Completed', 'Failed'];

const SingleBooking = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editBooking, setEditBooking] = useState({});

    // Fetch booking details by ID
    useEffect(() => {


        getBookingById(id);
    }, [id]);

    const getBookingById = async (bookingId) => {
        try {
            const response = await fetchBookingDetails(bookingId);
            setBooking(response.data.booking);
            setEditBooking(response.data.booking);
        } catch (error) {
            console.error("Failed to fetch booking details:", error);
            showToast("Failed to fetch booking details. Please try again.", "error");
        }
    };

    // Handle input changes for the edit form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditBooking((prev) => ({ ...prev, [name]: value }));
    };

    // Open and close the edit dialog
    const handleEditClick = () => setEditDialogOpen(true);
    const handleDialogClose = () => setEditDialogOpen(false);


    // Save changes to the booking
    const handleSaveChanges = async () => {
        try {
            const response = await updateBookingDetails(id, editBooking);
            if (response.status === 200) {
                // setBooking(response.data.booking);
                getBookingById(id)
                setEditDialogOpen(false);
                showToast("Booking details updated successfully!", "success");
            } else {
                showToast("Failed to update booking details. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to update booking details:", error);
            showToast("Failed to update booking details. Please try again.", "error");
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Event Booking Details
            </Typography>
            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Grid container spacing={4}>
                    {/* Booking Details Display */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6">Event: {booking.eventId?.eventTitle || "N/A"}</Typography>
                        {/* <Typography variant="body1">
                            <strong>Event Start Date:</strong> {new Date(booking.eventId?.eventStartDate).toLocaleDateString() || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Event End Date:</strong> {new Date(booking.eventId?.eventEndDate).toLocaleDateString() || "N/A"}
                        </Typography> */}
                        <Typography variant="body1">
                            <strong>Event Start Date:</strong> {booking.eventId?.eventStartDate
                                ? formatDateMoment(booking.eventId.eventStartDate)
                                : "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Event End Date:</strong> {booking.eventId?.eventEndDate
                                ? formatDateMoment(booking.eventId.eventEndDate)
                                : "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Event Time:</strong>  {booking.eventId?.startTime ? formatTime(booking.eventId.startTime) : "N/A"} -  {booking.eventId?.endTime ? formatTime(booking.eventId.endTime) : "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Location:</strong> {booking.eventId?.location || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Organizer:</strong> {booking.eventId?.organizer || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Booking Status:</strong>  <Chip
                                label={booking.bookingStatus}
                                color={booking.bookingStatus === "Confirmed" ? "success" : "default"} // Approved, Pending, Rejected
                                size="small"
                            />

                        </Typography>
                        {/* <Typography variant="body1">
                            <strong>Booking Created Date & Time:</strong>  {booking.createdAt ? formatDateTime(booking.createdAt) : "N/A"}
                        </Typography> */}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6">Ticket Details</Typography>
                        <Typography variant="body1">
                            <strong>Primary Member Price:</strong> ₹ {booking.ticketDetails?.primaryMemberPrice || 0}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Dependent Price:</strong> ₹ {booking.ticketDetails?.dependentMemberPrice || 0}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Spouse Price:</strong> ₹ {booking.ticketDetails?.spouseMemberPrice || 0}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Kids Price:</strong> ₹ {booking.ticketDetails?.kidsMemberPrice || 0}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Senior Dependent Price:</strong> ₹ {booking.ticketDetails?.seniorDependentMemberPrice || 0}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Guest Price:</strong> ₹ {booking.ticketDetails?.guestPrice || 0}
                        </Typography>
                        {/* <Typography variant="body1">
                            <strong>Tax Rate:</strong> {booking.ticketDetails?.taxRate || 0}%
                        </Typography> */}
                        <Typography variant="body1">
                            <strong>Subtotal:</strong> ₹ {booking.ticketDetails?.subtotal || 0}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Tax Amount:</strong> ₹ {booking.ticketDetails?.taxAmount || 0}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Total Amount:</strong> ₹ {booking.ticketDetails?.totalAmount || 0}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Payment Status:</strong>  <Chip
                                label={booking.paymentStatus}
                                color={booking.paymentStatus === "Completed" ? "success" : "default"} // Approved, Pending, Rejected
                                size="small"
                            />

                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Members</Typography>
                        <Typography variant="body1">
                            <strong>Primary Member:</strong> {booking.primaryMemberId?.name || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Members:</strong> {booking.dependents?.map((dep) => dep.userId?.name).join(", ") || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Guests:</strong> {booking.guests?.map((guest) => guest?.name).join(", ") || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Member Count:</strong> Primary: {booking.counts?.primaryMemberCount || 0}, Dependent: {booking.counts?.dependentMemberCount || 0}, Spouse: {booking.counts?.spouseMemberCount || 0}, Kids: {booking.counts?.kidsMemberCount || 0}, Senior Dependent: {booking.counts?.seniorDependentMemberCount || 0}, Guest: {booking.counts?.guestMemberCount || 0}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1">
                            <strong>Booking Created Date & Time:</strong>  {booking.createdAt ? formatDateTime(booking.createdAt) : "N/A"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        {booking.bookingStatus !== "Cancelled" &&
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<FiEdit />}
                                onClick={handleEditClick}
                                sx={{ mt: 2 }}
                            >
                                Edit Booking
                            </Button>
                        }
                    </Grid>
                </Grid>
            </Paper>

            {/* Edit Dialog */}
            <Dialog
                open={isEditDialogOpen}
                onClose={handleDialogClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Edit Booking Details</DialogTitle>
                <DialogContent>
                    {/* Booking Status Dropdown */}
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="booking-status-label">Booking Status</InputLabel>
                        <Select
                            labelId="booking-status-label"
                            name="bookingStatus"
                            value={editBooking.bookingStatus || ""}
                            onChange={handleInputChange}
                            label="Booking Status"
                        >
                            {statusOptions.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Payment Status Dropdown */}
                    {/* <FormControl fullWidth margin="dense">
                        <InputLabel id="payment-status-label">Payment Status</InputLabel>
                        <Select
                            labelId="payment-status-label"
                            name="paymentStatus"
                            value={editBooking.paymentStatus || ""}
                            onChange={handleInputChange}
                            label="Payment Status"
                        >
                            {paymentOptions.map((payment) => (
                                <MenuItem key={payment} value={payment}>
                                    {payment}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveChanges} color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SingleBooking;
