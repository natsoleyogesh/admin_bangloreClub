// import React, { useEffect, useState } from "react";
// import { Box, Button, Typography } from "@mui/material";
// import { FiPlus } from "react-icons/fi";
// import { Link } from "react-router-dom";
// import ConfirmationDialog from "../../../api/ConfirmationDialog";
// import Table from "../../../components/Table";
// import { deleteBanquetBooking, fetchAllBanquetBookingss } from "../../../api/banquet";


// const Bookings = () => {
//     const [bookings, setBookings] = useState([]);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedBooking, setSelectedBooking] = useState(null);

//     // Utility function to format dates
//     const formatDate = (dateString) => {
//         const options = { year: "numeric", month: "long", day: "numeric" };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };

//     // Table columns definition
//     const columns = [
//         { accessorKey: "eventId.eventTitle", header: "Event Title" },
//         { accessorKey: "eventId.eventDate", header: "Event Date", Cell: ({ cell }) => formatDate(cell.getValue()) },
//         { accessorKey: "primaryMemberId.name", header: "Primary Member" },
//         { accessorKey: "bookingStatus", header: "Booking Status" },
//         { accessorKey: "ticketDetails.totalAmount", header: "Total Amount" },
//         {
//             accessorKey: "createdAt",
//             header: "Created Date",
//             Cell: ({ cell }) => formatDate(cell.getValue()),
//         },
//     ];

//     // Fetch all bookings
//     const fetchBookings = async () => {
//         try {
//             const response = await fetchAllBanquetBookingss();
//             setBookings(response?.data?.bookings || []);
//         } catch (error) {
//             console.error("Error fetching bookings:", error);
//             showToast("Failed to fetch bookings. Please try again.", "error");
//         }
//     };

//     // Fetch bookings on component mount
//     useEffect(() => {
//         fetchBookings();
//     }, []);

//     // Handle delete confirmation dialog
//     const handleDeleteClick = (booking) => {
//         setSelectedBooking(booking);
//         setOpenDialog(true);
//     };

//     // Confirm and delete booking
//     const handleConfirmDelete = async () => {
//         try {
//             if (selectedBooking) {
//                 await deleteBanquetBooking(selectedBooking._id);
//                 showToast("Booking deleted successfully.", "success");
//                 fetchBookings(); // Refresh bookings list
//             }
//         } catch (error) {
//             console.error("Error deleting booking:", error);
//             showToast("Failed to delete booking. Please try again.", "error");
//         } finally {
//             setOpenDialog(false);
//             setSelectedBooking(null);
//         }
//     };

//     // Cancel delete dialog
//     const handleCancelDelete = () => {
//         setOpenDialog(false);
//         setSelectedBooking(null);
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             {/* Header Section */}
//             <Box
//                 sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     mb: 2,
//                 }}
//             >
//                 <Typography variant="h6">Event Bookings</Typography>
//                 <Link to="/booking/add" style={{ textDecoration: "none" }}>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<FiPlus />}
//                         sx={{ borderRadius: "20px" }}
//                     >
//                         Create Booking
//                     </Button>
//                 </Link>
//             </Box>

//             {/* Bookings Table */}
//             <Table
//                 data={bookings}
//                 fields={columns}
//                 numberOfRows={bookings.length}
//                 enableTopToolBar
//                 enableBottomToolBar
//                 enablePagination
//                 enableRowSelection
//                 enableColumnFilters
//                 enableEditing
//                 enableColumnDragging
//                 showPreview
//                 routeLink="booking"
//                 handleDelete={handleDeleteClick}
//             />

//             {/* Delete Confirmation Dialog */}
//             <ConfirmationDialog
//                 open={openDialog}
//                 title="Delete Booking"
//                 message={`Are you sure you want to delete the booking for "${selectedBooking?.primaryMemberId?.name}"? This action cannot be undone.`}
//                 onConfirm={handleConfirmDelete}
//                 onCancel={handleCancelDelete}
//                 confirmText="Delete"
//                 cancelText="Cancel"
//                 loadingText="Deleting..."
//             />
//         </Box>
//     );
// };

// export default Bookings;

