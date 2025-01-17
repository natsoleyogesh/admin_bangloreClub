import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { deleteBanquet, fetchAllBanquets } from "../../../api/banquet";
import { showToast } from "../../../api/toast";
import Table from "../../../components/Table";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import { formatDateTime } from "../../../api/config";

const Banquets = () => {
    const [banquets, setBanquets] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBanquet, setSelectedBanquet] = useState(null);

    /**
     * Format a date string to "14 December 2024".
     * @param {string} dateString
     * @returns {string} Formatted date.
     */
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

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
    const [loading, setLoading] = useState(null)
    const fetchBanquets = async () => {
        setLoading(true)
        try {
            const response = await fetchAllBanquets();
            setBanquets(response?.data?.data || []);
            setLoading(false)
        } catch (error) {
            console.error("Error fetching banquets:", error);
            showToast(error.message || "Failed to fetch banquets.", "error");
            setLoading(false)

        }
    };

    useEffect(() => {
        fetchBanquets();
    }, []);

    /**
     * Handles the deletion of a banquet.
     * @param {Object} banquet The banquet to delete.
     */
    const handleDeleteClick = (banquet) => {
        setSelectedBanquet(banquet);
        setOpenDialog(true);
    };

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
