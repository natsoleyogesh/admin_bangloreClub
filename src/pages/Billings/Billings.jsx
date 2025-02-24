// import React, { useCallback, useEffect, useState } from "react";
// import {
//     Box,
//     Button,
//     Typography,
//     Select,
//     MenuItem,
//     FormControl,
//     InputLabel,
//     Grid,
//     TextField,
//     Autocomplete,
//     CircularProgress,
// } from "@mui/material";
// import Table from "../../components/Table";
// import { fetchAllBillings } from "../../api/billing";
// import { showToast } from "../../api/toast";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx";
// import { fetchAllMembers } from "../../api/member"
// import { useParams } from "react-router-dom";
// // import Breadcrumb from "../../components/common/Breadcrumb";
// import { formatDateTime } from "../../api/config";

// const Billings = () => {

//     const { id } = useParams();

//     const [billings, setBillings] = useState([]);
//     const [totals, setTotals] = useState({});
//     const [filterType, setFilterType] = useState("all");
//     const [paymentStatus, setPaymentStatus] = useState("all");
//     const [customStartDate, setCustomStartDate] = useState("");
//     const [customEndDate, setCustomEndDate] = useState("");
//     // const [userId, setUserId] = useState("all");
//     const [userId, setUserId] = useState(id || "all");
//     const [activeMembers, setActiveMembers] = useState([]);
//     const [loading, setLoading] = useState(null);
//     const [fetching, setFetching] = useState(false); // To show loading while fetching users


//     // Pagination State
//     const [page, setPage] = useState(1);
//     const [limit, setLimit] = useState(10);
//     const [totalPages, setTotalPages] = useState(1);
//     const [totalRecords, setTotalRecords] = useState(0);

//     // Utility function to format dates and times
//     const formatDate = (dateString) => {
//         const options = {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//             second: "2-digit",
//             hour12: true // Use 12-hour format
//         };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };

//     // Table columns definition
//     const columns = [
//         { accessorKey: "invoiceNumber", header: "Invoice Number" },
//         { accessorKey: "memberId.memberId", header: "MemberShip ID" },
//         { accessorKey: "memberId.name", header: "Member Name" },
//         { accessorKey: "serviceType", header: "Service Type" },
//         { accessorKey: "paymentStatus", header: "Payment Status" },
//         {
//             accessorKey: "invoiceDate",
//             header: "Invoice Date & Time",
//             Cell: ({ cell }) => formatDateTime(cell.getValue()),
//         },
//         {
//             accessorKey: "totalAmount",
//             header: "Total Amount",
//             Cell: ({ cell }) => `₹${cell.getValue()}`, // Format as currency
//         },
//         {
//             accessorKey: "createdAt",
//             header: "Created Date & Time",
//             Cell: ({ cell }) => formatDateTime(cell.getValue()),
//         },
//     ];

//     // Fetch paginated billings with filters
//     const fetchAllBillingData = useCallback(async (pageNumber = 1, pageSize = 10) => {
//         setLoading(true);
//         try {
//             const queryParams = { page: pageNumber, limit: pageSize, filterType };

//             if (customStartDate) queryParams.customStartDate = customStartDate;
//             if (customEndDate) queryParams.customEndDate = customEndDate;
//             if (paymentStatus !== "all") queryParams.paymentStatus = paymentStatus;
//             if (userId !== "all") queryParams.userId = userId;

//             const response = await fetchAllBillings(queryParams);
//             setBillings(response?.data?.billings || []);
//             setTotals(response?.data?.totals || {});
//             setTotalPages(response?.data?.pagination?.totalPages || 1);
//             setTotalRecords(response?.data?.pagination?.totalBillings || 0);
//         } catch (error) {
//             console.error("Error fetching billings:", error);
//             showToast("Failed to fetch billings. Please try again.", "error");
//         } finally {
//             setLoading(false);
//         }
//     }, [filterType, paymentStatus, customStartDate, customEndDate, userId]);


//     const getActiveMembers = async () => {
//         setFetching(true);
//         try {
//             const response = await fetchAllMembers();
//             setActiveMembers(response.users);
//         } catch (error) {
//             console.error("Failed to fetch members :", error);
//             showToast("Failed to fetch Members. Please try again.", "error");
//         } finally {
//             setFetching(false);
//         }
//     };

