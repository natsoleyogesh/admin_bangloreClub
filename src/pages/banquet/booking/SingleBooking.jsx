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
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Chip,
    List,
    ListItem,
    ListItemText,
    Divider,
} from "@mui/material";
import { FiCheck, FiEdit, FiX } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { fetchBanquetBookingDetails, updateBanquetBooking } from "../../../api/banquet";
import { showToast } from "../../../api/toast";
import Breadcrumb from "../../../components/common/Breadcrumb";

// Format Time in AM/PM
const formatTimeInIST = (timeStr) => {
    if (!timeStr) return "N/A";
    const todayDate = new Date().toISOString().split("T")[0];
    const timeInUTC = new Date(`${todayDate}T${timeStr}:00Z`);
    const options = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
    };
    return new Intl.DateTimeFormat("en-IN", options).format(timeInUTC);
};

const statusOptions = ["Pending", "Confirmed", "Cancelled"];

const SingleBooking = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editBooking, setEditBooking] = useState({ bookingId: id, bookingStatus: "" });

    // Fetch booking details
    useEffect(() => {
        getBookingById(id);
    }, [id]);

    const getBookingById = async (bookingId) => {
        try {
            const response = await fetchBanquetBookingDetails(bookingId);
            setBooking(response.data.booking);
            setEditBooking({ bookingStatus: response?.data?.booking?.bookingStatus });
        } catch (error) {
            console.error("Failed to fetch booking details:", error);
            showToast("Failed to fetch booking details. Please try again.", "error");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditBooking((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditClick = () => setEditDialogOpen(true);
    const handleDialogClose = () => setEditDialogOpen(false);

    const handleSaveChanges = async (newStatus) => {
        try {
            const response = await updateBanquetBooking({
                // bookingId: id,
                // bookingStatus: editBooking.bookingStatus,
                bookingId: id,
                bookingStatus: newStatus,
            });
            if (response.status === 200) {
                getBookingById(id);
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
            <Typography variant="h4" sx={{ mb: 2, color: "primary.main", fontWeight: "bold" }}>
                Booking Details
            </Typography>
            <Paper
                sx={{
                    p: 4,
                    mb: 3,
                    borderRadius: "16px",
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Grid container spacing={3}>
                    {/* Booking Details */}
                    <Grid item xs={12} md={12} sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                            General Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Banquet:</strong> {booking?.banquetType?.banquetName?.name || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Booking Dates:</strong>{" "}
                            {new Date(booking.bookingDates?.checkIn).toLocaleDateString() || "N/A"} -{" "}
                            {new Date(booking.bookingDates?.checkOut).toLocaleDateString() || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Booking Time:</strong>{" "}
                            {booking.bookingTime
                                ? `${formatTimeInIST(booking.bookingTime.from)} - ${formatTimeInIST(
                                    booking.bookingTime.to
                                )}`
                                : "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Status:</strong>{" "}
                            <Chip
                                label={booking.bookingStatus}
                                color={
                                    booking.bookingStatus === "Confirmed"
                                        ? "success"
                                        : booking.bookingStatus === "Cancelled"
                                            ? "error"
                                            : "default"
                                }
                                size="small"
                            />
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Payment Status:</strong>{" "}
                            <Chip
                                label={booking.paymentStatus || "N/A"}
                                color={booking.paymentStatus === "Completed" ? "success" : "default"}
                                size="small"
                            />
                        </Typography>
                        <Typography variant="body1">
                            <strong>Payment Mode:</strong> {booking?.paymentMode || "N/A"}
                        </Typography>
                    </Grid>

                    {/* Pricing Details */}
                    <Grid item xs={12} md={12}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                            Pricing Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Special Day Charges:</strong> ₹
                            {booking.pricingDetails?.specialDayExtraCharge || 0}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Total Amount:</strong> ₹{booking.pricingDetails?.totalAmount || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Tax Amount:</strong> ₹{booking.pricingDetails?.totalTaxAmount || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Final Total:</strong> ₹{booking.pricingDetails?.final_totalAmount || "N/A"}
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                <strong>Tax Breakdown:</strong>
                            </Typography>
                            {booking.pricingDetails?.taxTypes?.length > 0 ? (
                                <List dense>
                                    {booking.pricingDetails.taxTypes.map((tax, index) => (
                                        <ListItem key={index}>
                                            <ListItemText
                                                primary={`${tax.taxType}: ₹${tax.taxAmount} (${tax.taxRate}%)`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2">No tax details available.</Typography>
                            )}
                        </Box>
                    </Grid>

                    {/* Member Details */}
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                            Member Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Primary Member:</strong> {booking.primaryMemberId?.name || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Guest Of:</strong> {booking.invitationOfmember || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Guests:</strong> {booking.attendingGuests || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Mobile:</strong> {booking.mobileNumber || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Office Phone Number:</strong> {booking.officePhoneNumber || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Residence Phone Number:</strong> {booking.residencePhoneNo || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Address:</strong> {booking.address || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Occasion:</strong> {booking.occasion || "N/A"}
                        </Typography>
                    </Grid>
                </Grid>

                {/* <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FiEdit />}
                    onClick={handleEditClick}
                    sx={{ mt: 3 }}
                >
                    Edit Booking
                </Button> */}
                {/* Confirm and Cancel Buttons */}
                {booking.bookingStatus === "Pending" && (
                    <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<FiCheck />}
                            onClick={() => handleSaveChanges("Confirmed")}
                        >
                            Confirm
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<FiX />}
                            onClick={() => handleSaveChanges("Cancelled")}
                        >
                            Cancel
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit Booking Status</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Booking Status</InputLabel>
                        <Select
                            name="bookingStatus"
                            value={editBooking.bookingStatus || ""}
                            onChange={handleInputChange}
                        >
                            {statusOptions.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