import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Grid, Paper, List, ListItem, ListItemText, InputLabel, FormControl, Select, MenuItem, TextField } from "@mui/material";
import { FiPlus, FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import Table from "../../../components/Table";
import { deleteBanquetBooking, fetchAllBanquetBookingss } from "../../../api/banquet";
import { showToast } from "../../../api/toast";
import { formatDateTime } from "../../../api/config";
import { fetchAllMembers } from "../../../api/member";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// Utility function to format dates
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Utility function to format time in AM/PM
const formatTime = (time) => {
    if (!time) return "N/A";
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loading, setLoading] = useState(null);

    const [filterType, setFilterType] = useState("all");
    const [bookingStatus, setBookingStatus] = useState("all");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    const [userId, setUserId] = useState("all");
    const [activeMembers, setActiveMembers] = useState([]);

    // Table columns definition
    const columns = [
        { accessorKey: "primaryMemberId.memberId", header: "MemberShip ID" },
        { accessorKey: "primaryMemberId.name", header: "Member Name" },
        { accessorKey: "banquetType.banquetName.name", header: "Banquet Name" },
        { accessorKey: "occasion", header: "Occasion" },
        { accessorKey: "attendingGuests", header: "Guests" },
        { accessorKey: "bookingStatus", header: "Status" },
        {
            accessorKey: "bookingDates.checkIn",
            header: "Check-In",
            Cell: ({ cell }) => formatDate(cell.getValue()),
        },
        {
            accessorKey: "bookingDates.checkOut",
            header: "Check-Out",
            Cell: ({ cell }) => formatDate(cell.getValue()),
        },
        {
            accessorKey: "bookingTime.from",
            header: "Booking Time",
            Cell: ({ row }) =>
                `${formatTime(row.original.bookingTime.from)} - ${formatTime(row.original.bookingTime.to)}`,
        },
        { accessorKey: "banquetPrice", header: "Price" },
        { accessorKey: "paymentStatus", header: "Payment Status" },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    // Fetch all bookings
    const fetchBookings = async () => {
        setLoading(true)
        try {

            const queryParams = {
                filterType,
                customStartDate: customStartDate || undefined,
                customEndDate: customEndDate || undefined,
            };
            if (bookingStatus !== "all") {
                queryParams.bookingStatus = bookingStatus
            }
            if (userId !== "all") {
                queryParams.userId = userId;
            }

            const response = await fetchAllBanquetBookingss(queryParams);
            setBookings(response?.data?.bookings || []);
            setLoading(false)
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setBookings([]);
            showToast(error.response.data.message || "Failed to fetch bookings. Please try again.", "error");
            setLoading(false)
        }
    };

    // Fetch bookings on component mount
    useEffect(() => {
        fetchBookings();
    }, [filterType, bookingStatus, customStartDate, customEndDate, userId]);

    // Handle delete confirmation dialog
    const handleDeleteClick = (booking) => {
        setSelectedBooking(booking);
        setOpenDialog(true);
    };

    // Confirm and delete booking
    const handleConfirmDelete = async () => {
        try {
            if (selectedBooking) {
                await deleteBanquetBooking(selectedBooking._id);
                showToast("Booking deleted successfully.", "success");
                fetchBookings(); // Refresh bookings list
            }
        } catch (error) {
            console.error("Error deleting booking:", error);
            showToast("Failed to delete booking. Please try again.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedBooking(null);
        }
    };

    // Cancel delete dialog
    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedBooking(null);
    };

    const getActiveMembers = async () => {
        try {
            const response = await fetchAllMembers();
            setActiveMembers(response.users);
        } catch (error) {
            console.error("Failed to fetch members :", error);
            // showToast("Failed to fetch Members. Please try again.", "error");
        }
    };

    // Fetch billings on component mount and when filters change
    useEffect(() => {
        getActiveMembers();
    }, []);


    // Export to PDF
    const exportToPDF = () => {
        try {
            const doc = new jsPDF();
            doc.text("Banquet Booking Records", 10, 10);

            // Table Headers
            const tableHeaders = [
                "Membership ID", "Member Name", "Banquet Name", "Guests", "Status",
                "Check-In", "Booking Time", "Price", "Date"
            ];

            // Table Rows
            const tableRows = bookings.map((row) => [
                row.primaryMemberId?.memberId || "N/A",
                row.primaryMemberId?.name || "N/A",
                row.banquetType?.banquetName?.name || "N/A",
                row.attendingGuests || "N/A",
                row.bookingStatus || "N/A",
                formatDate(row.bookingDates?.checkIn),
                `${formatTime(row.bookingTime?.from)} - ${formatTime(row.bookingTime?.to)}`,
                row.banquetPrice || "N/A",
                formatDateTime(row.createdAt),
            ]);

            // Generate the table
            autoTable(doc, {
                head: [tableHeaders],
                body: tableRows,
            });

            // Save the PDF
            doc.save("banquetbookings.pdf");
        } catch (error) {
            console.error("Error exporting to PDF:", error);
        }
    };

    // Export to CSV
    const exportToCSV = () => {
        try {
            const csvData = bookings.map((row) => ({
                "Membership ID": row.primaryMemberId?.memberId || "N/A",
                "Member Name": row.primaryMemberId?.name || "N/A",
                "Banquet Name": row.banquetType?.banquetName?.name || "N/A",
                "Guests": row.attendingGuests || "N/A",
                "Status": row.bookingStatus || "N/A",
                "Check-In": formatDate(row.bookingDates?.checkIn),
                "Booking Time": `${formatTime(row.bookingTime?.from)} - ${formatTime(row.bookingTime?.to)}`,
                "Price": row.banquetPrice || "N/A",
                "Date": formatDateTime(row.createdAt),
            }));

            const worksheet = XLSX.utils.json_to_sheet(csvData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
            XLSX.writeFile(workbook, "banquetbookings.csv");
        } catch (error) {
            console.error("Error exporting to CSV:", error);
        }
    };

    // Export to XLS
    const exportToXLS = () => {
        try {
            const xlsData = bookings.map((row) => ({
                "Membership ID": row.primaryMemberId?.memberId || "N/A",
                "Member Name": row.primaryMemberId?.name || "N/A",
                "Banquet Name": row.banquetType?.banquetName?.name || "N/A",
                "Guests": row.attendingGuests || "N/A",
                "Status": row.bookingStatus || "N/A",
                "Check-In": formatDate(row.bookingDates?.checkIn),
                "Booking Time": `${formatTime(row.bookingTime?.from)} - ${formatTime(row.bookingTime?.to)}`,
                "Price": row.banquetPrice || "N/A",
                "Date": formatDateTime(row.createdAt),
            }));

            const worksheet = XLSX.utils.json_to_sheet(xlsData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
            XLSX.writeFile(workbook, "banquetbookings.xlsx");
        } catch (error) {
            console.error("Error exporting to XLS:", error);
        }
    };



    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            {/* Header Section */}
            {/* <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            > */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }} >Banquet Bookings</Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Select Member</InputLabel>
                        <FormControl fullWidth size="small">

                            <Select
                                name="userId"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                            >
                                <MenuItem value="all">All</MenuItem>
                                {activeMembers.map((member) => (
                                    <MenuItem key={member._id} value={member._id}>
                                        {member.name} (ID: {member.memberId})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Filter Type</InputLabel>
                        <FormControl fullWidth size="small">
                            <Select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <MenuItem value="today">Today</MenuItem>
                                <MenuItem value="last7days">Last 7 Days</MenuItem>
                                <MenuItem value="lastMonth">Last Month</MenuItem>
                                <MenuItem value="lastThreeMonths">Last 3 Months</MenuItem>
                                <MenuItem value="lastSixMonths">Last 6 Months</MenuItem>
                                <MenuItem value="last1year">Last 1 Year</MenuItem>
                                <MenuItem value="custom">Custom</MenuItem>
                                <MenuItem value="all">All</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Booking Status</InputLabel>
                        <FormControl fullWidth size="small">
                            <Select
                                value={bookingStatus}
                                onChange={(e) => setBookingStatus(e.target.value)}
                            >
                                <MenuItem value="Confirmed">Confirmed</MenuItem>
                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="all">All</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {filterType === "custom" && (
                        <>
                            <Grid item xs={12} sm={3} md={2}>
                                <TextField
                                    label="Start Date"
                                    type="date"
                                    fullWidth
                                    size="small"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3} md={2}>
                                <TextField
                                    label="End Date"
                                    type="date"
                                    fullWidth
                                    size="small"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </>
                    )}
                </Grid>
                <Box sx={{ mt: 3 }}>
                    <Button variant="contained" color="primary" onClick={exportToPDF} sx={{ mr: 1 }}>
                        Export to PDF
                    </Button>
                    <Button variant="contained" color="primary" onClick={exportToCSV} sx={{ mr: 1 }}>
                        Export to CSV
                    </Button>
                    <Button variant="contained" color="primary" onClick={exportToXLS}>
                        Export to XLS
                    </Button>
                </Box>
            </Box>

            {/* Bookings Table */}
            <Table
                data={bookings}
                fields={columns}
                numberOfRows={bookings.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="banquet-booking"
                // handleDelete={handleDeleteClick}
                isLoading={loading}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={openDialog}
                title="Delete Booking"
                message={`Are you sure you want to delete the booking for "${selectedBooking?._id}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />

            {/* Detailed Booking Information
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Booking Details
            </Typography>
            {bookings.map((booking, index) => (
                <Paper key={index} sx={{ p: 3, mb: 3, borderRadius: "12px", border: "1px solid #ddd" }}>
                    <Typography variant="body1">
                        <strong>Member Name:</strong> {booking.primaryMemberId?.name || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Occasion:</strong> {booking.occasion || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Attending Guests:</strong> {booking.attendingGuests || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Booking Status:</strong> {booking.bookingStatus || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Payment Status:</strong> {booking.paymentStatus || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Price:</strong> ₹{booking.banquetPrice || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Booking Time:</strong>{" "}
                        {`${formatTime(booking.bookingTime?.from)} - ${formatTime(booking.bookingTime?.to)}`}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Address:</strong> {booking.address || "N/A"}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        <strong>Tax Details:</strong>
                    </Typography>
                    <List>
                        {booking.pricingDetails?.taxTypes?.map((tax, idx) => (
                            <ListItem key={idx}>
                                <ListItemText
                                    primary={`${tax.taxType}: ₹${tax.taxAmount} (${tax.taxRate}%)`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            ))} */}
        </Box>
    );
};

export default Bookings;


