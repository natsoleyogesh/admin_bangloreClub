
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Autocomplete, Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import Table from "../../components/Table";
import { showToast } from "../../api/toast";
import { deleteBooking, fetchAllBookings, fetchAllEvents } from "../../api/event";
import ConfirmationDialog from "../../api/ConfirmationDialog";
import { formatDateCommon, formatDateTime } from "../../api/config";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { fetchAllMembers } from "../../api/member";
import BookingsExport from "./bookingExports";
import debounce from "lodash.debounce";
import { getRequest } from "../../api/commonAPI";

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loading, setLoading] = useState(null);
    const [fetching, setFetching] = useState(false); // To show loading while fetching users

    const [filterType, setFilterType] = useState("currentMonth");
    const [bookingStatus, setBookingStatus] = useState("all");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    const [userId, setUserId] = useState("all");
    const [activeMembers, setActiveMembers] = useState([]);
    const [eventList, setEventList] = useState([]);
    const [eventfetching, setEventFetching] = useState(false); // To show loading while fetching users
    const [eventId, setEventId] = useState("all");


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

    // Utility function to format dates
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Table columns definition
    const columns = [
        { accessorKey: "eventId.eventTitle", header: "Event Title" },
        { accessorKey: "primaryMemberId.memberId", header: "MemberShip ID" },
        { accessorKey: "primaryMemberId.name", header: "Primary Member" },
        { accessorKey: "eventId.eventStartDate", header: "Event Start Date", Cell: ({ cell }) => formatDate(cell.getValue()) },
        { accessorKey: "eventId.eventEndDate", header: "Event End Date", Cell: ({ cell }) => formatDate(cell.getValue()) },
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

    // Fetch paginated bookings
    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = {
                page,
                limit,
                filterType,
                customStartDate: customStartDate || undefined,
                customEndDate: customEndDate || undefined,
                // bookingStatus: bookingStatus !== "all" ? bookingStatus : undefined,
                // userId: userId !== "all" ? userId : undefined,
                // eventId: eventId !== "all" ? eventId : undefined,
            };
            if (bookingStatus !== "all") {
                queryParams.bookingStatus = bookingStatus
            }
            if (userId !== "all") {
                queryParams.userId = userId;
            }
            if (eventId !== "all") {
                queryParams.eventId = eventId;
            }

            const response = await fetchAllBookings(queryParams);
            setBookings(response?.data?.bookings || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalBookings || 0);
            if (response.data.pagination?.currentPage) {
                setPage(response.data.pagination.currentPage);
            }

            if (response.data.pagination?.pageSize) {
                setLimit(response.data.pagination.pageSize);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            showToast("Failed to fetch bookings. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    }, [page, limit, filterType, bookingStatus, customStartDate, customEndDate, userId, eventId]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);


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

    const getEvents = async () => {
        setEventFetching(true)
        try {
            const event = await fetchAllEvents();
            console.log(event.data.allEvents, "events")
            setEventList(event?.data.allEvents);
        } catch (error) {
            console.error("Failed to fetch members:", error);
        } finally {
            setEventFetching(false);
        }
    };

    useEffect(() => {

        getEvents();
    }, []);

    // Export to PDF
    const exportToPDF = () => {
        try {
            const doc = new jsPDF();
            doc.text("Booking Records", 10, 10);

            // Generate table headers and rows
            const tableHeaders = ["Event Title", "Membership ID", "Primary Member", "Event Start Date", "Event End Date", "Booking Status", "Total Amount"];
            const tableRows = bookings.map((row) => [
                row.eventId?.eventTitle || "N/A",
                row.primaryMemberId?.memberId || "N/A",
                row.primaryMemberId?.name || "N/A",
                formatDateCommon(row.eventId?.eventStartDate),
                formatDateCommon(row.eventId?.eventEndDate),
                row.bookingStatus,
                `${row.ticketDetails?.totalAmount || 0}`,
            ]);

            // Generate the table
            autoTable(doc, {
                head: [tableHeaders],
                body: tableRows,
            });

            // Save the PDF
            doc.save("bookings.pdf");
        } catch (error) {
            console.error("Error exporting to PDF:", error);
        }
    };

    // Export to CSV
    const exportToCSV = () => {
        try {
            const csvData = bookings.map((row) => ({
                "Event Title": row.eventId?.eventTitle || "N/A",
                "Membership ID": row.primaryMemberId?.memberId || "N/A",
                "Primary Member": row.primaryMemberId?.name || "N/A",
                "Event Start Date": formatDateCommon(row.eventId?.eventStartDate),
                "Event End Date": formatDateCommon(row.eventId?.eventEndDate),
                "Booking Status": row.bookingStatus,
                "Total Amount": `${row.ticketDetails?.totalAmount || 0}`,
            }));

            const worksheet = XLSX.utils.json_to_sheet(csvData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
            XLSX.writeFile(workbook, "bookings.csv");
        } catch (error) {
            console.error("Error exporting to CSV:", error);
        }
    };

    // Export to XLS
    const exportToXLS = () => {
        try {
            const xlsData = bookings.map((row) => ({
                "Event Title": row.eventId?.eventTitle || "N/A",
                "Membership ID": row.primaryMemberId?.memberId || "N/A",
                "Primary Member": row.primaryMemberId?.name || "N/A",
                "Event Start Date": formatDateCommon(row.eventId?.eventStartDate),
                "Event End Date": formatDateCommon(row.eventId?.eventEndDate),
                "Booking Status": row.bookingStatus,
                "Total Amount": `${row.ticketDetails?.totalAmount || 0}`,
            }));

            const worksheet = XLSX.utils.json_to_sheet(xlsData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
            XLSX.writeFile(workbook, "bookings.xlsx");
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
                <Typography variant="h6" sx={{ mb: 2 }}>Event Bookings</Typography>
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
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Select Event</InputLabel>
                        <FormControl fullWidth size="small">
                            <Autocomplete
                                options={eventList}
                                getOptionLabel={(option) => `${option.eventTitle}`}
                                value={eventList.find((event) => event._id === eventId) || null}
                                onChange={(event, newValue) => setEventId(newValue ? newValue._id : "all")}
                                loading={eventfetching}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        sx={{ minHeight: "40px" }}  // Ensures same height as other inputs
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {fetching ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </FormControl>
                    </Grid>

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
                                <MenuItem value="currentMonth">Current Month</MenuItem>
                                <MenuItem value="last30days">Last 30 Days</MenuItem>
                                <MenuItem value="last3months">Last 3 Months</MenuItem>
                                <MenuItem value="last6months">Last 6 Months</MenuItem>
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
                    <BookingsExport bookings={bookings} />
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
                routeLink="booking"
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