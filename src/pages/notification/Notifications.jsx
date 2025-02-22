import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    TextField,
} from "@mui/material";
import Table from "../../components/Table";
import Breadcrumb from "../../components/common/Breadcrumb";
import { formatDateTime, PUBLIC_API_URI } from "../../api/config";
import { fetchAllNotifications } from "../../api/notification";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import ConfirmationDialog from "../../api/ConfirmationDialog";
import { showToast } from "../../api/toast";
import { deleteRequest } from "../../api/commonAPI";

const Notifications = () => {


    const [notifications, setNotifications] = useState([]);
    const [filterType, setFilterType] = useState("all");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    const [loading, setLoading] = useState(null);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    // Utility function to format dates and times
    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true // Use 12-hour format
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Table columns definition
    const columns = [
        {
            accessorKey: "image",
            header: "Image",
            Cell: ({ cell }) => {
                const imageUrl = cell.getValue();
                return imageUrl ? (
                    <img
                        src={`${PUBLIC_API_URI}${imageUrl}`}
                        alt="Notification"
                        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                    />
                ) : (
                    "No Image"
                );
            },
        },
        { accessorKey: "send_to", header: "Send To" },
        { accessorKey: "department", header: "Department" },
        {
            accessorKey: "push_message",
            header: "Message",
            Cell: ({ row }) => {
                const [showFull, setShowFull] = React.useState(false);

                const toggleShowMore = () => setShowFull(!showFull);

                const push_message = row.original.push_message;

                const truncatedpush_message = push_message?.length > 50
                    ? `${push_message.substring(0, 50)}...`
                    : push_message;

                return (
                    <div>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: showFull ? push_message : truncatedpush_message,
                            }}
                            style={{
                                maxHeight: showFull ? "none" : "100px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: showFull ? "normal" : "nowrap",
                            }}
                        />
                        {push_message?.length > 50 && (
                            <Button
                                size="small"
                                color="primary"
                                onClick={toggleShowMore}
                                sx={{
                                    padding: "2px 4px",
                                    marginTop: "4px",
                                    fontSize: "12px",
                                    textTransform: "none",
                                }}
                            >
                                {showFull ? "Show Less" : "Show More"}
                            </Button>
                        )}
                    </div>
                );
            },
        },
        { accessorKey: "timeAgo", header: "Times Ago" },

        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    // Fetch notifications with pagination
    const fetchAllNotificationData = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = {
                page,
                limit,
                filterType,
            };

            if (filterType === "custom") {
                queryParams.customStartDate = customStartDate;
                queryParams.customEndDate = customEndDate;
            }

            const response = await fetchAllNotifications(queryParams);
            setNotifications(response?.data?.data || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalNotifications || 0);
            if (response.data.pagination?.currentPage) {
                setPage(response.data.pagination.currentPage);
            }

            if (response.data.pagination?.pageSize) {
                setLimit(response.data.pagination.pageSize);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    }, [page, limit, filterType, customStartDate, customEndDate]);

    useEffect(() => {
        fetchAllNotificationData();
    }, [fetchAllNotificationData]);



    // Handle filter changes
    const handleFilterChange = (key, value) => {
        if (key === "filterType" && value !== "custom") {
            // Reset custom dates when filter type is not custom
            setCustomStartDate("");
            setCustomEndDate("");
        }

        // Update the filter type
        setFilterType(value);
    };

    const handleConfirmDelete = async () => {
        const notificationId = selectedNotification._id;
        console.log(notificationId, "usersgshg")
        try {
            await deleteRequest(`/notification/${notificationId}`);
            fetchAllNotificationData()

            showToast("Notification deleted successfully.", "success");
        } catch (error) {
            console.error("Failed to delete Notification:", error.response.data.message);
            showToast(error.response.data.message || "Failed to delete Notification.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedNotification(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedNotification(null);
    };


    const handleDeleteClick = (notification) => {
        setSelectedNotification(notification);
        setOpenDialog(true);
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            {/* Header Section */}
            <Box sx={{ mb: 3 }}>

                <Typography variant="h6" sx={{ mb: 2 }}>All Notifications</Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                    }}
                >

                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3} md={2}>
                            <InputLabel>Filter Type</InputLabel>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={filterType}
                                    // onChange={(e) => setFilterType(e.target.value)}
                                    onChange={(e) => handleFilterChange("filterType", e.target.value)}
                                >
                                    <MenuItem value="60seconds">Last Minutes</MenuItem>
                                    <MenuItem value="10minutes">Last 10 Minutes</MenuItem>
                                    <MenuItem value="30minutes">Last 30 Minutes</MenuItem>
                                    <MenuItem value="1hour">Last Hour</MenuItem>
                                    <MenuItem value="custom">Custom</MenuItem>
                                    <MenuItem value="all">All</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {filterType === "custom" && (
                            <>
                                <Grid item xs={12} sm={3} md={2}>
                                    <InputLabel>Start Date</InputLabel>
                                    <TextField
                                        // label="Start Date"
                                        type="date"
                                        fullWidth
                                        size="small"
                                        value={customStartDate}
                                        onChange={(e) => setCustomStartDate(e.target.value)}
                                        // onChange={(e) => handleFilterChange("customStartDate", e.target.value)}

                                        InputLabelProps={{ shrink: false }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3} md={2}>
                                    <InputLabel>End Date</InputLabel>
                                    <TextField
                                        // label="End Date"
                                        type="date"
                                        fullWidth
                                        size="small"
                                        value={customEndDate}
                                        onChange={(e) => setCustomEndDate(e.target.value)}
                                        // onChange={(e) => handleFilterChange("customEndDate", e.target.value)}

                                        InputLabelProps={{ shrink: false }}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                    <Link to="/notification/send" style={{ textDecoration: "none" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiPlus />}
                            sx={{ borderRadius: "20px" }}
                        >
                            Send Notification
                        </Button>
                    </Link>
                </Box>

                {/* Billings Table */}
                <Table
                    data={notifications}
                    fields={columns}
                    numberOfRows={notifications.length}
                    enableTopToolBar
                    enableBottomToolBar
                    enablePagination
                    enableRowSelection
                    enableColumnFilters
                    enableEditing
                    enableColumnDragging
                    isLoading={loading}
                    routeLink='notification'
                    handleDelete={handleDeleteClick}

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
            </Box>

            <ConfirmationDialog
                open={openDialog}
                title="Delete Hod"
                message={`Are you sure you want to delete this notification? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Notifications;