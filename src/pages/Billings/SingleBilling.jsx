import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Paper,
    Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { fetchBillingDetails } from "../../api/billing";
import { showToast } from "../../api/toast";
import Breadcrumb from "../../components/common/Breadcrumb";

const SingleBilling = () => {
    const { id } = useParams();
    const [billing, setBilling] = useState(null);

    // Fetch billing details by ID
    useEffect(() => {
        getBillingById(id);
    }, [id]);

    const getBillingById = async (billingId) => {
        try {
            const response = await fetchBillingDetails(billingId);
            setBilling(response.data.billing);
        } catch (error) {
            console.error("Failed to fetch billing details:", error);
            showToast("Failed to fetch billing details. Please try again.", "error");
        }
    };

    if (!billing) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
             <Breadcrumb
              />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Billing Details
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
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            Invoice Number: {billing.invoiceNumber || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Member Name:</strong> {billing.memberId?.name || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Service Type:</strong> {billing.serviceType || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Invoice Date:</strong> {new Date(billing.invoiceDate).toLocaleDateString() || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Due Date:</strong> {new Date(billing.dueDate).toLocaleDateString() || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Sub Total:</strong> ₹{billing.subTotal || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Discount Amount:</strong> ₹{billing.discountAmount || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Tax Amount:</strong> ₹{billing.taxAmount || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Total Amount:</strong> ₹{billing.totalAmount || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Payment Status:</strong> {billing.paymentStatus || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Status:</strong> {billing.status || "N/A"}
                        </Typography>
                    </Grid>

                    {/* Display Service Details */}
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>Service Details</Typography>
                        {billing.serviceDetails?.roomBooking && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body1">
                                    <strong>Category Names:</strong> {billing.serviceDetails.roomBooking.roomCategoryCounts.map((category) => category.roomType.categoryName.name).join(", ") || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Room Booking Check-In:</strong> {new Date(billing.serviceDetails.roomBooking.bookingDates.checkIn).toLocaleDateString() || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Room Booking Check-Out:</strong> {new Date(billing.serviceDetails.roomBooking.bookingDates.checkOut).toLocaleDateString() || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Final Total Amount:</strong> ₹{billing.serviceDetails.roomBooking.pricingDetails.final_totalAmount || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Sub Total Amount:</strong> ₹{(billing.serviceDetails.roomBooking.pricingDetails.final_totalAmount - billing.serviceDetails.roomBooking.pricingDetails.final_totalTaxAmount) || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Final Total Tax Amount:</strong> ₹{billing.serviceDetails.roomBooking.pricingDetails.final_totalTaxAmount || "N/A"}
                                </Typography>
                            </Box>
                        )}

                        {billing.serviceDetails?.banquetBooking && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6">Banquet Details</Typography>
                                <Typography variant="body1">
                                    <strong>Banquet Name:</strong> {billing?.serviceDetails?.banquetBooking?.banquetType?.banquetName?.name || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Final Total Amount:</strong> ₹{billing.serviceDetails.banquetBooking.pricingDetails.final_totalAmount || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Sub Total Amount:</strong> ₹{(billing.serviceDetails.banquetBooking.pricingDetails.totalAmount + billing.serviceDetails.banquetBooking.pricingDetails.specialDayExtraCharge) || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Total Tax Amount:</strong> ₹{billing.serviceDetails.banquetBooking.pricingDetails.totalTaxAmount || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Invitation Of Member:</strong> ₹{billing.serviceDetails.banquetBooking.invitationOfmember || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Address:</strong> ₹{billing.serviceDetails.banquetBooking.address || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Total Attending Guests:</strong> {billing.serviceDetails.banquetBooking.attendingGuests || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Occasion:</strong> {billing.serviceDetails.banquetBooking.occasion || "N/A"}
                                </Typography>
                            </Box>
                        )}

                        {billing.serviceDetails?.eventBooking && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6">Event Details</Typography>
                                <Typography variant="body1">
                                    <strong>Event Name:</strong> {billing?.serviceDetails?.eventBooking?.eventId?.eventTitle || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Final Total Amount:</strong> ₹{billing.serviceDetails.eventBooking.ticketDetails.totalAmount || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Sub Total Amount:</strong> ₹{billing.serviceDetails.eventBooking.ticketDetails.subtotal || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Total Tax Amount:</strong> ₹{billing.serviceDetails.eventBooking.ticketDetails.taxAmount || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Event Date:</strong> {new Date(billing.serviceDetails.eventBooking.eventId?.eventDate).toLocaleDateString() || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Address:</strong> {billing.serviceDetails.eventBooking.eventId?.location || "N/A"}
                                </Typography>

                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default SingleBilling;
