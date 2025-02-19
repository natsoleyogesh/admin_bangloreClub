// import React, { useEffect, useState } from "react";
// import { Box, Button, Typography } from "@mui/material";
// import { FiPlus } from "react-icons/fi";
// import { Link } from "react-router-dom";
// import Table from "../../../components/Table";
// import ConfirmationDialog from "../../../api/ConfirmationDialog";
// import { deleteDepartment, fetchAllDepartments } from "../../../api/masterData/department";
// import { showToast } from "../../../api/toast";
// import { formatDateTime } from "../../../api/config";
// import { deleteRequest, getRequest } from "../../../api/commonAPI";
// import { fetchAllMembers } from "../../../api/member";

// const UserLoginActions = () => {
//     const [actions, setActions] = useState([]);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedAction, setSelectedAction] = useState(null);
//     const [loading, setLoading] = useState(null)
//     // Utility function to format dates
//     const formatDate = (dateString) => {
//         const options = { year: "numeric", month: "long", day: "numeric" };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };
//     const [userId, setUserId] = useState("all");
//     const [filter, setfilter] = useState("all");
//     const [action, setaction] = useState("all");
//     const [startDate, setstartDate] = useState("");
//     const [endDate, setendDate] = useState("");
//     const [activeMembers, setActiveMembers] = useState([]);

//     // Table columns definition
//     const columns = [
//         { accessorKey: "user.name", header: "Name" },
//         { accessorKey: "user.email", header: "Email" },
//         { accessorKey: "action", header: "Action" },
//         { accessorKey: "role", header: "Role" },

//         {
//             accessorKey: "timestamp",
//             header: "Action Date & Time",
//             Cell: ({ cell }) => formatDateTime(cell.getValue()),
//         },
//     ];

//     // Fetch all departments
//     const fetchLogActions = async () => {
//         setLoading(true)
//         try {
//             const queryParams = {
//                 userType: "User",
//                 startDate: startDate || undefined,
//                 endDate: endDate || undefined,
//             };
//             if (filter !== "all" || filter !== "customDate") {
//                 queryParams.filter = filter
//             }
//             if (action !== "all") {
//                 queryParams.action = action
//             }
//             if (userId !== "all") {
//                 queryParams.userId = userId;
//             }
//             const queryString = new URLSearchParams(queryParams).toString();
//             const response = await getRequest(`/actions?${queryString}`);
//             setDepartments(response?.data?.data || []); // Set departments to the fetched data
//             setLoading(false)
//         } catch (error) {
//             console.error("Error fetching departments:", error);
//             setLoading(false)
//             showToast("Failed to fetch departments. Please try again.", "error");
//         }
//     };

//     const getActiveMembers = async () => {
//         try {
//             const response = await fetchAllMembers();
//             setActiveMembers(response.users);
//         } catch (error) {
//             console.error("Failed to fetch members :", error);
//             showToast("Failed to fetch Members. Please try again.", "error");
//         }
//     };

//     // Fetch billings on component mount and when filters change
//     useEffect(() => {
//         getActiveMembers();
//     }, [])

//     // Fetch departments on component mount
//     useEffect(() => {
//         fetchLogActions();
//     }, [userId, filter, action, startDate, endDate]);

//     // Handle delete confirmation dialog
//     const handleDeleteClick = (department) => {
//         setSelectedAction(department);
//         setOpenDialog(true);
//     };

//     // Confirm and delete department
//     const handleConfirmDelete = async () => {
//         try {
//             if (selectedAction) {
//                 await deleteRequest(`/delete-action/${selectedAction._id}`);
//                 showToast("Department deleted successfully.", "success");
//                 fetchLogActions(); // Refresh departments list
//             }
//         } catch (error) {
//             console.error("Error deleting department:", error);
//             showToast("Failed to delete department. Please try again.", "error");
//         } finally {
//             setOpenDialog(false);
//             setSelectedAction(null);
//         }
//     };

//     // Cancel delete dialog
//     const handleCancelDelete = () => {
//         setOpenDialog(false);
//         setSelectedAction(null);
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             {/* Header Section */}
//             <Box
//                 sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     mb: 2,
//                 }}
//             >
//                 <Typography variant="h6">Users Action Logs</Typography>
//             </Box>

//             <Box sx={{ mb: 3 }}>
//                 <Grid container spacing={2} alignItems="center">
//                     <Grid item xs={12} sm={3} md={2}>
//                         <InputLabel>Select Member</InputLabel>
//                         <FormControl fullWidth size="small">

