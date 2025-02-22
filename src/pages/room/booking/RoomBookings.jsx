import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography, Grid, Paper, List, ListItem, ListItemText, InputLabel, FormControl, Select, MenuItem, TextField, Autocomplete, CircularProgress } from "@mui/material";
import { FiPlus, FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import Table from "../../../components/Table";
import { showToast } from "../../../api/toast";
import { deleteRoomBooking, fetchAllRoomBookingss } from "../../../api/room";
import { formatDateTime } from "../../../api/config";
import { fetchAllMembers } from "../../../api/member";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import debounce from "lodash.debounce";
import { getRequest } from "../../../api/commonAPI";


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
    const [loading, setLoading] = useState(null);
    const [fetching, setFetching] = useState(false); // To show loading while fetching users
    // Table columns definition based on the provided structure

    const [filterType, setFilterType] = useState("today");
    const [bookingStatus, setBookingStatus] = useState("all");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    const [userId, setUserId] = useState("all");
    const [activeMembers, setActiveMembers] = useState([]);

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    // User Search & Infinite Scroll State
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [userPage, setUserPage] = useState(1);
    const [userTotalPages, setUserTotalPages] = useState(1);
    const [fetchingUsers, setFetchingUsers] = useState(false);
    const [hasMoreUsers, setHasMoreUsers] = useState(true);
    const scrollRef = useRef(null);

    const columns = [
        { accessorKey: "primaryMemberId.memberId", header: "MemberShip ID" },
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
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    // // Fetch all bookings
    // const fetchBookings = async () => {
    //     setLoading(true)
    //     try {
    //         const queryParams = {
    //             filterType,
    //             customStartDate: customStartDate || undefined,
    //             customEndDate: customEndDate || undefined,
    //         };
    //         if (bookingStatus !== "all") {
    //             queryParams.bookingStatus = bookingStatus
    //         }
    //         if (userId !== "all") {
    //             queryParams.userId = userId;
    //         }
    //         const response = await fetchAllRoomBookingss(queryParams);
    //         setBookings(response?.data?.bookings || []);
    //         setLoading(false)
    //     } catch (error) {
    //         console.error("Error fetching bookings:", error);
    //         setBookings([])
    //         setLoading(false)
    //         showToast(error.response.data.message || "Failed to fetch bookings. Please try again.", "error");
    //     }
    // };

    // // Fetch bookings on component mount
    // useEffect(() => {
    //     fetchBookings();
    // }, [filterType, bookingStatus, customStartDate, customEndDate, userId]);

    // Fetch bookings with pagination
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const queryParams = {
                filterType,
                page,
                limit,
                ...(customStartDate && { customStartDate }),
                ...(customEndDate && { customEndDate }),
            };
            if (bookingStatus !== "all") {
                queryParams.bookingStatus = bookingStatus;
            }
            if (userId !== "all") {
                queryParams.userId = userId;
            }

            const response = await fetchAllRoomBookingss(queryParams);
            setBookings(response?.data?.bookings || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalBookings || 0);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setBookings([]);
            showToast(error.response?.data?.message || "Failed to fetch bookings.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch bookings when filters change
    useEffect(() => {
        fetchBookings();
    }, [filterType, bookingStatus, customStartDate, customEndDate, userId, page, limit]);

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

    /** 📌 Fetch Users for Autocomplete with Pagination */
    const fetchUsers = async ({ search = "", page = 1, reset = false }) => {
        if (fetchingUsers || page > userTotalPages) return;

        setFetchingUsers(true);
        try {
            const response = await getRequest(`/admin/get-users?search=${search}&page=${page}&limit=10`);
            setUsers((prevUsers) => (reset ? response.data.users : [...prevUsers, ...response.data.users]));
            setUserTotalPages(response.data.pagination.totalPages);
            setUserPage(page);
            setHasMoreUsers(page < response.data.pagination.totalPages);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setFetchingUsers(false);
        }
    };

    /** 📌 Debounced function to optimize API calls while searching */
    const debouncedFetchUsers = debounce((query) => fetchUsers({ search: query, page: 1, reset: true }), 500);

    /** 📌 Fetch Users on Component Mount */
    useEffect(() => {
        fetchUsers({ search: "", page: 1, reset: true });
    }, []);

    /** 📌 Handle Search Change */
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        debouncedFetchUsers(query);
    };

    /** 📌 Handle User Selection */
    const handleUserChange = (event, selectedUser) => {
        setUserId(selectedUser ? selectedUser._id : "all");
    };

    /** 📌 Handle Scroll to Fetch More Users */
    const handleScroll = (event) => {
        const bottom = event.target.scrollHeight - event.target.scrollTop <= event.target.clientHeight + 20;
        if (bottom && hasMoreUsers) {
            fetchUsers({ search: searchQuery, page: userPage + 1, reset: false });
        }
    };

    // // Export to PDF
    const exportToPDF = () => {
        try {
            const doc = new jsPDF();
            doc.text("Booking Records", 10, 10);

            // Table Headers
            const tableHeaders = [
                "Membership ID", "Member Name", "Email", "Mobile Number", "Status",
                "Total Amount", "Date", "Check-In", "Check-Out"
            ];

            // Table Rows
            const tableRows = bookings.map((row) => [
                row.primaryMemberId?.memberId || "N/A",
                row.primaryMemberId?.name || "N/A",
                row.primaryMemberId?.email || "N/A",
                row.primaryMemberId?.mobileNumber || "N/A",
                row.bookingStatus || "N/A",
                `${row.pricingDetails?.final_totalAmount || 0}`,
                formatDateTime(row.createdAt),
                formatDate(row.bookingDates.checkIn),
                formatDate(row.bookingDates.checkOut)
            ]);

            // Generate the table
            autoTable(doc, {
                head: [tableHeaders],
                body: tableRows,
            });

            // Save the PDF
            doc.save("roombookings.pdf");
        } catch (error) {
            console.error("Error exporting to PDF:", error);
        }
    };

    // const exportToPDF = () => {
    //     try {
    //         const doc = new jsPDF();
    //         doc.setFontSize(16);
    //         doc.text("Room Booking Records", 14, 20);

    //         // Define table headers
    //         const tableHeaders = [
    //             { content: "Membership ID", styles: { halign: "center" } },
    //             { content: "Member Name", styles: { halign: "center" } },
    //             { content: "Email", styles: { halign: "center" } },
    //             { content: "Mobile Number", styles: { halign: "center" } },
    //             { content: "Status", styles: { halign: "center" } },
    //             { content: "Total Amount", styles: { halign: "center" } },
    //             { content: "Guest Contact", styles: { halign: "center" } },
    //             { content: "Date", styles: { halign: "center" } },
    //         ];

    //         // Map table rows with proper field values
    //         const tableRows = bookings.map((row) => [
    //             row.primaryMemberId?.memberId || "N/A",
    //             row.primaryMemberId?.name || "N/A",
    //             row.primaryMemberId?.email || "N/A",
    //             row.primaryMemberId?.mobileNumber || "N/A",
    //             row.bookingStatus || "N/A",
    //             formatDate(row.bookingDates?.checkIn),
    //             formatDate(row.bookingDates?.checkOut),
    //             `${row.pricingDetails?.final_totalAmount || 0}`,
    //             row.guestContact || "N/A",
    //             formatDateTime(row.createdAt),
    //         ]);

    //         // Generate the table with improved layout
    //         autoTable(doc, {
    //             startY: 30,
    //             head: [tableHeaders],
    //             body: tableRows,
    //             styles: {
    //                 fontSize: 10,
    //                 cellPadding: 3,
    //                 overflow: "linebreak", // Enable wrapping for long text
    //                 valign: "middle", // Vertically align text in cells
    //             },
    //             headStyles: {
    //                 fillColor: [41, 128, 185], // Custom blue color for header
    //                 textColor: [255, 255, 255], // White text
    //                 fontStyle: "bold",
    //                 fontSize: 12, // Slightly larger font for headers
    //             },
    //             bodyStyles: {
    //                 textColor: [0, 0, 0], // Black text
    //             },
    //             alternateRowStyles: {
    //                 fillColor: [245, 245, 245], // Light gray background for alternate rows
    //             },
    //             columnStyles: {
    //                 0: { cellWidth: 30 }, // Membership ID
    //                 1: { cellWidth: 30 }, // Member Name
    //                 2: { cellWidth: 50 }, // Email
    //                 3: { cellWidth: 30 }, // Mobile Number
    //                 4: { cellWidth: 20 }, // Status
    //                 6: { cellWidth: 25 }, // Check-In
    //                 7: { cellWidth: 25 }, // Check-Out
    //                 8: { cellWidth: 30 }, // Total Amoun
    //                 11: { cellWidth: 30 }, // Guest Contact
    //                 12: { cellWidth: 40 }, // Created Date & Time
    //             },
    //             margin: { top: 25, left: 14, right: 14 },
    //             didDrawPage: (data) => {
    //                 // Add footer with page number
    //                 const pageCount = doc.internal.getNumberOfPages();
    //                 const pageHeight = doc.internal.pageSize.height;
    //                 doc.setFontSize(10);
    //                 doc.text(
    //                     `Page ${data.pageNumber} of ${pageCount}`,
    //                     data.settings.margin.left,
    //                     pageHeight - 10
    //                 );
    //             },
    //         });

    //         // Save the PDF
    //         doc.save("bookings.pdf");
    //     } catch (error) {
    //         console.error("Error exporting to PDF:", error);
    //     }
    // };

    // Export to CSV
    const exportToCSV = () => {
        try {
            const csvData = bookings.map((row) => ({
                "Membership ID": row.primaryMemberId?.memberId || "N/A",
                "Member Name": row.primaryMemberId?.name || "N/A",
                "Email": row.primaryMemberId?.email || "N/A",
                "Mobile Number": row.primaryMemberId?.mobileNumber || "N/A",
                "Status": row.bookingStatus || "N/A",
                "Total Amount": `${row.pricingDetails?.final_totalAmount || 0}`,
                "Date": formatDateTime(row.createdAt),
                "Check-In": formatDate(row.bookingDates.checkIn),
                "Check-Out": formatDate(row.bookingDates.checkOut)
            }));

            const worksheet = XLSX.utils.json_to_sheet(csvData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
            XLSX.writeFile(workbook, "roombookings.csv");
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
                "Email": row.primaryMemberId?.email || "N/A",
                "Mobile Number": row.primaryMemberId?.mobileNumber || "N/A",
                "Status": row.bookingStatus || "N/A",
                "Total Amount": `${row.pricingDetails?.final_totalAmount || 0}`,
                "Date": formatDateTime(row.createdAt),
                "Check-In": formatDate(row.bookingDates.checkIn),
                "Check-Out": formatDate(row.bookingDates.checkOut)
            }));

            const worksheet = XLSX.utils.json_to_sheet(xlsData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
            XLSX.writeFile(workbook, "roombookings.xlsx");
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
                <Typography variant="h6" sx={{ mb: 2 }} >Room Bookings</Typography>
                <Grid container spacing={2} alignItems="center">

                    <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Select Member</InputLabel>
                        <Autocomplete
                            options={users}
                            getOptionLabel={(option) => `${option.name} (${option.memberId})`}
                            value={users.find((user) => user._id === userId) || null}
                            onChange={handleUserChange}
                            loading={fetchingUsers}
                            ListboxProps={{
                                ref: scrollRef,
                                onScroll: handleScroll,
                                style: { maxHeight: 200, overflow: "auto" },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    onChange={handleSearchChange}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {fetchingUsers ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Filter Type</InputLabel>
                        <FormControl fullWidth size="small">
                            <Select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                sx={{ minHeight: "40px" }}  // Ensures same height as other inputs
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
                                sx={{ minHeight: "40px" }}  // Ensures same height as other inputs
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
                                <InputLabel>Custom Start Date</InputLabel>
                                <TextField
                                    // label="Start Date"
                                    type="date"
                                    fullWidth
                                    size="small"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ minHeight: "40px" }}  // Ensures same height as other inputs
                                />
                            </Grid>
                            <Grid item xs={12} sm={3} md={2}>
                                <InputLabel>Custom End Date</InputLabel>
                                <TextField
                                    // label="End Date"
                                    type="date"
                                    fullWidth
                                    size="small"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ minHeight: "40px" }}  // Ensures same height as other inputs
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
                routeLink="room-booking"
                // handleDelete={handleDeleteClick}
                isLoading={loading}
                pagination={{
                    page: page > 0 ? page : 1,
                    pageSize: limit > 0 ? limit : 10,
                    totalPages: totalPages || 1,
                    totalRecords: totalRecords || 0,
                    onPageChange: (newPage) => {
                        if (!isNaN(newPage) && newPage > 0) {
                            console.log("Setting Page to:", newPage);
                            setPage(newPage);
                        } else {
                            console.warn("Invalid page number received:", newPage);
                        }
                    },
                    onPageSizeChange: (newLimit) => {
                        if (!isNaN(newLimit) && newLimit > 0) {
                            console.log("Setting Page Size to:", newLimit);
                            setLimit(newLimit);
                        } else {
                            console.warn("Invalid page size received:", newLimit);
                        }
                    },
                }}
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
