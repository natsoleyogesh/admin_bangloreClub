import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography, Grid, Paper, List, ListItem, ListItemText, InputLabel, FormControl, Select, MenuItem, TextField, Autocomplete, CircularProgress } from "@mui/material";
import { FiPlus, FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import Table from "../../../components/Table";
import { deleteBanquetBooking, fetchAllBanquetBookingss } from "../../../api/banquet";
import { showToast } from "../../../api/toast";
import { formatDateMoment, formatDateTime, formatTime } from "../../../api/config";
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
// const formatTime = (time) => {
//     if (!time) return "N/A";
//     const [hours, minutes] = time.split(":").map(Number);
//     const period = hours >= 12 ? "PM" : "AM";
//     const adjustedHours = hours % 12 || 12;
//     return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
// };

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loading, setLoading] = useState(null);
    const [fetching, setFetching] = useState(false); // To show loading while fetching users

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

    const [loadingExport, setLoadingExport] = useState(false);


    // Table columns definition
    const columns = [
        { accessorKey: "primaryMemberId.memberId", header: "MemberShip ID" },
        { accessorKey: "primaryMemberId.name", header: "Member Name" },
        { accessorKey: "banquetType.banquetName.name", header: "Banquet Name" },
        { accessorKey: "occasion", header: "Occasion" },
        { accessorKey: "attendingGuests", header: "Guests" },
        { accessorKey: "bookingStatus", header: "Status" },
        {
            accessorKey: "billable",
            header: "Billable Type",
            Cell: ({ row }) => (
                row.original.billable === true
                    ? <Typography color="green">Billable</Typography>
                    : <Typography color="red">Non-Billable</Typography>
            ),
        },

        {
            accessorKey: "bookingDates.checkIn",
            header: "Booking Date",
            Cell: ({ cell }) => formatDateMoment(cell.getValue()),
        },
        // {
        //     accessorKey: "bookingDates.checkOut",
        //     header: "Check-Out",
        //     Cell: ({ cell }) => formatDate(cell.getValue()),
        // },
        {
            accessorKey: "bookingTime.from",
            header: "Booking Time",
            Cell: ({ row }) =>
                `${formatTime(row.original.bookingTime.from)} - ${formatTime(row.original.bookingTime.to)}`,
        },
        { accessorKey: "banquetPrice", header: "Price" },
        // { accessorKey: "paymentStatus", header: "Payment Status" },
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

    //         const response = await fetchAllBanquetBookingss(queryParams);
    //         setBookings(response?.data?.bookings || []);
    //         setLoading(false)
    //     } catch (error) {
    //         console.error("Error fetching bookings:", error);
    //         setBookings([]);
    //         showToast(error.response.data.message || "Failed to fetch bookings. Please try again.", "error");
    //         setLoading(false)
    //     }
    // };

    // // Fetch bookings on component mount
    // useEffect(() => {
    //     fetchBookings();
    // }, [filterType, bookingStatus, customStartDate, customEndDate, userId]);

    // Fetch all bookings with pagination
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const queryParams = {
                filterType,
                customStartDate: customStartDate || undefined,
                customEndDate: customEndDate || undefined,
                page,
                limit,
            };
            if (bookingStatus !== "all") queryParams.bookingStatus = bookingStatus;
            if (userId !== "all") queryParams.userId = userId;

            const response = await fetchAllBanquetBookingss(queryParams);
            setBookings(response?.data?.bookings || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalBookings || 0);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            showToast(error.response?.data?.message || "Failed to fetch bookings.", "error");
        } finally {
            setLoading(false);
        }
    };

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

    const fetchExportData = async ({ filterType, customStartDate, customEndDate, bookingStatus, userId, exportData }) => {
        try {
            setLoadingExport(true); // Hide loading 
            const queryParams = {};

            if (filterType !== "all") queryParams.filterType = filterType;
            if (bookingStatus !== "all") queryParams.bookingStatus = bookingStatus;
            if (userId !== "all") queryParams.userId = userId;
            if (customStartDate) queryParams.customStartDate = customStartDate;
            if (customEndDate) queryParams.customEndDate = customEndDate;
            if (exportData) queryParams.exportData = exportData;
            // Generate query string correctly
            const queryString = new URLSearchParams(queryParams).toString();

            // Show toast message before export starts
            showToast("📤 Fetching data for export...", "info");

            // Fetch full data for export
            const response = await getRequest(`/banquet-bookings?${queryString}`);
            setLoadingExport(false); // Hide loading
            if (!response || !response.data) {
                showToast("❌ No data available for export.", "error");
                return null;
            }
            return response.data; // Returns billings & totals
        } catch (error) {
            setLoadingExport(false);
            console.error("❌ Error fetching export data:", error);
            showToast("❌ Error fetching export data. Try again.", "error");
            return null;
        }
    };

    // Export to PDF
    const exportToPDF = async (exportParams) => {
        try {
            setLoadingExport(true);
            showToast("📤 Fetching data for PDF export...", "info");
            const data = await fetchExportData(exportParams);
            if (!data) return; // Prevent exporting if no data

            const { bookings } = data;
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
            setLoadingExport(false);
            showToast("✅ PDF Exported Successfully!", "success");


        } catch (error) {
            console.error("Error exporting to PDF:", error);
        }
    };

    // Export to CSV
    const exportToCSV = async (exportParams) => {
        try {
            setLoadingExport(true);
            showToast("📤 Fetching data for CSV export...", "info");
            const data = await fetchExportData(exportParams);
            if (!data) return; // Prevent exporting if no data

            const { bookings } = data;
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
            setLoadingExport(false);
            showToast("✅ CSV Exported Successfully!", "success");

        } catch (error) {
            console.error("Error exporting to CSV:", error);
        }
    };

    // Export to XLS
    const exportToXLS = async (exportParams) => {
        try {
            setLoadingExport(true);
            showToast("📤 Fetching data for XSL export...", "info");
            const data = await fetchExportData(exportParams);
            if (!data) return; // Prevent exporting if no data

            const { transactions } = data;
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
            setLoadingExport(false);
            showToast("✅ XSL Exported Successfully!", "success");

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
                    {/* <Button variant="contained" color="primary" onClick={exportToPDF} sx={{ mr: 1 }}>
                        Export to PDF
                    </Button>
                    <Button variant="contained" color="primary" onClick={exportToCSV} sx={{ mr: 1 }}>
                        Export to CSV
                    </Button>
                    <Button variant="contained" color="primary" onClick={exportToXLS}>
                        Export to XLS
                    </Button> */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => await exportToPDF({
                            filterType,
                            customStartDate,
                            customEndDate,
                            bookingStatus,
                            userId,
                            exportData: true
                        })}
                        sx={{ mr: 1 }}
                        disabled={loadingExport}
                    >
                        {loadingExport ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Export to PDF"}
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => await exportToCSV({
                            filterType,
                            customStartDate,
                            customEndDate,
                            bookingStatus,
                            userId,
                            exportData: true
                        })}
                        sx={{ mr: 1 }}
                        disabled={loadingExport}
                    >
                        {loadingExport ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Export to CSV"}
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => await exportToXLS({
                            filterType,
                            customStartDate,
                            customEndDate,
                            bookingStatus,
                            userId,
                            exportData: true
                        })}
                        disabled={loadingExport}
                    >
                        {loadingExport ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Export to XLS"}
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

export default Bookings;


