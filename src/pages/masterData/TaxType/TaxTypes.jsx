import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../../../components/Table";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import { deleteTaxType, fetchAllTaxTypes } from "../../../api/masterData/taxType"; // Adjusted to use the correct API for tax types
import { showToast } from "../../../api/toast";
import { formatDateTime } from "../../../api/config";

const TaxTypes = () => {
    const [taxTypes, setTaxTypes] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTaxType, setSelectedTaxType] = useState(null);
    const [loading, setLoading] = useState(null)
    // Utility function to format dates
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Table columns definition
    const columns = [
        { accessorKey: "name", header: "Tax Type" },
        { accessorKey: "percentage", header: "Percentage" },
        { accessorKey: "status", header: "Status" },
        {
            accessorKey: "applyKids", // Exclusive Offer Column
            header: "Tax Applicable In Kids",
            Cell: ({ cell }) => {
                const value = cell.getValue();
                return (
                    <Typography
                        variant="body2"
                        sx={{
                            color: value ? "green" : "inherit",
                            fontWeight: value ? "bold" : "normal",
                        }}
                    >
                        {value ? "YES" : "NO"}
                    </Typography>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    // Fetch all tax types
    const fetchTaxTypes = async () => {
        setLoading(true)
        try {
            const response = await fetchAllTaxTypes(); // Fetching tax types from API
            setTaxTypes(response?.data.data || []); // Set tax types to the fetched data
            setLoading(false)
        } catch (error) {
            console.error("Error fetching tax types:", error);
            setLoading(false)
            showToast("Failed to fetch tax types. Please try again.", "error");
        }
    };

    // Fetch tax types on component mount
    useEffect(() => {
        fetchTaxTypes();
    }, []);

    // Handle delete confirmation dialog
    const handleDeleteClick = (taxType) => {
        setSelectedTaxType(taxType);
        setOpenDialog(true);
    };

    // Confirm and delete tax type
    const handleConfirmDelete = async () => {
        try {
            if (selectedTaxType) {
                await deleteTaxType(selectedTaxType._id); // API call to delete tax type
                showToast("Tax Type deleted successfully.", "success");
                fetchTaxTypes(); // Refresh tax types list
            }
        } catch (error) {
            console.error("Error deleting tax type:", error);
            showToast("Failed to delete tax type. Please try again.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedTaxType(null);
        }
    };

    // Cancel delete dialog
    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedTaxType(null);
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            {/* Header Section */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Typography variant="h6">Tax Types</Typography>
                <Link to="/taxType/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Tax Type
                    </Button>
                </Link>
            </Box>

            {/* Tax Types Table */}
            <Table
                data={taxTypes}
                fields={columns}
                numberOfRows={taxTypes.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="taxType"
                handleDelete={handleDeleteClick}
                isLoading={loading}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={openDialog}
                title="Delete Tax Type"
                message={`Are you sure you want to delete the tax type "${selectedTaxType?.name}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default TaxTypes;
