// import React, { useEffect, useState } from "react";
// import { Avatar, Box, Button, Typography } from "@mui/material";
// import { FiPlus } from "react-icons/fi";
// import { Link, useNavigate } from "react-router-dom";
// import {
//     deleteBanquetCategory,
//     fetchAllBanquetCategories,
// } from "../../../api/banquet";
// import { showToast } from "../../../api/toast";
// import Table from "../../../components/Table";
// import ConfirmationDialog from "../../../api/ConfirmationDialog";
// import { formatDateTime } from "../../../api/config";

// const Categories = () => {
//     const navigate = useNavigate();
//     const [categories, setCategories] = useState([]);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedCategory, setSelectedCategory] = useState(null);
//     const [loading, setLoading] = useState(null)
//     /**
//      * Format a date string to "14 December 2024".
//      * @param {string} dateString
//      * @returns {string} Formatted date.
//      */
//     const formatDate = (dateString) => {
//         const options = { year: "numeric", month: "long", day: "numeric" };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };

//     // Define columns for the table
//     const columns = [
//         {
//             accessorKey: "name",
//             header: "Category Name",
//         },

//         {
//             accessorKey: "status",
//             header: "Status",
//             Cell: ({ cell }) =>
//                 cell.getValue() ? (
//                     <Typography color="green">Active</Typography>
//                 ) : (
//                     <Typography color="red">Inactive</Typography>
//                 ),
//         },
//         {
//             accessorKey: "description",
//             header: "Description",
//             Cell: ({ row }) => {
//                 const [showFull, setShowFull] = React.useState(false);

//                 const toggleShowMore = () => setShowFull(!showFull);

//                 const description = row.original.description;

//                 const truncatedDescription = description?.length > 50
//                     ? `${description.substring(0, 50)}...`
//                     : description;

//                 return (
//                     <div>
//                         <div
//                             dangerouslySetInnerHTML={{
//                                 __html: showFull ? description : truncatedDescription,
//                             }}
//                             style={{
//                                 maxHeight: showFull ? "none" : "100px",
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                                 whiteSpace: showFull ? "normal" : "nowrap",
//                             }}
//                         />
//                         {description?.length > 50 && (
//                             <Button
//                                 size="small"
//                                 color="primary"
//                                 onClick={toggleShowMore}
//                                 sx={{
//                                     padding: "2px 4px",
//                                     marginTop: "4px",
//                                     fontSize: "12px",
//                                     textTransform: "none",
//                                 }}
//                             >
//                                 {showFull ? "Show Less" : "Show More"}
//                             </Button>
//                         )}
//                     </div>
//                 );
//             },
//         },

//         {
//             accessorKey: "createdAt",
//             header: "Created Date & Time",
//             Cell: ({ cell }) => formatDateTime(cell.getValue()),
//         },
//         {
//             accessorKey: "updatedAt",
//             header: "Updated Date & Time",
//             Cell: ({ cell }) => formatDateTime(cell.getValue()),
//         },
//     ];

//     /**
//      * Fetches all banquet categories.
//      */
//     const fetchCategories = async () => {
//         setLoading(true)
//         try {
//             const response = await fetchAllBanquetCategories();
//             setCategories(response?.data?.categories || []);
//             setLoading(false)
//         } catch (error) {
//             console.error("Error fetching categories:", error);
//             showToast(error.message || "Failed to fetch categories.", "error");
//             setLoading(false)
//         }
//     };

//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     /**
//      * Handles the deletion of a category.
//      * @param {Object} category The category to delete.
//      */
//     const handleDeleteClick = (category) => {
//         setSelectedCategory(category);
//         setOpenDialog(true);
//     };

//     /**
//      * Confirms the deletion of a category.
//      */
//     const handleConfirmDelete = async () => {
//         try {
//             await deleteBanquetCategory(selectedCategory._id);
//             showToast("Category deleted successfully.", "success");
//             fetchCategories(); // Refresh categories after deletion
//         } catch (error) {
//             console.error("Error deleting category:", error);
//             showToast(
//                 error.message || "Failed to delete category.",
//                 "error"
//             );
//         } finally {
//             setOpenDialog(false);
//             setSelectedCategory(null);
//         }
//     };

