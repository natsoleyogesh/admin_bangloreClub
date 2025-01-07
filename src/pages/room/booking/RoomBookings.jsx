// import React, { useEffect, useState } from "react";
// import { Box, Button, Typography, Grid, Paper, List, ListItem, ListItemText } from "@mui/material";
// import { FiPlus, FiTrash } from "react-icons/fi";
// import { Link } from "react-router-dom";
// import ConfirmationDialog from "../../../api/ConfirmationDialog";
// import Table from "../../../components/Table";
// import { showToast } from "../../../api/toast";
// import { deleteRoomBooking, fetchAllRoomBookingss } from "../../../api/room";

// // Utility function to format dates
// const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const options = { year: "numeric", month: "long", day: "numeric" };
//     return new Date(dateString).toLocaleDateString(undefined, options);
// };

// // Utility function to format time in AM/PM
// const formatTime = (time) => {
//     if (!time) return "N/A";
//     const [hours, minutes] = time.split(":").map(Number);
//     const period = hours >= 12 ? "PM" : "AM";
//     const adjustedHours = hours % 12 || 12;
//     return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
// };

// const RoomBookings = () => {
//     const [bookings, setBookings] = useState([]);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedBooking, setSelectedBooking] = useState(null);

//     // Table columns definition
//     const columns = [
//         { accessorKey: "primaryMemberId.name", header: "Member Name" },
//         { accessorKey: "occasion", header: "Occasion" },
//         { accessorKey: "attendingGuests", header: "Guests" },
//         { accessorKey: "bookingStatus", header: "Status" },
//         {
//             accessorKey: "bookingDates.checkIn",
//             header: "Check-In",
//             Cell: ({ cell }) => formatDate(cell.getValue()),
//         },
//         {
//             accessorKey: "bookingDates.checkOut",
//             header: "Check-Out",
//             Cell: ({ cell }) => formatDate(cell.getValue()),
//         },
//         {
//             accessorKey: "bookingTime.from",
//             header: "Booking Time",
//             Cell: ({ row }) =>
//                 `${formatTime(row.original.bookingTime.from)} - ${formatTime(row.original.bookingTime.to)}`,
//         },
//         { accessorKey: "banquetPrice", header: "Price" },
//         { accessorKey: "paymentStatus", header: "Payment Status" },
//         {
//             accessorKey: "createdAt",
//             header: "Created At",
//             Cell: ({ cell }) => formatDate(cell.getValue()),
//         },
//     ];

//     // Fetch all bookings
//     const fetchBookings = async () => {
//         try {
//             const response = await fetchAllRoomBookingss();
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
//                 await deleteRoomBooking(selectedBooking._id);
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
//                 <Typography variant="h6">Banquet Bookings</Typography>
//                 {/* <Link to="/booking/add" style={{ textDecoration: "none" }}>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<FiPlus />}
//                         sx={{ borderRadius: "20px" }}
//                     >
//                         Create Booking
//                     </Button>
//                 </Link> */}
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
//                 routeLink="banquet-booking"
//                 handleDelete={handleDeleteClick}
//             />

//             {/* Delete Confirmation Dialog */}
//             <ConfirmationDialog
//                 open={openDialog}
//                 title="Delete Booking"
//                 message={`Are you sure you want to delete the booking for "${selectedBooking?._id}"? This action cannot be undone.`}
//                 onConfirm={handleConfirmDelete}
//                 onCancel={handleCancelDelete}
//                 confirmText="Delete"
//                 cancelText="Cancel"
//                 loadingText="Deleting..."
//             />
//         </Box>
//     );
// };

// export default RoomBookings;




import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Grid, Paper, List, ListItem, ListItemText } from "@mui/material";
import { FiPlus, FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import Table from "../../../components/Table";
import { showToast } from "../../../api/toast";
import { deleteRoomBooking, fetchAllRoomBookingss } from "../../../api/room";
import { formatDateTime } from "../../../api/config";

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

const RoomBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loading, setLoading] = useState(null)
    // Table columns definition based on the provided structure
    const columns = [
        { accessorKey: "primaryMemberId.name", header: "Member Name" },
        { accessorKey: "primaryMemberId.email", header: "Email" },
        { accessorKey: "primaryMemberId.mobileNumber", header: "Mobile Number" },
        { accessorKey: "bookingStatus", header: "Status" },
        { accessorKey: "memberType", header: "Member Type" },
        { accessorKey: "bookingDates.checkIn", header: "Check-In", Cell: ({ cell }) => formatDate(cell.getValue()) },
        { accessorKey: "bookingDates.checkOut", header: "Check-Out", Cell: ({ cell }) => formatDate(cell.getValue()) },
        { accessorKey: "pricingDetails.final_totalAmount", header: "Total Amount" },
        { accessorKey: "pricingDetails.final_totalTaxAmount", header: "Total Tax Amount" },
        { accessorKey: "pricingDetails.extraBedTotal", header: "Extra Bed Charge" },
        { accessorKey: "guestContact", header: "Guest Contact" },

        // { accessorKey: "roomCategoryCounts.roomType.categoryName", header: "Room Category" },
        // { accessorKey: "roomCategoryCounts.roomCount", header: "Room Count" },
        // { accessorKey: "roomCategoryCounts.roomPrice", header: "Room Price" },
        // { accessorKey: "roomCategoryCounts.extraBedPrice", header: "Extra Bed Price" },
        // { accessorKey: "roomCategoryCounts.specialDayTariff", header: "Special Day Tariff" },
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
            const response = await fetchAllRoomBookingss();
            setBookings(response?.data?.bookings || []);
            setLoading(false)
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setLoading(false)
            showToast("Failed to fetch bookings. Please try again.", "error");
        }
    };

    // Fetch bookings on component mount
    useEffect(() => {
        fetchBookings();
    }, []);

    // Handle delete confirmation dialog
    const handleDeleteClick = (booking) => {
        setSelectedBooking(booking);
        setOpenDialog(true);
    };

    // Confirm and delete booking
    const handleConfirmDelete = async () => {
        try {
            if (selectedBooking) {
                await deleteRoomBooking(selectedBooking._id);
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

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            {/* Header Section */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Typography variant="h6">Banquet Bookings</Typography>
                {/* <Link to="/booking/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Create Booking
                    </Button>
                </Link> */}
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
                routeLink="room-booking"
                handleDelete={handleDeleteClick}
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
        </Box>
    );
};

export default RoomBookings;
