import { Box, Button, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { formatDateTime, PUBLIC_API_URI } from "../api/config";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { showToast } from "../api/toast";
import { deleteDownload, fetchAllDownloads } from "../api/download";
import { getRequest } from "../api/commonAPI";

const Downloads = () => {


    // const navigate = useNavigate();

    const [downloadList, setDownloadList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDownload, setSelectedDownload] = useState(null);
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



    const DownloadColumns = [
        // {
        //     accessorKey: "image", //access nested data with dot notation
        //     header: "Image",
        //     size: 100,
        //     Cell: ({ cell }) => (
        //         <div>
        //             <Avatar src={`${PUBLIC_API_URI}${cell.getValue()}`} alt={"Hod Image"} variant="rounded" sx={{ width: 100, height: 100, objectFit: "cover" }} />

        //         </div>
        //     ),
        // },
        {
            accessorKey: "title", //access nested data with dot notation
            header: "Download Title",
        },
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
            accessorKey: "status", //normal accessorKey
            header: "Status",
        },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
        {
            accessorKey: "expiredDate",
            header: "Expired Date",
            Cell: ({ cell }) => formatDate(cell.getValue()),
        },
        {
            accessorKey: "fileUrl", // PDF file path stored in the backend
            header: "Action",
            Cell: ({ row }) => (
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => window.open(`${PUBLIC_API_URI}${row.original.fileUrl}`, "_blank")}
                >
                    View PDF
                </Button>
            ),
        },

    ];

    // Fetch downloads with pagination
    const getDownload = useCallback(async (pageNumber, pageSize) => {
        setLoading(true);
        try {
            // const response = await fetchAllDownloads({ page, limit });
            const response = await getRequest(`${PUBLIC_API_URI}/downloads?page=${pageNumber}&limit=${pageSize}`);

            setDownloadList(response?.data?.downloads || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalDownloads || 0);
            if (response.data.pagination?.currentPage) {
                setPage(response.data.pagination.currentPage);
            }

            if (response.data.pagination?.pageSize) {
                setLimit(response.data.pagination.pageSize);
            }
        } catch (error) {
            console.error("Failed to fetch downloads:", error);
            showToast("Failed to fetch downloads. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        getDownload();
    }, [getDownload]);

    console.log(downloadList, "member")

    const handleDeleteClick = (download) => {
        setSelectedDownload(download);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        const downloadId = selectedDownload._id;
        console.log(downloadId, "usersgshg")
        try {
            await deleteDownload(downloadId);
            getDownload()

            showToast("Download deleted successfully.", "success");
        } catch (error) {
            console.error("Failed to delete hod:", error);
            showToast(error.message || "Failed to delete HOD.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedDownload(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedDownload(null);
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
                <Typography variant="h6">Downloads</Typography>
                <Link to="/download/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Download
                    </Button>
                </Link>
            </Box>
            <Table
                data={downloadList}
                fields={DownloadColumns}
                numberOfRows={downloadList.length}
                enableTopToolBar={true}
                enableBottomToolBar={true}
                enablePagination={true}
                enableRowSelection={true}
                enableColumnFilters={true}
                enableEditing={true}
                enableColumnDragging={true}
                showPreview={true}
                routeLink="download"
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
                title="Delete Hod"
                message={`Are you sure you want to delete Download ${selectedDownload?.title}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Downloads;