//     /**
//      * Cancels the deletion of a category.
//      */
//     const handleCancelDelete = () => {
//         setOpenDialog(false);
//         setSelectedCategory(null);
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Box
//                 sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     mb: 2,
//                 }}
//             >
//                 <Typography variant="h6">Banquet Categories</Typography>
//                 <Link to="/banquet-category/add" style={{ textDecoration: "none" }}>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<FiPlus />}
//                         sx={{ borderRadius: "20px" }}
//                     >
//                         Add Category
//                     </Button>
//                 </Link>
//             </Box>

//             <Table
//                 data={categories}
//                 fields={columns}
//                 numberOfRows={categories.length}
//                 enableTopToolBar
//                 enableBottomToolBar
//                 enablePagination
//                 enableRowSelection
//                 enableColumnFilters
//                 enableEditing
//                 enableColumnDragging
//                 showPreview
//                 routeLink="banquet-category"
//                 handleDelete={handleDeleteClick}
//                 isLoading={loading}
//             />

//             <ConfirmationDialog
//                 open={openDialog}
//                 title="Delete Category"
//                 message={`Are you sure you want to delete category "${selectedCategory?.name}"? This action cannot be undone.`}
//                 onConfirm={handleConfirmDelete}
//                 onCancel={handleCancelDelete}
//                 confirmText="Delete"
//                 cancelText="Cancel"
//                 loadingText="Deleting..."
//             />
//         </Box>
//     );
// };

// export default Categories;



import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import {
    deleteBanquetCategory,
    fetchAllBanquetCategories,
} from "../../../api/banquet";
import { showToast } from "../../../api/toast";
import Table from "../../../components/Table";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import { formatDateTime, PUBLIC_API_URI } from "../../../api/config";
import { getRequest } from "../../../api/commonAPI";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);

    // Pagination State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    // Table column definitions
    const columns = [
        { accessorKey: "name", header: "Category Name" },
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
                const truncatedDescription =
                    description?.length > 50 ? `${description.substring(0, 50)}...` : description;

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
        { accessorKey: "createdAt", header: "Created Date & Time", Cell: ({ cell }) => formatDateTime(cell.getValue()) },
        { accessorKey: "updatedAt", header: "Updated Date & Time", Cell: ({ cell }) => formatDateTime(cell.getValue()) },
    ];

    // Fetch paginated categories
    const fetchCategories = useCallback(async (pageNumber = 1, pageSize = 10) => {
        setLoading(true);
        try {
            // const response = await fetchAllBanquetCategories({ page: pageNumber, limit: pageSize });
            const response = await getRequest(`${PUBLIC_API_URI}/all-banquet-categories?page=${pageNumber}&limit=${pageSize}`);

            setCategories(response?.data?.categories || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalCategories || 0);
            if (response.data.pagination?.currentPage) {
                setPage(response.data.pagination.currentPage);
            }

            if (response.data.pagination?.pageSize) {
                setLimit(response.data.pagination.pageSize);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            showToast(error.message || "Failed to fetch categories.", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories(page, limit);
    }, [page, limit, fetchCategories]);

    // Handle delete confirmation dialog
    const handleDeleteClick = (category) => {
        setSelectedCategory(category);
        setOpenDialog(true);
    };

    // Confirm and delete category
    const handleConfirmDelete = async () => {
        try {
            await deleteBanquetCategory(selectedCategory._id);
            showToast("Category deleted successfully.", "success");
            fetchCategories(page, limit); // Refresh categories after deletion
        } catch (error) {
            console.error("Error deleting category:", error);
            showToast(error.message || "Failed to delete category.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedCategory(null);
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            {/* Header Section */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6">Banquet Categories</Typography>
                <Link to="/banquet-category/add" style={{ textDecoration: "none" }}>
                    <Button variant="contained" color="primary" startIcon={<FiPlus />} sx={{ borderRadius: "20px" }}>
                        Add Category
                    </Button>
                </Link>
            </Box>

            {/* Categories Table */}
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
                title="Delete Category"
                message={`Are you sure you want to delete category "${selectedCategory?.name}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setOpenDialog(false)}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Categories;
