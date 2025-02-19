import { Box, Button, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { formatDateTime, PUBLIC_API_URI } from "../api/config";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { showToast } from "../api/toast";
// import { deleteDownload, fetchAllDownloads } from "../api/download";
import { deleteCOM, fetchAllCOMs } from "../api/com";
import { getRequest } from "../api/commonAPI";

const COMs = () => {


    // const navigate = useNavigate();

    const [comList, setComList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCom, setSelectedCom] = useState(null);
    const [loading, setLoading] = useState(null)
    // Format date to "14 December 2024"
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);


    const ComColumns = [
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
    // Fetch all rules/byelaws with pagination
    const getCOM = useCallback(async (pageNumber, pageSize) => {
        setLoading(true);
        try {
            // const response = await fetchAllRuleByeLaws({ page, limit });
            const response = await getRequest(`${PUBLIC_API_URI}/coms?page=${pageNumber}&limit=${pageSize}`);

            setComList(response?.data?.coms || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalCOMs || 0);
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
        getCOM(page, limit);
    }, [getCOM]);

    console.log(comList, "member")

    const handleDeleteClick = (com) => {
        setSelectedCom(com);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        const comId = selectedCom._id;
        console.log(comId, "usersgshg")
        try {
            await deleteCOM(comId);
            getCOM()

            showToast("Consideration Of Membership deleted successfully.", "success");
        } catch (error) {
            console.error("Failed to delete hod:", error);
            showToast(error.message || "Failed to delete Consideration Of Membership.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedCom(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedCom(null);
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
                <Typography variant="h6">Consideration Of Memberships</Typography>
                <Link to="/com/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Consideration Of Membership
                    </Button>
                </Link>
            </Box>
            <Table
                data={comList}
                fields={ComColumns}
                numberOfRows={comList.length}
                enableTopToolBar={true}
                enableBottomToolBar={true}
                enablePagination={true}
                enableRowSelection={true}
                enableColumnFilters={true}
                enableEditing={true}
                enableColumnDragging={true}
                showPreview={true}
                routeLink="com"
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
                message={`Are you sure you want to delete Consideration Of Membership ${selectedCom?.title}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default COMs;