import React, { useEffect, useState } from "react";
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

const Notifications = () => {


    const [notifications, setNotifications] = useState([]);
    const [filterType, setFilterType] = useState("all");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    const [loading, setLoading] = useState(null)



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

    // Fetch all billings with filters
    const fetchAllNotificationData = async () => {
        setLoading(true)
        try {
            const queryParams = {
                filterType,
                customStartDate: customStartDate || undefined,
                customEndDate: customEndDate || undefined,
            };

            const response = await fetchAllNotifications(queryParams);
            setNotifications(response?.data?.data || []); // Set billings to the fetched data
            setLoading(false)
        } catch (error) {
            console.error("Error fetching billings:", error);
            setNotifications([])
            setLoading(false)
            // showToast("Failed to fetch billings. Please try again.", "error");
        }
    };

    useEffect(() => {
        fetchAllNotificationData();
    }, [filterType, customStartDate, customEndDate]);



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
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    <MenuItem value="60seconds">60 Seconds</MenuItem>
                                    <MenuItem value="10minutes">Last 7 Days</MenuItem>
                                    <MenuItem value="30minutes">Last Month</MenuItem>
                                    <MenuItem value="1hour">Last 3 Months</MenuItem>
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
                />
            </Box>
        </Box>
    );
};

export default Notifications;