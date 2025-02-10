import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Paper,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Checkbox,
    ListItemText,
    Divider,
    Chip,
    Grid,
    List,
    ListItem,
} from "@mui/material";
import { useParams } from "react-router-dom";

import { showToast } from "../../../api/toast";
import Breadcrumb from "../../../components/common/Breadcrumb";
import {
    fetchRoomBookingDetails,
    fetchAvailableRooms,
    updateRoomBooking,
} from "../../../api/room";
import { formatDateMoment, formatDateTime } from "../../../api/config";

const SingleRoomBooking = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState({});
    const [availableRooms, setAvailableRooms] = useState([]);
    const [roomSelections, setRoomSelections] = useState({});

    useEffect(() => {
        getBookingById(id);
    }, [id]);

    useEffect(() => {
        if (booking?.bookingStatus === "Pending") {
            fetchAvailableRoomData();
        }
    }, [booking]);

    const getBookingById = async (bookingId) => {
        try {
            const response = await fetchRoomBookingDetails(bookingId);
            setBooking(response.data.response);
        } catch (error) {
            console.error("Failed to fetch booking details:", error);
            showToast("Failed to fetch booking details. Please try again.", "error");
        }
    };

    const fetchAvailableRoomData = async () => {
        try {
            const response = await fetchAvailableRooms(id);
            const roomData = response?.data?.availableRooms || [];
            const roomMap = roomData.reduce((acc, roomType) => {
                acc[roomType.roomType] = [];
                return acc;
            }, {});
            setAvailableRooms(roomData);
            setRoomSelections(roomMap);
        } catch (error) {
            console.error("Failed to fetch available rooms:", error);
            showToast("Failed to fetch available rooms. Please try again.", "error");
        }
    };

    const handleRoomTypeSelection = (roomType, selectedRoomIds) => {
        setRoomSelections((prev) => ({
            ...prev,
            [roomType]: selectedRoomIds,
        }));
    };

    console.log(roomSelections, "roomSelections")
    const handleConfirm = async () => {
        try {
            // Validate room selections
            const missingRooms = booking.roomCategoryCounts.filter((category) => {
                const selectedRooms = roomSelections[category.roomType._id] || []; // Ensure roomSelections is mapped correctly
                return selectedRooms.length !== category.roomCount;
            });

            if (missingRooms.length > 0) {
                const missingMessage = missingRooms
                    .map(
                        (room) =>
                            `Room Type: ${room.roomType._id} requires ${room.roomCount} room(s)`
                    )
                    .join(", ");
                showToast(
                    `Please select the correct number of rooms. Missing: ${missingMessage}`,
                    "error"
                );
                return;
            }

            // Prepare the allocatedRooms data for the API request
            const allocatedRooms = Object.entries(roomSelections).map(
                ([roomType, selectedRooms]) => ({
                    roomType,
                    allocatedRoomIds: selectedRooms,
                })
            );

            // Prepare the payload for the API call
            const updatedData = {
                allocatedRooms,
                bookingStatus: "Confirmed",
            };

            // Make the API request
            const response = await updateRoomBooking(id, updatedData);

            if (response.status === 200) {
                await getBookingById(id); // Refresh booking details after confirmation
                showToast("Booking confirmed successfully!", "success");
            } else {
                showToast("Failed to confirm booking. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to confirm booking:", error);
            showToast(
                "An error occurred while confirming the booking. Please try again.",
                "error"
            );
        }
    };


    const handleReject = async () => {
        try {
            const updatedData = {
                allocatedRooms: [],
                bookingStatus: "Cancelled",
            };

            const response = await updateRoomBooking(id, updatedData);
            if (response.status === 200) {
                getBookingById(id);
                showToast("Booking rejected successfully!", "success");
            } else {
                showToast("Failed to reject booking. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to reject booking:", error);
            showToast("Failed to reject booking. Please try again.", "error");
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
                    {/* General Information */}
                    <Grid item xs={12} md={12} sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                            General Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Booking ID:</strong> {booking?._id || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Check-In:</strong>{" "}
                            {formatDateMoment(booking.bookingDates?.checkIn) || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Check-Out:</strong>{" "}
                            {formatDateMoment(booking.bookingDates?.checkOut) || "N/A"}
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
                        {/* <Typography variant="body1">
                            <strong>Booking Created Date & Time:</strong>  {booking.createdAt ? formatDateTime(booking.createdAt) : "N/A"}
                        </Typography> */}
                    </Grid>

                    {/* Pricing Details */}
                    <Grid item xs={12} md={12} sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                            Pricing Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Special Day Charges:</strong> ₹
                            {booking.pricingDetails?.specialDayExtraCharge || 0}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Sub Total Amount:</strong> ₹{(booking.pricingDetails?.final_totalAmount - booking.pricingDetails?.final_totalTaxAmount) || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Total Tax Amount:</strong> ₹{booking.pricingDetails?.final_totalTaxAmount || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Total Biiled Amount:</strong> ₹{booking.pricingDetails?.final_totalAmount || "N/A"}
                        </Typography>

                        {/* Room Category Details */}
                        <Box sx={{ mb: 1, mt: 4 }}>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                                <strong>Room Categories</strong>
                            </Typography>
                            {booking.roomCategoryCounts?.length > 0 ? (
                                booking.roomCategoryCounts.map((category, index) => (
                                    <Box key={index} sx={{ mb: 2 }}>
                                        <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
                                            <strong>Room Type:</strong>   {category.roomType?.categoryName?.name || `Room Category ${index + 1}`}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            <strong>Room Count:</strong> {category.roomCount || "N/A"}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            <strong>Sub Total Amount:</strong> ₹{category.totalAmount || 0}
                                        </Typography>


                                        {/* Tax Breakdown for Each Category */}
                                        <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                                            Tax Breakdown:
                                        </Typography>
                                        {category.taxTypes?.length > 0 ? (
                                            <List dense>
                                                {category.taxTypes.map((tax, taxIndex) => (
                                                    <ListItem key={taxIndex}>
                                                        <ListItemText
                                                            primary={`${tax.taxType}: ₹${tax.taxAmount} (${tax.taxRate}%)`}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        ) : (
                                            <Typography variant="body2">No tax details available for this category.</Typography>
                                        )}
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            <strong>Final Amount:</strong> ₹{category.final_amount || 0}
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2">No room category details available.</Typography>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        {/* <Divider sx={{ mb: 2 }} /> */}
                        <Typography variant="body1">
                            <strong>Booking Created Date & Time:</strong>  {booking.createdAt ? formatDateTime(booking.createdAt) : "N/A"}
                        </Typography>
                    </Grid>


                    {/* Member Details */}
                    {/* <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                            Member Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {booking.memberDetails?.map((member, index) => (
                            <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                                <strong>{member.memberType}:</strong> {member.memberName || "N/A"}
                            </Typography>
                        ))}
                    </Grid> */}


                    {booking.bookingStatus === "Pending" && (< Grid item xs={12} md={12} sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                            Room Category Counts
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {availableRooms.length > 0 ? (
                            availableRooms.map((roomTypeData) => (
                                <Box key={roomTypeData.roomType} sx={{ mb: 2 }}>
                                    <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
                                        {`Room Type: ${roomTypeData.roomTypeName}`}
                                    </Typography>
                                    <FormControl fullWidth>
                                        <InputLabel>Select Rooms</InputLabel>
                                        <Select
                                            multiple
                                            value={roomSelections[roomTypeData.roomType] || []}
                                            onChange={(e) =>
                                                handleRoomTypeSelection(
                                                    roomTypeData.roomType,
                                                    e.target.value
                                                )
                                            }
                                            renderValue={(selected) =>
                                                selected
                                                    .map((roomId) =>
                                                        roomTypeData.availableRooms.find(
                                                            (room) => room.roomId === roomId
                                                        )?.roomNumber
                                                    )
                                                    .join(", ")
                                            }
                                        >
                                            {roomTypeData.availableRooms.map((room) => (
                                                <MenuItem key={room.roomId} value={room.roomId}>
                                                    <Checkbox
                                                        checked={
                                                            roomSelections[roomTypeData.roomType]?.includes(room.roomId) || false
                                                        }
                                                    />
                                                    <ListItemText primary={`Room ${room.roomNumber}`} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            ))
                        ) : (
                            <Typography>No room categories available.</Typography>
                        )}
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                            <Button variant="contained" color="error" onClick={handleReject}>
                                Reject
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleConfirm}>
                                Confirm
                            </Button>
                        </Box>
                    </Grid>
                    )}
                </Grid>


            </Paper>
        </Box >
    );
};

export default SingleRoomBooking;
