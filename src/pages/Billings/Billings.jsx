import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    TextField,
    Autocomplete,
    CircularProgress,
} from "@mui/material";
import Table from "../../components/Table";
import { fetchAllBillings } from "../../api/billing";
import { showToast } from "../../api/toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { fetchAllMembers } from "../../api/member"
import { useParams } from "react-router-dom";
// import Breadcrumb from "../../components/common/Breadcrumb";
import { formatDateTime } from "../../api/config";

const Billings = () => {

    const { id } = useParams();

    const [billings, setBillings] = useState([]);
    const [totals, setTotals] = useState({});
    const [filterType, setFilterType] = useState("all");
    const [paymentStatus, setPaymentStatus] = useState("all");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    // const [userId, setUserId] = useState("all");
    const [userId, setUserId] = useState(id || "all");
    const [activeMembers, setActiveMembers] = useState([]);
    const [loading, setLoading] = useState(null);
    const [fetching, setFetching] = useState(false); // To show loading while fetching users


    // Utility function to format dates and times
    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true // Use 12-hour format
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Table columns definition
    const columns = [
        { accessorKey: "invoiceNumber", header: "Invoice Number" },
        { accessorKey: "memberId.memberId", header: "MemberShip ID" },
        { accessorKey: "memberId.name", header: "Member Name" },
        { accessorKey: "serviceType", header: "Service Type" },
        { accessorKey: "paymentStatus", header: "Payment Status" },
        {
            accessorKey: "invoiceDate",
            header: "Invoice Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
        {
            accessorKey: "totalAmount",
            header: "Total Amount",
            Cell: ({ cell }) => `₹${cell.getValue()}`, // Format as currency
        },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    // Fetch all billings with filters
    const fetchAllBillingData = async () => {
        setLoading(true)
        try {
            const queryParams = {
                filterType,
                customStartDate: customStartDate || undefined,
                customEndDate: customEndDate || undefined,
            };
            if (paymentStatus !== "all") {
                queryParams.paymentStatus = paymentStatus
            }
            if (userId !== "all") {
                queryParams.userId = userId;
            }

            const response = await fetchAllBillings(queryParams);
            setBillings(response?.data?.billings || []); // Set billings to the fetched data
            setTotals(response?.data?.totals)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching billings:", error);
            setLoading(false)
            // showToast("Failed to fetch billings. Please try again.", "error");
        }
    };

    const getActiveMembers = async () => {
        setFetching(true);
        try {
            const response = await fetchAllMembers();
            setActiveMembers(response.users);
        } catch (error) {
            console.error("Failed to fetch members :", error);
            showToast("Failed to fetch Members. Please try again.", "error");
        } finally {
            setFetching(false);
        }
    };

    // Fetch billings on component mount and when filters change
    useEffect(() => {
        getActiveMembers();
    }, [])
    useEffect(() => {
        fetchAllBillingData();
    }, [filterType, paymentStatus, customStartDate, customEndDate, userId]);


    const exportToPDF = () => {
        const doc = new jsPDF();
        console.log(totals.totalOutstanding, "billings.totals.totalOutstanding")
        // Add Title
        doc.text("Billing Records", 10, 10);

        // Add Totals
        doc.text(`Total Outstanding: ${totals.totalOutstanding}`, 10, 20);
        doc.text(`Total Paid: ${totals.totalPaid}`, 10, 30);
        doc.text(`Total Due: ${totals.totalDue}`, 10, 40);

        // Add Table
        autoTable(doc, {
            startY: 50, // Start after the totals
            head: [columns.map((col) => col.header)],
            body: billings.map((row) => [
                row.invoiceNumber,
                row.memberId?.name || "N/A",
                row.serviceType,
                row.paymentStatus,
                formatDate(row.invoiceDate),
                `${row.totalAmount}`,
            ]),
        });

        // Save PDF
        doc.save("billings.pdf");
    };


    const exportToCSV = () => {
        // Add totals to the top of the CSV
        const totalsRow = [
            { InvoiceNumber: "Total Outstanding", MemberName: `${totals.totalOutstanding}` },
            { InvoiceNumber: "Total Paid", MemberName: `${totals.totalPaid}` },
            { InvoiceNumber: "Total Due", MemberName: `${totals.totalDue}` },
        ];

        // Prepare the billing data
        const csvData = [
            ...totalsRow,
            ...billings.map((row) => ({
                InvoiceNumber: row.invoiceNumber,
                MemberName: row.memberId?.name || "N/A",
                ServiceType: row.serviceType,
                PaymentStatus: row.paymentStatus,
                InvoiceDate: formatDate(row.invoiceDate),
                TotalAmount: `${row.totalAmount}`,
            })),
        ];

        // Generate and save CSV
        const worksheet = XLSX.utils.json_to_sheet(csvData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Billings");
        XLSX.writeFile(workbook, "billings.csv");
    };


    const exportToXLS = () => {
        // Add totals to the top of the XLS
        const totalsRow = [
            { InvoiceNumber: "Total Outstanding", MemberName: `${totals.totalOutstanding}` },
            { InvoiceNumber: "Total Paid", MemberName: `${totals.totalPaid}` },
            { InvoiceNumber: "Total Due", MemberName: `${totals.totalDue}` },
        ];

        // Prepare the billing data
        const xlsData = [
            ...totalsRow,
            ...billings.map((row) => ({
                InvoiceNumber: row.invoiceNumber,
                MemberName: row.memberId?.name || "N/A",
                ServiceType: row.serviceType,
                PaymentStatus: row.paymentStatus,
                InvoiceDate: formatDate(row.invoiceDate),
                TotalAmount: `${row.totalAmount}`,
            })),
        ];

        // Generate and save XLS
        const worksheet = XLSX.utils.json_to_sheet(xlsData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Billings");
        XLSX.writeFile(workbook, "billings.xlsx");
    };


    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            {/* <Breadcrumb onBack={() => console.log("Back button clicked!")} /> */}
            {/* Header Section */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Billings</Typography>
                {/* <Grid container spacing={2} alignItems="center">
                    {!id && <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Select Member</InputLabel>
                        <FormControl fullWidth size="small">
                            <Autocomplete
                                options={activeMembers}
                                getOptionLabel={(option) => `${option.name} (${option.memberId})`}
                                // value={option._id}
                                // onChange={(e) => setUserId(e.target.value)}
                                value={activeMembers.find((member) => member._id === userId) || null}  // Ensure proper default selection
                                onChange={(event, newValue) => setUserId(newValue ? newValue._id : "all")}  // Properly set `userId`
                                loading={fetching}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        // label="Select User"
                                        variant="outlined"
                                        fullWidth
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
                    </Grid>}
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
                        <InputLabel>Payment Status</InputLabel>
                        <FormControl fullWidth size="small">
                            <Select
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                            >
                                <MenuItem value="Paid">Paid</MenuItem>
                                <MenuItem value="Due">Due</MenuItem>
                                <MenuItem value="Overdue">Overdue</MenuItem>
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
                                />
                            </Grid>
                        </>
                    )}
                </Grid> */}
                <Grid container spacing={2} alignItems="center">
                    {!id && (
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
                    )}

                    <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Filter Type</InputLabel>
                        <FormControl fullWidth size="small">
                            <Select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                size="small"
                                sx={{ minHeight: "40px" }}  // Uniform height
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
                        <InputLabel>Payment Status</InputLabel>
                        <FormControl fullWidth size="small">
                            <Select
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                                size="small"
                                sx={{ minHeight: "40px" }}  // Uniform height
                            >
                                <MenuItem value="Paid">Paid</MenuItem>
                                <MenuItem value="Due">Due</MenuItem>
                                <MenuItem value="Overdue">Overdue</MenuItem>
                                <MenuItem value="all">All</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {filterType === "custom" && (
                        <>
                            <Grid item xs={12} sm={3} md={2}>
                                <InputLabel>Custom Start Date</InputLabel>
                                <TextField
                                    type="date"
                                    fullWidth
                                    size="small"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ minHeight: "40px" }}  // Ensures same height
                                />
                            </Grid>
                            <Grid item xs={12} sm={3} md={2}>
                                <InputLabel>Custom End Date</InputLabel>
                                <TextField
                                    type="date"
                                    fullWidth
                                    size="small"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ minHeight: "40px" }}  // Ensures same height
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

            {/* Billings Table */}
            <Table
                data={billings}
                fields={columns}
                numberOfRows={billings.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                isLoading={loading}
            />
        </Box>
    );
};

export default Billings;
