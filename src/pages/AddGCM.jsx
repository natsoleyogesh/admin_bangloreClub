// import React, { useEffect, useRef, useState } from "react";
// import {
//     Box,
//     Button,
//     CircularProgress,
//     FormControl,
//     InputAdornment,
//     InputLabel,
//     MenuItem,
//     Paper,
//     Select,
//     TextField,
//     Typography,
//     Grid,
//     IconButton,
// } from "@mui/material";
// import { Add, Delete, Person, Title, Work, Phone, UploadFile } from "@mui/icons-material";
// import { showToast } from "../api/toast";
// import { useNavigate } from "react-router-dom";
// import { addGCM } from "../api/gcm";
// import { fetchAllActiveMembers } from "../api/member";
// import { PUBLIC_API_URI } from "../api/config";
// import Breadcrumb from "../components/common/Breadcrumb";
// import { BiImageAdd } from "react-icons/bi";
// import styled from "@emotion/styled";

// const statusOptions = ["Active", "Inactive"];
// const categoryOptions = ["Chairperson", "Co-Chairperson", "Member"]; // Sample category options
// const subCategoryOptions = ["Go Green", "Rooms", "Catering", "Sports"]; // Sample subcategory options

// const UploadBox = styled(Box)(({ theme }) => ({
//     marginTop: 20,
//     height: 180,
//     borderRadius: "12px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "column",
//     border: `2px dashed ${theme.palette.divider}`,
//     cursor: "pointer",
//     backgroundColor: theme.palette.background.paper,
//     transition: "0.3s",
//     "&:hover": {
//         backgroundColor: theme.palette.action.hover,
//     },
// }));

// const AddGCM = () => {
//     const [gcmData, setGcmData] = useState({
//         designation: "",
//         userId: '',
//         status: "Active",
//     });
//     const [categories, setCategories] = useState([{ name: "", subCategories: [{ name: "" }] }]);
//     const [profileImage, setProfileImage] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const navigate = useNavigate();
//     const [image, setImage] = useState(null);
//     const imageInput = useRef(null);

//     // active member lists
//     const [activeMembers, setActiveMembers] = useState([]);
//     const [selectedMember, setSelectedMember] = useState({});

//     useEffect(() => {
//         getActiveMembers()
//     }, []);

//     const getActiveMembers = async () => {
//         try {
//             const response = await fetchAllActiveMembers();
//             setActiveMembers(response.data.users);
//             // setEditGcm(response.data.gcm);
//         } catch (error) {
//             console.error("Failed to fetch members :", error);
//             showToast("Failed to fetch Members. Please try again.", "error");
//         }
//     };


//     // Handle input changes
//     const handleInputChange = (e) => {
//         console.log(e.target.value, "hdffh")
//         const { name, value } = e.target;
//         setGcmData((prev) => ({ ...prev, [name]: value }));
//         // validateField(name, value);
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) setImage(file);
//     };

//     // Validation logic
//     const validateField = (name, value) => {
//         const newErrors = { ...errors };

//         // Name validation
//         if (name === "name" && !value.trim()) {
//             newErrors.name = "Name is required.";
//         } else {
//             delete newErrors.name;
//         }

//         // Member ID validation
//         if (name === "memberId" && !value.trim()) {
//             newErrors.memberId = "Member ID is required.";
//         } else {
//             delete newErrors.memberId;
//         }

//         // Contact number validation
//         if (name === "contactNumber" && (!/^\d{10}$/.test(value) || value.trim().length !== 10)) {
//             newErrors.contactNumber = "Contact number must be a valid 10-digit number.";
//         } else {
//             delete newErrors.contactNumber;
//         }

//         setErrors(newErrors);
//     };

//     // Handle category and subcategory changes
//     const handleCategoryChange = (index, value) => {
//         const updatedCategories = [...categories];
//         updatedCategories[index].name = value;
//         setCategories(updatedCategories);
//     };

//     const handleSubCategoryChange = (catIndex, subIndex, value) => {
//         const updatedCategories = [...categories];
//         updatedCategories[catIndex].subCategories[subIndex].name = value;
//         setCategories(updatedCategories);
//     };

//     // Add and remove category
//     const addCategory = () => {
//         setCategories((prev) => [...prev, { name: "", subCategories: [{ name: "" }] }]);
//     };

