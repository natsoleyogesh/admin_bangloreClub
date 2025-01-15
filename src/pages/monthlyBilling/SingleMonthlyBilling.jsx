import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Paper,
    Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { fetchBillingDetails } from "../../api/billing";
import { showToast } from "../../api/toast";
import Breadcrumb from "../../components/common/Breadcrumb";
import { getRequest } from "../../api/commonAPI";

const SingleMonthlyBilling = () => {
    const { id } = useParams();
    const [billing, setBilling] = useState(null);

    // Fetch billing details by ID
    useEffect(() => {
        getBillingById(id);
    }, [id]);

    const getBillingById = async (billingId) => {
        try {
            const response = await getRequest(`/offline-billing/${billingId}`);
            setBilling(response.data.billing);
        } catch (error) {
            console.error("Failed to fetch billing details:", error);
            showToast("Failed to fetch billing details. Please try again.", "error");
        }
    };

    if (!billing) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb
            />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Monthly Billing Details
            </Typography>
            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            Invoice Number: {billing.invoiceNumber || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Member Name:</strong> {billing.memberId?.name || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Transaction Month:</strong> {billing.transactionMonth || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Invoice Date:</strong> {new Date(billing.invoiceDate).toLocaleDateString() || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Due Date:</strong> {new Date(billing.dueDate).toLocaleDateString() || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Total Amount:</strong> ₹{billing.totalAmount || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Payment Status:</strong> {billing.paymentStatus || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Status:</strong> {billing.status || "N/A"}
                        </Typography>
                    </Grid>

                    {/* Display Service Details */}
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>LEDGER Details</Typography>
                        {billing.serviceTypeEntries?.map((entry) => (
                            <Box key={entry._id} sx={{ mt: 2 }}>
                                <Typography variant="body1">
                                    <strong>Service Type:</strong> {entry.serviceType || "N/A"}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Total Credit:</strong> ₹{entry.totalCredit || 0}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Total Debit:</strong> ₹{entry.totalDebit || 0}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Total:</strong> ₹{entry.total || 0}
                                </Typography>
                            </Box>
                        ))}
                    </Grid>

                </Grid>
            </Paper>
        </Box>
    );
};

export default SingleMonthlyBilling;
