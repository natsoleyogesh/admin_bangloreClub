import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    Grid,
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    TextField,
} from "@mui/material";
import Table from "../../../components/Table";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import { getRequest, deleteRequest } from "../../../api/commonAPI";
import { fetchAllMembers } from "../../../api/member";
import { showToast } from "../../../api/toast";
import { formatDateTime } from "../../../api/config";

const AdminLoginActions = () => {
    const [actions, setActions] = useState([]);
    const [filters, setFilters] = useState({
        userType: "Admin",
        // userId: "all",
        filter: "all",
        role: "all",
        action: "all",
        startDate: "",
        endDate: "",
    });
    // const [activeMembers, setActiveMembers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const [loading, setLoading] = useState(false);


    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    // Table columns definition
    const columns = [
        { accessorKey: "user.name", header: "Name" },
        { accessorKey: "user.email", header: "Email" },
        { accessorKey: "action", header: "Action" },
        { accessorKey: "role", header: "Role" },
        {
            accessorKey: "timestamp",
            header: "Action Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    // // Fetch all members
    // const getActiveMembers = async () => {
    //     try {
    //         const response = await fetchAllMembers();
    //         setActiveMembers(response.users || []);
    //     } catch (error) {
    //         console.error("Failed to fetch members:", error);
    //         showToast("Failed to fetch members. Please try again.", "error");
    //     }
    // };

    // Fetch action logs with pagination
    const fetchLogActions = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = { ...filters, page, limit };

            // Remove empty or 'all' filters for better query construction
            Object.keys(queryParams).forEach(
                (key) => queryParams[key] === "all" || !queryParams[key] ? delete queryParams[key] : null
            );

            const queryString = new URLSearchParams(queryParams).toString();
            const response = await getRequest(`/actions?${queryString}`);
            setActions(response?.data?.data || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalActions || 0);
            if (response.data.pagination?.currentPage) {
                setPage(response.data.pagination.currentPage);
            }

            if (response.data.pagination?.pageSize) {
                setLimit(response.data.pagination.pageSize);
            }
        } catch (error) {
            console.error("Error fetching action logs:", error);
            showToast("Failed to fetch action logs. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    }, [filters, page, limit]);

    useEffect(() => {
        fetchLogActions();
    }, [fetchLogActions]);

    // Handle delete confirmation dialog
    const handleDeleteClick = (action) => {
        setSelectedAction(action);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (selectedAction) {
                await deleteRequest(`/delete-action/${selectedAction._id}`);
                showToast("Action log deleted successfully.", "success");
                fetchLogActions(); // Refresh action logs
            }
        } catch (error) {
            console.error("Error deleting action log:", error);
            showToast("Failed to delete action log. Please try again.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedAction(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedAction(null);
    };

    // // Handle filter changes
    // const handleFilterChange = (key, value) => {
    //     setFilters((prev) => ({ ...prev, [key]: value }));
    // };
    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters((prev) => {
            const updatedFilters = { ...prev, [key]: value };
            if (key === "filter" && value !== "custom") {
                updatedFilters.startDate = "";
                updatedFilters.endDate = "";
            }
            return updatedFilters;
        });
    };

    // useEffect(() => {
    //     getActiveMembers();
    // }, []);

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
                <Typography variant="h6">Admin/Other Action Logs</Typography>
            </Box>

            {/* Filters Section */}
            <Box sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    {/* <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Select Member</InputLabel>
                        <FormControl fullWidth size="small">
                            <Select
                                name="userId"
                                value={filters.userId}
                                onChange={(e) => handleFilterChange("userId", e.target.value)}
                            >
                                <MenuItem value="all">All</MenuItem>
                                {activeMembers.map((member) => (
                                    <MenuItem key={member._id} value={member._id}>
                                        {member.name} (ID: {member.memberId})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid> */}

                    <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Filter Type</InputLabel>
                        <FormControl fullWidth size="small">
                            <Select
                                value={filters.filter}
                                onChange={(e) => handleFilterChange("filter", e.target.value)}
                            >
                                <MenuItem value="today">Today</MenuItem>
                                <MenuItem value="last7days">Last 7 Days</MenuItem>
                                <MenuItem value="lastMonth">Last Month</MenuItem>
                                <MenuItem value="lastYear">Last Year</MenuItem>
                                <MenuItem value="custom">Custom</MenuItem>
                                <MenuItem value="all">All</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Action</InputLabel>
                        <FormControl fullWidth size="small">
                            <Select
                                value={filters.action}
                                onChange={(e) => handleFilterChange("action", e.target.value)}
                            >
                                <MenuItem value="login">Login</MenuItem>
                                <MenuItem value="logout">Logout</MenuItem>
                                <MenuItem value="all">All</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {filters.filter === "custom" && (
                        <>
                            <Grid item xs={12} sm={3} md={2}>
                                <InputLabel>Start Date</InputLabel>
                                <TextField
                                    // label="Start Date"
                                    type="date"
                                    fullWidth
                                    size="small"
                                    value={filters.startDate}
                                    onChange={(e) => handleFilterChange("startDate", e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3} md={2}>
                                <InputLabel>End Date</InputLabel>
                                <TextField
                                    // label="End Date"
                                    type="date"
                                    fullWidth
                                    size="small"
                                    value={filters.endDate}
                                    onChange={(e) => handleFilterChange("endDate", e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </>
                    )}
                </Grid>
            </Box>

            {/* Actions Table */}
            <Table
                data={actions}
                fields={columns}
                numberOfRows={actions.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
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
                title="Delete Action Log"
                message={`Are you sure you want to delete the action log for "${selectedAction?.action}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default AdminLoginActions;