// import React, { useEffect, useState } from "react";
// import { Box, Button, Typography } from "@mui/material";
// import { FiPlus } from "react-icons/fi";
// import { Link } from "react-router-dom";
// import Table from "../../../components/Table";
// import ConfirmationDialog from "../../../api/ConfirmationDialog";
// import { deleteTaxType, fetchAllTaxTypes } from "../../../api/masterData/taxType"; // Adjusted to use the correct API for tax types
// import { showToast } from "../../../api/toast";
// import { formatDateTime } from "../../../api/config";

// const TaxTypes = () => {
//     const [taxTypes, setTaxTypes] = useState([]);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedTaxType, setSelectedTaxType] = useState(null);
//     const [loading, setLoading] = useState(null)
//     // Utility function to format dates
//     const formatDate = (dateString) => {
//         const options = { year: "numeric", month: "long", day: "numeric" };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };

//     // Table columns definition
//     const columns = [
//         { accessorKey: "name", header: "Tax Type" },
//         { accessorKey: "percentage", header: "Percentage" },
//         { accessorKey: "status", header: "Status" },
//         {
//             accessorKey: "applyKids", // Exclusive Offer Column
//             header: "Tax Applicable In Kids",
//             Cell: ({ cell }) => {
//                 const value = cell.getValue();
//                 return (
//                     <Typography
//                         variant="body2"
//                         sx={{
//                             color: value ? "green" : "inherit",
//                             fontWeight: value ? "bold" : "normal",
//                         }}
//                     >
//                         {value ? "YES" : "NO"}
//                     </Typography>
//                 );
//             },
//         },
//         {
//             accessorKey: "createdAt",
//             header: "Created Date & Time",
//             Cell: ({ cell }) => formatDateTime(cell.getValue()),
//         },
//     ];

//     // Fetch all tax types
//     const fetchTaxTypes = async () => {
//         setLoading(true)
//         try {
//             const response = await fetchAllTaxTypes(); // Fetching tax types from API
//             setTaxTypes(response?.data.data || []); // Set tax types to the fetched data
//             setLoading(false)
//         } catch (error) {
//             console.error("Error fetching tax types:", error);
//             setLoading(false)
//             showToast("Failed to fetch tax types. Please try again.", "error");
//         }
//     };

//     // Fetch tax types on component mount
//     useEffect(() => {
//         fetchTaxTypes();
//     }, []);

//     // Handle delete confirmation dialog
//     const handleDeleteClick = (taxType) => {
//         setSelectedTaxType(taxType);
//         setOpenDialog(true);
//     };

//     // Confirm and delete tax type
//     const handleConfirmDelete = async () => {
//         try {
//             if (selectedTaxType) {
//                 await deleteTaxType(selectedTaxType._id); // API call to delete tax type
//                 showToast("Tax Type deleted successfully.", "success");
//                 fetchTaxTypes(); // Refresh tax types list
//             }
//         } catch (error) {
//             console.error("Error deleting tax type:", error);
//             showToast("Failed to delete tax type. Please try again.", "error");
//         } finally {
//             setOpenDialog(false);
//             setSelectedTaxType(null);
//         }
//     };

//     // Cancel delete dialog
//     const handleCancelDelete = () => {
//         setOpenDialog(false);
//         setSelectedTaxType(null);
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
//                 <Typography variant="h6">Tax Types</Typography>
//                 <Link to="/taxType/add" style={{ textDecoration: "none" }}>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<FiPlus />}
//                         sx={{ borderRadius: "20px" }}
//                     >
//                         Add Tax Type
//                     </Button>
//                 </Link>
//             </Box>

//             {/* Tax Types Table */}
//             <Table
//                 data={taxTypes}
//                 fields={columns}
//                 numberOfRows={taxTypes.length}
//                 enableTopToolBar
//                 enableBottomToolBar
//                 enablePagination
//                 enableRowSelection
//                 enableColumnFilters
//                 enableEditing
//                 enableColumnDragging
//                 showPreview
//                 routeLink="taxType"
//                 handleDelete={handleDeleteClick}
//                 isLoading={loading}
//             />

//             {/* Delete Confirmation Dialog */}
//             <ConfirmationDialog
//                 open={openDialog}
//                 title="Delete Tax Type"
//                 message={`Are you sure you want to delete the tax type "${selectedTaxType?.name}"? This action cannot be undone.`}
//                 onConfirm={handleConfirmDelete}
//                 onCancel={handleCancelDelete}
//                 confirmText="Delete"
//                 cancelText="Cancel"
//                 loadingText="Deleting..."
//             />
//         </Box>
//     );
// };

// export default TaxTypes;


import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../../../components/Table";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import { deleteTaxType, fetchAllTaxTypes } from "../../../api/masterData/taxType";
import { showToast } from "../../../api/toast";
import { formatDateTime, PUBLIC_API_URI } from "../../../api/config";
import { getRequest } from "../../../api/commonAPI";

const TaxTypes = () => {
    const [taxTypes, setTaxTypes] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTaxType, setSelectedTaxType] = useState(null);
    const [loading, setLoading] = useState(false);

    // Pagination State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    // Table columns definition
    const columns = [
        { accessorKey: "name", header: "Tax Type" },
        { accessorKey: "percentage", header: "Percentage" },
        { accessorKey: "status", header: "Status" },
        {
            accessorKey: "applyKids",
            header: "Tax Applicable in Kids",
            Cell: ({ cell }) => (
                <Typography
                    variant="body2"
                    sx={{ color: cell.getValue() ? "green" : "inherit", fontWeight: "bold" }}
                >
                    {cell.getValue() ? "YES" : "NO"}
                </Typography>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    // Fetch tax types
    const fetchTaxTypes = useCallback(async (pageNumber = 1, pageSize = 10) => {
        setLoading(true);
        try {
            // const response = await fetchAllTaxTypes({ page: pageNumber, limit: pageSize });
            const response = await getRequest(`${PUBLIC_API_URI}/taxTypes?page=${pageNumber}&limit=${pageSize}`);

            setTaxTypes(response?.data?.taxTypes || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalTaxTypes || 0);
        } catch (error) {
            console.error("Error fetching tax types:", error);
            showToast("Failed to fetch tax types. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch data on mount and when pagination state changes
    useEffect(() => {
        fetchTaxTypes(page, limit);
    }, [page, limit, fetchTaxTypes]);

    // Handle delete confirmation dialog
    const handleDeleteClick = (taxType) => {
        setSelectedTaxType(taxType);
        setOpenDialog(true);
    };

    // Confirm and delete tax type
    const handleConfirmDelete = async () => {
        try {
            if (selectedTaxType) {
                await deleteTaxType(selectedTaxType._id);
                showToast("Tax Type deleted successfully.", "success");
                fetchTaxTypes(page, limit); // Refresh data after delete
            }
        } catch (error) {
            console.error("Error deleting tax type:", error);
            showToast("Failed to delete tax type. Please try again.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedTaxType(null);
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
                <Typography variant="h6">Tax Types</Typography>
                <Link to="/taxType/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Tax Type
                    </Button>
                </Link>
            </Box>

            {/* Tax Types Table */}
            <Table
                data={taxTypes}
                fields={columns}
                numberOfRows={taxTypes.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="taxType"
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
                title="Delete Tax Type"
                message={`Are you sure you want to delete the tax type "${selectedTaxType?.name}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setOpenDialog(false)}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default TaxTypes;
