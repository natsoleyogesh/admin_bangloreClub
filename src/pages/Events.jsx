import { Avatar, Box, Button, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { deleteEvent, fetchAllEvents } from "../api/event";
import { formatDateTime, PUBLIC_API_URI } from "../api/config";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { showToast } from "../api/toast";
import { getRequest } from "../api/commonAPI";

const Events = () => {


    // const navigate = useNavigate();

    const [eventList, setEventList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    // Format date to "14 December 2024"
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    // Format time to "01:00 PM"
    const formatTime = (timeString) => {
        const [hour, minute] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hour, minute);
        return date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };


    const eventColumns = [
        {
            accessorKey: "eventImage", //access nested data with dot notation
            header: "Image",
            size: 100,
            Cell: ({ cell }) => (
                <div>
                    <Avatar src={`${PUBLIC_API_URI}${cell.getValue()}`} sx={{ width: 100, height: 100 }} />
                </div>
            ),
        },
        {
            accessorKey: "eventTitle", //access nested data with dot notation
            header: "Event Name",
        },
        {
            accessorKey: "eventStartDate",
            header: "Event Start Date",
            Cell: ({ cell }) => formatDate(cell.getValue()),
        },
        {
            accessorKey: "eventEndDate",
            header: "Event End Date",
            Cell: ({ cell }) => formatDate(cell.getValue()),
        },
        {
            accessorKey: "startTime",
            header: "Start Time",
            Cell: ({ cell }) => formatTime(cell.getValue()),
        },
        {
            accessorKey: "endTime",
            header: "End Time",
            Cell: ({ cell }) => formatTime(cell.getValue()),
        },
        {
            accessorKey: "ticketPrice", //normal accessorKey
            header: "Ticket Price",
        },
        {
            accessorKey: "location", //normal accessorKey
            header: "Event Location",
        },
        // {
        //     accessorKey: "aboutEvent", //normal accessorKey
        //     header: "Description",
        // },
        {
            accessorKey: "abountEvent",
            header: "Description",
            Cell: ({ row }) => {
                const [showFull, setShowFull] = React.useState(false);

                const toggleShowMore = () => setShowFull(!showFull);

                const description = row.original.aboutEvent;

                const truncatedDescription = description?.length > 50
                    ? `${description.substring(0, 50)}...`
                    : description;

                return (
                    <div>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: showFull ? description : truncatedDescription,
                            }}
                            style={{
                                maxHeight: showFull ? "none" : "100px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: showFull ? "normal" : "nowrap",
                            }}
                        />
                        {description?.length > 50 && (
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
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },


    ];

    // Fetch paginated events
    const fetchEvents = useCallback(async (pageNumber, pageSize) => {
        setLoading(true);
        try {
            // const response = await fetchAllEvents({ page, limit });
            const response = await getRequest(`${PUBLIC_API_URI}/event/all-events?isAdmin=true&page=${pageNumber}&limit=${pageSize}`);


            setEventList(response?.data?.events || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalEvents || 0);
            if (response.data.pagination?.currentPage) {
                setPage(response.data.pagination.currentPage);
            }

            if (response.data.pagination?.pageSize) {
                setLimit(response.data.pagination.pageSize);
            }
        } catch (error) {
            console.error("Failed to fetch events:", error);
            showToast("Failed to fetch events.", "error");
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchEvents(page, limit);
    }, [fetchEvents]);

    console.log(eventList, "member")

    // const handleDeleteClick = (event) => {
    //     setSelectedEvent(event);
    //     setOpenDialog(true);
    // };

    const handleConfirmDelete = async () => {
        const eventId = selectedEvent._id;
        console.log(eventId, "usersgshg")
        try {
            await deleteEvent(eventId);
            fetchEvents(page, limit)
            // const updatedList = eventList.filter((item) => item.eventId !== eventId);
            // setMemberList(updatedList);
            showToast("event deleted successfully.", "success");
        } catch (error) {
            console.error("Failed to delete member:", error);
            showToast(error.message || "Failed to delete member.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedEvent(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedEvent(null);
    };


    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                }}
            >
                <Typography variant="h6">Events</Typography>
                <Link to="/events/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Event
                    </Button>
                </Link>
            </Box>
            <Table
                data={eventList}
                fields={eventColumns}
                numberOfRows={eventList.length}
                enableTopToolBar={true}
                enableBottomToolBar={true}
                enablePagination={true}
                enableRowSelection={true}
                enableColumnFilters={true}
                enableEditing={true}
                enableColumnDragging={true}
                showPreview={true}
                routeLink="events"
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
            <ConfirmationDialog
                open={openDialog}
                title="Delete Member"
                message={`Are you sure you want to delete member ${selectedEvent?.eventTitle}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Events;
