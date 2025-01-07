import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import {
    deleteBanquetCategory,
    fetchAllBanquetCategories,
} from "../../../api/banquet";
import { showToast } from "../../../api/toast";
import Table from "../../../components/Table";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import { formatDateTime } from "../../../api/config";

const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(null)
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
            accessorKey: "name",
            header: "Category Name",
        },

        {
            accessorKey: "status",
            header: "Status",
            Cell: ({ cell }) =>
                cell.getValue() ? (
                    <Typography color="green">Active</Typography>
                ) : (
                    <Typography color="red">Inactive</Typography>
                ),
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
     * Fetches all banquet categories.
     */
    const fetchCategories = async () => {
        setLoading(true)
        try {
            const response = await fetchAllBanquetCategories();
            setCategories(response?.data?.categories || []);
            setLoading(false)
        } catch (error) {
            console.error("Error fetching categories:", error);
            showToast(error.message || "Failed to fetch categories.", "error");
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    /**
     * Handles the deletion of a category.
     * @param {Object} category The category to delete.
     */
    const handleDeleteClick = (category) => {
        setSelectedCategory(category);
        setOpenDialog(true);
    };

    /**
     * Confirms the deletion of a category.
     */
    const handleConfirmDelete = async () => {
        try {
            await deleteBanquetCategory(selectedCategory._id);
            showToast("Category deleted successfully.", "success");
            fetchCategories(); // Refresh categories after deletion
        } catch (error) {
            console.error("Error deleting category:", error);
            showToast(
                error.message || "Failed to delete category.",
                "error"
            );
        } finally {
            setOpenDialog(false);
            setSelectedCategory(null);
        }
    };

    /**
     * Cancels the deletion of a category.
     */
    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedCategory(null);
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
                <Typography variant="h6">Banquet Categories</Typography>
                <Link to="/banquet-category/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Category
                    </Button>
                </Link>
            </Box>

            <Table
                data={categories}
                fields={columns}
                numberOfRows={categories.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="banquet-category"
                handleDelete={handleDeleteClick}
                isLoading={loading}
            />

            <ConfirmationDialog
                open={openDialog}
                title="Delete Category"
                message={`Are you sure you want to delete category "${selectedCategory?.name}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Categories;