//     // Fetch billings on component mount and when filters change
//     useEffect(() => {
//         getActiveMembers();
//     }, [])

//     useEffect(() => {
//         fetchAllBillingData(page, limit);
//     }, [filterType, paymentStatus, customStartDate, customEndDate, userId, page, limit, fetchAllBillingData]);


//     const exportToPDF = () => {
//         const doc = new jsPDF();
//         console.log(totals.totalOutstanding, "billings.totals.totalOutstanding")
//         // Add Title
//         doc.text("Billing Records", 10, 10);

//         // Add Totals
//         doc.text(`Total Outstanding: ${totals.totalOutstanding}`, 10, 20);
//         doc.text(`Total Paid: ${totals.totalPaid}`, 10, 30);
//         doc.text(`Total Due: ${totals.totalDue}`, 10, 40);

//         // Add Table
//         autoTable(doc, {
//             startY: 50, // Start after the totals
//             head: [columns.map((col) => col.header)],
//             body: billings.map((row) => [
//                 row.invoiceNumber,
//                 row.memberId?.name || "N/A",
//                 row.serviceType,
//                 row.paymentStatus,
//                 formatDate(row.invoiceDate),
//                 `${row.totalAmount}`,
//             ]),
//         });

//         // Save PDF
//         doc.save("billings.pdf");
//     };


//     const exportToCSV = () => {
//         // Add totals to the top of the CSV
//         const totalsRow = [
//             { InvoiceNumber: "Total Outstanding", MemberName: `${totals.totalOutstanding}` },
//             { InvoiceNumber: "Total Paid", MemberName: `${totals.totalPaid}` },
//             { InvoiceNumber: "Total Due", MemberName: `${totals.totalDue}` },
//         ];

//         // Prepare the billing data
//         const csvData = [
//             ...totalsRow,
//             ...billings.map((row) => ({
//                 InvoiceNumber: row.invoiceNumber,
//                 MemberName: row.memberId?.name || "N/A",
//                 ServiceType: row.serviceType,
//                 PaymentStatus: row.paymentStatus,
//                 InvoiceDate: formatDate(row.invoiceDate),
//                 TotalAmount: `${row.totalAmount}`,
//             })),
//         ];

//         // Generate and save CSV
//         const worksheet = XLSX.utils.json_to_sheet(csvData);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Billings");
//         XLSX.writeFile(workbook, "billings.csv");
//     };


//     const exportToXLS = () => {
//         // Add totals to the top of the XLS
//         const totalsRow = [
//             { InvoiceNumber: "Total Outstanding", MemberName: `${totals.totalOutstanding}` },
//             { InvoiceNumber: "Total Paid", MemberName: `${totals.totalPaid}` },
//             { InvoiceNumber: "Total Due", MemberName: `${totals.totalDue}` },
//         ];

//         // Prepare the billing data
//         const xlsData = [
//             ...totalsRow,
//             ...billings.map((row) => ({
//                 InvoiceNumber: row.invoiceNumber,
//                 MemberName: row.memberId?.name || "N/A",
//                 ServiceType: row.serviceType,
//                 PaymentStatus: row.paymentStatus,
//                 InvoiceDate: formatDate(row.invoiceDate),
//                 TotalAmount: `${row.totalAmount}`,
//             })),
//         ];

//         // Generate and save XLS
//         const worksheet = XLSX.utils.json_to_sheet(xlsData);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Billings");
//         XLSX.writeFile(workbook, "billings.xlsx");
//     };


