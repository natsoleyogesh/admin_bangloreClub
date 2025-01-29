import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../../../components/Table";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import { showToast } from "../../../api/toast";
import { formatDateTime } from "../../../api/config";
import { deleteRequest, getRequest } from "../../../api/commonAPI";

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(false);

    // Table columns definition
    const columns = [
        { accessorKey: "name", header: "Role Name" },
        {
            accessorKey: "status",
            header: "Status",
            Cell: ({ cell }) =>
                cell.getValue() ? (
                    <Typography color="green">Active</Typography>
                ) : (
                    <Typography color="red">Inactive</Typography>
                ),
        },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    // Fetch all roles
    const fetchRoles = async () => {
        setLoading(true);
        try {
            const response = await getRequest("/roles"); // Replace with correct API endpoint
            setRoles(response?.data?.roles || []); // Set roles data
        } catch (error) {
            console.error("Error fetching roles:", error);
            showToast("Failed to fetch roles. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch roles on component mount
    useEffect(() => {
        fetchRoles();
    }, []);

    // Handle delete confirmation dialog
    const handleDeleteClick = (role) => {
        setSelectedRole(role);
        setOpenDialog(true);
    };

    // Confirm and delete role
    const handleConfirmDelete = async () => {
        try {
            if (selectedRole) {
                await deleteRequest(`/roles/${selectedRole._id}`); // Replace with correct delete API endpoint
                showToast("Role deleted successfully.", "success");
                fetchRoles(); // Refresh roles list
            }
        } catch (error) {
            console.error("Error deleting role:", error);
            showToast("Failed to delete role. Please try again.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedRole(null);
        }
    };

    // Cancel delete dialog
    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedRole(null);
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
                <Typography variant="h6">Roles</Typography>
                <Link to="/role/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Role
                    </Button>
                </Link>
                <Link to="/permission/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Permission
                    </Button>
                </Link>
            </Box>

            {/* Roles Table */}
            <Table
                data={roles}
                fields={columns}
                numberOfRows={roles.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="role"
                handleDelete={handleDeleteClick}
                isLoading={loading}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={openDialog}
                title="Delete Role"
                message={`Are you sure you want to delete the Role "${selectedRole?.name}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Roles;