//     const removeCategory = (index) => {
//         const updatedCategories = [...categories];
//         updatedCategories.splice(index, 1);
//         setCategories(updatedCategories);
//     };

//     // Add and remove subcategory
//     const addSubCategory = (catIndex) => {
//         const updatedCategories = [...categories];
//         updatedCategories[catIndex].subCategories.push({ name: "" });
//         setCategories(updatedCategories);
//     };

//     const removeSubCategory = (catIndex, subIndex) => {
//         const updatedCategories = [...categories];
//         updatedCategories[catIndex].subCategories.splice(subIndex, 1);
//         setCategories(updatedCategories);
//     };

//     // Form submission handler
//     const handleSubmit = async () => {
//         for (const category of categories) {
//             if (!category.name) {
//                 showToast("Each category must have a name.", "error");
//                 return;
//             }
//             for (const subCategory of category.subCategories) {
//                 if (!subCategory.name) {
//                     showToast(`Each subcategory in "${category.name}" must have a name.`, "error");
//                     return;
//                 }
//             }
//         }

//         setLoading(true);

//         const payload = {
//             userId: gcmData.userId,
//             designation: gcmData.designation,
//             status: gcmData.status,
//             categories: categories.map((category) => ({
//                 name: category.name,
//                 subCategories: category.subCategories.map((subCategory) => ({
//                     name: subCategory.name,
//                 })),
//             })),
//         };
//         const formData = new FormData();
//         if (image) formData.append("image", image);

//         formData.append("categories", JSON.stringify(categories));

//         try {
//             const response = await addGCM(payload);
//             if (response.status === 201) {
//                 showToast("General Committee Member added successfully!", "success");
//                 navigate("/gcms");
//             } else {
//                 showToast(response.message || "Failed to add General Committee Member.", "error");
//             }
//         } catch (error) {
//             showToast(error.response?.data?.message || "An error occurred. Please try again.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleMemberSelect = (e) => {
//         console.log("cLL ", e.target.value)
//         const selected = activeMembers.find((member) => member._id === e.target.value);
//         setSelectedMember(selected);
//         setGcmData({
//             ...gcmData,
//             userId: selected._id,
//             // designation: selected.designation || "",
//             // status: selected.status || "Active",
//         });
//     };

//     return (
//         <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
//             <Breadcrumb />
//             <Typography variant="h5" sx={{ mb: "20px", textAlign: "center", fontWeight: 600 }}>
//                 Add General Committee Member
//             </Typography>
//             <Paper elevation={3} sx={{ p: 4, borderRadius: "10px", maxWidth: "800px", margin: "0 auto" }}>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12} md={6}>
//                         <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Select Member</InputLabel>
//                         <Select
//                             name="memberId"
//                             value={gcmData.userId}
//                             onChange={handleMemberSelect}
//                             fullWidth
//                             size="small"
//                         >
//                             <MenuItem value="" disabled>
//                                 Select Member
//                             </MenuItem>
//                             {activeMembers.map((member) => (
//                                 <MenuItem key={member._id} value={member._id}>
//                                     {member.name} (ID: {member.memberId})
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </Grid>

//                     {/* Name */}
//                     <Grid item xs={12} md={6}>
//                         <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Name</InputLabel>
//                         <TextField
//                             fullWidth
//                             name="name"
//                             value={selectedMember.name}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <Person />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                             disabled
//                         />
//                     </Grid>

//                     {/* Member ID */}
//                     <Grid item xs={12} md={6}>
//                         <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Member ID</InputLabel>
//                         <TextField
//                             fullWidth
//                             name="memberId"
//                             value={selectedMember.memberId}
//                             // onChange={handleInputChange}
//                             // error={!!errors.memberId}
//                             // helperText={errors.memberId}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <Title />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                             disabled
//                         />
//                     </Grid>



