import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { deleteBanquet, fetchAllBanquets } from "../../../api/banquet";
import { showToast } from "../../../api/toast";
import Table from "../../../components/Table";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import { formatDateTime, PUBLIC_API_URI } from "../../../api/config";
import { getRequest } from "../../../api/commonAPI";

const Banquets = () => {
    const [banquets, setBanquets] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBanquet, setSelectedBanquet] = useState(null);

    /**
     * Format a date string to "14 December 2024".
     * @param {string} dateString
     * @returns {string} Formatted date.
     */
    // const formatDate = (dateString) => {
    //     const options = { year: "numeric", month: "long", day: "numeric" };
    //     return new Date(dateString).toLocaleDateString(undefined, options);
    // };

    // Define columns for the table
    const columns = [
        {
            accessorKey: "banquetName.name",
            header: "Banquet Name",
            Cell: ({ row }) => <Typography>{row.original.banquetName?.name || "N/A"}</Typography>,
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
            accessorKey: "priceRange",
            header: "Price Range",
            Cell: ({ row }) => (
                <Typography>
                    {row.original.priceRange.minPrice} - {row.original.priceRange.maxPrice} ₹
                </Typography>
            ),
        },
        {
            accessorKey: "billable",
            header: "Billable Type",
            Cell: ({ row }) => (
                row.original.billable === true
                    ? <Typography color="green">Billable</Typography>
                    : <Typography color="red">Non-Billable</Typography>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            Cell: ({ row }) => (
                row.original.status === "Active"
                    ? <Typography color="green">Active</Typography>
                    : <Typography color="red">Inactive</Typography>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
        {
            accessorKey: "updatedAt",
            header: "Updated Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    /**
     * Fetches all banquets.
     */
    const [loading, setLoading] = useState(false)

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    // Fetch all rules/byelaws with pagination
    const fetchBanquets = useCallback(async (pageNumber, pageSize) => {
        setLoading(true);
        try {
            // const response = await fetchAllRuleByeLaws({ page, limit });
            const response = await getRequest(`${PUBLIC_API_URI}/banquets?page=${pageNumber}&limit=${pageSize}`);

            setBanquets(response?.data?.data || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalBanquets || 0);
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
        fetchBanquets(page, limit);
    }, [fetchBanquets]);

    /**
     * Handles the deletion of a banquet.
     * @param {Object} banquet The banquet to delete.
     */
    // const handleDeleteClick = (banquet) => {
    //     setSelectedBanquet(banquet);
    //     setOpenDialog(true);
    // };

    /**
     * Confirms the deletion of a banquet.
     */
    const handleConfirmDelete = async () => {
        try {
            await deleteBanquet(selectedBanquet._id);
            showToast("Banquet deleted successfully.", "success");
            fetchBanquets(); // Refresh the list after deletion
        } catch (error) {
            console.error("Error deleting banquet:", error);
            showToast(error.message || "Failed to delete banquet.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedBanquet(null);
        }
    };

    /**
     * Cancels the deletion of a banquet.
     */
    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedBanquet(null);
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Typography variant="h6">Banquet List</Typography>
                <Link to="/banquet/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Banquet
                    </Button>
                </Link>
            </Box>

            <Table
                data={banquets}
                fields={columns}
                numberOfRows={banquets.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="banquet"
                isLoading={loading}
                // handleDelete={handleDeleteClick}
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
                title="Delete Banquet"
                message={`Are you sure you want to delete banquet "${selectedBanquet?.banquetName?.name}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Banquets;
