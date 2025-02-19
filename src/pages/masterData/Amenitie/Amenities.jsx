// import React, { useEffect, useState } from "react";
// import { Box, Button, Typography } from "@mui/material";
// import { FiPlus } from "react-icons/fi";
// import { Link } from "react-router-dom";
// import Table from "../../../components/Table";
// import ConfirmationDialog from "../../../api/ConfirmationDialog";
// import { deleteAmenitie, fetchAllAmenities } from "../../../api/masterData/amenities"; // Adjusted to use the correct API for amenities
// import { showToast } from "../../../api/toast";
// import { formatDateTime, PUBLIC_API_URI } from "../../../api/config";

// const Amenities = () => {
//     const [amenities, setAmenities] = useState([]);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedAmenity, setSelectedAmenity] = useState(null);
//     const [loading, setLoading] = useState(null)
//     // Utility function to format dates
//     const formatDate = (dateString) => {
//         const options = { year: "numeric", month: "long", day: "numeric" };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };

//     // Table columns definition
//     const columns = [
//         { accessorKey: "name", header: "Amenity Name" },
//         {
//             accessorKey: "icon",
//             header: "Icon",
//             Cell: ({ cell }) => (
//                 <img
//                     src={`${PUBLIC_API_URI}${cell.getValue()}`}
//                     alt="Amenity Icon"
//                     style={{ width: "30px", height: "30px", objectFit: "contain" }}
//                 />
//             ),
//         },
//         { accessorKey: "status", header: "Status" },
//         {
//             accessorKey: "createdAt",
//             header: "Created Date & Time",
//             Cell: ({ cell }) => formatDateTime(cell.getValue()),
//         },
//     ];

//     // Fetch all amenities
//     const fetchAmenities = async () => {
//         setLoading(true)
//         try {
//             const response = await fetchAllAmenities(); // Fetching amenities from API
//             setAmenities(response?.data?.data || []); // Set amenities to the fetched data
//             setLoading(false)
//         } catch (error) {
//             console.error("Error fetching amenities:", error);
//             setLoading(false)
//             showToast("Failed to fetch amenities. Please try again.", "error");
//         }
//     };

//     // Fetch amenities on component mount
//     useEffect(() => {
//         fetchAmenities();
//     }, []);

//     // Handle delete confirmation dialog
//     const handleDeleteClick = (amenity) => {
//         setSelectedAmenity(amenity);
//         setOpenDialog(true);
//     };

//     // Confirm and delete amenity
//     const handleConfirmDelete = async () => {
//         try {
//             if (selectedAmenity) {
//                 await deleteAmenitie(selectedAmenity._id); // API call to delete amenity
//                 showToast("Amenity deleted successfully.", "success");
//                 fetchAmenities(); // Refresh amenities list
//             }
//         } catch (error) {
//             console.error("Error deleting amenity:", error);
//             showToast("Failed to delete amenity. Please try again.", "error");
//         } finally {
//             setOpenDialog(false);
//             setSelectedAmenity(null);
//         }
//     };

//     // Cancel delete dialog
//     const handleCancelDelete = () => {
//         setOpenDialog(false);
//         setSelectedAmenity(null);
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
//                 <Typography variant="h6">Amenities</Typography>
//                 <Link to="/amenitie/add" style={{ textDecoration: "none" }}>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<FiPlus />}
//                         sx={{ borderRadius: "20px" }}
//                     >
//                         Add Amenity
//                     </Button>
//                 </Link>
//             </Box>

//             {/* Amenities Table */}
//             <Table
//                 data={amenities}
//                 fields={columns}
//                 numberOfRows={amenities.length}
//                 enableTopToolBar
//                 enableBottomToolBar
//                 enablePagination
//                 enableRowSelection
//                 enableColumnFilters
//                 enableEditing
//                 enableColumnDragging
//                 showPreview
//                 routeLink="amenitie"
//                 handleDelete={handleDeleteClick}
//                 isLoading={loading}
//             />

//             {/* Delete Confirmation Dialog */}
//             <ConfirmationDialog
//                 open={openDialog}
//                 title="Delete Amenity"
//                 message={`Are you sure you want to delete the amenity "${selectedAmenity?.name}"? This action cannot be undone.`}
//                 onConfirm={handleConfirmDelete}
//                 onCancel={handleCancelDelete}
//                 confirmText="Delete"
//                 cancelText="Cancel"
//                 loadingText="Deleting..."
//             />
//         </Box>
//     );
// };

// export default Amenities;



import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../../../components/Table";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import { deleteAmenitie, fetchAllAmenities } from "../../../api/masterData/amenities"; // Adjusted to use the correct API for amenities
import { showToast } from "../../../api/toast";
import { formatDateTime, PUBLIC_API_URI } from "../../../api/config";
import { getRequest } from "../../../api/commonAPI";

const Amenities = () => {
    const [amenities, setAmenities] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAmenity, setSelectedAmenity] = useState(null);
    const [loading, setLoading] = useState(false);

    // Pagination State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    // Table columns definition
    const columns = [
        { accessorKey: "name", header: "Amenity Name" },
        {
            accessorKey: "icon",
            header: "Icon",
            Cell: ({ cell }) => (
                <img
                    src={`${PUBLIC_API_URI}${cell.getValue()}`}
                    alt="Amenity Icon"
                    style={{ width: "30px", height: "30px", objectFit: "contain" }}
                />
            ),
        },
        { accessorKey: "status", header: "Status" },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    // Fetch amenities
    const fetchAmenities = useCallback(async (pageNumber = 1, pageSize = 10) => {
        setLoading(true);
        try {
            // const response = await fetchAllAmenities({ page: pageNumber, limit: pageSize });
            const response = await getRequest(`${PUBLIC_API_URI}/amenities?page=${pageNumber}&limit=${pageSize}`);

            setAmenities(response?.data?.amenities || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalAmenities || 0);
            if (response.data.pagination?.currentPage) {
                setPage(response.data.pagination.currentPage);
            }

            if (response.data.pagination?.pageSize) {
                setLimit(response.data.pagination.pageSize);
            }
        } catch (error) {
            console.error("Error fetching amenities:", error);
            showToast("Failed to fetch amenities. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch data on mount and when pagination state changes
    useEffect(() => {
        fetchAmenities(page, limit);
    }, [page, limit, fetchAmenities]);

    // Handle delete confirmation dialog
    const handleDeleteClick = (amenity) => {
        setSelectedAmenity(amenity);
        setOpenDialog(true);
    };

    // Confirm and delete amenity
    const handleConfirmDelete = async () => {
        try {
            if (selectedAmenity) {
                await deleteAmenitie(selectedAmenity._id);
                showToast("Amenity deleted successfully.", "success");
                fetchAmenities(page, limit); // Refresh data after delete
            }
        } catch (error) {
            console.error("Error deleting amenity:", error);
            showToast("Failed to delete amenity. Please try again.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedAmenity(null);
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
                <Typography variant="h6">Amenities</Typography>
                <Link to="/amenitie/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Amenity
                    </Button>
                </Link>
            </Box>

            {/* Amenities Table */}
            <Table
                data={amenities}
                fields={columns}
                numberOfRows={amenities.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="amenitie"
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
                title="Delete Amenity"
                message={`Are you sure you want to delete the amenity "${selectedAmenity?.name}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setOpenDialog(false)}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Amenities;
