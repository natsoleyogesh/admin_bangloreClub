import React, { useCallback, useEffect, useState } from "react";
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


    // Pagination State
    const [page, setPage] = useState(1);  // Default to page 1
    const [limit, setLimit] = useState(10); // Default to 10 records per page
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

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
    // const fetchAdmins = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await getRequest("/all-admins");
    //         setAdmins(response?.data?.admins || []);
    //     } catch (error) {
    //         console.error("Error fetching admins:", error);
    //         showToast(error.response?.data?.message || "Failed to fetch admins. Please try again.", "error");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchAdmins();
    // }, []);


    // Fetch all departments
    const fetchAdmins = useCallback(async (pageNumber, pageSize) => {
        setLoading(true)
        try {
            const response = await getRequest(`/all-admins?page=${pageNumber}&limit=${pageSize}`);

            setAdmins(response?.data?.admins || []);
            // Ensure that we update pagination only if values exist
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalRecords(response.data.pagination?.totalAdmins || 0);

            if (response.data.pagination?.currentPage) {
                setPage(response.data.pagination.currentPage);
            }

            if (response.data.pagination?.pageSize) {
                setLimit(response.data.pagination.pageSize);
            }
            // setLoading(false)
        } catch (error) {
            console.error("Failed to fetch members:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch departments on component mount
    useEffect(() => {
        fetchAdmins(page, limit);
    }, [page, limit]);


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
                fetchAdmins(page, limit);
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