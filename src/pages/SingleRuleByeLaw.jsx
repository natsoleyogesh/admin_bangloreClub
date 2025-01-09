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
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { fetchRuleByeLawDetails, updateRuleByeLawDetails } from "../api/ruleByelaws"; // Update with actual API functions
// import { showToast } from "../api/toast";
// import { FiEdit } from "react-icons/fi";
// import Breadcrumb from "../components/common/Breadcrumb";
// import ReactQuill from "react-quill";

// const SingleRuleByeLaw = () => {
//     const { id } = useParams();
//     const [ruleByeLaw, setRuleByeLaw] = useState({});
//     const [isEditDialogOpen, setEditDialogOpen] = useState(false);
//     const [editRuleByeLaw, setEditRuleByeLaw] = useState({});

//     const typeOptions = ["Rule", "Bylaw"];
//     const statusOptions = ["Active", "Inactive"];

//     // Fetch Rule/Bylaw details by ID
//     useEffect(() => {
//         const getRuleByeLawById = async (ruleByeLawId) => {
//             try {
//                 const response = await fetchRuleByeLawDetails(ruleByeLawId);
//                 setRuleByeLaw(response.data.ruleByelaw);
//                 setEditRuleByeLaw(response.data.ruleByelaw);
//             } catch (error) {
//                 console.error("Failed to fetch Rule/ByeLaw details:", error);
//                 showToast("Failed to fetch Rule/ByeLaw details. Please try again.", "error");
//             }
//         };

//         getRuleByeLawById(id);
//     }, [id]);

//     // Handle input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setEditRuleByeLaw((prev) => ({ ...prev, [name]: value }));
//     };

//     // Handle dialog open/close
//     const handleEditClick = () => setEditDialogOpen(true);
//     const handleDialogClose = () => setEditDialogOpen(false);

//     // Save changes to the Rule/Byelaw
//     const handleSaveChanges = async () => {
//         try {
//             const response = await updateRuleByeLawDetails(id, editRuleByeLaw);
//             if (response.status === 200) {
//                 setRuleByeLaw(response.data.ruleByelaw);
//                 setEditDialogOpen(false);
//                 showToast("Rule/ByeLaw details updated successfully!", "success");
//             } else {
//                 showToast("Failed to update Rule/ByeLaw details. Please try again.", "error");
//             }
//         } catch (error) {
//             console.error("Failed to update Rule/ByeLaw details:", error);
//             showToast("Failed to update Rule/ByeLaw details. Please try again.", "error");
//         }
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Breadcrumb />
//             <Typography variant="h4" sx={{ mb: 2 }}>
//                 Rule/ByeLaw Details
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
//                     {/* Rule/ByeLaw Details */}
//                     <Grid item xs={12} md={7}>
//                         <Typography variant="h5">{ruleByeLaw.title || "N/A"}</Typography>
//                         <Typography variant="body1">
//                             <strong>Description:</strong>
//                             <div
//                                 dangerouslySetInnerHTML={{ __html: ruleByeLaw.description || "N/A" }}
//                             // style={{ maxHeight: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
//                             />
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Type:</strong> {ruleByeLaw.type || "N/A"}
//                         </Typography>
//                         {/* <Typography variant="body1">
//                             <strong>Category:</strong> {ruleByeLaw.category || "N/A"}
//                         </Typography> */}
//                         <Typography variant="body1">
//                             <strong>Status:</strong> {ruleByeLaw.status || "N/A"}
//                         </Typography>
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             startIcon={<FiEdit />}
//                             onClick={handleEditClick}
//                             sx={{ mt: 2 }}
//                         >
//                             Edit Rule/ByeLaw Details
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
//                 <DialogTitle>Edit Rule/ByeLaw Details</DialogTitle>
//                 <DialogContent>
//                     <FormControl fullWidth margin="dense">
//                         <InputLabel>Type</InputLabel>
//                         <Select
//                             name="type"
//                             value={editRuleByeLaw.type || ""}
//                             onChange={handleInputChange}
//                         >
//                             {typeOptions.map((option) => (
//                                 <MenuItem key={option} value={option}>
//                                     {option}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                     <TextField
//                         label="Title"
//                         fullWidth
//                         margin="dense"
//                         name="title"
//                         value={editRuleByeLaw.title || ""}
//                         onChange={handleInputChange}
//                     />
//                     {/* <TextField
//                         label="Description"
//                         fullWidth
//                         margin="dense"
//                         name="description"
//                         multiline
//                         rows={3}
//                         value={editRuleByeLaw.description || ""}
//                         onChange={handleInputChange}
//                     /> */}
//                     <ReactQuill
//                         value={editRuleByeLaw.description || ""}
//                         onChange={(value) => setEditRuleByeLaw({ ...editRuleByeLaw, description: value })}
//                         style={{ height: "150px", marginBottom: "50px" }}
//                     />
//                     <TextField
//                         label="Category"
//                         fullWidth
//                         margin="dense"
//                         name="category"
//                         value={editRuleByeLaw.category || ""}
//                         onChange={handleInputChange}
//                     />
//                     <FormControl fullWidth margin="dense">
//                         <InputLabel>Status</InputLabel>
//                         <Select
//                             name="status"
//                             value={editRuleByeLaw.status || ""}
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