//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             {/* <Breadcrumb onBack={() => console.log("Back button clicked!")} /> */}
//             {/* Header Section */}
//             <Box sx={{ mb: 3 }}>
//                 <Typography variant="h6" sx={{ mb: 2 }}>Billings</Typography>
//                 {/* <Grid container spacing={2} alignItems="center">
//                     {!id && <Grid item xs={12} sm={3} md={2}>
//                         <InputLabel>Select Member</InputLabel>
//                         <FormControl fullWidth size="small">
//                             <Autocomplete
//                                 options={activeMembers}
//                                 getOptionLabel={(option) => `${option.name} (${option.memberId})`}
//                                 // value={option._id}
//                                 // onChange={(e) => setUserId(e.target.value)}
//                                 value={activeMembers.find((member) => member._id === userId) || null}  // Ensure proper default selection
//                                 onChange={(event, newValue) => setUserId(newValue ? newValue._id : "all")}  // Properly set `userId`
//                                 loading={fetching}
//                                 renderInput={(params) => (
//                                     <TextField
//                                         {...params}
//                                         // label="Select User"
//                                         variant="outlined"
//                                         fullWidth
//                                         InputProps={{
//                                             ...params.InputProps,
//                                             endAdornment: (
//                                                 <>
//                                                     {fetching ? <CircularProgress color="inherit" size={20} /> : null}
//                                                     {params.InputProps.endAdornment}
//                                                 </>
//                                             ),
//                                         }}
//                                     />
//                                 )}
//                             />
//                         </FormControl>
//                     </Grid>}
//                     <Grid item xs={12} sm={3} md={2}>
//                         <InputLabel>Filter Type</InputLabel>
//                         <FormControl fullWidth size="small">
//                             <Select
//                                 value={filterType}
//                                 onChange={(e) => setFilterType(e.target.value)}
//                             >
//                                 <MenuItem value="today">Today</MenuItem>
//                                 <MenuItem value="last7days">Last 7 Days</MenuItem>
//                                 <MenuItem value="lastMonth">Last Month</MenuItem>
//                                 <MenuItem value="lastThreeMonths">Last 3 Months</MenuItem>
//                                 <MenuItem value="lastSixMonths">Last 6 Months</MenuItem>
//                                 <MenuItem value="last1year">Last 1 Year</MenuItem>
//                                 <MenuItem value="custom">Custom</MenuItem>
//                                 <MenuItem value="all">All</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Grid>
//                     <Grid item xs={12} sm={3} md={2}>
//                         <InputLabel>Payment Status</InputLabel>
//                         <FormControl fullWidth size="small">
//                             <Select
//                                 value={paymentStatus}
//                                 onChange={(e) => setPaymentStatus(e.target.value)}
//                             >
//                                 <MenuItem value="Paid">Paid</MenuItem>
//                                 <MenuItem value="Due">Due</MenuItem>
//                                 <MenuItem value="Overdue">Overdue</MenuItem>
//                                 <MenuItem value="all">All</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Grid>
//                     {filterType === "custom" && (
//                         <>
//                             <Grid item xs={12} sm={3} md={2}>
//                                 <InputLabel>Custom Start Date</InputLabel>
//                                 <TextField
//                                     // label="Start Date"
//                                     type="date"
//                                     fullWidth
//                                     size="small"
//                                     value={customStartDate}
//                                     onChange={(e) => setCustomStartDate(e.target.value)}
//                                     InputLabelProps={{ shrink: true }}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={3} md={2}>
//                                 <InputLabel>Custom End Date</InputLabel>
//                                 <TextField
//                                     // label="End Date"
//                                     type="date"
//                                     fullWidth
//                                     size="small"
//                                     value={customEndDate}
//                                     onChange={(e) => setCustomEndDate(e.target.value)}
//                                     InputLabelProps={{ shrink: true }}
//                                 />
//                             </Grid>
//                         </>
//                     )}
//                 </Grid> */}
//                 <Grid container spacing={2} alignItems="center">
//                     {!id && (
//                         <Grid item xs={12} sm={3} md={2}>
//                             <InputLabel>Select Member</InputLabel>
//                             <FormControl fullWidth size="small">
//                                 <Autocomplete
//                                     options={activeMembers}
//                                     getOptionLabel={(option) => `${option.name} (${option.memberId})`}
//                                     value={activeMembers.find((member) => member._id === userId) || null}
//                                     onChange={(event, newValue) => setUserId(newValue ? newValue._id : "all")}
//                                     loading={fetching}
//                                     renderInput={(params) => (
//                                         <TextField
//                                             {...params}
//                                             variant="outlined"
//                                             fullWidth
//                                             size="small"
//                                             sx={{ minHeight: "40px" }}  // Ensures same height as other inputs
//                                             InputProps={{
//                                                 ...params.InputProps,
//                                                 endAdornment: (
//                                                     <>
//                                                         {fetching ? <CircularProgress color="inherit" size={20} /> : null}
//                                                         {params.InputProps.endAdornment}
//                                                     </>
//                                                 ),
//                                             }}
//                                         />
//                                     )}
//                                 />
//                             </FormControl>
//                         </Grid>
//                     )}

