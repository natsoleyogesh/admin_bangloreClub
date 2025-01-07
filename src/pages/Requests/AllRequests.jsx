
import React, { useContext, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

import { WebSocketContext } from "../../contexts/WebSocketContext";
import { deleteRequest } from "../../api/request";
import Table from "../../components/Table";

import { showToast } from "../../api/toast";
import ConfirmationDialog from "../../api/ConfirmationDialog";
import Breadcrumb from "../../components/common/Breadcrumb";
import { formatDateTime } from "../../api/config";

const AllRequests = () => {
    const { requests, removeRequest } = useContext(WebSocketContext); // Consume WebSocketContext
    const [openDialog, setOpenDialog] = useState(false); // Manage dialog state
    const [selectedRequest, setSelectedRequest] = useState(null); // Track selected request for deletion
    const [loading, setLoading] = useState(null)
    // Utility function to format dates
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Table columns definition
    const columns = [
        { accessorKey: "primaryMemberId.name", header: "Member" },
        { accessorKey: "department", header: "Department" },
        { accessorKey: "status", header: "Status" },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    // Handle delete confirmation dialog
    const handleDeleteClick = (request) => {
        setSelectedRequest(request);
        setOpenDialog(true);
    };

    // Confirm and delete request
    const handleConfirmDelete = async () => {
        try {
            if (selectedRequest) {
                await deleteRequest(selectedRequest._id); // API call to delete request
                removeRequest(selectedRequest._id); // Remove from local state immediately
                showToast("Request deleted successfully.", "success"); // Show success toast
            }
        } catch (error) {
            console.error("Error deleting request:", error);
            showToast("Failed to delete request. Please try again.", "error"); // Show error toast
        } finally {
            setOpenDialog(false);
            setSelectedRequest(null); // Reset dialog state
        }
    };

    // Cancel delete dialog
    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedRequest(null);
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            {/* <Breadcrumb /> */}
            {/* Header Section */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Typography variant="h6">All Bookings Requests</Typography>
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
            </Box>

            {/* Requests Table */}
            <Table
                data={requests} // Data from WebSocketContext
                fields={columns} // Table column definitions
                numberOfRows={requests.length} // Pagination setup
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="request"
                handleDelete={handleDeleteClick} // Trigger delete dialog
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={openDialog} // Dialog state
                title="Delete Request"
                message={`Are you sure you want to delete the request with ID "${selectedRequest?._id}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default AllRequests;
