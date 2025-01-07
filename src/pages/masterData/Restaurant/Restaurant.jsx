import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../../../components/Table";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import { deleteRestaurant, fetchAllRestaurants } from "../../../api/masterData/restaurant";
import { showToast } from "../../../api/toast";
import { formatDateTime } from "../../../api/config";

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [loading, setLoading] = useState(null)
    // Utility function to format dates
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Table columns definition
    const columns = [
        { accessorKey: "name", header: "Restaurant Name" },
        { accessorKey: "status", header: "Status" },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    // Fetch all restaurants
    const fetchRestaurants = async () => {
        setLoading(true)
        try {
            const response = await fetchAllRestaurants();
            setRestaurants(response?.data?.restaurants || []); // Set restaurants to the fetched data
            setLoading(false)
        } catch (error) {
            console.error("Error fetching restaurants:", error);
            setLoading(false)
            showToast("Failed to fetch restaurants. Please try again.", "error");
        }
    };

    // Fetch restaurants on component mount
    useEffect(() => {
        fetchRestaurants();
    }, []);

    // Handle delete confirmation dialog
    const handleDeleteClick = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setOpenDialog(true);
    };

    // Confirm and delete restaurant
    const handleConfirmDelete = async () => {
        try {
            if (selectedRestaurant) {
                await deleteRestaurant(selectedRestaurant._id);
                showToast("Restaurant deleted successfully.", "success");
                fetchRestaurants(); // Refresh restaurants list
            }
        } catch (error) {
            console.error("Error deleting restaurant:", error);
            showToast("Failed to delete restaurant. Please try again.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedRestaurant(null);
        }
    };

    // Cancel delete dialog
    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedRestaurant(null);
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            {/* Header Section */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Typography variant="h6">Restaurants</Typography>
                <Link to="/restaurant/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Restaurant
                    </Button>
                </Link>
            </Box>

            {/* Restaurants Table */}
            <Table
                data={restaurants}
                fields={columns}
                numberOfRows={restaurants.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="restaurant"
                handleDelete={handleDeleteClick}
                isLoading={loading}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={openDialog}
                title="Delete Restaurant"
                message={`Are you sure you want to delete the restaurant "${selectedRestaurant?.name}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Restaurants;
