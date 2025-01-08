
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
//         const getGCMById = async (gcmId) => {
//             try {
//                 const response = await fetchGCMDetails(gcmId);
//                 setGcm(response.data.gcm);
//                 setEditGcm(response.data.gcm);
//             } catch (error) {
//                 console.error("Failed to fetch GCM details:", error);
//                 showToast("Failed to fetch GCM details. Please try again.", "error");
//             }
//         };

//         getGCMById(id);
//     }, [id]);

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
//             const formData = new FormData();
//             Object.entries(editGcm).forEach(([key, value]) => {
//                 if (key === "categories") {
//                     formData.append(key, JSON.stringify(value));
//                 } else if (value !== null && value !== undefined) {
//                     formData.append(key, value);
//                 }
//             });

//             if (selectedFile) {
//                 formData.append("profileImage", selectedFile);
//             }

//             const response = await updateGCMDetails(id, formData);
//             if (response.status === 200 && response.data.gcm) {
//                 setGcm(response.data.gcm);
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
//                     {/* Profile Image Preview */}
//                     <Grid item xs={12} md={5}>
//                         <img
//                             src={`${PUBLIC_API_URI}${gcm.profileImage}`}
//                             alt={gcm.name || "GCM Image"}
//                             style={{ width: "100%", height: "300px", objectFit: "cover" }}
//                         />
//                     </Grid>

//                     {/* GCM Details */}
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
//                         onChange={handleInputChange}
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
//                         onChange={handleInputChange}
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

//                     {/* Categories & Subcategories */}
//                     {/* {editGcm.categories?.map((cat, catIndex) => (
//                         <Box key={catIndex} sx={{ mt: 2 }}>
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
//                                 <FormControl fullWidth margin="dense" key={subIndex}>
//                                     <InputLabel>Subcategory</InputLabel>
//                                     <Select
//                                         value={subCat.name || ""}
//                                         onChange={(e) =>
//                                             handleSubCategoryChange(catIndex, subIndex, e.target.value)
//                                         }
//                                     >
//                                         {subCategoryOptions.map((option) => (
//                                             <MenuItem key={option} value={option}>
//                                                 {option}
//                                             </MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>
//                             ))}

//                             <Button onClick={() => addSubCategory(catIndex)}>Add Subcategory</Button>
//                         </Box>
//                     ))} */}
//                     {/* Categories & Subcategories */}
//                     {editGcm.categories?.map((cat, catIndex) => (
//                         <Box key={catIndex} sx={{ mt: 2, border: '1px solid #ccc', padding: 2, borderRadius: 2 }}>
//                             {/* Category Selection */}
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

//                             {/* Subcategories */}
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
//                                     {/* Remove Subcategory Button */}
//                                     <Button
//                                         onClick={() => removeSubCategory(catIndex, subIndex)}
//                                         color="error"
//                                         sx={{ ml: 2 }}
//                                     >
//                                         Remove Subcategory
//                                     </Button>
//                                 </Box>
//                             ))}

//                             {/* Add Subcategory Button */}
//                             <Button onClick={() => addSubCategory(catIndex)} sx={{ mt: 1 }}>
//                                 Add Subcategory
//                             </Button>

//                             {/* Remove Category Button */}
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

//                     {/* Profile Image Upload */}
//                     <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
//                         Upload New Profile Image
//                         <input type="file" accept="image/*" hidden onChange={handleFileChange} />
//                     </Button>
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
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGCMDetails, updateGCMDetails } from "../api/gcm";
import { PUBLIC_API_URI } from "../api/config";
import { showToast } from "../api/toast";
import { FiEdit } from "react-icons/fi";
import Breadcrumb from "../components/common/Breadcrumb";

const categoryOptions = ["Chairperson", "Co-Chairperson", "Member"];
const subCategoryOptions = ["Go Green", "Rooms", "Catering", "Sports"];

const SingleGCM = () => {
    const { id } = useParams();
    const [gcm, setGcm] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editGcm, setEditGcm] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);

    // Fetch GCM details by ID
    useEffect(() => {

        getGCMById(id);
    }, [id]);

    const getGCMById = async (gcmId) => {
        try {
            const response = await fetchGCMDetails(gcmId);
            setGcm(response.data.gcm);
            console.log(gcm,"gb")
            setEditGcm(response.data.gcm);
        } catch (error) {
            console.error("Failed to fetch GCM details:", error);
            showToast("Failed to fetch GCM details. Please try again.", "error");
        }
    };


    // console.log(gcm, "gcm")

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditGcm((prev) => ({ ...prev, [name]: value }));
    };

    // Handle category and subcategory changes
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

    // Add and remove categories and subcategories
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

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    // Handle dialog open/close
    const handleEditClick = () => setEditDialogOpen(true);
    const handleDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedFile(null);
    };

    // Save changes to the GCM
    const handleSaveChanges = async () => {
        try {
            // const formData = new FormData();
            // Object.entries(editGcm).forEach(([key, value]) => {
            //     if (key === "categories") {
            //         formData.append(key, JSON.stringify(value));
            //     } else if (value !== null && value !== undefined) {
            //         formData.append(key, value);
            //     }
            // });

            // if (selectedFile) {
            //     formData.append("profileImage", selectedFile);
            // }

            const requestBody = {
                // name: editGcm.name,
                designation: editGcm.designation,
                // contactNumber: editGcm.contactNumber,
                status: editGcm.status,
                categories: editGcm.categories,
            };

            const response = await updateGCMDetails(id, requestBody);
            if (response.status === 200 && response.data.gcm) {
                // setGcm(response.data.gcm);
                getGCMById(id);
                setEditGcm(response.data.gcm);
                setEditDialogOpen(false);
                showToast("GCM details updated successfully!", "success");
            } else {
                showToast("Failed to update GCM details. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to update GCM details:", error);
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
                                    {cat.name === "Invalid Category" && <span style={{ color: "red" }}> (Invalid)</span>}
                                </Typography>
                                <Typography variant="body2">
                                    ___
                                </Typography>
                                <ul>
                                    {cat.subCategories?.map((subCat) => (
                                        <li key={subCat._id}>
                                            {subCat.name}
                                            {subCat.name === "Invalid Subcategory" && (
                                                <span style={{ color: "red" }}> (Invalid)</span>
                                            )}
                                        </li>
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

            {/* Edit Dialog */}
            <Dialog
                open={isEditDialogOpen}
                onClose={handleDialogClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Edit GCM Details</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="dense"
                        name="name"
                        value={editGcm.name || ""}
                    // onChange={handleInputChange}
                    />
                    <TextField
                        label="Designation"
                        fullWidth
                        margin="dense"
                        name="designation"
                        value={editGcm.designation || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Contact Number"
                        fullWidth
                        margin="dense"
                        name="contactNumber"
                        value={editGcm.contactNumber || ""}
                    // onChange={handleInputChange}
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
                                    {categoryOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
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
                                            onChange={(e) =>
                                                handleSubCategoryChange(catIndex, subIndex, e.target.value)
                                            }
                                        >
                                            {subCategoryOptions.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
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
                    {/* <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
                        Upload New Profile Image
                        <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                    </Button> */}
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
