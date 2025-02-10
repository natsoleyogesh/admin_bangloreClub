import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { formatDateTime, PUBLIC_API_URI } from "../api/config";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { showToast } from "../api/toast";
import { deleteDownload, fetchAllDownloads } from "../api/download";

const Downloads = () => {


    // const navigate = useNavigate();

    const [downloadList, setDownloadList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDownload, setSelectedDownload] = useState(null);
    const [loading, setLoading] = useState(null)
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

    const getDownload = async () => {
        setLoading(true)
        try {
            const download = await fetchAllDownloads();
            console.log(download.data.downloads, "user")
            setDownloadList(download?.data.downloads);
            setLoading(false)
        } catch (error) {
            console.error("Failed to fetch members:", error);
            setLoading(false)
        }
    };

    useEffect(() => {

        getDownload();
    }, []);

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
