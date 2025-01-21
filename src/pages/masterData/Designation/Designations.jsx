// import React, { useEffect, useState } from "react";
// import { Box, Button, Typography } from "@mui/material";
// import { FiPlus } from "react-icons/fi";
// import { Link } from "react-router-dom";
// import Table from "../../../components/Table";
// import ConfirmationDialog from "../../../api/ConfirmationDialog";
// import { deleteDepartment, fetchAllDepartments } from "../../../api/masterData/department";
// import { showToast } from "../../../api/toast";
// import { formatDateTime } from "../../../api/config";
// import { deleteRequest, getRequest } from "../../../api/commonAPI";

// const Designations = () => {
//     const [departments, setDepartments] = useState([]);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedDepartment, setSelectedDepartment] = useState(null);
//     const [loading, setLoading] = useState(null)
//     // Utility function to format dates
//     const formatDate = (dateString) => {
//         const options = { year: "numeric", month: "long", day: "numeric" };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };

//     // Table columns definition
//     const columns = [
//         { accessorKey: "designationName", header: "Designation Name" },
//         { accessorKey: "status", header: "Status" },
//         {
//             accessorKey: "createdAt",
//             header: "Created Date & Time",
//             Cell: ({ cell }) => formatDateTime(cell.getValue()),
//         },
//     ];

//     // Fetch all departments
//     const fetchDepartments = async () => {
//         setLoading(true)
//         try {
//             const response = await getRequest(`/designations`);
//             setDepartments(response?.data?.designations || []); // Set departments to the fetched data
//             setLoading(false)
//         } catch (error) {
//             console.error("Error fetching departments:", error);
//             setLoading(false)
//             showToast("Failed to fetch departments. Please try again.", "error");
//         }
//     };

//     // Fetch departments on component mount
//     useEffect(() => {
//         fetchDepartments();
//     }, []);

//     // Handle delete confirmation dialog
//     const handleDeleteClick = (department) => {
//         setSelectedDepartment(department);
//         setOpenDialog(true);
//     };

//     // Confirm and delete department
//     const handleConfirmDelete = async () => {
//         try {
//             if (selectedDepartment) {
//                 await deleteRequest(`/designation/${selectedDepartment._id}`);
//                 showToast("Department deleted successfully.", "success");
//                 fetchDepartments(); // Refresh departments list
//             }
//         } catch (error) {
//             console.error("Error deleting department:", error);
//             showToast("Failed to delete department. Please try again.", "error");
//         } finally {
//             setOpenDialog(false);
//             setSelectedDepartment(null);
//         }
//     };

//     // Cancel delete dialog
//     const handleCancelDelete = () => {
//         setOpenDialog(false);
//         setSelectedDepartment(null);
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
//                 <Typography variant="h6">Designations</Typography>
//                 <Link to="/department/add" style={{ textDecoration: "none" }}>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<FiPlus />}
//                         sx={{ borderRadius: "20px" }}
//                     >
//                         Add Designation
//                     </Button>
//                 </Link>
//             </Box>

//             {/* Departments Table */}
//             <Table
//                 data={departments}
//                 fields={columns}
//                 numberOfRows={departments.length}
//                 enableTopToolBar
//                 enableBottomToolBar
//                 enablePagination
//                 enableRowSelection
//                 enableColumnFilters
//                 enableEditing
//                 enableColumnDragging
//                 showPreview
//                 routeLink="department"
//                 handleDelete={handleDeleteClick}
//                 isLoading={loading}
//             />

//             {/* Delete Confirmation Dialog */}
//             <ConfirmationDialog
//                 open={openDialog}
//                 title="Delete Department"
//                 message={`Are you sure you want to delete the department "${selectedDepartment?.designationName}"? This action cannot be undone.`}
//                 onConfirm={handleConfirmDelete}
//                 onCancel={handleCancelDelete}
//                 confirmText="Delete"
//                 cancelText="Cancel"
//                 loadingText="Deleting..."
//             />
//         </Box>
//     );
// };

// export default Designations;


import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../../../components/Table";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import { showToast } from "../../../api/toast";
import { formatDateTime } from "../../../api/config";
import { deleteRequest, getRequest } from "../../../api/commonAPI";

const Designations = () => {
    // State variables
    const [designations, setDesignations] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDesignation, setSelectedDesignation] = useState(null);
    const [loading, setLoading] = useState(false);

    // Table column definitions
    const columns = [
        { accessorKey: "designationName", header: "Designation Name" },
        { accessorKey: "status", header: "Status" },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    // Fetch designations data
    const fetchDesignations = async () => {
        setLoading(true);
        try {
            const response = await getRequest("/designations");
            setDesignations(response?.data?.designations || []);
        } catch (error) {
            console.error("Error fetching designations:", error);
            showToast("Failed to fetch designations. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Delete a designation
    const handleDeleteDesignation = async () => {
        if (!selectedDesignation) return;

        try {
            await deleteRequest(`/designation/${selectedDesignation._id}`);
            showToast("Designation deleted successfully.", "success");
            fetchDesignations();
        } catch (error) {
            console.error("Error deleting designation:", error);
            showToast("Failed to delete designation. Please try again.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedDesignation(null);
        }
    };

    // Lifecycle: fetch designations on component mount
    useEffect(() => {
        fetchDesignations();
    }, []);

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
                <Typography variant="h6">Designations</Typography>
                <Link to="/designation/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Designation
                    </Button>
                </Link>
            </Box>

            {/* Designations Table */}
            <Table
                data={designations}
                fields={columns}
                numberOfRows={designations.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="designation"
                handleDelete={(designation) => {
                    setSelectedDesignation(designation);
                    setOpenDialog(true);
                }}
                isLoading={loading}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={openDialog}
                title="Delete Designation"
                message={`Are you sure you want to delete the designation "${selectedDesignation?.designationName}"? This action cannot be undone.`}
                onConfirm={handleDeleteDesignation}
                onCancel={() => {
                    setOpenDialog(false);
                    setSelectedDesignation(null);
                }}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Designations;
