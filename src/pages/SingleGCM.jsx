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
//     FormControl,
//     Select,
//     InputLabel,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { fetchGCMDetails, updateGCMDetails } from "../api/gcm";
// import { PUBLIC_API_URI } from "../api/config";
// import { showToast } from "../api/toast";
// import { FiEdit } from "react-icons/fi";
// import Breadcrumb from "../components/common/Breadcrumb";

// const categoryOptions = ["Chairperson", "Co-Chairperson", "Member"];
// const subCategoryOptions = ["Go Green", "Rooms", "Catering", "Sports"];

// const SingleGCM = () => {
//     const { id } = useParams();
//     const [gcm, setGcm] = useState({});
//     const [isEditDialogOpen, setEditDialogOpen] = useState(false);
//     const [editGcm, setEditGcm] = useState({});
//     const [selectedFile, setSelectedFile] = useState(null);

//     // Fetch GCM details by ID
//     useEffect(() => {

//         getGCMById(id);
//     }, [id]);

//     const getGCMById = async (gcmId) => {
//         try {
//             const response = await fetchGCMDetails(gcmId);
//             setGcm(response.data.gcm);
//             console.log(gcm, "gb")
//             setEditGcm(response.data.gcm);
//         } catch (error) {
//             console.error("Failed to fetch GCM details:", error);
//             showToast("Failed to fetch GCM details. Please try again.", "error");
//         }
//     };


//     // console.log(gcm, "gcm")

//     // Handle input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setEditGcm((prev) => ({ ...prev, [name]: value }));
//     };

//     // Handle category and subcategory changes
//     const handleCategoryChange = (index, value) => {
//         const updatedCategories = [...editGcm.categories];
//         updatedCategories[index].name = value;
//         setEditGcm((prev) => ({ ...prev, categories: updatedCategories }));
//     };

//     const handleSubCategoryChange = (catIndex, subIndex, value) => {
//         const updatedCategories = [...editGcm.categories];
//         updatedCategories[catIndex].subCategories[subIndex].name = value;
//         setEditGcm((prev) => ({ ...prev, categories: updatedCategories }));
//     };

//     // Add and remove categories and subcategories
//     const addCategory = () => {
//         setEditGcm((prev) => ({
//             ...prev,
//             categories: [...prev.categories, { name: "", subCategories: [{ name: "" }] }],
//         }));
//     };

//     const removeCategory = (index) => {
//         const updatedCategories = [...editGcm.categories];
//         updatedCategories.splice(index, 1);
//         setEditGcm((prev) => ({ ...prev, categories: updatedCategories }));
//     };

//     const addSubCategory = (catIndex) => {
//         const updatedCategories = [...editGcm.categories];
//         updatedCategories[catIndex].subCategories.push({ name: "" });
//         setEditGcm((prev) => ({ ...prev, categories: updatedCategories }));
//     };

//     const removeSubCategory = (catIndex, subIndex) => {
//         const updatedCategories = [...editGcm.categories];
//         updatedCategories[catIndex].subCategories.splice(subIndex, 1);
//         setEditGcm((prev) => ({ ...prev, categories: updatedCategories }));
//     };

//     // Handle file selection
//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setSelectedFile(file);
//         }
//     };

//     // Handle dialog open/close
//     const handleEditClick = () => setEditDialogOpen(true);
//     const handleDialogClose = () => {
//         setEditDialogOpen(false);
//         setSelectedFile(null);
//     };

//     // Save changes to the GCM
//     const handleSaveChanges = async () => {
//         try {
//             // const formData = new FormData();
//             // Object.entries(editGcm).forEach(([key, value]) => {
//             //     if (key === "categories") {
//             //         formData.append(key, JSON.stringify(value));
//             //     } else if (value !== null && value !== undefined) {
//             //         formData.append(key, value);
//             //     }
//             // });

//             // if (selectedFile) {
//             //     formData.append("profileImage", selectedFile);
//             // }

//             const requestBody = {
//                 // name: editGcm.name,
//                 designation: editGcm.designation,
//                 // contactNumber: editGcm.contactNumber,
//                 status: editGcm.status,
//                 categories: editGcm.categories,
//             };

