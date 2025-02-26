import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { formatDateCommon } from "../../api/config";
import { showToast } from "../../api/toast";
import { getRequest } from "../../api/commonAPI";

const BookingsExport = ({ filterType, customStartDate, customEndDate, bookingStatus, eventId, userId, }) => {

    const [loadingExport, setLoadingExport] = useState(false);


    const fetchExportData = async ({ filterType, customStartDate, customEndDate, bookingStatus, eventId, userId, exportData }) => {
        try {
            setLoadingExport(true); // Hide loading 
            const queryParams = {};

            if (filterType !== "all") queryParams.filterType = filterType;
            if (bookingStatus !== "all") queryParams.bookingStatus = bookingStatus;
            if (userId !== "all") queryParams.userId = userId;
            if (customStartDate) queryParams.customStartDate = customStartDate;
            if (customEndDate) queryParams.customEndDate = customEndDate;
            if (eventId !== "all") {
                queryParams.eventId = eventId;
            }
            if (exportData) queryParams.exportData = exportData;
            // Generate query string correctly
            const queryString = new URLSearchParams(queryParams).toString();

            // Show toast message before export starts
            showToast("📤 Fetching data for export...", "info");

            // Fetch full data for export
            const response = await getRequest(`/event/all-bookings?${queryString}`);
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

    // Ensure bookings is an array
    // if (!Array.isArray(bookings)) {
    //     console.error("Invalid bookings data");
    //     return null;
    // }

    // Extract Member Name based on booking type
    const getMemberName = (booking) => {
        if (booking.counts?.primaryMemberCount > 0) {
            return booking.primaryMemberId?.name || "N/A";
        } else if (booking.dependents && Array.isArray(booking.dependents)) {
            return booking.dependents.map(dep => dep.userId?.name || "N/A").join(", ");
        } else if (booking.guests && Array.isArray(booking.guests)) {
            return booking.guests.map(guest => guest.name || "N/A").join(", ");
        }
        return "N/A";
    };

    // Function to determine ticket price based on relation type
    const getTicketPrice = (booking, relation) => {
        switch (relation) {
            case "Dependent":
                return booking.ticketDetails?.dependentMemberPrice || "N/A";
            case "Child":
                return booking.ticketDetails?.kidsMemberPrice || "N/A";
            case "Senior Dependent":
                return booking.ticketDetails?.seniorDependentMemberPrice || "N/A";
            case "Spouse":
            case "Dependent Spouse":
            case "Senior Dependent Spouse":
                return booking.ticketDetails?.spouseMemberPrice || "N/A";
            default:
                return "N/A";
        }
    };

    // Format bookings into separate rows for dependents and guests
    const formatBookings = (bookings) => {
        let formattedRows = [];

        bookings.forEach(booking => {
            if (booking.counts?.primaryMemberCount > 0) {
                formattedRows.push({
                    "Event Title": booking.eventId?.eventTitle || "N/A",
                    "Membership ID": booking.primaryMemberId?.memberId || "N/A",
                    "User AccNo": booking.primaryMemberId?.memberId || "N/A",
                    "Member Name": booking.primaryMemberId?.name || "N/A",
                    "Guest Name": "",
                    "Guest Mobile No": "",
                    "Relation": booking.primaryMemberId?.relation || "N/A",
                    "Event Date": formatDateCommon(booking.eventId?.eventStartDate) || "N/A",
                    "Created Date": formatDateCommon(booking.createdAt) || "N/A",
                    "Booking Status": booking.bookingStatus || "N/A",
                    "Ticket Price": booking.eventId?.primaryMemberPrice || "N/A"
                });
            }

            booking.dependents?.forEach(dep => {
                formattedRows.push({
                    "Event Title": booking.eventId?.eventTitle || "N/A",
                    "Membership ID": booking.primaryMemberId?.memberId || "N/A",
                    "User AccNo": dep.userId?.memberId || "N/A",
                    "Member Name": dep.userId?.name || "N/A",
                    "Guest Name": "",
                    "Guest Mobile No": "",
                    "Relation": dep.userId?.relation || "N/A",
                    "Event Date": formatDateCommon(booking.eventId?.eventStartDate) || "N/A",
                    "Created Date": formatDateCommon(booking.createdAt) || "N/A",
                    "Booking Status": booking.bookingStatus || "N/A",
                    "Ticket Price": getTicketPrice(booking, dep.userId?.relation)
                });
            });

            booking.guests?.forEach(guest => {
                formattedRows.push({
                    "Event Title": booking.eventId?.eventTitle || "N/A",
                    "Membership ID": booking.primaryMemberId?.memberId || "N/A",
                    "User AccNo": "",
                    "Member Name": "",
                    "Guest Name": guest.name || "N/A",
                    "Guest Mobile No": guest.phone || "N/A",
                    "Relation": "Guest",
                    "Event Date": formatDateCommon(booking.eventId?.eventStartDate) || "N/A",
                    "Created Date": formatDateCommon(booking.createdAt) || "N/A",
                    "Booking Status": booking.bookingStatus || "N/A",
                    "Ticket Price": booking.eventId?.guestMemberPrice || "N/A"
                });
            });
        });
        return formattedRows;
    };

    // const exportToPDF = () => {
    //     const doc = new jsPDF();
    //     doc.text("Booking Records", 10, 10);

    //     const tableHeaders = ["Event Title", "Membership ID", "User AccNo", "Member Name", "Guest Name", "Guest Mobile No", "Relation", "Event Date", "Created Date", "Booking Status", "Ticket Price"];
    //     const tableRows = formatBookings().map(row => Object.values(row));

    //     autoTable(doc, { head: [tableHeaders], body: tableRows });
    //     doc.save("bookings.pdf");
    // };
    const exportToPDF = async (exportParams) => {
        setLoadingExport(true);
        showToast("📤 Fetching data for PDF export...", "info");
        const data = await fetchExportData(exportParams);
        if (!data) return; // Prevent exporting if no data

        const { bookings } = data;
        const doc = new jsPDF({
            orientation: "landscape", // Makes the table fit better
            unit: "mm",
            format: "a4",
        });

        // Set title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Booking Records", 14, 10);

        // Table Headers
        const tableHeaders = [
            "Event Title", "Membership ID", "User AccNo", "Member Name",
            "Guest Name", "Guest Mobile No", "Relation",
            "Event Date", "Created Date", "Booking Status", "Ticket Price"
        ];

        // Get table data
        const tableRows = formatBookings(bookings).map(row => Object.values(row));

        // Generate Table
        autoTable(doc, {
            head: [tableHeaders],
            body: tableRows,
            startY: 20, // Adjust table position below title
            theme: "grid",
            headStyles: {
                fillColor: [41, 128, 185], // Blue header color
                textColor: [255, 255, 255], // White text color
                fontSize: 10,
                fontStyle: "bold",
            },
            bodyStyles: {
                fontSize: 9, // Adjust text size for better fit
                cellPadding: 3,
            },
            columnStyles: {
                0: { cellWidth: 25 }, // Event Title
                1: { cellWidth: 25 }, // Membership ID
                2: { cellWidth: 25 }, // User AccNo
                3: { cellWidth: 25 }, // Member Name
                4: { cellWidth: 25 }, // Guest Name
                5: { cellWidth: 25 }, // Guest Mobile No
                6: { cellWidth: 25 }, // Relation
                7: { cellWidth: 25 }, // Event Date
                8: { cellWidth: 25 }, // Created Date
                9: { cellWidth: 25 }, // Booking Status
                10: { cellWidth: 25 }, // Ticket Price
            },
            margin: { top: 10, left: 10, right: 10 },
            styles: {
                overflow: "linebreak",
            },
        });

        // Save PDF
        doc.save("bookings.pdf");
        setLoadingExport(false);
        showToast("✅ PDF Exported Successfully!", "success");


    };

    const exportToCSV = async (exportParams) => {
        setLoadingExport(true);
        showToast("📤 Fetching data for CSV export...", "info");
        const data = await fetchExportData(exportParams);
        if (!data) return; // Prevent exporting if no data

        const { bookings } = data;
        const worksheet = XLSX.utils.json_to_sheet(formatBookings(bookings));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
        XLSX.writeFile(workbook, "bookings.csv");
        setLoadingExport(false);
        showToast("✅ CSV Exported Successfully!", "success");

    };

    const exportToXLS = async (exportParams) => {
        setLoadingExport(true);
        showToast("📤 Fetching data for XSL export...", "info");
        const data = await fetchExportData(exportParams);
        if (!data) return; // Prevent exporting if no data

        const { bookings } = data;
        const worksheet = XLSX.utils.json_to_sheet(formatBookings(bookings));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
        XLSX.writeFile(workbook, "bookings.xlsx");
    };

    return (
        <div>
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
                    eventId,
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
                    eventId,
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
                    eventId,
                    userId,
                    exportData: true
                })}
                disabled={loadingExport}
            >
                {loadingExport ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Export to XLS"}
            </Button>
        </div>
    );
};

export default BookingsExport;