//                     <Grid item xs={12} sm={3} md={2}>
//                         <InputLabel>Filter Type</InputLabel>
//                         <FormControl fullWidth size="small">
//                             <Select
//                                 value={filterType}
//                                 onChange={(e) => setFilterType(e.target.value)}
//                                 size="small"
//                                 sx={{ minHeight: "40px" }}  // Uniform height
//                             >
//                                 <MenuItem value="today">Today</MenuItem>
//                                 <MenuItem value="last7days">Last 7 Days</MenuItem>
//                                 <MenuItem value="lastMonth">Last Month</MenuItem>
//                                 <MenuItem value="lastThreeMonths">Last 3 Months</MenuItem>
//                                 <MenuItem value="lastSixMonths">Last 6 Months</MenuItem>
//                                 <MenuItem value="last1year">Last 1 Year</MenuItem>
//                                 <MenuItem value="custom">Custom</MenuItem>
//                                 <MenuItem value="all">All</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Grid>

//                     <Grid item xs={12} sm={3} md={2}>
//                         <InputLabel>Payment Status</InputLabel>
//                         <FormControl fullWidth size="small">
//                             <Select
//                                 value={paymentStatus}
//                                 onChange={(e) => setPaymentStatus(e.target.value)}
//                                 size="small"
//                                 sx={{ minHeight: "40px" }}  // Uniform height
//                             >
//                                 <MenuItem value="Paid">Paid</MenuItem>
//                                 <MenuItem value="Due">Due</MenuItem>
//                                 <MenuItem value="Overdue">Overdue</MenuItem>
//                                 <MenuItem value="all">All</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Grid>

//                     {filterType === "custom" && (
//                         <>
//                             <Grid item xs={12} sm={3} md={2}>
//                                 <InputLabel>Custom Start Date</InputLabel>
//                                 <TextField
//                                     type="date"
//                                     fullWidth
//                                     size="small"
//                                     value={customStartDate}
//                                     onChange={(e) => setCustomStartDate(e.target.value)}
//                                     InputLabelProps={{ shrink: true }}
//                                     sx={{ minHeight: "40px" }}  // Ensures same height
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={3} md={2}>
//                                 <InputLabel>Custom End Date</InputLabel>
//                                 <TextField
//                                     type="date"
//                                     fullWidth
//                                     size="small"
//                                     value={customEndDate}
//                                     onChange={(e) => setCustomEndDate(e.target.value)}
//                                     InputLabelProps={{ shrink: true }}
//                                     sx={{ minHeight: "40px" }}  // Ensures same height
//                                 />
//                             </Grid>
//                         </>
//                     )}
//                 </Grid>

//                 <Box sx={{ mt: 3 }}>
//                     <Button variant="contained" color="primary" onClick={exportToPDF} sx={{ mr: 1 }}>
//                         Export to PDF
//                     </Button>
//                     <Button variant="contained" color="primary" onClick={exportToCSV} sx={{ mr: 1 }}>
//                         Export to CSV
//                     </Button>
//                     <Button variant="contained" color="primary" onClick={exportToXLS}>
//                         Export to XLS
//                     </Button>
//                 </Box>
//             </Box>

//             {/* Billings Table */}
//             <Table
//                 data={billings}
//                 fields={columns}
//                 numberOfRows={billings.length}
//                 enableTopToolBar
//                 enableBottomToolBar
//                 enablePagination
//                 enableRowSelection
//                 enableColumnFilters
//                 enableEditing
//                 enableColumnDragging
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
//         </Box>
//     );
// };

// export default Billings;

