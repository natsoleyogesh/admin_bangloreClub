import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Paper,
    Typography,
    Chip,
    Divider,
    Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";

import { showToast } from "../../api/toast";
import { fetchRequestDetails } from "../../api/request";
import Breadcrumb from "../../components/common/Breadcrumb";

const SingleRequest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);

    // Fetch request details by ID
    useEffect(() => {
        getRequestById(id);
    }, [id]);

    const getRequestById = async (requestId) => {
        try {
            const response = await fetchRequestDetails(requestId);
            setRequest(response.data.request);
        } catch (error) {
            console.error("Failed to fetch request details:", error);
            showToast("Failed to fetch request details. Please try again.", "error");
        }
    };

    // Navigate to Edit Page
    const handleClick = (department, departmentId) => {
        if (department === "BanquetBooking") {
            navigate(`/banquet-booking/${departmentId}`);
        }
        if (department === "RoomBooking") {
            navigate(`/room-booking/${departmentId}`);
        }
    };

    if (!request) return <Typography>Loading...</Typography>;

    const renderRoomBookingDetails = (details) => (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>Room Booking Details</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1">
                <strong>Check-In:</strong> {new Date(details.bookingDates.checkIn).toLocaleDateString() || "N/A"}
            </Typography>
            <Typography variant="body1">
                <strong>Check-Out:</strong> {new Date(details.bookingDates.checkOut).toLocaleDateString() || "N/A"}
            </Typography>
            <Typography variant="body1">
                <strong>Guests:</strong> {details.roomCategoryCounts[0]?.memberCounts.totalOccupants || "N/A"}
            </Typography>
            <Typography variant="body1">
                <strong>Total Amount:</strong> ₹{details.pricingDetails.final_totalAmount || "N/A"}
            </Typography>
            <Typography variant="body1">
                <strong>Total Tax Amount:</strong> ₹{details.pricingDetails.final_totalTaxAmount || "N/A"}
            </Typography>
            <Typography variant="body1">
                <strong>Payment Mode:</strong> {details.paymentMode || "N/A"}
            </Typography>
            {/* <Typography variant="body1">
                <strong>Payment Status:</strong> {details.paymentStatus || "N/A"}
            </Typography> */}
        </Box>
    );

    const renderBanquetBookingDetails = (details) => (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>Banquet Booking Details</Typography>
            <Divider sx={{ mb: 2 }} />
            {/* <Typography variant="body1">
                <strong>Banquet Name:</strong> {details.banquetType?.banquetName?.name || "N/A"}
            </Typography> */}
            <Typography variant="body1">
                <strong>Booking Time:</strong> {details.bookingTime ? `${details.bookingTime.from} - ${details.bookingTime.to}` : "N/A"}
            </Typography>
            <Typography variant="body1">
                <strong>Guests:</strong> {details.attendingGuests || "N/A"}
            </Typography>
            <Typography variant="body1">
                <strong>Occasion:</strong> {details.occasion || "N/A"}
            </Typography>
            <Typography variant="body1">
                <strong>Total Amount:</strong> ₹{details.pricingDetails.final_totalAmount || "N/A"}
            </Typography>
            <Typography variant="body1">
                <strong>Total Tax Amount:</strong> ₹{details.pricingDetails.totalTaxAmount || "N/A"}
            </Typography>
            <Typography variant="body1">
                <strong>Payment Mode:</strong> {details.paymentMode || "N/A"}
            </Typography>
            {/* <Typography variant="body1">
                <strong>Payment Status:</strong> {details.paymentStatus || "N/A"}
            </Typography> */}
        </Box>
    );

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Request Details
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
                            Request ID: {request._id || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Member Name:</strong> {request.primaryMemberId?.name || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Email:</strong> {request.primaryMemberId?.email || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Mobile:</strong> {request.primaryMemberId?.mobileNumber || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Department:</strong> {request.department || "N/A"}
                        </Typography>
                        {request.department !== "profileRequest" && <Typography variant="body1">
                            <strong>Status:</strong>
                            <Chip label={request.status || "N/A"} color="primary" size="small" />
                        </Typography>}
                        <Typography variant="body1">
                            <strong>Description:</strong> {request.description || "N/A"}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {/* Conditional Rendering Based on Department */}
                        {request.department === "RoomBooking" && renderRoomBookingDetails(request.departmentId)}
                        {request.department === "BanquetBooking" && renderBanquetBookingDetails(request.departmentId)}
                    </Grid>
                    {/* View Department Button */}
                    {request.department !== "profileRequest" && <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={() => handleClick(request.department, request.departmentId._id)}
                            sx={{ mt: 2 }}
                        >
                            View {request.department}
                        </Button>
                    </Grid>}
                </Grid>
            </Paper>
        </Box>
    );
};

export default SingleRequest;