//             const response = await updateGCMDetails(id, requestBody);
//             if (response.status === 200 && response.data.gcm) {
//                 // setGcm(response.data.gcm);
//                 getGCMById(id);
//                 setEditGcm(response.data.gcm);
//                 setEditDialogOpen(false);
//                 showToast("GCM details updated successfully!", "success");
//             } else {
//                 showToast("Failed to update GCM details. Please try again.", "error");
//             }
//         } catch (error) {
//             console.error("Failed to update GCM details:", error);
//             showToast("Failed to update GCM details. Please try again.", "error");
//         }
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Breadcrumb />
//             <Typography variant="h4" sx={{ mb: 2 }}>
//                 General Committee Member Details
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
//                     <Grid item xs={12} md={5}>
//                         <img
//                             src={`${PUBLIC_API_URI}${gcm?.image}`}
//                             alt={gcm.name || "GCM Image"}
//                             style={{ width: "100%", height: "300px", objectFit: "cover" }}
//                         />
//                     </Grid>
//                     <Grid item xs={12} md={7}>
//                         <Typography variant="h5">{gcm.name || "N/A"}</Typography>
//                         <Typography variant="body1">
//                             <strong>Designation:</strong> {gcm.designation || "N/A"}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Contact Number:</strong> {gcm.contactNumber || "N/A"}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Status:</strong> {gcm.status || "N/A"}
//                         </Typography>
//                         <Typography variant="body1" sx={{ mt: 2 }}>
//                             <strong>Categories:</strong>
//                         </Typography>
//                         {gcm.categories?.map((cat) => (
//                             <Box key={cat._id} sx={{ mt: 1, ml: 2 }}>
//                                 <Typography variant="body2">
//                                     <strong>{cat.name}</strong>
//                                     {cat.name === "Invalid Category" && <span style={{ color: "red" }}> (Invalid)</span>}
//                                 </Typography>
//                                 <Typography variant="body2">
//                                     ___
//                                 </Typography>
//                                 <ul>
//                                     {cat.subCategories?.map((subCat) => (
//                                         <li key={subCat._id}>
//                                             {subCat.name}
//                                             {subCat.name === "Invalid Subcategory" && (
//                                                 <span style={{ color: "red" }}> (Invalid)</span>
//                                             )}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </Box>
//                         ))}
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             startIcon={<FiEdit />}
//                             onClick={handleEditClick}
//                             sx={{ mt: 2 }}
//                         >
//                             Edit GCM Details
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
//                 <DialogTitle>Edit GCM Details</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         label="Name"
//                         fullWidth
//                         margin="dense"
//                         name="name"
//                         value={editGcm.name || ""}
//                     // onChange={handleInputChange}
//                     />
//                     <TextField
//                         label="Designation"
//                         fullWidth
//                         margin="dense"
//                         name="designation"
//                         value={editGcm.designation || ""}
//                         onChange={handleInputChange}
//                     />
//                     <TextField
//                         label="Contact Number"
//                         fullWidth
//                         margin="dense"
//                         name="contactNumber"
//                         value={editGcm.contactNumber || ""}
//                     // onChange={handleInputChange}
//                     />
//                     <FormControl fullWidth margin="dense">
//                         <InputLabel>Status</InputLabel>
//                         <Select
//                             name="status"
//                             value={editGcm.status || ""}
//                             onChange={handleInputChange}
//                         >
//                             <MenuItem value="Active">Active</MenuItem>
//                             <MenuItem value="Inactive">Inactive</MenuItem>
//                         </Select>
//                     </FormControl>
//                     {editGcm.categories?.map((cat, catIndex) => (
//                         <Box key={catIndex} sx={{ mt: 2, border: '1px solid #ccc', padding: 2, borderRadius: 2 }}>
//                             <FormControl fullWidth margin="dense">
//                                 <InputLabel>Category</InputLabel>
//                                 <Select
//                                     value={cat.name || ""}
//                                     onChange={(e) => handleCategoryChange(catIndex, e.target.value)}
//                                 >
//                                     {categoryOptions.map((option) => (
//                                         <MenuItem key={option} value={option}>
//                                             {option}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                             {cat.subCategories.map((subCat, subIndex) => (
//                                 <Box key={subIndex} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
//                                     <FormControl fullWidth margin="dense">
//                                         <InputLabel>Subcategory</InputLabel>
//                                         <Select
//                                             value={subCat.name || ""}
//                                             onChange={(e) =>
//                                                 handleSubCategoryChange(catIndex, subIndex, e.target.value)
//                                             }
//                                         >
//                                             {subCategoryOptions.map((option) => (
//                                                 <MenuItem key={option} value={option}>
//                                                     {option}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                     </FormControl>
//                                     <Button
//                                         onClick={() => removeSubCategory(catIndex, subIndex)}
//                                         color="error"
//                                         sx={{ ml: 2 }}
//                                     >
//                                         Remove Subcategory
//                                     </Button>
//                                 </Box>
//                             ))}
//                             <Button onClick={() => addSubCategory(catIndex)} sx={{ mt: 1 }}>
//                                 Add Subcategory
//                             </Button>
//                             {editGcm.categories.length > 1 && (
//                                 <Button
//                                     onClick={() => removeCategory(catIndex)}
//                                     color="error"
//                                     sx={{ mt: 1 }}
//                                 >
//                                     Remove Category
//                                 </Button>
//                             )}
//                         </Box>
//                     ))}
//                     <Button onClick={addCategory}>Add Category</Button>
//                     {/* <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
//                         Upload New Profile Image
//                         <input type="file" accept="image/*" hidden onChange={handleFileChange} />
//                     </Button> */}
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

