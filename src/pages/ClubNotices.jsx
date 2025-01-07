import { Avatar, Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../components/Table";
import { formatDateTime, PUBLIC_API_URI } from "../api/config";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { showToast } from "../api/toast";
import { deleteDownload, fetchAllDownloads } from "../api/download";
import { deleteNotice, fetchAllNotices } from "../api/clubNotice";

const ClubNotices = () => {
    const [noticeList, setNoticeList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [loading, setLoading] = useState(null)
    // Format date to "Wed, Apr 28 • 5:30 PM" in IST
    const formatDate = (dateString) => {
        const options = {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            timeZone: "Asia/Kolkata", // Set to Indian Standard Time
        };

        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", options).format(date);
    };

    const NoticeColumns = [
        {
            accessorKey: "title",
            header: "Notice Title",
        },
        // {
        //     accessorKey: "description",
        //     header: "Description",
        // },
        {
            accessorKey: "description",
            header: "Description",
            Cell: ({ row }) => {
                const [showFull, setShowFull] = React.useState(false);

                const toggleShowMore = () => setShowFull(!showFull);

                const description = row.original.description;

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
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
        {
            accessorKey: "expiredDate",
            header: "Expired Date & Time",
            Cell: ({ cell }) => formatDate(cell.getValue()),
        },
        {
            accessorKey: "fileUrl",
            header: "Action",
            Cell: ({ row }) => {
                const fileUrl = row.original.fileUrl;
                const isImage = /\.(jpeg|jpg|png|webp)$/i.test(fileUrl);

                return isImage ? (
                    <Avatar
                        src={`${PUBLIC_API_URI}${fileUrl}`}
                        alt="Notice"
                        variant="rounded"
                        sx={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                ) : (
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => window.open(`${PUBLIC_API_URI}${fileUrl}`, "_blank")}
                    >
                        View File
                    </Button>
                );
            },
        },
    ];

    const getNotices = async () => {
        setLoading(true)
        try {
            const response = await fetchAllNotices();
            setNoticeList(response?.data.notices || []);
            setLoading(false)
        } catch (error) {
            console.error("Failed to fetch notices:", error);
            setLoading(false)
        }
    };

    useEffect(() => {
        getNotices();
    }, []);

    const handleDeleteClick = (notice) => {
        setSelectedNotice(notice);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteNotice(selectedNotice._id);
            getNotices();
            showToast("Notice deleted successfully.", "success");
        } catch (error) {
            console.error("Failed to delete notice:", error);
            showToast(error.message || "Failed to delete notice.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedNotice(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedNotice(null);
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
                <Typography variant="h6">Club Notices</Typography>
                <Link to="/notice/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Notice
                    </Button>
                </Link>
            </Box>
            <Table
                data={noticeList}
                fields={NoticeColumns}
                numberOfRows={noticeList.length}
                enableTopToolBar={true}
                enableBottomToolBar={true}
                enablePagination={true}
                enableRowSelection={true}
                enableColumnFilters={true}
                enableEditing={true}
                enableColumnDragging={true}
                showPreview={true}
                routeLink="notice"
                handleDelete={handleDeleteClick}
                isLoading={loading}
            />
            <ConfirmationDialog
                open={openDialog}
                title="Delete Notice"
                message={`Are you sure you want to delete notice "${selectedNotice?.title}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default ClubNotices;