// -------------------------working code

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
    Autocomplete,
    CircularProgress,
} from "@mui/material";
import Table from "../../components/Table";
import { fetchAllBillings } from "../../api/billing";
import { deleteRequest, getRequest } from "../../api/commonAPI";
import { showToast } from "../../api/toast";
import debounce from "lodash.debounce";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { formatDateTime } from "../../api/config";
import ConfirmationDialog from "../../api/ConfirmationDialog";

const Billings = () => {

    const { id } = useParams();
    const [billings, setBillings] = useState([]);
    const [totals, setTotals] = useState({});
    const [filterType, setFilterType] = useState("today");
    const [paymentStatus, setPaymentStatus] = useState("all");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    const [userId, setUserId] = useState(id || "all");
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBilling, setSelectedBilling] = useState(null);

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

    // Fetch paginated billings with filters
    const fetchAllBillingData = useCallback(async (pageNumber = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const queryParams = { page: pageNumber, limit: pageSize, filterType };

            if (customStartDate) queryParams.customStartDate = customStartDate;
            if (customEndDate) queryParams.customEndDate = customEndDate;
            if (paymentStatus !== "all") queryParams.paymentStatus = paymentStatus;
            if (userId !== "all") queryParams.userId = userId;

            const response = await fetchAllBillings(queryParams);
            setBillings(response?.data?.billings || []);
            setTotals(response?.data?.totals || {});
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalBillings || 0);
        } catch (error) {
            console.error("Error fetching billings:", error);
            showToast("Failed to fetch billings. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    }, [filterType, paymentStatus, customStartDate, customEndDate, userId]);


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
        fetchAllBillingData(page, limit);
    }, [filterType, paymentStatus, customStartDate, customEndDate, userId, page, limit, fetchAllBillingData]);


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
                MemberShipId: row.row.memberId,
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
                MemberShipId: row.row.memberId,
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



    const handleDeleteClick = (club) => {
        setSelectedBilling(club);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteRequest(`/billing/${selectedBilling._id}`);
            showToast("Invoice deleted successfully.", "success");
            fetchAllBillingData(page, limit);
        } catch (error) {
            console.error("Failed to delete club:", error);
            showToast(error.message || "Failed to delete club.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedBilling(null);
        }
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
                routeLink="billing"
                handleDelete={handleDeleteClick}
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

            <ConfirmationDialog open={openDialog} title="Delete Invoice"
                message={`Are you sure you want to delete invoice ${selectedBilling?.invoiceNumber}?`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setOpenDialog(false)}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />

        </Box>
    );
};

export default Billings;



// import React, { useEffect, useState, useCallback } from "react";
// import {
//     Box, Button, Typography, Select, MenuItem, FormControl, InputLabel,
//     Grid, TextField, Autocomplete, CircularProgress
// } from "@mui/material";
// import Table from "../../components/Table";
// import { fetchAllBillings } from "../../api/billing";
// import { showToast } from "../../api/toast";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx";
// import { fetchAllMembers } from "../../api/member";
// import { useParams } from "react-router-dom";
// import { formatDateTime } from "../../api/config";

// const Billings = () => {
//     const { id } = useParams();

//     const [billings, setBillings] = useState([]);
//     const [totals, setTotals] = useState({});
//     const [filterType, setFilterType] = useState("all");
//     const [paymentStatus, setPaymentStatus] = useState("all");
//     const [customStartDate, setCustomStartDate] = useState("");
//     const [customEndDate, setCustomEndDate] = useState("");
//     const [userId, setUserId] = useState(id || "all");
//     const [activeMembers, setActiveMembers] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [fetching, setFetching] = useState(false); // Loading for fetching users

//     // Pagination State
//     const [page, setPage] = useState(1);
//     const [limit, setLimit] = useState(10);
//     const [totalPages, setTotalPages] = useState(1);
//     const [totalRecords, setTotalRecords] = useState(0);

//     const columns = [
//         { accessorKey: "invoiceNumber", header: "Invoice Number" },
//         { accessorKey: "memberId.memberId", header: "Membership ID" },
//         { accessorKey: "memberId.name", header: "Member Name" },
//         { accessorKey: "serviceType", header: "Service Type" },
//         { accessorKey: "paymentStatus", header: "Payment Status" },
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

