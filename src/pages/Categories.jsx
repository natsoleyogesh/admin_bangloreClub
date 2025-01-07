import { Avatar, Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { deleteCategory, fetchAllCategories } from "../api/category";
import { formatDateTime, PUBLIC_API_URI } from "../api/config";
import { showToast } from "../api/toast";
import ConfirmationDialog from "../api/ConfirmationDialog";

const Categories = () => {
    const navigate = useNavigate();
    const [categoryList, setCategoryList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(null)
    // Format date to "14 December 2024"
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    // Define columns for the categories table
    const categoryColumns = [
        {
            accessorKey: "name",
            header: "Category Name",
        },
        {
            accessorKey: "code",
            header: "Category Code",
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
            accessorKey: "isActive",
            header: "Status",
            Cell: ({ cell }) => (cell.getValue() ? "Active" : "Inactive"),
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

    // Fetch all categories
    const getCategories = async () => {
        setLoading(true)
        try {
            const response = await fetchAllCategories();
            setCategoryList(response?.data?.categories || []);
            setLoading(false)
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            setLoading(false)
            showToast(error.message || "Failed to fetch categories.", "error");
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const handleDeleteClick = (category) => {
        setSelectedCategory(category);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        const categoryId = selectedCategory._id;
        try {
            await deleteCategory(categoryId);
            getCategories(); // Refresh the list after deletion
            showToast("Category deleted successfully.", "success");
        } catch (error) {
            console.error("Failed to delete category:", error);
            showToast(error.message || "Failed to delete category.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedCategory(null);
        }
    };

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
                    marginBottom: "16px",
                }}
            >
                <Typography variant="h6">Categories</Typography>
                <Link to="/category/add" style={{ textDecoration: "none" }}>
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
                data={categoryList}
                fields={categoryColumns}
                numberOfRows={categoryList.length}
                enableTopToolBar={true}
                enableBottomToolBar={true}
                enablePagination={true}
                enableRowSelection={true}
                enableColumnFilters={true}
                enableEditing={true}
                enableColumnDragging={true}
                showPreview={true}
                routeLink="categories"
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