// export default SingleGCM;


import React, { useEffect, useRef, useState } from "react";
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
    FormControl,
    Select,
    InputLabel,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { fetchGCMDetails, updateGCMDetails } from "../api/gcm";
import { PUBLIC_API_URI } from "../api/config";
import { showToast } from "../api/toast";
import { FiEdit } from "react-icons/fi";
import Breadcrumb from "../components/common/Breadcrumb";
import styled from "@emotion/styled";
import { BiImageAdd } from "react-icons/bi";
import { getRequest } from "../api/commonAPI";
import { fetchAllActiveDepartments } from "../api/masterData/department";

const categoryOptions = ["Chairperson", "Co-Chairperson", "Member"];
const subCategoryOptions = ["Go Green", "Rooms", "Catering", "Sports"];


const UploadBox = styled(Box)(({ theme }) => ({
    marginTop: 20,
    height: 180,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    border: `2px dashed ${theme.palette.divider}`,
    cursor: "pointer",
    backgroundColor: theme.palette.background.paper,
    transition: "0.3s",
    "&:hover": {
        backgroundColor: theme.palette.action.hover,
    },
}));

const SingleGCM = () => {
    const { id } = useParams();
    const [gcm, setGcm] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editGcm, setEditGcm] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const imageInput = useRef(null);

    const [activeDepartments, setActiveDepartments] = useState([]);
    const [activeDesignation, setActiveDesignation] = useState([]);



    useEffect(() => {
        getActiveDepartments()
        getActiveDesignations()
    }, [id])

    const getActiveDepartments = async () => {
        try {
            const department = await fetchAllActiveDepartments();
            console.log(department, "hh")
            setActiveDepartments(department.data.activeDepartments);

        } catch (error) {
            console.error("Failed to fetch members :", error);
            showToast("Failed to fetch Members. Please try again.", "error");
        }
    };

    const getActiveDesignations = async () => {
        try {
            const designation = await getRequest('/active-designations');
            console.log(designation, "hh")
            setActiveDesignation(designation.data.activeDesignations);

        } catch (error) {
            console.error("Failed to fetch members :", error);
            showToast("Failed to fetch Members. Please try again.", "error");
        }
    };


    useEffect(() => {
        getGCMById(id);
        getEditGCMById(id)
    }, [id]);

    const getGCMById = async (gcmId) => {
        try {
            const response = await fetchGCMDetails(gcmId);
            setGcm(response.data.gcm);
            // setEditGcm(response.data.gcm);
        } catch (error) {
            showToast("Failed to fetch GCM details. Please try again.", "error");
        }
    };

    const getEditGCMById = async (gcmId) => {
        try {
            const response = await getRequest(`/gcm/edit-details/${gcmId}`);
            setEditGcm(response.data.gcm);
        } catch (error) {
            showToast("Failed to fetch GCM details. Please try again.", "error");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditGcm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (index, value) => {
        const updatedCategories = [...editGcm.categories];
        updatedCategories[index].name = value;
        setEditGcm((prev) => ({ ...prev, categories: updatedCategories }));
    };

    const handleSubCategoryChange = (catIndex, subIndex, value) => {
        const updatedCategories = [...editGcm.categories];
        updatedCategories[catIndex].subCategories[subIndex].name = value;
        setEditGcm((prev) => ({ ...prev, categories: updatedCategories }));
    };

    const addCategory = () => {
        setEditGcm((prev) => ({
            ...prev,
            categories: [...prev.categories, { name: "", subCategories: [{ name: "" }] }],
        }));
    };

    const removeCategory = (index) => {
        const updatedCategories = [...editGcm.categories];
        updatedCategories.splice(index, 1);
        setEditGcm((prev) => ({ ...prev, categories: updatedCategories }));
    };

    const addSubCategory = (catIndex) => {
        const updatedCategories = [...editGcm.categories];
        updatedCategories[catIndex].subCategories.push({ name: "" });
        setEditGcm((prev) => ({ ...prev, categories: updatedCategories }));
    };

    const removeSubCategory = (catIndex, subIndex) => {
        const updatedCategories = [...editGcm.categories];
        updatedCategories[catIndex].subCategories.splice(subIndex, 1);
        setEditGcm((prev) => ({ ...prev, categories: updatedCategories }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedFile(file);
    };

    const handleEditClick = () => setEditDialogOpen(true);
    const handleDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedFile(null);
    };

    const handleSaveChanges = async () => {
        try {
            const formData = new FormData();
            formData.append("designation", editGcm.designation);
            formData.append("priority", editGcm.priority);
            formData.append("status", editGcm.status);
            formData.append("categories", JSON.stringify(editGcm.categories));

            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            const response = await updateGCMDetails(id, formData);
            if (response.status === 200 && response.data.gcm) {
                getGCMById(id);
                setEditDialogOpen(false);
                showToast("GCM details updated successfully!", "success");
            } else {
                showToast("Failed to update GCM details. Please try again.", "error");
            }
        } catch (error) {
            showToast("Failed to update GCM details. Please try again.", "error");
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                General Committee Member Details
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
                    <Grid item xs={12} md={5}>
                        <img
                            src={`${PUBLIC_API_URI}${gcm?.image}`}
                            alt={gcm.name || "GCM Image"}
                            style={{ width: "100%", height: "300px", objectFit: "cover" }}
                        />
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Typography variant="h5">{gcm.name || "N/A"}</Typography>
                        <Typography variant="body1">
                            <strong>Designation:</strong> {gcm.designation || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Priority:</strong> {gcm.priority || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Contact Number:</strong> {gcm.contactNumber || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Status:</strong> {gcm.status || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            <strong>Categories:</strong>
                        </Typography>
                        {gcm.categories?.map((cat) => (
                            <Box key={cat._id} sx={{ mt: 1, ml: 2 }}>
                                <Typography variant="body2">
                                    <strong>{cat.name}</strong>
                                </Typography>
                                <ul>
                                    {cat.subCategories?.map((subCat) => (
                                        <li key={subCat._id}>{subCat.name}</li>
                                    ))}
                                </ul>
                            </Box>
                        ))}
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleEditClick}
                            sx={{ mt: 2 }}
                        >
                            Edit GCM Details
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Dialog
                open={isEditDialogOpen}
                onClose={handleDialogClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Edit GCM Details</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Designation"
                        fullWidth
                        margin="dense"
                        name="designation"
                        value={editGcm.designation || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Priority"
                        fullWidth
                        margin="dense"
                        name="priority"
                        value={editGcm.priority || ""}
                        onChange={handleInputChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={editGcm.status || ""}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                    {editGcm.categories?.map((cat, catIndex) => (
                        <Box key={catIndex} sx={{ mt: 2, border: '1px solid #ccc', padding: 2, borderRadius: 2 }}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={cat.name || ""}
                                    onChange={(e) => handleCategoryChange(catIndex, e.target.value)}
                                >
                                    {activeDesignation.map((option) => (
                                        <MenuItem key={option._id} value={option._id}>
                                            {option.designationName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {cat.subCategories.map((subCat, subIndex) => (
                                <Box key={subIndex} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <FormControl fullWidth margin="dense">
                                        <InputLabel>Subcategory</InputLabel>
                                        <Select
                                            value={subCat.name || ""}
                                            onChange={(e) => handleSubCategoryChange(catIndex, subIndex, e.target.value)}
                                        >
                                            {activeDepartments.map((option) => (
                                                <MenuItem key={option._id} value={option._id}>
                                                    {option.departmentName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Button
                                        onClick={() => removeSubCategory(catIndex, subIndex)}
                                        color="error"
                                        sx={{ ml: 2 }}
                                    >
                                        Remove Subcategory
                                    </Button>
                                </Box>
                            ))}
                            <Button onClick={() => addSubCategory(catIndex)} sx={{ mt: 1 }}>
                                Add Subcategory
                            </Button>
                            {editGcm.categories.length > 1 && (
                                <Button
                                    onClick={() => removeCategory(catIndex)}
                                    color="error"
                                    sx={{ mt: 1 }}
                                >
                                    Remove Category
                                </Button>
                            )}
                        </Box>
                    ))}
                    <Button onClick={addCategory}>Add Category</Button>
                    {/* <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Upload New Profile Image
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button> */}

                    <Grid item xs={12}>
                        <InputLabel>Profile Image</InputLabel>
                        <UploadBox onClick={() => imageInput.current.click()}>
                            {selectedFile ? (
                                <img
                                    src={URL.createObjectURL(selectedFile)}
                                    alt="Profile"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography variant="body2" color="textSecondary">Click to upload new image</Typography>
                                </Box>
                            )}
                            <input type="file" hidden ref={imageInput} onChange={handleFileChange} />
                        </UploadBox>
                    </Grid>
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

export default SingleGCM;
