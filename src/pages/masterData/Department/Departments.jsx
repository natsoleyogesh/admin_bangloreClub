import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../../../components/Table";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import { deleteDepartment, fetchAllDepartments } from "../../../api/masterData/department";
import { showToast } from "../../../api/toast";
import { formatDateTime } from "../../../api/config";

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [loading, setLoading] = useState(null)
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
    const fetchDepartments = async () => {
        setLoading(true)
        try {
            const response = await fetchAllDepartments();
            setDepartments(response?.data?.departments || []); // Set departments to the fetched data
            setLoading(false)
        } catch (error) {
            console.error("Error fetching departments:", error);
            setLoading(false)
            showToast("Failed to fetch departments. Please try again.", "error");
        }
    };

    // Fetch departments on component mount
    useEffect(() => {
        fetchDepartments();
    }, []);

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
                fetchDepartments(); // Refresh departments list
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
