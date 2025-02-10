// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     Grid,
//     Paper,
//     TextField,
//     Typography,
//     MenuItem,
//     Select,
//     InputLabel,
//     FormControl,
// } from "@mui/material";
// import { useParams } from "react-router-dom";
// import { FiEdit } from "react-icons/fi";
// import { showToast } from "../../../api/toast";
// import { fetchDepartmentDetails, updateDepartmentDetails } from "../../../api/masterData/department";
// import Breadcrumb from "../../../components/common/Breadcrumb";
// import { getRequest, putRequest } from "../../../api/commonAPI";

// const SingleDesignation = () => {
//     const { id } = useParams();
//     const [department, setDepartment] = useState({});
//     const [isEditDialogOpen, setEditDialogOpen] = useState(false);
//     const [editDepartment, setEditDepartment] = useState({});

//     const statusOptions = ["active", "inactive"];

//     // Fetch department details by ID
//     useEffect(() => {


//         getDepartmentById(id);
//     }, [id]);

//     const getDepartmentById = async (departmentId) => {
//         try {
//             const response = await getRequest(`/designation/${departmentId}`);
//             setDepartment(response.data.designation);
//             setEditdesignation(response.data.department);
//         } catch (error) {
//             console.error("Failed to fetch department details:", error);
//             showToast("Failed to fetch department details. Please try again.", "error");
//         }
//     };

//     // Handle input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setEditDepartment((prev) => ({ ...prev, [name]: value }));
//     };

//     // Open and close the edit dialog
//     const handleEditClick = () => setEditDialogOpen(true);
//     const handleDialogClose = () => setEditDialogOpen(false);



//     const validateForm = () => {
//         const errors = [];

//         // Validate department name
//         if (!editDepartment.departmentName.trim()) {
//             errors.push("Department Name is required.");
//         }

//         // Show errors if any
//         if (errors.length > 0) {
//             errors.forEach((error) => showToast(error, "error"));
//             return false;
//         }

//         return true; // Form is valid
//     };


//     // Save changes to the department
//     const handleSaveChanges = async () => {
//         if (!validateForm()) return;

//         try {
//             const response = await putRequest(`/designation/${id}`, editDepartment);
//             if (response.status === 200) {
//                 // setDepartment(response.data.department);
//                 getDepartmentById(id)
//                 setEditDialogOpen(false);
//                 showToast("Department details updated successfully!", "success");
//             } else {
//                 showToast("Failed to update department details. Please try again.", "error");
//             }
//         } catch (error) {
//             console.error("Failed to update department details:", error);
//             showToast(error.response?.data?.message || "Failed to update department details. Please try again.", "error");
//         }
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Breadcrumb />
//             <Typography variant="h4" sx={{ mb: 2 }}>
//                 Designation Details
//             </Typography>
//             <Paper
//                 sx={{
//                     p: 3,
//                     mb: 3,
//                     borderRadius: "12px",
//                     border: "1px solid",
//                     borderColor: "divider",
//                 }}
//             >
//                 <Grid container spacing={4}>
//                     {/* Department Details Display */}
//                     <Grid item xs={12}>
//                         <Typography variant="h5">{department.designationName || "N/A"}</Typography>
//                         <Typography variant="body1">
//                             <strong>Status:</strong> {department.status || "N/A"}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Created At:</strong> {new Date(department.createdAt).toLocaleDateString() || "N/A"}
//                         </Typography>
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             startIcon={<FiEdit />}
//                             onClick={handleEditClick}
//                             sx={{ mt: 2 }}
//                         >
//                             Edit Designation Details
//                         </Button>
//                     </Grid>
//                 </Grid>
//             </Paper>

//             {/* Edit Dialog */}
//             <Dialog
//                 open={isEditDialogOpen}
//                 onClose={handleDialogClose}
//                 fullWidth
//                 maxWidth="sm"
//             >
//                 <DialogTitle>Edit Designation Details</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         label="Designation Name"
//                         fullWidth
//                         margin="dense"
//                         name="designationName"
//                         value={editDepartment.designationName || ""}
//                         onChange={handleInputChange}
//                     />
//                     <FormControl fullWidth margin="dense">
//                         <InputLabel>Status</InputLabel>
//                         <Select
//                             name="status"
//                             value={editDepartment.status || ""}
//                             onChange={handleInputChange}
//                         >
//                             {statusOptions.map((option) => (
//                                 <MenuItem key={option} value={option}>
//                                     {option}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleDialogClose} color="secondary">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleSaveChanges} color="primary">
//                         Save Changes
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default SingleDesignation;


import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    TextField,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { showToast } from "../../../api/toast";
import Breadcrumb from "../../../components/common/Breadcrumb";
import { getRequest, putRequest } from "../../../api/commonAPI";
import { formatDateMoment } from "../../../api/config";

const SingleDesignation = () => {
    const { id } = useParams();
    const [designation, setDesignation] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editDesignation, setEditDesignation] = useState({});

    const statusOptions = ["active", "inactive"];

    // Fetch designation details by ID
    useEffect(() => {
        fetchDesignationDetails(id);
    }, [id]);

    const fetchDesignationDetails = async (designationId) => {
        try {
            const response = await getRequest(`/designation/${designationId}`);
            if (response?.data?.designation) {
                setDesignation(response.data.designation);
                setEditDesignation(response.data.designation);
            }
        } catch (error) {
            console.error("Failed to fetch designation details:", error);
            showToast("Failed to fetch designation details. Please try again.", "error");
        }
    };

    // Handle input changes for editing
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditDesignation((prev) => ({ ...prev, [name]: value }));
    };

    // Open and close the edit dialog
    const handleEditClick = () => setEditDialogOpen(true);
    const handleDialogClose = () => setEditDialogOpen(false);

    // Validate the form fields
    const validateForm = () => {
        if (!editDesignation.designationName?.trim()) {
            showToast("Designation Name is required.", "error");
            return false;
        }
        return true;
    };

    // Save changes to the designation
    const handleSaveChanges = async () => {
        if (!validateForm()) return;

        try {
            const response = await putRequest(`/designation/${id}`, editDesignation);
            if (response.status === 200) {
                fetchDesignationDetails(id); // Refresh designation details
                setEditDialogOpen(false);
                showToast("Designation details updated successfully!", "success");
            } else {
                showToast("Failed to update designation details. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to update designation details:", error);
            showToast(
                error.response?.data?.message || "Failed to update designation details. Please try again.",
                "error"
            );
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Designation Details
            </Typography>
            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Typography variant="h5">{designation.designationName || "N/A"}</Typography>
                        <Typography variant="body1">
                            <strong>Status:</strong> {designation.status || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Created At:</strong> {designation.createdAt
                                ? formatDateMoment(designation.createdAt)
                                : "N/A"}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleEditClick}
                            sx={{ mt: 2 }}
                        >
                            Edit Designation Details
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Edit Dialog */}
            <Dialog
                open={isEditDialogOpen}
                onClose={handleDialogClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Edit Designation Details</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Designation Name"
                        fullWidth
                        margin="dense"
                        name="designationName"
                        value={editDesignation.designationName || ""}
                        onChange={handleInputChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={editDesignation.status || ""}
                            onChange={handleInputChange}
                        >
                            {statusOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveChanges} color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SingleDesignation;