// export default SingleRuleByeLaw;




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
    CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PUBLIC_API_URI } from "../api/config";
import { showToast } from "../api/toast";
import { FiEdit } from "react-icons/fi";
import Breadcrumb from "../components/common/Breadcrumb";
import { fetchRuleByeLawDetails, updateRuleByeLawDetails } from "../api/ruleByelaws";

const SingleRuleByeLaw = () => {
    const { id } = useParams(); // Extract the ID from route parameters
    const [ruleDetails, setRuleDetails] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editDetails, setEditDetails] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch Rule/Byelaw details by ID
    useEffect(() => {

        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const response = await fetchRuleByeLawDetails(id);
            setRuleDetails(response.data.ruleByelaw);
            setEditDetails(response.data.ruleByelaw);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch rule/byelaw details:", error);
            setLoading(false)
            showToast("Failed to fetch rule/byelaw details. Please try again.", "error");
        }
    };

    // Handle input field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Validate expiration date
        if (name === "expiredDate") {
            const selectedDate = new Date(value);
            const currentDate = new Date();
            if (selectedDate < currentDate) {
                showToast("Expiration date cannot be in the past.", "error");
                return;
            }
        }

        setEditDetails((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
        } else {
            showToast("Only PDF files are allowed.", "error");
        }
    };

    // Open and close dialog
    const handleEditClick = () => setEditDialogOpen(true);
    const handleDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedFile(null);
    };

    // Save updated details
    const handleSaveChanges = async () => {
        try {
            const formData = new FormData();
            Object.entries(editDetails).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            if (selectedFile) {
                formData.append("fileUrl", selectedFile);
            }

            const response = await updateRuleByeLawDetails(id, formData);
            if (response.status === 200 && response.data.ruleByelaw) {
                fetchDetails()
                // setRuleDetails(response.data.ruleByelaw);
                // setEditDetails(response.data.ruleByelaw);
                setEditDialogOpen(false);
                showToast("Rule/Byelaw details updated successfully!", "success");
            } else {
                showToast("Failed to update rule/byelaw details. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to update rule/byelaw details:", error);
            showToast("Failed to update rule/byelaw details. Please try again.", "error");
        }
    };


    if (loading) {
        return (
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    zIndex: 1000,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Rule/ByeLaw Details
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
                    {/* PDF Preview */}
                    <Grid item xs={12} md={5}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            href={`${PUBLIC_API_URI}${ruleDetails.fileUrl}`}
                            target="_blank"
                        >
                            View PDF
                        </Button>
                    </Grid>

                    {/* Rule Details */}
                    <Grid item xs={12} md={7}>
                        <Typography variant="h5">{ruleDetails.title || "N/A"}</Typography>

                        <Typography variant="body1">
                            <strong>Status:</strong> {ruleDetails.status || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Expiration Date:</strong>{" "}
                            {ruleDetails.expiredDate
                                ? new Date(ruleDetails.expiredDate).toLocaleDateString()
                                : "N/A"}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleEditClick}
                            sx={{ mt: 2 }}
                        >
                            Edit Details
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit Rule/ByeLaw Details</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="dense"
                        name="title"
                        value={editDetails.title || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Expiration Date"
                        type="date"
                        fullWidth
                        margin="dense"
                        name="expiredDate"
                        value={
                            editDetails.expiredDate
                                ? new Date(editDetails.expiredDate).toISOString().split("T")[0]
                                : ""
                        }
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates
                    />
                    <TextField
                        label="Status"
                        select
                        fullWidth
                        margin="dense"
                        name="status"
                        value={editDetails.status || ""}
                        onChange={handleInputChange}
                    >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>
                    <Button variant="contained" component="label" fullWidth>
                        Upload New PDF
                        <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
                    </Button>
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

export default SingleRuleByeLaw;