//     // Fetch paginated billings with filters
//     const fetchAllBillingData = useCallback(async (pageNumber = 1, pageSize = 10) => {
//         setLoading(true);
//         try {
//             const queryParams = { page: pageNumber, limit: pageSize, filterType };

//             if (customStartDate) queryParams.customStartDate = customStartDate;
//             if (customEndDate) queryParams.customEndDate = customEndDate;
//             if (paymentStatus !== "all") queryParams.paymentStatus = paymentStatus;
//             if (userId !== "all") queryParams.userId = userId;

//             const response = await fetchAllBillings(queryParams);
//             setBillings(response?.data?.billings || []);
//             setTotals(response?.data?.totals || {});
//             setTotalPages(response?.data?.pagination?.totalPages || 1);
//             setTotalRecords(response?.data?.pagination?.totalBillings || 0);
//         } catch (error) {
//             console.error("Error fetching billings:", error);
//             showToast("Failed to fetch billings. Please try again.", "error");
//         } finally {
//             setLoading(false);
//         }
//     }, [filterType, paymentStatus, customStartDate, customEndDate, userId]);

//     const getActiveMembers = async () => {
//         setFetching(true);
//         try {
//             const response = await fetchAllMembers();
//             setActiveMembers(response.users || []);
//         } catch (error) {
//             console.error("Failed to fetch members:", error);
//             showToast("Failed to fetch members. Please try again.", "error");
//         } finally {
//             setFetching(false);
//         }
//     };

//     useEffect(() => {
//         getActiveMembers();
//     }, []);

//     useEffect(() => {
//         fetchAllBillingData(page, limit);
//     }, [filterType, paymentStatus, customStartDate, customEndDate, userId, page, limit, fetchAllBillingData]);

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Typography variant="h6" sx={{ mb: 2 }}>Billings</Typography>
//             <Grid container spacing={2} alignItems="center">
//                 {!id && (
//                     <Grid item xs={12} sm={3} md={2}>
//                         <InputLabel>Select Member</InputLabel>
//                         <Autocomplete
//                             options={activeMembers}
//                             getOptionLabel={(option) => `${option.name} (${option.memberId})`}
//                             value={activeMembers.find((member) => member._id === userId) || null}
//                             onChange={(event, newValue) => setUserId(newValue ? newValue._id : "all")}
//                             loading={fetching}
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     variant="outlined"
//                                     fullWidth
//                                     size="small"
//                                     InputProps={{
//                                         ...params.InputProps,
//                                         endAdornment: (
//                                             <>
//                                                 {fetching && <CircularProgress color="inherit" size={20} />}
//                                                 {params.InputProps.endAdornment}
//                                             </>
//                                         ),
//                                     }}
//                                 />
//                             )}
//                         />
//                     </Grid>
//                 )}

//                 <Grid item xs={12} sm={3} md={2}>
//                     <InputLabel>Filter Type</InputLabel>
//                     <FormControl fullWidth size="small">
//                         <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} size="small">
//                             <MenuItem value="today">Today</MenuItem>
//                             <MenuItem value="last7days">Last 7 Days</MenuItem>
//                             <MenuItem value="lastMonth">Last Month</MenuItem>
//                             <MenuItem value="lastThreeMonths">Last 3 Months</MenuItem>
//                             <MenuItem value="lastSixMonths">Last 6 Months</MenuItem>
//                             <MenuItem value="last1year">Last 1 Year</MenuItem>
//                             <MenuItem value="custom">Custom</MenuItem>
//                             <MenuItem value="all">All</MenuItem>
//                         </Select>
//                     </FormControl>
//                 </Grid>
//             </Grid>

//             <Table
//                 data={billings}
//                 fields={columns}
//                 numberOfRows={billings.length}
//                 enableTopToolBar
//                 enableBottomToolBar
//                 enablePagination
//                 enableRowSelection
//                 enableColumnFilters
//                 enableEditing
//                 enableColumnDragging
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
//         </Box>
//     );
// };

// export default Billings;

