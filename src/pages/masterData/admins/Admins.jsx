import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../../../components/Table";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import { showToast } from "../../../api/toast";
import { formatDateTime } from "../../../api/config";
import { deleteRequest, getRequest } from "../../../api/commonAPI";

const Admins = () => {
    const [admins, setAdmins] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [loading, setLoading] = useState(false);

    // Table columns definition
    const columns = [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "role.name", header: "Role" },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    // Fetch all admins
    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const response = await getRequest("/all-admins");
            setAdmins(response?.data?.admins || []);
        } catch (error) {
            console.error("Error fetching admins:", error);
            showToast(error.response?.data?.message || "Failed to fetch admins. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    // Handle delete confirmation dialog
    const handleDeleteClick = (admin) => {
        setSelectedAdmin(admin);
        setOpenDialog(true);
    };

    // Confirm and delete admin
    const handleConfirmDelete = async () => {
        try {
            if (selectedAdmin) {
                await deleteRequest(`/admin/${selectedAdmin._id}`);
                showToast("Admin deleted successfully.", "success");
                fetchAdmins(); // Refresh admin list
            }
        } catch (error) {
            console.error("Error deleting admin:", error);
            showToast("Failed to delete admin. Please try again.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedAdmin(null);
        }
    };

    // Cancel delete dialog
    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedAdmin(null);
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            {/* Header Section */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6">Admins</Typography>
                <Link to="/admin/add" style={{ textDecoration: "none" }}>
                    <Button variant="contained" color="primary" startIcon={<FiPlus />} sx={{ borderRadius: "20px" }}>
                        Add Admin
                    </Button>
                </Link>
            </Box>

            {/* Admins Table */}
            <Table
                data={admins}
                fields={columns}
                numberOfRows={admins.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="admin"
                // handleDelete={handleDeleteClick}
                isLoading={loading}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={openDialog}
                title="Delete Admin"
                message={`Are you sure you want to delete the Admin "${selectedAdmin?.name}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Admins;