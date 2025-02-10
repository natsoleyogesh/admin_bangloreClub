import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Grid,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Chip,
} from "@mui/material";
import { FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBanquetDetails, fetchEditBanquetDetails } from "../../../api/banquet";
import { showToast } from "../../../api/toast";
import { PUBLIC_API_URI } from "../../../api/config";
import Breadcrumb from "../../../components/common/Breadcrumb";

// Function to convert 24-hour time to 12-hour AM/PM format
const formatTime = (time) => {
    if (!time) return "N/A";
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
    return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const SingleBanquet = () => {
    const { id } = useParams();
    const [banquet, setBanquet] = useState({});
    const [editData, setEditdata] = useState({});
    const navigate = useNavigate();

    // Fetch banquet details by ID
    const getBanquetById = async (id) => {
        try {
            const response = await fetchBanquetDetails(id);
            if (response?.status === 200) {
                setBanquet(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch banquet details:", error);
            showToast("Failed to fetch banquet details. Please try again.", "error");
        }
    };

    // const getEditBanquetById = async (id) => {
    //     if (!id) return; // Guard condition to prevent unnecessary calls
    //     // setLoading(true);
    //     try {
    //         const response = await fetchEditBanquetDetails(id);
    //         const banquet = response?.data?.data || {};

    //         setEditdata(banquet)
    //     } catch (error) {
    //         console.error("Failed to fetch banquet details:", error);
    //         showToast("Failed to fetch banquet details.", "error");
    //     } finally {
    //         // setLoading(false);
    //     }
    // };


    useEffect(() => {
        getBanquetById(id);
    }, [id]);

    // Navigate to Edit Page
    const handleEditClick = () => {
        navigate(`/banquet/edit/${id}`);
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 3 }}>
                Banquet Details
            </Typography>
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Grid container spacing={4}>
                    {/* Images */}
                    <Grid item xs={12} md={5}>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                            {banquet.images?.map((image, index) => (
                                <Box key={index} sx={{ position: "relative" }}>
                                    <img
                                        src={`${PUBLIC_API_URI}${image}`}
                                        height={120}
                                        width={120}
                                        alt={`Banquet Image ${index + 1}`}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    {/* Banquet Details */}
                    <Grid item xs={12} md={7}>
                        <Typography variant="h5">
                            {banquet.banquetName?.name || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Description:</strong>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: banquet?.description || "N/A",
                                }}
                            />
                        </Typography>
                        {/* <Typography variant="body1" >
                            <strong>Status:</strong> {banquet.status || "N/A"}
                        </Typography> */}
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Status:</strong>  <Chip
                                label={banquet.status}
                                color={banquet.status == "Active" ? "success" : "default"} // Approved, Pending, Rejected
                                size="small"
                            />

                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Billable Type:</strong>  <Chip
                                label={banquet.billable == true ? "Billable" : "Non-Billable"}
                                color={banquet.billable == true ? "success" : "default"} // Approved, Pending, Rejected
                                size="small"
                            />

                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Price Range:</strong> ₹{banquet.priceRange?.minPrice || 0} - ₹
                            {banquet.priceRange?.maxPrice || 0}
                        </Typography>
                        {/* <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Check-In Time:</strong> {banquet.checkInTime || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Check-Out Time:</strong> {banquet.checkOutTime || "N/A"}
                        </Typography> */}
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Min Allowed Guest:</strong> {banquet.minAllowedPerRoom || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Max Allowed Guest:</strong> {banquet.maxAllowedPerRoom || "N/A"}
                        </Typography>

                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Banquet Hall Size:</strong> {banquet.banquetHallSize || "N/A"} sqft
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Features:</strong>
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary={`Smoking Allowed: ${banquet.features?.smokingAllowed ? "Yes" : "No"}`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary={`Pet Friendly: ${banquet.features?.petFriendly ? "Yes" : "No"}`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary={`Accessible: ${banquet.features?.accessible ? "Yes" : "No"}`}
                                />
                            </ListItem>
                        </List>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Amenities:</strong>{" "}
                            {banquet.amenities?.map((amenity) => amenity.name).join(", ") || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Cancellation Policy:</strong>
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary={`Before 7 Days: ${banquet.cancellationPolicy?.before7Days || "N/A"}%`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary={`Between 7 to 2 Days: ${banquet.cancellationPolicy?.between7To2Days || "N/A"
                                        }%`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary={`Between 48 to 24 Hours: ${banquet.cancellationPolicy?.between48To24Hours || "N/A"
                                        }%`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary={`Less than 24 Hours: ${banquet.cancellationPolicy?.lessThan24Hours || "N/A"
                                        }%`}
                                />
                            </ListItem>
                        </List>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Special Day Tariffs:</strong>
                        </Typography>
                        {banquet.specialDayTariff?.length > 0 ? (
                            banquet.specialDayTariff.map((tariff, index) => (
                                <List key={index} dense>
                                    <ListItem>
                                        <ListItemText
                                            primary={`Special Day: ${tariff.special_day_name}`}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary={`Date: ${tariff.startDate} - ${tariff.endDate}`}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary={`Extra Charge: ₹${tariff.extraCharge || 0}`}
                                        />
                                    </ListItem>
                                </List>
                            ))
                        ) : (
                            <Typography>No special day tariffs available.</Typography>
                        )}
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Tax Types:</strong>{" "}
                            {banquet.taxTypes?.map((tax) => tax.name).join(", ") || "N/A"}
                        </Typography>
                        {/* Pricing Details */}
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Pricing Details:</strong>
                        </Typography>
                        {banquet.pricingDetails?.length > 0 ? (
                            banquet.pricingDetails.map((pricing, index) => (
                                <Box key={index} sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: "8px" }}>
                                    <Typography variant="body2">
                                        <strong>Days:</strong> {pricing.days.join(", ")}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Time Slots:</strong>
                                    </Typography>
                                    <List dense>
                                        {pricing.timeSlots.map((slot, idx) => (
                                            <ListItem key={idx}>
                                                <ListItemText
                                                    primary={`Start: ${formatTime(slot.start)}, End: ${formatTime(slot.end)}`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Typography variant="body2">
                                        <strong>Price:</strong> ₹{pricing.price || "N/A"}
                                    </Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography>No pricing details available.</Typography>
                        )}

                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Pricing Details Description:</strong>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: banquet?.pricingDetailDescription || "N/A",
                                }}
                            />
                        </Typography>

                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Banquet Guidelines:</strong>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: banquet?.guideline || "N/A",
                                }}
                            />
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleEditClick}
                            sx={{ mt: 2 }}
                        >
                            Edit Banquet
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default SingleBanquet;
