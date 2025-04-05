
import React, { useContext, useState } from "react";
import { Box, Typography } from "@mui/material";

import { WebSocketContext } from "../../contexts/WebSocketContext";
import { deleteRequest } from "../../api/request";
import Table from "../../components/Table";

import { showToast } from "../../api/toast";
import ConfirmationDialog from "../../api/ConfirmationDialog";
import { formatDateTime } from "../../api/config";

const AllRequests = () => {
    // const { requests, removeRequest } = useContext(WebSocketContext); // Consume WebSocketContext
    const {
        requests, removeRequest, page, setPage, limit, setLimit,
        totalPages, totalRecords, loading
    } = useContext(WebSocketContext);
    const [openDialog, setOpenDialog] = useState(false); // Manage dialog state
    const [selectedRequest, setSelectedRequest] = useState(null); // Track selected request for deletion

    // Table columns definition
    const columns = [
        { accessorKey: "primaryMemberId.memberId", header: "MemberShip ID" },
        { accessorKey: "primaryMemberId.name", header: "Member" },
        { accessorKey: "department", header: "Department" },
        // {
        //     accessorKey: "departmentId.billable",
        //     header: "Billable Type",
        //     Cell: ({ row }) => (
        //         row.original.departmentId?.billable === true
        //             ? <Typography color="green">Billable</Typography>
        //             : <Typography color="red">Non-Billable</Typography>
        //     ),
        // },
        // {
        //     accessorKey: "departmentId.billable",
        //     header: "Billable Type",
        //     Cell: ({ row }) => {
        //         const billable = row.original.departmentId?.billable;
        //         return (
        //             billable === true ? (
        //                 <Typography color="green">Billable</Typography>
        //             ) : billable === false ? (
        //                 <Typography color="red">Non-Billable</Typography>
        //             ) : (
        //                 <Typography color="textSecondary">N/A</Typography>
        //             )
        //         );
        //     },
        // },

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
                // handleDelete={handleDeleteClick} // Trigger delete dialog
                pagination={{
                    page,
                    pageSize: limit,
                    totalPages,
                    totalRecords,
                    onPageChange: setPage,
                    onPageSizeChange: setLimit,
                }}
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
