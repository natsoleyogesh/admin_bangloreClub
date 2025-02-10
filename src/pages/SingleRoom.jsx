import {
    Box,
    Button,
    Grid,
    Paper,
    Typography,
    Divider
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRoomDetails } from "../api/room";
import { showToast } from "../api/toast";
import { PUBLIC_API_URI } from "../api/config";
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