//                             <Select
//                                 name="userId"
//                                 value={userId}
//                                 onChange={(e) => setUserId(e.target.value)}
//                             >
//                                 <MenuItem value="all">All</MenuItem>
//                                 {activeMembers.map((member) => (
//                                     <MenuItem key={member._id} value={member._id}>
//                                         {member.name} (ID: {member.memberId})
//                                     </MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                     </Grid>
//                     <Grid item xs={12} sm={3} md={2}>
//                         <InputLabel>Filter Type</InputLabel>
//                         <FormControl fullWidth size="small">
//                             <Select
//                                 value={filter}
//                                 onChange={(e) => setfilter(e.target.value)}
//                             >
//                                 <MenuItem value="today">Today</MenuItem>
//                                 <MenuItem value="last7days">Last 7 Days</MenuItem>
//                                 <MenuItem value="lastMonth">Last Month</MenuItem>
//                                 <MenuItem value="lastYear">Last Year</MenuItem>
//                                 <MenuItem value="custom">Custom</MenuItem>
//                                 <MenuItem value="all">All</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Grid>
//                     <Grid item xs={12} sm={3} md={2}>
//                         <InputLabel>Action</InputLabel>
//                         <FormControl fullWidth size="small">
//                             <Select
//                                 value={action}
//                                 onChange={(e) => setActions(e.target.value)}
//                             >
//                                 <MenuItem value="login">Login</MenuItem>
//                                 <MenuItem value="logout">Logout</MenuItem>
//                                 <MenuItem value="all">All</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Grid>
//                     {filterType === "custom" && (
//                         <>
//                             <Grid item xs={12} sm={3} md={2}>
//                                 <TextField
//                                     label="Start Date"
//                                     type="date"
//                                     fullWidth
//                                     size="small"
//                                     value={startDate}
//                                     onChange={(e) => setstartDate(e.target.value)}
//                                     InputLabelProps={{ shrink: true }}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={3} md={2}>
//                                 <TextField
//                                     label="End Date"
//                                     type="date"
//                                     fullWidth
//                                     size="small"
//                                     value={endDate}
//                                     onChange={(e) => setendDate(e.target.value)}
//                                     InputLabelProps={{ shrink: true }}
//                                 />
//                             </Grid>
//                         </>
//                     )}
//                 </Grid>
//             </Box>

//             {/* Departments Table */}
//             <Table
//                 data={actions}
//                 fields={columns}
//                 numberOfRows={actions.length}
//                 enableTopToolBar
//                 enableBottomToolBar
//                 enablePagination
//                 enableRowSelection
//                 enableColumnFilters
//                 enableEditing
//                 enableColumnDragging
//                 showPreview
//                 // routeLink="department"
//                 handleDelete={handleDeleteClick}
//                 isLoading={loading}
//             />

//             {/* Delete Confirmation Dialog */}
//             <ConfirmationDialog
//                 open={openDialog}
//                 title="Delete Department"
//                 message={`Are you sure you want to delete the Action Log "${selectedAction?.action}"? This action cannot be undone.`}
//                 onConfirm={handleConfirmDelete}
//                 onCancel={handleCancelDelete}
//                 confirmText="Delete"
//                 cancelText="Cancel"
//                 loadingText="Deleting..."
//             />
//         </Box>
//     );
// };

// export default UserLoginActions;


import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    TextField,
    Autocomplete,
    CircularProgress,
} from "@mui/material";
import Table from "../../../components/Table";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import { getRequest, deleteRequest } from "../../../api/commonAPI";
import { fetchAllMembers } from "../../../api/member";
import { showToast } from "../../../api/toast";
import { formatDateTime } from "../../../api/config";
import debounce from "lodash.debounce";

const UserLoginActions = () => {
    const [actions, setActions] = useState([]);
    const [filters, setFilters] = useState({
        userType: "User",
        userId: "",
        filter: "all",
        action: "all",
        startDate: "",
        endDate: "",
    });
    const [activeMembers, setActiveMembers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const [loading, setLoading] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    // User Search & Infinite Scroll State
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
        { accessorKey: "action", header: "Action" },
        { accessorKey: "role", header: "Role" },
        {
            accessorKey: "timestamp",
            header: "Action Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    /** 📌 Fetch Users for Autocomplete with Pagination */
    const fetchUsers = async ({ search = "", page = 1, reset = false }) => {
        if (fetchingUsers || page > userTotalPages) return;

        setFetchingUsers(true);
        try {
            const response = await getRequest(`/admin/get-users?search=${search}&page=${page}&limit=10`);
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

    /** 📌 Handle Scroll to Fetch More Users */
    const handleScroll = (event) => {
        const bottom = event.target.scrollHeight - event.target.scrollTop <= event.target.clientHeight + 20;
        if (bottom && hasMoreUsers) {
            fetchUsers({ search: searchQuery, page: userPage + 1, reset: false });
        }
    };
    // Fetch action logs based on filters with pagination
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
        } catch (error) {
            console.error("Error fetching action logs:", error);
            showToast("Failed to fetch action logs. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    }, [filters, page, limit]);

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


    useEffect(() => {
        fetchLogActions();
    }, [fetchLogActions]);

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
                <Typography variant="h6">Users Action Logs</Typography>
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
                        <InputLabel>Select Member</InputLabel>
                        <Autocomplete
                            options={users}
                            getOptionLabel={(option) => `${option.name} (${option.memberId})`}
                            value={users.find((user) => user._id === filters.userId) || null}
                            onChange={(event, newValue) => handleFilterChange("userId", newValue ? newValue._id : "")}
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
                                        endAdornment: fetchingUsers ? <CircularProgress color="inherit" size={20} /> : null,
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
                // showPreview
                routeLink='user-action-logs'
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

export default UserLoginActions;