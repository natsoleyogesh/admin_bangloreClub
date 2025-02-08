
import React, { useEffect, useState } from "react";
import { Autocomplete, Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import { showToast } from "../../api/toast";
import { deleteBooking, fetchAllBookings, fetchAllEvents } from "../../api/event";
import ConfirmationDialog from "../../api/ConfirmationDialog";
import { formatDateCommon, formatDateTime } from "../../api/config";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { fetchAllMembers } from "../../api/member";

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loading, setLoading] = useState(null);
    const [fetching, setFetching] = useState(false); // To show loading while fetching users

    const [filterType, setFilterType] = useState("all");
    const [bookingStatus, setBookingStatus] = useState("all");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    const [userId, setUserId] = useState("all");
    const [activeMembers, setActiveMembers] = useState([]);
    const [eventList, setEventList] = useState([]);
    const [eventfetching, setEventFetching] = useState(false); // To show loading while fetching users
    const [eventId, setEventId] = useState("all");



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
            if (eventId !== "all") {
                queryParams.eventId = eventId;
            }

            const response = await fetchAllBookings(queryParams);
            setBookings(response?.data?.bookings || []);
            setLoading(false)
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setLoading(false)
            // showToast("Failed to fetch bookings. Please try again.", "error");
        }
    };

    // Fetch bookings on component mount
    useEffect(() => {
        fetchBookings();
    }, [filterType, bookingStatus, customStartDate, customEndDate, userId, eventId]);



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

    // // Utility function to format data for export
    // const formatBookingData = (row) => ({
    //     eventTitle: row.eventId?.eventTitle || "N/A",
    //     membershipId: row.primaryMemberId?.memberId || "N/A",
    //     primaryMember: row.primaryMemberId?.name || "N/A",
    //     eventStartDate: formatDateCommon(row.eventId?.eventStartDate),
    //     eventEndDate: formatDateCommon(row.eventId?.eventEndDate),
    //     bookingStatus: row.bookingStatus,
    //     totalAmount: `₹${row.ticketDetails?.totalAmount || 0}`,
    // });

    const getActiveMembers = async () => {
        setFetching(true);
        try {
            const response = await fetchAllMembers();
            setActiveMembers(response.users);
        } catch (error) {
            console.error("Failed to fetch members :", error);
            showToast("Failed to fetch Members. Please try again.", "error");
        }
        finally {
            setFetching(false);
        }
    };

    // Fetch billings on component mount and when filters change
    useEffect(() => {
        getActiveMembers();
    }, [])

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
                        <FormControl fullWidth size="small">
                            <Autocomplete
                                options={activeMembers}
                                getOptionLabel={(option) => `${option.name} (${option.memberId})`}
                                value={activeMembers.find((member) => member._id === userId) || null}
                                onChange={(event, newValue) => setUserId(newValue ? newValue._id : "all")}
                                loading={fetching}
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
                routeLink="booking"
                // handleDelete={handleDeleteClick}
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

