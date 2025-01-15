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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
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

const formatMonthYear = (value) => {
    if (!value) return "";
    const [year, month] = value.split("-");
    return `${new Date(year, month - 1).toLocaleString("default", { month: "long" })}-${year}`;
};

const MonthlyBillings = () => {

    const { id } = useParams();

    const [monthlyBillings, setMonthlyBillings] = useState([]);
    const [totals, setTotals] = useState({});
    const [paymentStatus, setPaymentStatus] = useState("all");
    const [transactionMonth, setTransactionMonth] = useState("");
    const [showtransactionMonth, setShowTransactionMonth] = useState("");
    const [userId, setUserId] = useState(id || "all");
    const [activeMembers, setActiveMembers] = useState([]);
    const [loading, setLoading] = useState(null)

    const [openFileDialog, setOpenFileDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);


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

    // Fetch all billings with filters
    const fetchAllOfflineBillingData = async () => {
        setLoading(true)
        try {
            const queryParams = {
            };
            if (paymentStatus !== "all") {
                queryParams.paymentStatus = paymentStatus
            }
            if (userId !== "all") {
                queryParams.userId = userId;
            }
            if (transactionMonth !== "") {
                queryParams.transactionMonth = transactionMonth;
            }

            const queryString = new URLSearchParams(queryParams).toString();
            const response = await getRequest(`/offline-billings?${queryString}`);
            setMonthlyBillings(response?.data?.billings || []); // Set billings to the fetched data
            setTotals(response?.data?.totals)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching billings:", error);
            setMonthlyBillings([])
            setLoading(false)
            // showToast("Failed to fetch billings. Please try again.", "error");
        }
    };

    const getActiveMembers = async () => {
        try {
            const response = await fetchAllMembers();
            setActiveMembers(response.users);
        } catch (error) {
            console.error("Failed to fetch members :", error);
            showToast("Failed to fetch Members. Please try again.", "error");
        }
    };

    // Fetch billings on component mount and when filters change
    useEffect(() => {
        getActiveMembers();
    }, [])
    useEffect(() => {
        fetchAllOfflineBillingData();
    }, [paymentStatus, transactionMonth, userId]);


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
                MemberName: row.memberId?.memberId || "N/A",
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
                MemberName: row.memberId?.memberId || "N/A",
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
        }
    };


    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            {/* <Breadcrumb onBack={() => console.log("Back button clicked!")} /> */}
            {/* Header Section */}
            <Box sx={{ mb: 3 }}>
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

                <Grid container spacing={2} alignItems="center">
                    {!id && <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Select Member</InputLabel>
                        <FormControl fullWidth size="small">

                            <Select
                                name="userId"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                            >
                                <MenuItem value="all">All</MenuItem>
                                {activeMembers.map((member) => (
                                    <MenuItem key={member._id} value={member._id}>
                                        {member.name} (ID: {member.memberId})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>}
                    <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Payment Status</InputLabel>
                        <FormControl fullWidth size="small">
                            <Select
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
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
                    <Button onClick={() => setOpenFileDialog(false)}>Cancel</Button>
                    <Button onClick={handleUploadFile} variant="contained" color="primary">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default MonthlyBillings;
