import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import Table from "../../components/Table";
import { showToast } from "../../api/toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { fetchAllMembers } from "../../api/member";
import { useParams } from "react-router-dom";
import { formatDateTime } from "../../api/config";
import { getRequest } from "../../api/commonAPI";
import debounce from "lodash.debounce";

const MonthlyBillTransactions = () => {
    const { id } = useParams();

    const [transactions, setTransactions] = useState([]);
    const [filterType, setFilterType] = useState("today");
    const [paymentStatus, setPaymentStatus] = useState("all");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    // const [userId, setUserId] = useState("all");
    const [userId, setUserId] = useState(id || "all");
    const [activeMembers, setActiveMembers] = useState([]);
    const [loading, setLoading] = useState(null);
    const [fetching, setFetching] = useState(false); // To show loading while fetching users

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
        { accessorKey: "transactionId", header: "Transaction ID" },
        { accessorKey: "memberId.memberId", header: "MemberShip ID" },
        { accessorKey: "memberId.name", header: "Member Name" },
        { accessorKey: "billingId.invoiceNumber", header: "Invoice Number" },
        {
            accessorKey: "paymentStatus",
            header: "Payment Status",
            Cell: ({ cell, row }) => (
                <div>
                    {row.original.paymentStatus === "Success" && (
                        <span
                            className="status"
                            style={{ color: "#388b84", backgroundColor: "#388b8433" }}
                        >
                            {cell.getValue()}
                        </span>
                    )}
                    {row.original.paymentStatus === "Failed" && (
                        <span
                            className="status"
                            style={{ color: "#fd4332", backgroundColor: "#fd433233" }}
                        >
                            {cell.getValue()}
                        </span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "paymentMethod",
            header: "Payment Method",
            Cell: ({ cell, row }) => row.original.paymentMethod ? cell.getValue() : 'N/A'
        },
        {
            accessorKey: "paymentDate",
            header: "Payment Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
        {
            accessorKey: "paymentAmount",
            header: "Payment Amount",
            Cell: ({ cell }) => `₹${cell.getValue()}`, // Format as currency
        },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    // Fetch transactions with pagination
    const fetchAllTransactionData = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = {
                page,
                limit,
            };

            if (filterType !== "all") queryParams.filterType = filterType;
            if (paymentStatus !== "all") queryParams.paymentStatus = paymentStatus;
            if (userId !== "all") queryParams.userId = userId;
            if (customStartDate) queryParams.customStartDate = customStartDate;
            if (customEndDate) queryParams.customEndDate = customEndDate;

            const queryString = new URLSearchParams(queryParams).toString();
            const response = await getRequest(`/offline-bill-transactions?${queryString}`);

            setTransactions(response?.data?.transactions || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalTransactions || 0);
            if (response.data.pagination?.currentPage) {
                setPage(response.data.pagination.currentPage);
            }

            if (response.data.pagination?.pageSize) {
                setLimit(response.data.pagination.pageSize);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    }, [page, limit, filterType, paymentStatus, customStartDate, customEndDate, userId]);


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

    // // Fetch transactions on component mount
    // useEffect(() => {
    //     fetchAllTransactionData();
    // }, [filterType, paymentStatus, customStartDate, customEndDate, userId]);

    useEffect(() => {
        fetchAllTransactionData();
    }, [fetchAllTransactionData]);

    // Export to PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Transaction Records", 10, 10);
        autoTable(doc, {
            head: [columns.map((col) => col.header)],
            body: transactions.map((row) => [
                row.transactionId,
                row.memberId?.name || "N/A",
                row.memberId?.name || "N/A",
                row.billingId?.invoiceNumber || "N/A",
                row.paymentStatus,
                row.paymentMethod || "N/A",
                formatDate(row.paymentDate),
                `${row.paymentAmount}`,
            ]),
        });
        doc.save("transactions.pdf");
    };

    // Export to CSV
    const exportToCSV = () => {
        const csvData = transactions.map((row) => ({
            TransactionID: row.transactionId,
            MemberShipId: row.memberId?.memberId || "N/A",
            MemberName: row.memberId?.name || "N/A",
            InvoiceNumber: row.billingId?.invoiceNumber || "N/A",
            PaymentStatus: row.paymentStatus,
            PaymentMethod: row.paymentMethod || "N/A",
            PaymentDate: formatDate(row.paymentDate),
            PaymentAmount: `${row.paymentAmount}`,
        }));
        const worksheet = XLSX.utils.json_to_sheet(csvData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
        XLSX.writeFile(workbook, "transactions.csv");
    };

    // Export to XLS
    const exportToXLS = () => {
        const xlsData = transactions.map((row) => ({
            TransactionID: row.transactionId,
            MemberShipId: row.memberId?.memberId || "N/A",
            MemberName: row.memberId?.name || "N/A",
            InvoiceNumber: row.billingId?.invoiceNumber || "N/A",
            PaymentStatus: row.paymentStatus,
            PaymentMethod: row.paymentMethod || "N/A",
            PaymentDate: formatDate(row.paymentDate),
            PaymentAmount: `${row.paymentAmount}`,
        }));
        const worksheet = XLSX.utils.json_to_sheet(xlsData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
        XLSX.writeFile(workbook, "transactions.xlsx");
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            {/* Header Section */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Billings</Typography>
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
                        <InputLabel>Payment Status</InputLabel>
                        <FormControl fullWidth size="small">
                            <Select
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                                sx={{ minHeight: "40px" }}  // Ensures same height as other inputs
                            >
                                <MenuItem value="Success">Success</MenuItem>
                                <MenuItem value="Failed">Failed</MenuItem>
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

            {/* Transactions Table */}
            <Table
                data={transactions}
                fields={columns}
                numberOfRows={transactions.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
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
        </Box>
    );
};

export default MonthlyBillTransactions;
