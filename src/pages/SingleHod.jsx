import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchHodDetails, updateHodDetails } from "../api/clubhods";
import { PUBLIC_API_URI } from "../api/config";
import { showToast } from "../api/toast";
import { FiEdit } from "react-icons/fi";
import { fetchAllActiveDepartments } from "../api/member";
import Breadcrumb from "../components/common/Breadcrumb";

const SingleHod = () => {
    const { id } = useParams();
    const [hod, setHod] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editHod, setEditHod] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeDepartments, setActiveDepartments] = useState([]);

    useEffect(() => {
        const fetchHodData = async () => {
            try {
                const response = await fetchHodDetails(id);
                setHod(response.data.hod);
                setEditHod(response.data.hod);
            } catch (error) {
                console.error("Failed to fetch HOD details:", error);
                showToast("Failed to fetch HOD details. Please try again.", "error");
            }
        };

        fetchHodData();
        fetchDepartments();
    }, [id]);

    const fetchDepartments = async () => {
        try {
            const response = await fetchAllActiveDepartments();
            setActiveDepartments(response.data.activeDepartments);
        } catch (error) {
            console.error("Failed to fetch departments:", error);
            showToast("Failed to fetch departments. Please try again.", "error");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "contactNumber" && !/^\d{0,10}$/.test(value)) {
            showToast("Contact number must be up to 10 digits.", "error");
            return;
        }

        setEditHod((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleDialogOpen = () => setEditDialogOpen(true);
    const handleDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedImage(null);
    };

    const handleSaveChanges = async () => {
        try {
            const formData = new FormData();
            Object.entries(editHod).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            if (selectedImage) {
                formData.append("image", selectedImage);
            }

            const response = await updateHodDetails(id, formData);

            if (response.status === 200) {
                setHod(response.data.hod);
                setEditHod(response.data.hod);
                setEditDialogOpen(false);
                showToast("HOD details updated successfully!", "success");
            } else {
                showToast("Failed to update HOD details. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to update HOD details:", error);
            showToast("Failed to update HOD details. Please try again.", "error");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return "primary";
            case "Inactive":
                return "error";
            default:
                return "default";
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                HOD Details
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
                        <Avatar
                            src={
                                selectedImage
                                    ? URL.createObjectURL(selectedImage)
                                    : hod.image
                                        ? `${PUBLIC_API_URI}${hod.image}`
                                        : ""
                            }
                            alt={hod.name || "HOD Image"}
                            variant="rounded"
                            sx={{ width: "100%", height: "300px", objectFit: "cover" }}
                        />
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Typography variant="h5">{hod.name || "N/A"}</Typography>
                        <Typography variant="body1">
                            <strong>Email:</strong> {hod.email || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Designation:</strong> {hod.designation || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Department:</strong> {hod.department || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Contact Number:</strong> {hod.contactNumber || "N/A"}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ color: getStatusColor(hod.status) }}
                        >
                            <strong>Status:</strong> {hod.status || "N/A"}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleDialogOpen}
                            sx={{ mt: 2 }}
                        >
                            Edit HOD Details
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
                <DialogTitle>Edit HOD Details</DialogTitle>
                <DialogContent>
                    {[
                        { label: "Name", name: "name", value: editHod.name || "" },
                        { label: "Email", name: "email", value: editHod.email || "" },
                        { label: "Contact Number", name: "contactNumber", value: editHod.contactNumber || "" },
                        { label: "Designation", name: "designation", value: editHod.designation || "" },
                    ].map(({ label, name, value }) => (
                        <TextField
                            key={name}
                            label={label}
                            fullWidth
                            margin="dense"
                            name={name}
                            value={value}
                            onChange={handleInputChange}
                        />
                    ))}

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <Select
                            name="departmentId"
                            value={editHod.departmentId || ""}
                            onChange={handleInputChange}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Select department
                            </MenuItem>
                            {activeDepartments.map((dept) => (
                                <MenuItem key={dept._id} value={dept._id}>
                                    {dept.departmentName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Status"
                        select
                        fullWidth
                        margin="dense"
                        name="status"
                        value={editHod.status || ""}
                        onChange={handleInputChange}
                    >
                        {[
                            { label: "Active", value: "Active" },
                            { label: "Inactive", value: "Inactive" },
                        ].map(({ label, value }) => (
                            <MenuItem key={value} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Avatar
                        src={
                            selectedImage
                                ? URL.createObjectURL(selectedImage)
                                : hod.image
                                    ? `${PUBLIC_API_URI}${hod.image}`
                                    : ""
                        }
                        alt={hod.name || "HOD Image"}
                        variant="rounded"
                        sx={{ width: "100%", height: "300px", objectFit: "cover" }}
                    />
                    <Button
                        variant="contained"
                        component="label"
                        sx={{ mt: 2 }}
                    >
                        Upload New Image
                        <input type="file" hidden onChange={handleImageChange} />
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

export default SingleHod;



// import {
//     Avatar,
//     Box,
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     FormControl,
//     Grid,
//     MenuItem,
//     Paper,
//     Select,
//     TextField,
//     Typography,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { fetchHodDetails, updateHodDetails } from "../api/clubhods";
// import { PUBLIC_API_URI } from "../api/config";
// import { showToast } from "../api/toast";
// import { FiEdit } from "react-icons/fi";
// import { fetchAllActiveDepartments } from "../api/member";
// import Breadcrumb from "../components/common/Breadcrumb";

// const SingleHod = () => {
//     const { id } = useParams();
//     const [hod, setHod] = useState({});
//     const [isEditDialogOpen, setEditDialogOpen] = useState(false);
//     const [editHod, setEditHod] = useState({});
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [activeDepartments, setActiveDepartments] = useState([]);


//     // Fetch HOD details by ID
//     useEffect(() => {
//         const getHodById = async (hodId) => {
//             try {
//                 const response = await fetchHodDetails(hodId);
//                 setHod(response.data.hod);
//                 setEditHod(response.data.hod);
//             } catch (error) {
//                 console.error("Failed to fetch HOD details:", error);
//                 showToast("Failed to fetch HOD details. Please try again.", "error");
//             }
//         };

//         getHodById(id);
//     }, [id]);

//     useEffect(() => {
//         getActiveDepartments()
//     }, [id])

//     const getActiveDepartments = async () => {
//         try {
//             const department = await fetchAllActiveDepartments();
//             console.log(department, "hh")
//             setActiveDepartments(department.data.activeDepartments);

//         } catch (error) {
//             console.error("Failed to fetch members :", error);
//             showToast("Failed to fetch Members. Please try again.", "error");
//         }
//     };




//     // Handle input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;

//         // Validate contact number for 10 digits
//         if (name === "contactNumber" && !/^\d{0,10}$/.test(value)) {
//             showToast("Contact number must be up to 10 digits.", "error");
//             return;
//         }

//         setEditHod((prev) => ({ ...prev, [name]: value }));
//     };

//     // Handle image selection
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setSelectedImage(file);
//         }
//     };

//     // Handle dialog open/close
//     const handleEditClick = () => setEditDialogOpen(true);
//     const handleDialogClose = () => {
//         setEditDialogOpen(false);
//         setSelectedImage(null);
//     };

//     // Save changes to the HOD
//     const handleSaveChanges = async () => {
//         try {
//             const formData = new FormData();
//             Object.entries(editHod).forEach(([key, value]) => {
//                 if (value !== null && value !== undefined) {
//                     formData.append(key, value);
//                 }
//             });

//             if (selectedImage) {
//                 formData.append("image", selectedImage);
//             }

//             const response = await updateHodDetails(id, formData);
//             if (response.status === 200 && response.data.hod) {
//                 setHod(response.data.hod);
//                 setEditHod(response.data.hod);
//                 setEditDialogOpen(false);
//                 showToast("HOD details updated successfully!", "success");
//             } else {
//                 showToast("Failed to update HOD details. Please try again.", "error");
//             }
//         } catch (error) {
//             console.error("Failed to update HOD details:", error);
//             showToast("Failed to update HOD details. Please try again.", "error");
//         }
//     };

//     // Get color for status
//     const getStatusColor = (status) => {
//         switch (status) {
//             case "Active":
//                 return "primary";
//             case "Inactive":
//                 return "error";
//             default:
//                 return "default";
//         }
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Breadcrumb />
//             <Typography variant="h4" sx={{ mb: 2 }}>
//                 HOD Details
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
//                     {/* HOD Image */}
//                     <Grid item xs={12} md={5}>
//                         <Avatar
//                             src={
//                                 hod.image
//                                     ? `${PUBLIC_API_URI}${hod.image}`
//                                     : ""
//                             }
//                             alt={hod.name || "HOD Image"}
//                             variant="rounded"
//                             sx={{ width: "100%", height: "300px", objectFit: "cover" }}
//                         />
//                     </Grid>

//                     {/* HOD Details */}
//                     <Grid item xs={12} md={7}>
//                         <Typography variant="h5">{hod.name || "N/A"}</Typography>
//                         <Typography variant="body1">
//                             <strong>Designation:</strong> {hod.designation || "N/A"}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Department:</strong> {hod.department || "N/A"}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Contact Number:</strong>{" "}
//                             {hod.contactNumber || "N/A"}
//                         </Typography>
//                         <Typography variant="body1" sx={{ color: getStatusColor(hod.status) }}>
//                             <strong>Status:</strong> {hod.status || "N/A"}
//                         </Typography>
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             startIcon={<FiEdit />}
//                             onClick={handleEditClick}
//                             sx={{ mt: 2 }}
//                         >
//                             Edit HOD Details
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
//                 <DialogTitle>Edit HOD Details</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         label="Name"
//                         fullWidth
//                         margin="dense"
//                         name="name"
//                         value={editHod.name || ""}
//                     // onChange={handleInputChange}
//                     />
//                     <TextField
//                         label="Contact Number"
//                         fullWidth
//                         margin="dense"
//                         name="contactNumber"
//                         value={editHod.contactNumber || ""}
//                     // onChange={handleInputChange}
//                     />
//                     <TextField
//                         label="Designation"
//                         fullWidth
//                         margin="dense"
//                         name="designation"
//                         value={editHod.designation || ""}
//                         onChange={handleInputChange}
//                     />
//                     {/* <TextField
//                         label="Department"
//                         fullWidth
//                         margin="dense"
//                         name="department"
//                         value={editHod.department || ""}
//                         onChange={handleInputChange}
//                     /> */}

//                     <FormControl fullWidth >
//                         <Select
//                             name="departmentId"
//                             value={editHod.departmentId}
//                             onChange={handleInputChange}
//                             displayEmpty
//                         >
//                             <MenuItem value="" disabled>
//                                 Select department
//                             </MenuItem>
//                             {activeDepartments.map((option) => (
//                                 <MenuItem key={option._id} value={option._id}>
//                                     {option.departmentName}
//                                 </MenuItem>
//                             ))}
//                         </Select>

//                     </FormControl>
//                     <TextField
//                         label="Status"
//                         select
//                         fullWidth
//                         margin="dense"
//                         name="status"
//                         value={editHod.status || ""}
//                         onChange={handleInputChange}
//                     >
//                         <MenuItem value="Active">Active</MenuItem>
//                         <MenuItem value="Inactive">Inactive</MenuItem>
//                     </TextField>

//                     {/* <Avatar
//                         src={
//                             selectedImage
//                                 ? URL.createObjectURL(selectedImage)
//                                 : `${PUBLIC_API_URI}${editHod.image}`
//                         }
//                         alt="HOD Image"
//                         variant="rounded"
//                         sx={{
//                             width: "100%",
//                             height: "200px",
//                             objectFit: "cover",
//                             mb: 2,
//                         }}
//                     />
//                     <Button variant="contained" component="label" fullWidth>
//                         Upload New Image
//                         <input type="file" hidden onChange={handleImageChange} />
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

// export default SingleHod;
