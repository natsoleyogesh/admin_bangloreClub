import { Avatar, Box, Button, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../components/Table";
import { formatDateTime, PUBLIC_API_URI } from "../api/config";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { showToast } from "../api/toast";
import { deleteNotice, fetchAllNotices } from "../api/clubNotice";
import { getRequest } from "../api/commonAPI";

const ClubNotices = () => {
    const [noticeList, setNoticeList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [loading, setLoading] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
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
            accessorKey: "bannerImage",
            header: "Banner Image",
            size: 100,
            Cell: ({ cell }) => (
                <Avatar
                    src={`${PUBLIC_API_URI}${cell.getValue()}`}
                    alt={"GCM Image"}
                    variant="rounded"
                    sx={{ width: 100, height: 100, objectFit: "cover" }}
                />
            ),
        },
        {
            accessorKey: "title",
            header: "Title",
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

    // Fetch all rules/byelaws with pagination
    const getNotices = useCallback(async (pageNumber, pageSize) => {
        setLoading(true);
        try {
            // const response = await fetchAllRuleByeLaws({ page, limit });
            const response = await getRequest(`${PUBLIC_API_URI}/notices?page=${pageNumber}&limit=${pageSize}`);

            setNoticeList(response?.data?.notices || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalNotices || 0);
            if (response.data.pagination?.currentPage) {
                setPage(response.data.pagination.currentPage);
            }

            if (response.data.pagination?.pageSize) {
                setLimit(response.data.pagination.pageSize);
            }
        } catch (error) {
            console.error("Failed to fetch rules/byelaws:", error);
            showToast("Failed to fetch rules/byelaws. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        getNotices(page, limit);
    }, [getNotices]);

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
                <Typography variant="h6">Upcoming Events</Typography>
                <Link to="/notice/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Upcoming Event
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
                title="Delete Upcoming Event"
                message={`Are you sure you want to delete upcoming event "${selectedNotice?.title}"? This action cannot be undone.`}
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
