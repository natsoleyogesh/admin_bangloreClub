// import React, { useEffect, useState } from "react";
// import { Box, Button, Typography } from "@mui/material";
// import { FiPlus } from "react-icons/fi";
// import { Link } from "react-router-dom";
// import Table from "../../../components/Table";
// import ConfirmationDialog from "../../../api/ConfirmationDialog";
// import { deleteRestaurant, fetchAllRestaurants } from "../../../api/masterData/restaurant";
// import { showToast } from "../../../api/toast";
// import { formatDateTime } from "../../../api/config";

// const Restaurants = () => {
//     const [restaurants, setRestaurants] = useState([]);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedRestaurant, setSelectedRestaurant] = useState(null);
//     const [loading, setLoading] = useState(null)
//     // Utility function to format dates
//     const formatDate = (dateString) => {
//         const options = { year: "numeric", month: "long", day: "numeric" };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };

//     // Table columns definition
//     const columns = [
//         { accessorKey: "name", header: "Restaurant Name" },
//         { accessorKey: "status", header: "Status" },
//         {
//             accessorKey: "createdAt",
//             header: "Created Date & Time",
//             Cell: ({ cell }) => formatDateTime(cell.getValue()),
//         },
//     ];

//     // Fetch all restaurants
//     const fetchRestaurants = async () => {
//         setLoading(true)
//         try {
//             const response = await fetchAllRestaurants();
//             setRestaurants(response?.data?.restaurants || []); // Set restaurants to the fetched data
//             setLoading(false)
//         } catch (error) {
//             console.error("Error fetching restaurants:", error);
//             setLoading(false)
//             showToast("Failed to fetch restaurants. Please try again.", "error");
//         }
//     };

//     // Fetch restaurants on component mount
//     useEffect(() => {
//         fetchRestaurants();
//     }, []);

//     // Handle delete confirmation dialog
//     const handleDeleteClick = (restaurant) => {
//         setSelectedRestaurant(restaurant);
//         setOpenDialog(true);
//     };

//     // Confirm and delete restaurant
//     const handleConfirmDelete = async () => {
//         try {
//             if (selectedRestaurant) {
//                 await deleteRestaurant(selectedRestaurant._id);
//                 showToast("Restaurant deleted successfully.", "success");
//                 fetchRestaurants(); // Refresh restaurants list
//             }
//         } catch (error) {
//             console.error("Error deleting restaurant:", error);
//             showToast("Failed to delete restaurant. Please try again.", "error");
//         } finally {
//             setOpenDialog(false);
//             setSelectedRestaurant(null);
//         }
//     };

//     // Cancel delete dialog
//     const handleCancelDelete = () => {
//         setOpenDialog(false);
//         setSelectedRestaurant(null);
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             {/* Header Section */}
//             <Box
//                 sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     mb: 2,
//                 }}
//             >
//                 <Typography variant="h6">Restaurants</Typography>
//                 <Link to="/restaurant/add" style={{ textDecoration: "none" }}>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<FiPlus />}
//                         sx={{ borderRadius: "20px" }}
//                     >
//                         Add Restaurant
//                     </Button>
//                 </Link>
//             </Box>

//             {/* Restaurants Table */}
//             <Table
//                 data={restaurants}
//                 fields={columns}
//                 numberOfRows={restaurants.length}
//                 enableTopToolBar
//                 enableBottomToolBar
//                 enablePagination
//                 enableRowSelection
//                 enableColumnFilters
//                 enableEditing
//                 enableColumnDragging
//                 showPreview
//                 routeLink="restaurant"
//                 handleDelete={handleDeleteClick}
//                 isLoading={loading}
//             />

//             {/* Delete Confirmation Dialog */}
//             <ConfirmationDialog
//                 open={openDialog}
//                 title="Delete Restaurant"
//                 message={`Are you sure you want to delete the restaurant "${selectedRestaurant?.name}"? This action cannot be undone.`}
//                 onConfirm={handleConfirmDelete}
//                 onCancel={handleCancelDelete}
//                 confirmText="Delete"
//                 cancelText="Cancel"
//                 loadingText="Deleting..."
//             />
//         </Box>
//     );
// };

// export default Restaurants;


import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../../../components/Table";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import { deleteRestaurant, fetchAllRestaurants } from "../../../api/masterData/restaurant";
import { showToast } from "../../../api/toast";
import { formatDateTime, PUBLIC_API_URI } from "../../../api/config";
import { getRequest } from "../../../api/commonAPI";

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [loading, setLoading] = useState(false);

    // Pagination State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

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

    // Fetch restaurants
    const fetchRestaurants = useCallback(async (pageNumber = 1, pageSize = 10) => {
        setLoading(true);
        try {
            // const response = await fetchAllRestaurants({ page: pageNumber, limit: pageSize });
            const response = await getRequest(`${PUBLIC_API_URI}/restaurants?page=${pageNumber}&limit=${pageSize}`);

            setRestaurants(response?.data?.restaurants || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalRestaurants || 0);
            if (response.data.pagination?.currentPage) {
                setPage(response.data.pagination.currentPage);
            }

            if (response.data.pagination?.pageSize) {
                setLimit(response.data.pagination.pageSize);
            }
        } catch (error) {
            console.error("Error fetching restaurants:", error);
            showToast("Failed to fetch restaurants. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch data on mount and when pagination state changes
    useEffect(() => {
        fetchRestaurants(page, limit);
    }, [page, limit, fetchRestaurants]);

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
                fetchRestaurants(page, limit); // Refresh data after delete
            }
        } catch (error) {
            console.error("Error deleting restaurant:", error);
            showToast("Failed to delete restaurant. Please try again.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedRestaurant(null);
        }
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

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={openDialog}
                title="Delete Restaurant"
                message={`Are you sure you want to delete the restaurant "${selectedRestaurant?.name}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setOpenDialog(false)}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Restaurants;
