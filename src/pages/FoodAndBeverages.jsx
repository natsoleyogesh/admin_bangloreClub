import { Avatar, Box, Button, Typography, Chip } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../components/Table";
import { formatDateTime, PUBLIC_API_URI } from "../api/config";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { showToast } from "../api/toast";
import { fetchAllFoodAndBeverages, deleteFoodAndBeverage } from "../api/foodAndBeverage";
import { getRequest } from "../api/commonAPI";

const FoodAndBeverages = () => {
    const [foodAndBeverages, setFoodAndBeverages] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFoodAndBeverage, setSelectedFoodAndBeverage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    // Format date to "14 December 2024"
    // const formatDate = (dateString) => {
    //     const options = { year: "numeric", month: "long", day: "numeric" };
    //     return new Date(dateString).toLocaleDateString(undefined, options);
    // };

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

    // Fetch all rules/byelaws with pagination
    const fetchFoodAndBeverages = useCallback(async (pageNumber, pageSize) => {
        setLoading(true);
        try {
            // const response = await fetchAllRuleByeLaws({ page, limit });
            const response = await getRequest(`${PUBLIC_API_URI}/foodAndBeverages?page=${pageNumber}&limit=${pageSize}`);

            setFoodAndBeverages(response?.data?.foodAndBeverages || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalFoodAndBeverages || 0);
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
        fetchFoodAndBeverages(page, limit);
    }, [fetchFoodAndBeverages]);

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
