import { Avatar, Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { deleteEvent, fetchAllEvents } from "../api/event";
import { formatDateTime, PUBLIC_API_URI } from "../api/config";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { showToast } from "../api/toast";

const Events = () => {


    const navigate = useNavigate();

    const [eventList, setEventList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(null)
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

    const getEvents = async () => {
        setLoading(true)
        try {
            const event = await fetchAllEvents();
            console.log(event.data.allEvents, "user")
            setEventList(event?.data.allEvents);
            setLoading(false)
        } catch (error) {
            console.error("Failed to fetch members:", error);
            setLoading(false)
        }
    };

    useEffect(() => {

        getEvents();
    }, []);

    console.log(eventList, "member")

    const handleDeleteClick = (event) => {
        setSelectedEvent(event);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        const eventId = selectedEvent._id;
        console.log(eventId, "usersgshg")
        try {
            await deleteEvent(eventId);
            getEvents()
            const updatedList = eventList.filter((item) => item.eventId !== eventId);
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
                handleDelete={handleDeleteClick}
                isLoading={loading}
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