//                     {/* Contact Number */}
//                     <Grid item xs={12} md={6}>
//                         <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Contact Number</InputLabel>
//                         <TextField
//                             fullWidth
//                             name="contactNumber"
//                             value={selectedMember.mobileNumber}
//                             // onChange={handleInputChange}
//                             // error={!!errors.contactNumber}
//                             // helperText={errors.contactNumber}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <Phone />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                             disabled
//                         />
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                         <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Designation</InputLabel>
//                         <TextField
//                             fullWidth
//                             name="designation"
//                             value={gcmData.designation}
//                             onChange={handleInputChange}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <Work />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                         />
//                     </Grid>
//                     {/* Status */}
//                     <Grid item xs={12} md={6}>
//                         <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Status</InputLabel>
//                         <FormControl fullWidth>
//                             <Select
//                                 name="status"
//                                 value={gcmData.status}
//                                 onChange={handleInputChange}
//                                 displayEmpty
//                             >
//                                 {statusOptions.map((option) => (
//                                     <MenuItem key={option} value={option}>
//                                         {option}
//                                     </MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                     </Grid>

//                     {/* Categories */}
//                     <Grid item xs={12}>
//                         <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
//                             Categories & Subcategories
//                         </Typography>
//                         {categories.map((cat, catIndex) => (
//                             <Box key={catIndex} sx={{ mb: 2 }}>
//                                 <Grid container spacing={2}>
//                                     {/* Category Dropdown */}
//                                     <Grid item xs={12} md={5}>
//                                         <FormControl fullWidth>
//                                             <Select
//                                                 value={cat.name}
//                                                 onChange={(e) => handleCategoryChange(catIndex, e.target.value)}
//                                                 displayEmpty
//                                             >
//                                                 <MenuItem value="" disabled>
//                                                     Please select category
//                                                 </MenuItem>
//                                                 {categoryOptions.map((option) => (
//                                                     <MenuItem key={option} value={option}>
//                                                         {option}
//                                                     </MenuItem>
//                                                 ))}
//                                             </Select>
//                                         </FormControl>
//                                     </Grid>

//                                     {/* Add/Remove Category */}
//                                     <Grid item xs={12} md={2}>
//                                         <IconButton onClick={addCategory}>
//                                             <Add />
//                                         </IconButton>
//                                         {categories.length > 1 && (
//                                             <IconButton color="error" onClick={() => removeCategory(catIndex)}>
//                                                 <Delete />
//                                             </IconButton>
//                                         )}
//                                     </Grid>

//                                     {/* Subcategories Dropdown */}
//                                     <Grid item xs={12} md={5}>
//                                         {cat.subCategories.map((subCat, subIndex) => (
//                                             <Box key={subIndex} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                                                 <FormControl fullWidth>
//                                                     {/* <InputLabel>Subcategory</InputLabel> */}
//                                                     <Select
//                                                         value={subCat.name}
//                                                         onChange={(e) =>
//                                                             handleSubCategoryChange(catIndex, subIndex, e.target.value)
//                                                         }
//                                                         displayEmpty
//                                                     >
//                                                         <MenuItem value="" disabled>
//                                                             Please select sub category
//                                                         </MenuItem>
//                                                         {subCategoryOptions.map((option) => (
//                                                             <MenuItem key={option} value={option}>
//                                                                 {option}
//                                                             </MenuItem>
//                                                         ))}
//                                                     </Select>
//                                                 </FormControl>
//                                                 <IconButton onClick={() => addSubCategory(catIndex)}>
//                                                     <Add />
//                                                 </IconButton>
//                                                 {cat.subCategories.length > 1 && (
//                                                     <IconButton
//                                                         color="error"
//                                                         onClick={() => removeSubCategory(catIndex, subIndex)}
//                                                     >
//                                                         <Delete />
//                                                     </IconButton>
//                                                 )}
//                                             </Box>
//                                         ))}
//                                     </Grid>
//                                 </Grid>
//                             </Box>
//                         ))}
//                     </Grid>

//                     {/* Image Upload */}
//                     <Grid item xs={12}>
//                         <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Profile Image</InputLabel>
//                         <UploadBox onClick={() => imageInput.current.click()}>
//                             {image ? (
//                                 <img
//                                     src={URL.createObjectURL(image)}
//                                     alt="Profile"
//                                     style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                                 />
//                             ) : (
//                                 <Box sx={{ textAlign: "center" }}>
//                                     <BiImageAdd style={{ fontSize: "40px", color: "#027edd" }} />
//                                     <Typography variant="body2" color="textSecondary">
//                                         Click to upload image
//                                     </Typography>
//                                 </Box>
//                             )}
//                             <input type="file" hidden ref={imageInput} onChange={handleImageChange} />
//                         </UploadBox>
//                     </Grid>

