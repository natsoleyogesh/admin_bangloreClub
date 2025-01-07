import { Avatar, Box, Button, Typography, Chip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../components/Table";
import { formatDateTime, PUBLIC_API_URI } from "../api/config";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { showToast } from "../api/toast";
import { fetchAllFoodAndBeverages, deleteFoodAndBeverage } from "../api/foodAndBeverage";

const FoodAndBeverages = () => {
    const [foodAndBeverages, setFoodAndBeverages] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFoodAndBeverage, setSelectedFoodAndBeverage] = useState(null);
    const [loading, setLoading] = useState(null)
    // Format date to "14 December 2024"
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Define table columns
    const columns = [
        {
            accessorKey: "bannerImage",
            header: "Banner Image",
            Cell: ({ cell }) => (
                cell.getValue() ? (
                    <Avatar
                        src={`${PUBLIC_API_URI}${cell.getValue()}`}
                        alt="Banner"
                        variant="rounded"
                        sx={{ width: 100, height: 60, objectFit: "cover" }}
                    />
                ) : (
                    <Typography variant="caption" color="textSecondary">
                        No Image
                    </Typography>
                )
            ),
        },
        { accessorKey: "name", header: "Category Name" },
        // { accessorKey: "description", header: "Description" },
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
            Cell: ({ cell }) => (
                <Chip
                    label={cell.getValue()}
                    color={cell.getValue() === "Active" ? "success" : "default"}
                    size="small"
                />
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    const fetchFoodAndBeverages = async () => {
        setLoading(true)
        try {
            const response = await fetchAllFoodAndBeverages();
            setFoodAndBeverages(response?.data?.foodAndBeverages || []);
            setLoading(false)
        } catch (error) {
            console.error("Failed to fetch food and beverages:", error);
            setLoading(false)
            showToast("Failed to fetch food and beverages. Please try again.", "error");
        }
    };

    useEffect(() => {
        fetchFoodAndBeverages();
    }, []);

    const handleDeleteClick = (foodAndBeverage) => {
        setSelectedFoodAndBeverage(foodAndBeverage);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (selectedFoodAndBeverage) {
                await deleteFoodAndBeverage(selectedFoodAndBeverage._id);
                showToast("Food & Beverage category deleted successfully.", "success");
                fetchFoodAndBeverages();
            }
        } catch (error) {
            console.error("Failed to delete Food & Beverage category:", error);
            showToast("Failed to delete Food & Beverage category. Please try again.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedFoodAndBeverage(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedFoodAndBeverage(null);
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
                <Typography variant="h6">Food & Beverages</Typography>
                <Link to="/foodAndBeverage/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Food & Beverage
                    </Button>
                </Link>
            </Box>
            <Table
                data={foodAndBeverages}
                fields={columns}
                numberOfRows={foodAndBeverages.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="foodAndBeverage"
                handleDelete={handleDeleteClick}
                isLoading={loading}
            />
            <ConfirmationDialog
                open={openDialog}
                title="Delete Food & Beverage Category"
                message={`Are you sure you want to delete ${selectedFoodAndBeverage?.name}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default FoodAndBeverages;
