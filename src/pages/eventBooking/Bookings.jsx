// import React, { useEffect, useState } from "react";
// import { Box, Button, Typography } from "@mui/material";
// import { FiPlus } from "react-icons/fi";
// import { Link } from "react-router-dom";
// import Table from "../components/Table";
// import { showToast } from "../api/toast";
// import { fetchAllFAQs, deleteFAQ } from "../api/faq";
// import ConfirmationDialog from "../api/ConfirmationDialog";
// import { deleteBooking, fetchAllBookings } from "../../api/event";

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
//         { accessorKey: "question", header: "FAQ Question" },
//         { accessorKey: "answer", header: "FAQ Answer" },
//         { accessorKey: "category", header: "FAQ Category" },
//         { accessorKey: "status", header: "Status" },
//         {
//             accessorKey: "createdAt",
//             header: "Created Date",
//             Cell: ({ cell }) => formatDate(cell.getValue()),
//         },
//     ];

//     // Fetch all FAQs
//     const fetchBookings = async () => {
//         try {
//             const response = await fetchAllBookings();
//             setBookings(response?.data?.bookings || []);
//         } catch (error) {
//             console.error("Error fetching FAQs:", error);
//             showToast("Failed to fetch FAQs. Please try again.", "error");
//         }
//     };

//     // Fetch FAQs on component mount
//     useEffect(() => {
//         fetchBookings();
//     }, []);

//     // Handle delete confirmation dialog
//     const handleDeleteClick = (booking) => {
//         setSelectedBooking(booking);
//         setOpenDialog(true);
//     };

//     // Confirm and delete FAQ
//     const handleConfirmDelete = async () => {
//         try {
//             if (selectedBooking) {
//                 await deleteBooking(selectedBooking._id);
//                 showToast("Booking deleted successfully.", "success");
//                 fetchBookings(); // Refresh FAQ list
//             }
//         } catch (error) {
//             console.error("Error deleting booking:", error);
//             showToast("Failed to delete Booking. Please try again.", "error");
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
//                 <Typography variant="h6">Events Bookings</Typography>
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

//             {/* FAQs Table */}
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
//                 routeLink="faq"
//                 handleDelete={handleDeleteClick}
//             />

//             {/* Delete Confirmation Dialog */}
//             <ConfirmationDialog
//                 open={openDialog}
//                 title="Delete FAQ"
//                 message={`Are you sure you want to delete the Booking "${selectedBooking?.question}"? This action cannot be undone.`}
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
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import { showToast } from "../../api/toast";
import { deleteBooking, fetchAllBookings } from "../../api/event";
import ConfirmationDialog from "../../api/ConfirmationDialog";
import { formatDateTime } from "../../api/config";

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loading, setLoading] = useState(null)
    // Utility function to format dates
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Table columns definition
    const columns = [
        { accessorKey: "eventId.eventTitle", header: "Event Title" },
        { accessorKey: "eventId.eventStartDate", header: "Event Start Date", Cell: ({ cell }) => formatDate(cell.getValue()) },
        { accessorKey: "eventId.eventEndDate", header: "Event End Date", Cell: ({ cell }) => formatDate(cell.getValue()) },
        { accessorKey: "primaryMemberId.name", header: "Primary Member" },
        { accessorKey: "bookingStatus", header: "Booking Status" },
        { accessorKey: "ticketDetails.totalAmount", header: "Total Amount" },
        // {
        //     accessorKey: "createdAt",
        //     header: "Created Date",
        //     Cell: ({ cell }) => formatDate(cell.getValue()),
        // },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()), // Format as date and time
        },
    ];

    // Fetch all bookings
    const fetchBookings = async () => {
        setLoading(true)
        try {
            const response = await fetchAllBookings();
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
                await deleteBooking(selectedBooking._id);
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
                <Typography variant="h6">Event Bookings</Typography>
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
                routeLink="booking"
                handleDelete={handleDeleteClick}
                isLoading={loading}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={openDialog}
                title="Delete Booking"
                message={`Are you sure you want to delete the booking for "${selectedBooking?.primaryMemberId?.name}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Bookings;