//                 </Grid>

//                 {/* Submit Button */}
//                 <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
//                     <Button
//                         type="submit"
//                         variant="contained"
//                         color="primary"
//                         onClick={handleSubmit}
//                         disabled={loading}
//                     >
//                         {loading ? <CircularProgress size={20} /> : "Add General Committee Member"}
//                     </Button>
//                 </Box>
//             </Paper>
//         </Box>
//     );
// };

// export default AddGCM;
import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    Grid,
    IconButton,
} from "@mui/material";
import {
    Add,
    Delete,
    Person,
    Title,
    Work,
    Phone,
} from "@mui/icons-material";
import { BiImageAdd } from "react-icons/bi";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { showToast } from "../api/toast";
import { addGCM } from "../api/gcm";
import { fetchAllActiveMembers } from "../api/member";
import Breadcrumb from "../components/common/Breadcrumb";
import { fetchAllActiveDepartments } from "../api/masterData/department";
import { getRequest } from "../api/commonAPI";

const statusOptions = ["Active", "Inactive"];
// const categoryOptions = ["Chairperson", "Co-Chairperson", "Member"];
// const subCategoryOptions = ["Go Green", "Rooms", "Catering", "Sports"];

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

const AddGCM = () => {
    const [gcmData, setGcmData] = useState({
        designation: "",
        userId: "",
        status: "Active",
        priority: 1,
    });
    const [categories, setCategories] = useState([{ name: "", subCategories: [{ name: "" }] }]);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    // const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const imageInput = useRef(null);
    const [activeMembers, setActiveMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState({});

    const [activeDepartments, setActiveDepartments] = useState([]);
    const [activeDesignation, setActiveDesignation] = useState([]);
    useEffect(() => {
        getActiveDepartments()
        getActiveDesignations()
    }, [])

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
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await fetchAllActiveMembers();
            setActiveMembers(response.data.users);
        } catch (error) {
            showToast("Failed to fetch Members. Please try again.", "error");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGcmData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setImage(file);
    };

    const validateForm = () => {
        for (const category of categories) {
            if (!category.name) {
                showToast("Each category must have a name.", "error");
                return false;
            }
            for (const subCategory of category.subCategories) {
                if (!subCategory.name) {
                    showToast(`Each subcategory in "${category.name}" must have a name.`, "error");
                    return false;
                }
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        const formData = new FormData();

        formData.append("userId", gcmData.userId);
        formData.append("designation", gcmData.designation);
        formData.append("priority", gcmData.priority);
        formData.append("status", gcmData.status);
        formData.append("categories", JSON.stringify(categories.map((cat) => ({
            name: cat.name,
            subCategories: cat.subCategories.map((sub) => ({ name: sub.name })),
        }))));

        if (image) formData.append("image", image);

        try {
            const response = await addGCM(formData);
            if (response.status === 201) {
                showToast("General Committee Member added successfully!", "success");
                navigate("/gcms");
            } else {
                showToast(response.message || "Failed to add General Committee Member.", "error");
            }
        } catch (error) {
            showToast("An error occurred. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleMemberSelect = (e) => {
        const selected = activeMembers.find((member) => member._id === e.target.value);
        setSelectedMember(selected);
        setGcmData({ ...gcmData, userId: selected?._id });
    };

    const handleCategoryChange = (index, value) => {
        const updated = [...categories];
        updated[index].name = value;
        setCategories(updated);
    };

    const handleSubCategoryChange = (catIndex, subIndex, value) => {
        const updated = [...categories];
        updated[catIndex].subCategories[subIndex].name = value;
        setCategories(updated);
    };

    const addCategory = () => {
        setCategories((prev) => [...prev, { name: "", subCategories: [{ name: "" }] }]);
    };

    const removeCategory = (index) => {
        const updated = [...categories];
        updated.splice(index, 1);
        setCategories(updated);
    };

    const addSubCategory = (catIndex) => {
        const updated = [...categories];
        updated[catIndex].subCategories.push({ name: "" });
        setCategories(updated);
    };

    const removeSubCategory = (catIndex, subIndex) => {
        const updated = [...categories];
        updated[catIndex].subCategories.splice(subIndex, 1);
        setCategories(updated);
    };

    return (
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Breadcrumb />
            <Typography variant="h5" sx={{ mb: 4, textAlign: "center", fontWeight: 600 }}>
                Add General Committee Member
            </Typography>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 800, mx: "auto" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <InputLabel>Select Member</InputLabel>
                        <Select
                            name="memberId"
                            value={gcmData.userId}
                            onChange={handleMemberSelect}
                            fullWidth
                            size="small"
                        >
                            <MenuItem value="" disabled>Select Member</MenuItem>
                            {activeMembers.map((member) => (
                                <MenuItem key={member._id} value={member._id}>
                                    {member.name} (ID: {member.memberId})
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputLabel>Name</InputLabel>
                        <TextField
                            fullWidth
                            value={selectedMember.name || ""}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person />
                                    </InputAdornment>
                                ),
                            }}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputLabel>Member ID</InputLabel>
                        <TextField
                            fullWidth
                            value={selectedMember.memberId || ""}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Title />
                                    </InputAdornment>
                                ),
                            }}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputLabel>Contact Number</InputLabel>
                        <TextField
                            fullWidth
                            value={selectedMember.mobileNumber || ""}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone />
                                    </InputAdornment>
                                ),
                            }}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputLabel>Designation</InputLabel>
                        <TextField
                            fullWidth
                            name="designation"
                            value={gcmData.designation}
                            onChange={handleInputChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Work />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputLabel>Priority</InputLabel>
                        <TextField
                            fullWidth
                            name="priority"
                            value={gcmData.priority}
                            onChange={handleInputChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Work />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={gcmData.status}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                        >
                            {statusOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mt: 2 }}>Categories & Subcategories</Typography>
                        {categories.map((cat, catIndex) => (
                            <Box key={catIndex} sx={{ mb: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={5}>
                                        {/* <Select
                                            value={cat.name}
                                            onChange={(e) => handleCategoryChange(catIndex, e.target.value)}
                                            fullWidth
                                            displayEmpty
                                        > */}
                                        <Select
                                            // name="department"
                                            value={cat.name}
                                            onChange={(e) => handleCategoryChange(catIndex, e.target.value)}
                                            displayEmpty
                                        >
                                            <MenuItem value="" disabled>Please select category</MenuItem>
                                            {activeDesignation.map((option) => (
                                                <MenuItem key={option._id} value={option._id}>
                                                    {option.designationName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <IconButton onClick={addCategory}><Add /></IconButton>
                                        {categories.length > 1 && (
                                            <IconButton color="error" onClick={() => removeCategory(catIndex)}>
                                                <Delete />
                                            </IconButton>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                        {cat.subCategories.map((subCat, subIndex) => (
                                            <Box key={subIndex} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                {/* <Select
                                                    value={subCat.name}
                                                    onChange={(e) => handleSubCategoryChange(catIndex, subIndex, e.target.value)}
                                                    fullWidth
                                                    displayEmpty
                                                > */}
                                                <Select
                                                    // name="department"
                                                    value={subCat.name}
                                                    onChange={(e) => handleSubCategoryChange(catIndex, subIndex, e.target.value)}
                                                    displayEmpty
                                                >
                                                    <MenuItem value="" disabled>Please select subcategory</MenuItem>
                                                    {activeDepartments.map((option) => (
                                                        <MenuItem key={option._id} value={option._id}>
                                                            {option.departmentName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <IconButton onClick={() => addSubCategory(catIndex)}><Add /></IconButton>
                                                {
                                                    cat.subCategories.length > 1 && (
                                                        <IconButton color="error" onClick={() => removeSubCategory(catIndex, subIndex)}>
                                                            <Delete />
                                                        </IconButton>
                                                    )
                                                }
                                            </Box>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel>Profile Image</InputLabel>
                        <UploadBox onClick={() => imageInput.current.click()}>
                            {image ? (
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Profile"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <Box sx={{ textAlign: "center" }}>
                                    <BiImageAdd style={{ fontSize: "40px", color: "#027edd" }} />
                                    <Typography variant="body2" color="textSecondary">Click to upload image</Typography>
                                </Box>
                            )}
                            <input type="file" hidden ref={imageInput} onChange={handleImageChange} />
                        </UploadBox>
                    </Grid>
                </Grid>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} /> : "Add General Committee Member"}
                    </Button>
                </Box>
            </Paper>
        </Box >
    );
};

export default AddGCM;
