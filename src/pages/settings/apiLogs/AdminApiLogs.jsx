import React, { useCallback, useEffect, useRef, useState } from "react";
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
    CircularProgress,
    Autocomplete,
} from "@mui/material";
import Table from "../../../components/Table";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import { getRequest, deleteRequest } from "../../../api/commonAPI";
import { showToast } from "../../../api/toast";
import { formatDateTime } from "../../../api/config";
import debounce from "lodash.debounce";

const AdminApiLogs = () => {
    const [actions, setActions] = useState([]);
    // const [filters, setFilters] = useState({
    //     userType: "Admin",
    //     // userId: "all",
    //     filter: "all",
    //     role: "all",
    //     action: "all",
    //     startDate: "",
    //     endDate: "",
    // });
    const [filters, setFilters] = useState({
        userRole: "Admin",
        userId: "all",
        filter: "all",
        method: "all",
        endpoint: "",
        status: "all",
        startDate: "",
        endDate: "",
        ipAddress: "",
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

    // User Search & Infinite Scroll State
    // const [userId, setUserId] = useState("all");
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [userPage, setUserPage] = useState(1);
    const [userTotalPages, setUserTotalPages] = useState(1);
    const [fetchingUsers, setFetchingUsers] = useState(false);
    const [hasMoreUsers, setHasMoreUsers] = useState(true);
    const scrollRef = useRef(null);

    // Table columns definition
    const columns = [
        { accessorKey: "user.name", header: "Name" },
        { accessorKey: "user.email", header: "Email" },
        { accessorKey: "method", header: "Method" },
        { accessorKey: "ip", header: "IP Address" },
        { accessorKey: "endpoint", header: "EndPoint" },
        { accessorKey: "status", header: "Status" },
        {
            accessorKey: "createdAt",
            header: "Action Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

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
            const response = await getRequest(`/api-logs?${queryString}`);
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
                await deleteRequest(`/delete-api-log/${selectedAction._id}`);
                showToast("API log deleted successfully.", "success");
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
    /** 📌 Fetch Users for Autocomplete with Pagination */
    const fetchUsers = async ({ search = "", page = 1, reset = false }) => {
        if (fetchingUsers || page > userTotalPages) return;

        setFetchingUsers(true);
        try {
            const response = await getRequest(`/get-admin-search?search=${search}&page=${page}&limit=10`);
            setUsers((prevUsers) => (reset ? response.data.users : [...prevUsers, ...response.data.users]));
            setUserTotalPages(response.data.pagination.totalPages);
            setUserPage(page);
            setHasMoreUsers(page < response.data.pagination.totalPages);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setFetchingUsers(false);
        }
    };

    /** 📌 Debounced function to optimize API calls while searching */
    const debouncedFetchUsers = debounce((query) => fetchUsers({ search: query, page: 1, reset: true }), 500);

    /** 📌 Fetch Users on Component Mount */
    useEffect(() => {
        fetchUsers({ search: "", page: 1, reset: true });
    }, []);

    /** 📌 Handle Search Change */
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        debouncedFetchUsers(query);
    };

    /** 📌 Handle User Selection */
    const handleUserChange = (event, selectedUser) => {
        // setUserId(selectedUser ? selectedUser._id : "all");
        setFilters((prev) => ({
            ...prev,
            userId: selectedUser ? selectedUser._id : "all",
        }));
    };

    /** 📌 Handle Scroll to Fetch More Users */
    const handleScroll = (event) => {
        const bottom = event.target.scrollHeight - event.target.scrollTop <= event.target.clientHeight + 20;
        if (bottom && hasMoreUsers) {
            fetchUsers({ search: searchQuery, page: userPage + 1, reset: false });
        }
    };

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
                <Typography variant="h6">Admin API Logs</Typography>
            </Box>

            {/* Filters Section */}
            <Box sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Select Member</InputLabel>
                        <Autocomplete
                            options={users}
                            getOptionLabel={(option) => `${option.name}`}
                            value={users.find((user) => user._id === filters.userId) || null}
                            onChange={handleUserChange}
                            loading={fetchingUsers}
                            ListboxProps={{
                                ref: scrollRef,
                                onScroll: handleScroll,
                                style: { maxHeight: 200, overflow: "auto" },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    onChange={handleSearchChange}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {fetchingUsers ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Filter Type</InputLabel>
                        <FormControl fullWidth size="small">
                            <Select
                                value={filters.filter}
                                onChange={(e) => handleFilterChange("filter", e.target.value)}
                            >
                                <MenuItem value="today">Today</MenuItem>
                                <MenuItem value="last7days">Last 7 Days</MenuItem>
                                <MenuItem value="currentMonth">Current Month</MenuItem>
                                <MenuItem value="lastMonth">Last Month</MenuItem>
                                <MenuItem value="currentYear">Current Year</MenuItem>
                                <MenuItem value="lastYear">Last Year</MenuItem>
                                <MenuItem value="custom">Custom</MenuItem>
                                <MenuItem value="all">All</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Method</InputLabel>
                        <FormControl fullWidth size="small">
                            <Select
                                value={filters.method}
                                onChange={(e) => handleFilterChange("method", e.target.value)}
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="GET">GET</MenuItem>
                                <MenuItem value="POST">POST</MenuItem>
                                <MenuItem value="PUT">PUT</MenuItem>
                                <MenuItem value="DELETE">DELETE</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Status</InputLabel>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Enter Status (e.g., 200)"
                            value={filters.status}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                        />
                    </Grid> */}
                    <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>Status Code</InputLabel>
                        <FormControl fullWidth size="small">
                            <Select
                                value={filters.status}
                                onChange={(e) => handleFilterChange("status", e.target.value)}
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="200">200</MenuItem>
                                <MenuItem value="201">201</MenuItem>
                                <MenuItem value="400">400</MenuItem>
                                <MenuItem value="401">401</MenuItem>
                                <MenuItem value="404">404</MenuItem>
                                <MenuItem value="500">500</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                        <InputLabel>IP Address</InputLabel>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Enter IP Address"
                            value={filters.ipAddress}
                            onChange={(e) => handleFilterChange("ipAddress", e.target.value)}
                        />
                    </Grid>


                    {filters.filter === "custom" && (
                        <>
                            <Grid item xs={12} sm={3} md={2}>
                                <InputLabel>Start Date</InputLabel>
                                <TextField
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

export default AdminApiLogs;