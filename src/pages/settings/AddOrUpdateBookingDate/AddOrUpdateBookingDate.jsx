import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
    Paper,
    Grid
} from "@mui/material";
import { getRequest, postRequest } from "../../../api/commonAPI";
import { showToast } from "../../../api/toast";
import moment from "moment";

const AddOrUpdateBookingDate = () => {
    const [bookingDetails, setBookingDetails] = useState({
        minCheckInDays: "",
        maxCheckOutMonths: "",
        // bookingStartDate: "",
        // bookingEndDate: ""
    });

    const [loading, setLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchBookingConfig();
    }, []);

    // ✅ Fetch existing booking configuration
    const fetchBookingConfig = async () => {
        try {
            setLoading(true);
            const response = await getRequest(`/get-booking-date`);
            if (response.status === 200 && response.data.data) {
                // setBookingDetails(response.data.data);
                const data = response.data.data;
                // ✅ Convert ISO Dates to "YYYY-MM-DD" format for Date Picker
                setBookingDetails({
                    minCheckInDays: data.minCheckInDays,
                    maxCheckOutMonths: data.maxCheckOutMonths,
                    // bookingStartDate: moment(data.bookingStartDate).format("YYYY-MM-DD"),
                    // bookingEndDate: moment(data.bookingEndDate).format("YYYY-MM-DD")
                });
                setIsUpdating(true);
            }
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to fetch booking configuration.", "error");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingDetails((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Handle form submission with validation
    const handleSubmit = async () => {
        try {
            setLoading(true);

            // // Convert dates to moment.js
            // const today = moment().startOf("day");
            // const startDate = moment(bookingDetails.bookingStartDate).startOf("day");
            // const endDate = moment(bookingDetails.bookingEndDate).endOf("day");

            // // Expected start & end dates based on admin rules
            // const expectedCheckInDate = today.clone().add(parseInt(bookingDetails.minCheckInDays), "days");
            // const expectedCheckOutDate = startDate.clone().add(parseInt(bookingDetails.maxCheckOutMonths), "months");

            // // ❌ Validation: Check-in must be exactly `minCheckInDays` after today
            // if (!startDate.isSame(expectedCheckInDate, "day")) {
            //     showToast(`Check-in date must be exactly ${bookingDetails.minCheckInDays} days from today (${expectedCheckInDate.format("YYYY-MM-DD")}).`, "error");
            //     setLoading(false);
            //     return;
            // }

            // // ❌ Validation: Check-out must be exactly `maxCheckOutMonths` after check-in
            // if (!endDate.isSame(expectedCheckOutDate, "day")) {
            //     showToast(`Check-out must be exactly ${bookingDetails.maxCheckOutMonths} months from check-in (${expectedCheckOutDate.format("YYYY-MM-DD")}).`, "error");
            //     setLoading(false);
            //     return;
            // }

            // ✅ Submit data
            const response = await postRequest(`/add-or-update-booking-date`, bookingDetails);
            if (response.status === 201 || response.status === 200) {
                showToast(`Booking configuration ${isUpdating ? "updated" : "added"} successfully!`, "success");
                fetchBookingConfig();
            } else {
                showToast(response.message || "Failed to save configuration. Please try again.", "error");
            }
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to save booking configuration.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ pt: "80px", px: 4, pb: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: "center", fontWeight: "bold", color: "#1976d2" }}>
                {isUpdating ? "Update Booking Date Configuration" : "Add Booking Date Configuration"}
            </Typography>

            <Paper elevation={3} sx={{ p: 4, maxWidth: "600px", margin: "0 auto", borderRadius: "16px" }}>
                {loading ? (
                    <Box sx={{ textAlign: "center" }}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Minimum Check-In Days"
                                name="minCheckInDays"
                                type="number"
                                fullWidth
                                value={bookingDetails.minCheckInDays}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                                helperText="How many days after today is check-in allowed?"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Maximum Check-Out Months"
                                name="maxCheckOutMonths"
                                type="number"
                                fullWidth
                                value={bookingDetails.maxCheckOutMonths}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                                helperText="How many months after check-in is check-out allowed?"
                            />
                        </Grid>

                        {/* <Grid item xs={12}>
                            <TextField
                                label="Booking Start Date"
                                name="bookingStartDate"
                                type="date"
                                fullWidth
                                value={bookingDetails.bookingStartDate}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                                helperText="The first date bookings can be made."
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Booking End Date"
                                name="bookingEndDate"
                                type="date"
                                fullWidth
                                value={bookingDetails.bookingEndDate}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                                helperText="The last date bookings can be made."
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid> */}

                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{ mt: 2, py: 1.5, fontSize: "16px" }}
                            >
                                {isUpdating ? "Update Configuration" : "Add Configuration"}
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </Paper>
        </Box>
    );
};

export default AddOrUpdateBookingDate;
