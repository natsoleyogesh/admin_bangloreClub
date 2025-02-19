import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../../../components/Table";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import { deleteDepartment, fetchAllDepartments } from "../../../api/masterData/department";
import { showToast } from "../../../api/toast";
import { formatDateTime, PUBLIC_API_URI } from "../../../api/config";
import { getRequest } from "../../../api/commonAPI";

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [loading, setLoading] = useState(null)

    // Pagination State
    const [page, setPage] = useState(1);  // Default to page 1
    const [limit, setLimit] = useState(10); // Default to 10 records per page
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    // Utility function to format dates
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Table columns definition
    const columns = [
        { accessorKey: "departmentName", header: "Department Name" },
        { accessorKey: "email", header: "Department Email" },
        { accessorKey: "status", header: "Status" },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    // Fetch all departments
    const fetchDepartments = useCallback(async (pageNumber, pageSize) => {
        setLoading(true)
        try {
            // const response = await fetchAllDepartments();
            const response = await getRequest(`${PUBLIC_API_URI}/departments?page=${pageNumber}&limit=${pageSize}`);

            setDepartments(response?.data?.departments || []); // Set departments to the fetched data
            // Ensure that we update pagination only if values exist
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalRecords(response.data.pagination?.totalDepartments || 0);

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
        fetchDepartments(page, limit);
    }, [page, limit]);

    // Handle delete confirmation dialog
    const handleDeleteClick = (department) => {
        setSelectedDepartment(department);
        setOpenDialog(true);
    };

    // Confirm and delete department
    const handleConfirmDelete = async () => {
        try {
            if (selectedDepartment) {
                await deleteDepartment(selectedDepartment._id);
                showToast("Department deleted successfully.", "success");
                fetchDepartments(page, limit); // Refresh departments list
            }
        } catch (error) {
            console.error("Error deleting department:", error);
            showToast("Failed to delete department. Please try again.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedDepartment(null);
        }
    };

    // Cancel delete dialog
    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedDepartment(null);
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
                <Typography variant="h6">Departments</Typography>
                <Link to="/department/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Department
                    </Button>
                </Link>
            </Box>

            {/* Departments Table */}
            <Table
                data={departments}
                fields={columns}
                numberOfRows={departments.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="department"
                handleDelete={handleDeleteClick}
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
                title="Delete Department"
                message={`Are you sure you want to delete the department "${selectedDepartment?.departmentName}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Departments;
