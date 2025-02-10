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
// import Breadcrumb from "../../../components/common/Breadcrumb";
// import { getRequest, putRequest } from "../../../api/commonAPI";
// import ReactQuill from "react-quill";

// const SingleAboutUs = () => {
//     const { id } = useParams();
//     const [about, setAbout] = useState({});
//     const [isEditDialogOpen, setEditDialogOpen] = useState(false);
//     const [editAbout, setEditAbout] = useState({});

//     const statusOptions = ["Active", "Inactive"];

//     // Fetch designation details by ID
//     useEffect(() => {
//         fetchAboutDetails(id);
//     }, [id]);

//     const fetchAboutDetails = async (aboutId) => {
//         try {
//             const response = await getRequest(`/about/${aboutId}`);
//             if (response?.data?.designation) {
//                 setAbout(response.data.about);
//                 setEditAbout(response.data.about);
//             }
//         } catch (error) {
//             console.error("Failed to fetch designation details:", error);
//             showToast("Failed to fetch designation details. Please try again.", "error");
//         }
//     };

//     // Handle input changes for editing
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setEditAbout((prev) => ({ ...prev, [name]: value }));
//     };

//     // Open and close the edit dialog
//     const handleEditClick = () => setEditDialogOpen(true);
//     const handleDialogClose = () => setEditDialogOpen(false);

//     // Validate the form fields
//     const validateForm = () => {
//         if (!editAbout.title?.trim()) {
//             showToast("Designation Name is required.", "error");
//             return false;
//         }
//         return true;
//     };

//     // Save changes to the designation
//     const handleSaveChanges = async () => {
//         if (!validateForm()) return;

//         try {
//             const response = await putRequest(`/about/${id}`, editAbout);
//             if (response.status === 200) {
//                 fetchAboutDetails(id); // Refresh designation details
//                 setEditDialogOpen(false);
//                 showToast("Designation details updated successfully!", "success");
//             } else {
//                 showToast("Failed to update designation details. Please try again.", "error");
//             }
//         } catch (error) {
//             console.error("Failed to update designation details:", error);
//             showToast(
//                 error.response?.data?.message || "Failed to update designation details. Please try again.",
//                 "error"
//             );
//         }
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Breadcrumb />
//             <Typography variant="h4" sx={{ mb: 2 }}>
//                 About Details
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
//                     <Grid item xs={12}>
//                         <Typography variant="h5">{about.title || "N/A"}</Typography>
//                         <Typography variant="body1">
//                             <strong>Description:</strong>
//                             <div
//                                 dangerouslySetInnerHTML={{ __html: about.description || "N/A" }}
//                             // style={{ maxHeight: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
//                             />
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Status:</strong> {about.status || "N/A"}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Created At:</strong> {about.createdAt
//                                 ? new Date(about.createdAt).toLocaleDateString()
//                                 : "N/A"}
//                         </Typography>
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             startIcon={<FiEdit />}
//                             onClick={handleEditClick}
//                             sx={{ mt: 2 }}
//                         >
//                             Edit about Details
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
//                 <DialogTitle>Edit About Details</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         label="Title"
//                         fullWidth
//                         margin="dense"
//                         name="title"
//                         value={editAbout.title || ""}
//                         onChange={handleInputChange}
//                     />
//                     <InputLabel sx={{ fontWeight: "bold", mt: 2 }}>Description</InputLabel>
//                     <ReactQuill
//                         value={editAbout.description || ""}
//                         onChange={(value) => setEditAbout({ ...editAbout, description: value })}
//                         style={{ height: "150px", marginBottom: "100px" }}
//                     />
//                     <FormControl fullWidth margin="dense">
//                         <InputLabel>Status</InputLabel>
//                         <Select
//                             name="status"
//                             value={editDesignation.status || ""}
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

// export default SingleAboutUs;


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
import ReactQuill from "react-quill";
import { formatDateMoment } from "../../../api/config";

const SingleAboutUs = () => {
    const { id } = useParams();
    const [aboutDetails, setAboutDetails] = useState({});
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const statusOptions = ["Active", "Inactive"];

    // Fetch About Us details by ID
    useEffect(() => {
        fetchAboutDetails(id);
    }, [id]);

    const fetchAboutDetails = async (aboutId) => {
        try {
            const response = await getRequest(`/about/${aboutId}`);
            if (response?.data?.about) {
                setAboutDetails(response.data.about);
                setEditData(response.data.about);
            }
        } catch (error) {
            console.error("Failed to fetch about details:", error);
            showToast("Failed to fetch about details. Please try again.", "error");
        }
    };

    // Handle input changes for editing
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    // Open and close the edit dialog
    const handleEditClick = () => setIsEditDialogOpen(true);
    const handleDialogClose = () => setIsEditDialogOpen(false);

    // Validate form fields
    const validateForm = () => {
        if (!editData.title?.trim()) {
            showToast("Title is required.", "error");
            return false;
        }
        return true;
    };

    // Save changes to the About Us details
    const handleSaveChanges = async () => {
        if (!validateForm()) return;

        try {
            const response = await putRequest(`/about/${id}`, editData);
            if (response.status === 200) {
                fetchAboutDetails(id); // Refresh details
                setIsEditDialogOpen(false);
                showToast("About Us details updated successfully!", "success");
            } else {
                showToast("Failed to update About Us details. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to update About Us details:", error);
            showToast(
                error.response?.data?.message || "An error occurred. Please try again.",
                "error"
            );
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                About Us Details
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
                        <Typography variant="h5">{aboutDetails.title || "N/A"}</Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Description:</strong>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: aboutDetails.description || "N/A",
                                }}
                            />
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Status:</strong> {aboutDetails.status || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Created At:</strong>{" "}
                            {aboutDetails.createdAt
                                ? formatDateMoment(aboutDetails.createdAt)
                                : "N/A"}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleEditClick}
                            sx={{ mt: 2 }}
                        >
                            Edit About Us Details
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
                <DialogTitle>Edit About Us Details</DialogTitle>
                <DialogContent>
                    {/* Title Field */}
                    <TextField
                        label="Title"
                        fullWidth
                        margin="dense"
                        name="title"
                        value={editData.title || ""}
                        onChange={handleInputChange}
                    />

                    {/* Description Field */}
                    <InputLabel sx={{ fontWeight: "bold", mt: 2 }}>Description</InputLabel>
                    <ReactQuill
                        value={editData.description || ""}
                        onChange={(value) => setEditData((prev) => ({ ...prev, description: value }))}
                        style={{ height: "150px", marginBottom: "20px" }}
                    />

                    {/* Status Field */}
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={editData.status || ""}
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

export default SingleAboutUs;
