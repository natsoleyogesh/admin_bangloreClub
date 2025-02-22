import React, { useCallback, useEffect, useRef, useState } from "react";
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
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
import Breadcrumb from "../../components/common/Breadcrumb";
import { formatDateTime } from "../../api/config";
import { getRequest, postFormDataRequest } from "../../api/commonAPI";
import { FiPlus } from "react-icons/fi";
import debounce from "lodash.debounce";

// ✅ Utility function to get the current month & year in "YYYY-MM" format
const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Ensures 2-digit format
    return `${year}-${month}`;
};

const formatMonthYear = (value) => {
    if (!value) return "";
    const [year, month] = value.split("-");
    return `${new Date(year, month - 1).toLocaleString("default", { month: "long" })}-${year}`;
};

const MonthlyBillings = () => {

    const { id } = useParams();
    const [uploadLoading, setUploadLoading] = useState(false);

    const [monthlyBillings, setMonthlyBillings] = useState([]);
    const [totals, setTotals] = useState({});
    const [paymentStatus, setPaymentStatus] = useState("all");
    const [transactionMonth, setTransactionMonth] = useState("");
    const [showtransactionMonth, setShowTransactionMonth] = useState("");
    const [userId, setUserId] = useState(id || "all");
    const [activeMembers, setActiveMembers] = useState([]);
    const [loading, setLoading] = useState(null);
    const [fetching, setFetching] = useState(false); // To show loading while fetching users

    const [openFileDialog, setOpenFileDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);


    // Pagination State
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

    // ✅ Set default transaction month when component mounts
    useEffect(() => {
        const defaultMonth = getCurrentMonth(); // "YYYY-MM"
        setShowTransactionMonth(defaultMonth);
        setTransactionMonth(formatMonthYear(defaultMonth)); // "Month-Year"
    }, []);


    // Table columns definition
    const columns = [
        { accessorKey: "invoiceNumber", header: "Invoice Number" },
        { accessorKey: "memberId.memberId", header: "MemberShip ID" },
        { accessorKey: "memberId.name", header: "Member Name" },
        { accessorKey: "paymentStatus", header: "Payment Status" },
        { accessorKey: "transactionMonth", header: "Transaction Month" },
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

    const handleTransactionMonthChange = (e) => {
        const rawValue = e.target.value; // Raw value from the input (e.g., "2024-08")
        setShowTransactionMonth(rawValue)
        const formattedValue = formatMonthYear(rawValue); // Convert to "August-2024"
        setTransactionMonth(formattedValue);
    };

    // Fetch paginated offline billing data with filters
    const fetchAllOfflineBillingData = useCallback(async (pageNumber = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const queryParams = { page: pageNumber, limit: pageSize };

            if (paymentStatus !== "all") queryParams.paymentStatus = paymentStatus;
            if (userId !== "all") queryParams.userId = userId;
            if (transactionMonth !== "") queryParams.transactionMonth = transactionMonth;

            const response = await getRequest(`/offline-billings?${new URLSearchParams(queryParams)}`);
            setMonthlyBillings(response?.data?.billings || []);
            setTotals(response?.data?.totals || {});
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalBillings || 0);
        } catch (error) {
            console.error("Error fetching billings:", error);
            setMonthlyBillings([]);
        } finally {
            setLoading(false);
        }
    }, [paymentStatus, transactionMonth, userId]);

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

    useEffect(() => {
        fetchAllOfflineBillingData(page, limit);
    }, [paymentStatus, transactionMonth, userId, page, limit, fetchAllOfflineBillingData]);


    const exportToPDF = () => {

        const pdfColoum = ["Invoice Number", "MemberShip ID", "Member Name", "Payment Status", "Total Amount", "Invoice Date & Time"]
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
            head: [pdfColoum.map((col) => col)],
            body: monthlyBillings.map((row) => [
                row.invoiceNumber,
                row.memberId?.memberId || "N/A",
                row.memberId?.name || "N/A",
                row.paymentStatus,
                `${row.totalAmount}`,
                formatDate(row.invoiceDate),
            ]),
        });

        // Save PDF
        doc.save("offline-billings.pdf");
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
            ...monthlyBillings.map((row) => ({
                InvoiceNumber: row.invoiceNumber,
                MemberShipID: row.memberId?.memberId || "N/A",
                MemberName: row.memberId?.name || "N/A",
                PaymentStatus: row.paymentStatus,
                InvoiceDate: formatDate(row.invoiceDate),
                TotalAmount: `${row.totalAmount}`,
            })),
        ];

        // Generate and save CSV
        const worksheet = XLSX.utils.json_to_sheet(csvData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Billings");
        XLSX.writeFile(workbook, "offline-billings.csv");
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
            ...monthlyBillings.map((row) => ({
                InvoiceNumber: row.invoiceNumber,
                MemberShipID: row.memberId?.memberId || "N/A",
                MemberName: row.memberId?.name || "N/A",
                PaymentStatus: row.paymentStatus,
                InvoiceDate: formatDate(row.invoiceDate),
                TotalAmount: `${row.totalAmount}`,
            })),
        ];

        // Generate and save XLS
        const worksheet = XLSX.utils.json_to_sheet(xlsData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Billings");
        XLSX.writeFile(workbook, "offline-billings.xlsx");
    };

    const handleUploadFile = async () => {
        if (!selectedFile) {
            showToast("Please select a file first.", "error");
            return;
        }
        const formData = new FormData();
        formData.append("file", selectedFile);
        setUploadLoading(true)
        try {
            await postFormDataRequest("/upload-offline-bill", formData);
            showToast("File uploaded and Bills updated successfully.", "success");
            fetchAllOfflineBillingData();
        } catch (error) {
            console.error("Failed to upload file:", error);
            showToast(error.message || "Failed to upload file.", "error");
        } finally {
            setOpenFileDialog(false);
            setSelectedFile(null);
            setUploadLoading(false)
        }
    };


    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            {/* <Breadcrumb onBack={() => console.log("Back button clicked!")} /> */}
            {/* Header Section */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "14px",
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>Offline Billings</Typography>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FiPlus />}
                    sx={{ borderRadius: "20px" }}
                    onClick={() => setOpenFileDialog(true)}
                >
                    Upload Bill
                </Button>
            </Box>
            <Box sx={{ mb: 3 }}>


                <Grid container spacing={2} alignItems="center">
                    {!id && (
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
                    )}
                    <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Payment Status</InputLabel>
                        <FormControl fullWidth size="small">
                            <Select
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                                sx={{ minHeight: "40px" }}  // Ensures same height as other inputs
                            >
                                <MenuItem value="Paid">Paid</MenuItem>
                                <MenuItem value="Paid Offline">Paid Offline</MenuItem>
                                <MenuItem value="Due">Due</MenuItem>
                                <MenuItem value="Overdue">Overdue</MenuItem>
                                <MenuItem value="all">All</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Transaction Month</InputLabel>
                        <TextField
                            type="month"
                            value={showtransactionMonth}
                            onChange={handleTransactionMonthChange}
                            fullWidth
                            size="small"
                            sx={{ minHeight: "40px" }}  // Ensures same height as other inputs
                        />
                    </Grid>
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
                data={monthlyBillings}
                fields={columns}
                numberOfRows={monthlyBillings.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="monthly-billing"
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

            {/* Dialog for File Upload */}
            <Dialog open={openFileDialog} onClose={() => setOpenFileDialog(false)}>
                <DialogTitle>Upload Monthly Bill</DialogTitle>
                <DialogContent>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={() => setOpenFileDialog(false)}>Cancel</Button>
                    <Button onClick={handleUploadFile} variant="contained" color="primary">
                        Upload
                    </Button> */}
                    {!uploadLoading && <Button onClick={() => setOpenFileDialog(false)}>Cancel</Button>}
                    <Button onClick={handleUploadFile} variant="contained" color="primary">

                        {uploadLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Upload"}

                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default MonthlyBillings;


// import React, { useEffect, useState, useCallback } from "react";
// import {
//     Box, Button, Typography, Select, MenuItem, FormControl, InputLabel,
//     Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
//     Autocomplete, CircularProgress
// } from "@mui/material";
// import Table from "../../components/Table";
// import { showToast } from "../../api/toast";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx";
// import { useParams } from "react-router-dom";
// import { formatDateTime } from "../../api/config";
// import { getRequest, postFormDataRequest } from "../../api/commonAPI";
// import { FiPlus } from "react-icons/fi";

// const formatMonthYear = (value) => {
//     if (!value) return "";
//     const [year, month] = value.split("-");
//     return `${new Date(year, month - 1).toLocaleString("default", { month: "long" })}-${year}`;
// };

// const MonthlyBillings = () => {
//     const { id } = useParams();

//     const [monthlyBillings, setMonthlyBillings] = useState([]);
//     const [totals, setTotals] = useState({});
//     const [paymentStatus, setPaymentStatus] = useState("all");
//     const [transactionMonth, setTransactionMonth] = useState("");
//     const [showTransactionMonth, setShowTransactionMonth] = useState("");
//     const [userId, setUserId] = useState(id || "all");
//     const [loading, setLoading] = useState(false);
//     const [fetching, setFetching] = useState(false); // To show loading while fetching users

//     const [openFileDialog, setOpenFileDialog] = useState(false);
//     const [selectedFile, setSelectedFile] = useState(null);

//     // Pagination State
//     const [page, setPage] = useState(1);
//     const [limit, setLimit] = useState(10);
//     const [totalPages, setTotalPages] = useState(1);
//     const [totalRecords, setTotalRecords] = useState(0);

//     const columns = [
//         { accessorKey: "invoiceNumber", header: "Invoice Number" },
//         { accessorKey: "memberId.memberId", header: "Membership ID" },
//         { accessorKey: "memberId.name", header: "Member Name" },
//         { accessorKey: "paymentStatus", header: "Payment Status" },
//         { accessorKey: "transactionMonth", header: "Transaction Month" },
//         {
//             accessorKey: "invoiceDate",
//             header: "Invoice Date & Time",
//             Cell: ({ cell }) => formatDateTime(cell.getValue()),
//         },
//         {
//             accessorKey: "totalAmount",
//             header: "Total Amount",
//             Cell: ({ cell }) => `₹${cell.getValue()}`,
//         },
//         {
//             accessorKey: "createdAt",
//             header: "Created Date & Time",
//             Cell: ({ cell }) => formatDateTime(cell.getValue()),
//         },
//     ];

//     const handleTransactionMonthChange = (e) => {
//         const rawValue = e.target.value;
//         setShowTransactionMonth(rawValue);
//         setTransactionMonth(formatMonthYear(rawValue));
//     };

//     // Fetch paginated offline billing data with filters
//     const fetchAllOfflineBillingData = useCallback(async (pageNumber = 1, pageSize = 10) => {
//         setLoading(true);
//         try {
//             const queryParams = { page: pageNumber, limit: pageSize };

//             if (paymentStatus !== "all") queryParams.paymentStatus = paymentStatus;
//             if (userId !== "all") queryParams.userId = userId;
//             if (transactionMonth !== "") queryParams.transactionMonth = transactionMonth;

//             const response = await getRequest(`/offline-billings?${new URLSearchParams(queryParams)}`);
//             setMonthlyBillings(response?.data?.billings || []);
//             setTotals(response?.data?.totals || {});
//             setTotalPages(response?.data?.pagination?.totalPages || 1);
//             setTotalRecords(response?.data?.pagination?.totalRecords || 0);
//         } catch (error) {
//             console.error("Error fetching billings:", error);
//             setMonthlyBillings([]);
//         } finally {
//             setLoading(false);
//         }
//     }, [paymentStatus, transactionMonth, userId]);

//     useEffect(() => {
//         fetchAllOfflineBillingData(page, limit);
//     }, [paymentStatus, transactionMonth, userId, page, limit, fetchAllOfflineBillingData]);

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                 <Typography variant="h6">Offline Billings</Typography>
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     startIcon={<FiPlus />}
//                     sx={{ borderRadius: "20px" }}
//                     onClick={() => setOpenFileDialog(true)}
//                 >
//                     Upload Bill
//                 </Button>
//             </Box>

//             <Grid container spacing={2} alignItems="center">
//                 <Grid item xs={12} sm={3} md={2}>
//                     <InputLabel>Payment Status</InputLabel>
//                     <FormControl fullWidth size="small">
//                         <Select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} size="small">
//                             <MenuItem value="Paid">Paid</MenuItem>
//                             <MenuItem value="Paid Offline">Paid Offline</MenuItem>
//                             <MenuItem value="Due">Due</MenuItem>
//                             <MenuItem value="Overdue">Overdue</MenuItem>
//                             <MenuItem value="all">All</MenuItem>
//                         </Select>
//                     </FormControl>
//                 </Grid>
//                 <Grid item xs={12} sm={3} md={2}>
//                     <InputLabel>Transaction Month</InputLabel>
//                     <TextField type="month" value={showTransactionMonth} onChange={handleTransactionMonthChange} fullWidth size="small" />
//                 </Grid>
//             </Grid>

//             <Table
//                 data={monthlyBillings}
//                 fields={columns}
//                 numberOfRows={monthlyBillings.length}
//                 enableTopToolBar
//                 enableBottomToolBar
//                 enablePagination
//                 enableRowSelection
//                 enableColumnFilters
//                 enableEditing
//                 enableColumnDragging
//                 showPreview
//                 routeLink="monthly-billing"
//                 isLoading={loading}
//                 pagination={{
//                     page: page > 0 ? page : 1,
//                     pageSize: limit > 0 ? limit : 10,
//                     totalPages: totalPages || 1,
//                     totalRecords: totalRecords || 0,
//                     onPageChange: (newPage) => {
//                         if (!isNaN(newPage) && newPage > 0) {
//                             console.log("Setting Page to:", newPage);
//                             setPage(newPage);
//                         } else {
//                             console.warn("Invalid page number received:", newPage);
//                         }
//                     },
//                     onPageSizeChange: (newLimit) => {
//                         if (!isNaN(newLimit) && newLimit > 0) {
//                             console.log("Setting Page Size to:", newLimit);
//                             setLimit(newLimit);
//                         } else {
//                             console.warn("Invalid page size received:", newLimit);
//                         }
//                     },
//                 }}
//             />

//             <Dialog open={openFileDialog} onClose={() => setOpenFileDialog(false)}>
//                 <DialogTitle>Upload Monthly Bill</DialogTitle>
//                 <DialogContent>
//                     <input type="file" accept=".xlsx, .xls" onChange={(e) => setSelectedFile(e.target.files[0])} />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenFileDialog(false)}>Cancel</Button>
//                     <Button onClick={() => { /* handleUploadFile() */ }} variant="contained" color="primary">
//                         Upload
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default MonthlyBillings;
