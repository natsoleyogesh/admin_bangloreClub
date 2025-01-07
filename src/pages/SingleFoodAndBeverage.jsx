// // import React, { useEffect, useState } from "react";
// // import {
// //     Box,
// //     Button,
// //     Card,
// //     CardContent,
// //     CardMedia,
// //     Dialog,
// //     DialogActions,
// //     DialogContent,
// //     DialogTitle,
// //     Divider,
// //     FormControl,
// //     Grid,
// //     IconButton,
// //     InputLabel,
// //     MenuItem,
// //     Paper,
// //     Select,
// //     TextField,
// //     Typography,
// // } from "@mui/material";
// // import TimePicker from "react-time-picker";
// // import "react-time-picker/dist/TimePicker.css";
// // import "react-clock/dist/Clock.css";
// // import { useParams } from "react-router-dom";
// // import { fetchFoodAndBeverageDetails, updateFoodAndBeverageDetails } from "../api/foodAndBeverage";
// // import { PUBLIC_API_URI } from "../api/config";
// // import { showToast } from "../api/toast";
// // import { FiEdit } from "react-icons/fi";
// // import { Add, Delete, Save } from "@mui/icons-material";
// // import Breadcrumb from "../components/common/Breadcrumb";

// // const formatTo12Hour = (time) => {
// //     if (!time) return ""; // Return empty if no time is selected
// //     const [hours, minutes] = time.split(":").map(Number);
// //     const period = hours >= 12 ? "PM" : "AM";
// //     const formattedHours = hours % 12 || 12; // Convert to 12-hour format
// //     console.log(`${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`, "dhdh")
// //     return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
// // };


// // const SingleFoodAndBeverage = () => {
// //     const { id } = useParams();
// //     const [foodAndBeverage, setFoodAndBeverage] = useState({});
// //     const [isEditDialogOpen, setEditDialogOpen] = useState(false);
// //     const [editData, setEditData] = useState({});
// //     const [selectedBanner, setSelectedBanner] = useState(null);
// //     const [subCategoryFiles, setSubCategoryFiles] = useState({});
// //     const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// //     // Fetch Food & Beverage Details
// //     useEffect(() => {
// //         const getFoodAndBeverageById = async (categoryId) => {
// //             try {
// //                 const response = await fetchFoodAndBeverageDetails(categoryId);
// //                 console.log(response.data.foodAndBeverage.timings, response.data.foodAndBeverage.timings.length, "yttidfiudjkfh")
// //                 setFoodAndBeverage(response.data.foodAndBeverage);
// //                 setEditData(response.data.foodAndBeverage);
// //             } catch (error) {
// //                 console.error("Failed to fetch food and beverage details:", error);
// //                 showToast("Failed to fetch food and beverage details. Please try again.", "error");
// //             }
// //         };

// //         getFoodAndBeverageById(id);
// //     }, []);

// //     // Handle Input Changes
// //     const handleInputChange = (e) => {
// //         const { name, value } = e.target;
// //         setEditData((prev) => ({ ...prev, [name]: value }));
// //     };

// //     // Handle File Changes
// //     const handleFileChange = (e, index, field) => {
// //         console.log(e.target.files, index, field, "field")
// //         const file = e.target.files[0];
// //         if (field === "bannerImage") {
// //             setSelectedBanner(file);
// //         } else {
// //             setSubCategoryFiles((prev) => ({
// //                 ...prev,
// //                 [`${field}_${index}`]: file,
// //             }));
// //         }
// //     };

// //     // Subcategory Field Change
// //     const handleSubCategoryChange = (index, field, value) => {
// //         const updatedSubCategories = [...editData.subCategories];
// //         updatedSubCategories[index][field] = value;
// //         setEditData((prev) => ({ ...prev, subCategories: updatedSubCategories }));
// //     };

// //     // Timing Management
// //     const handleTimingChange = (subCategoryIndex, timingIndex, field, value) => {
// //         console.log(subCategoryIndex, timingIndex, field, value, "fdjhhjfhdhdh")
// //         setEditData((prev) => {
// //             const updatedSubCategories = [...prev.subCategories];
// //             const updatedTimings = [...updatedSubCategories[subCategoryIndex].timings];
// //             updatedTimings[timingIndex][field] = formatTo12Hour(value);
// //             updatedSubCategories[subCategoryIndex].timings = updatedTimings;
// //             return { ...prev, subCategories: updatedSubCategories };
// //         });
// //     };
// //     // Day Management
// //     const handleDayChange = (subCategoryIndex, timingIndex, field, value) => {
// //         console.log(subCategoryIndex, timingIndex, field, value, "fdjhhjfhdhdh")
// //         setEditData((prev) => {
// //             const updatedSubCategories = [...prev.subCategories];
// //             const updatedTimings = [...updatedSubCategories[subCategoryIndex].timings];
// //             updatedTimings[timingIndex][field] = value;
// //             updatedSubCategories[subCategoryIndex].timings = updatedTimings;
// //             return { ...prev, subCategories: updatedSubCategories };
// //         });
// //     };


// //     // Add and Remove Subcategories
// //     const addSubCategory = () => {
// //         const newSubCategory = {
// //             name: "",
// //             description: "",
// //             timings: [],
// //             images: [],
// //             menu: null,
// //         };
// //         setEditData((prev) => ({
// //             ...prev,
// //             subCategories: [...prev.subCategories, newSubCategory],
// //         }));
// //     };

// //     const removeSubCategory = (index) => {
// //         const updatedSubCategories = [...editData.subCategories];
// //         updatedSubCategories.splice(index, 1);
// //         setEditData((prev) => ({ ...prev, subCategories: updatedSubCategories }));
// //     };

// //     // Add and Remove Timing
// //     const addTiming = (subCategoryIndex) => {
// //         const newTiming = { startDay: "", endDay: "", startTime: "", endTime: "" };
// //         setEditData((prev) => {
// //             const updatedSubCategories = [...prev.subCategories];
// //             updatedSubCategories[subCategoryIndex].timings.push(newTiming);
// //             return { ...prev, subCategories: updatedSubCategories };
// //         });
// //     };

// //     const removeTiming = (subCategoryIndex, timingIndex) => {
// //         setEditData((prev) => {
// //             const updatedSubCategories = [...prev.subCategories];
// //             updatedSubCategories[subCategoryIndex].timings.splice(timingIndex, 1);
// //             return { ...prev, subCategories: updatedSubCategories };
// //         });
// //     };

// //     // Save Changes
// //     const handleSaveChanges = async () => {
// //         try {
// //             const formData = new FormData();
// //             Object.entries(editData).forEach(([key, value]) => {
// //                 if (key === "subCategories") {
// //                     formData.append(key, JSON.stringify(value));
// //                 } else if (value !== null && value !== undefined) {
// //                     formData.append(key, value);
// //                 }
// //             });

// //             if (selectedBanner) {
// //                 formData.append("bannerImage", selectedBanner);
// //             }

// //             Object.entries(subCategoryFiles).forEach(([key, file]) => {
// //                 formData.append(key, file);
// //             });

// //             const response = await updateFoodAndBeverageDetails(id, formData);

// //             if (response.status === 200) {
// //                 setFoodAndBeverage(response.data.foodAndBeverage);
// //                 setEditData(response.data.foodAndBeverage);
// //                 setEditDialogOpen(false);
// //                 showToast("Food & Beverage details updated successfully!", "success");
// //             } else {
// //                 showToast("Failed to update food and beverage details. Please try again.", "error");
// //             }
// //         } catch (error) {
// //             console.error("Failed to update food and beverage details:", error);
// //             showToast("Failed to update food and beverage details. Please try again.", "error");
// //         }
// //     };

// //     // console.log(foodAndBeverage.timings, foodAndBeverage.timings.length, "external")


// //     return (
// //         <Box sx={{ pt: "80px", pb: "20px" }}>
// //             <Breadcrumb />
// //             <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
// //                 Food & Beverage Details
// //             </Typography>
// //             <Card sx={{ display: "flex", flexDirection: "column", p: 3, gap: 3 }}>
// //                 <CardMedia
// //                     component="img"
// //                     height="300"
// //                     image={`${PUBLIC_API_URI}${foodAndBeverage.bannerImage}`}
// //                     alt={foodAndBeverage.name || "Banner"}
// //                     sx={{ borderRadius: "12px" }}
// //                 />
// //                 <CardContent>
// //                     <Typography variant="h5">{foodAndBeverage.name || "N/A"}</Typography>
// //                     <Typography variant="body1">
// //                         <strong>Description:</strong>
// //                         <div
// //                             dangerouslySetInnerHTML={{ __html: foodAndBeverage.description || "N/A" }}
// //                         // style={{ maxHeight: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
// //                         />
// //                     </Typography>
// //                     <Typography variant="body2" sx={{ mt: 1 }}>
// //                         <strong>Location:</strong> {foodAndBeverage.location || "N/A"}
// //                     </Typography>
// //                     <Typography variant="body2" sx={{ mt: 1 }}>
// //                         <strong>Extatiopn No:</strong> {foodAndBeverage.extansion_no || "N/A"}
// //                     </Typography>
// //                     <Typography variant="body2" sx={{ mt: 1 }}>
// //                         <strong>Timings:</strong>
// //                         {foodAndBeverage.timings?.map((timing, i) => (
// //                             <div key={i}>
// //                                 <div>{timing.title}</div>
// //                                 <div>{timing.startDay} - {timing.endDay}, {timing.startTime} - {timing.endTime}</div>
// //                             </div>
// //                         ))}
// //                     </Typography>
// //                     <Typography variant="body2" sx={{ mt: 1 }}>
// //                         <strong>Status:</strong> {foodAndBeverage.status || "N/A"}
// //                     </Typography>
// //                     {foodAndBeverage.mainmenu && (
// //                         <Button
// //                             variant="outlined"
// //                             color="primary"
// //                             href={`${PUBLIC_API_URI}${foodAndBeverage.mainmenu}`}
// //                             target="_blank"
// //                             sx={{ mt: 2 }}
// //                         >
// //                             View Menu
// //                         </Button>
// //                     )}
// //                 </CardContent>

// //                 <Divider />
// //                 <Typography variant="h6">Subcategories</Typography>
// //                 <Grid container spacing={2}>
// //                     {foodAndBeverage.subCategories?.map((subCategory, index) => (
// //                         <Grid item xs={12} md={6} key={index}>
// //                             <Paper sx={{ p: 2, borderRadius: "8px" }}>
// //                                 <Typography variant="h6">{subCategory.name}</Typography>
// //                                 {/* <Typography>{subCategory.description}</Typography> */}
// //                                 <div
// //                                     dangerouslySetInnerHTML={{ __html: subCategory.description || "N/A" }}
// //                                 // style={{ maxHeight: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
// //                                 />
// //                                 <Typography>{subCategory.location}</Typography>
// //                                 <Typography>{subCategory.extansion_no}</Typography>
// //                                 <Typography variant="body2" sx={{ mt: 1 }}>
// //                                     <strong>Timings:</strong>
// //                                     {subCategory.timings.map((timing, i) => (
// //                                         <>
// //                                             <div >
// //                                                 {timing.title}
// //                                             </div>
// //                                             <div key={i}>
// //                                                 {timing.startDay} - {timing.endDay}, {timing.startTime} - {timing.endTime}
// //                                             </div>
// //                                         </>
// //                                     ))}
// //                                 </Typography>
// //                                 <Box>
// //                                     {subCategory.images.length > 0 && (
// //                                         <>
// //                                             {subCategory.images.map((image, index) => (
// //                                                 <img key={index} src={`${PUBLIC_API_URI}${image}`} alt={`Subcategory Image ${index + 1}`} height={150} width={150} />
// //                                             ))}
// //                                         </>
// //                                     )}
// //                                 </Box>
// //                                 {subCategory.menu && (
// //                                     <Button
// //                                         variant="outlined"
// //                                         color="primary"
// //                                         href={`${PUBLIC_API_URI}${subCategory.menu}`}
// //                                         target="_blank"
// //                                         sx={{ mt: 2 }}
// //                                     >
// //                                         View Menu
// //                                     </Button>
// //                                 )}
// //                             </Paper>
// //                         </Grid>
// //                     ))}
// //                 </Grid>
// //             </Card>

// //             <Dialog open={isEditDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="lg">
// //                 <DialogTitle>Edit Food & Beverage Details</DialogTitle>
// //                 <DialogContent>
// //                     <DialogContent>
// //                         <Box sx={{ mb: 4 }}>
// //                             <Typography variant="h6" sx={{ mb: 2 }}>
// //                                 General Information
// //                             </Typography>
// //                             <TextField
// //                                 label="Name"
// //                                 fullWidth
// //                                 margin="dense"
// //                                 name="name"
// //                                 value={editData.name || ""}
// //                                 onChange={handleInputChange}
// //                             />
// //                             <TextField
// //                                 label="Description"
// //                                 fullWidth
// //                                 margin="dense"
// //                                 name="description"
// //                                 multiline
// //                                 rows={3}
// //                                 value={editData.description || ""}
// //                                 onChange={handleInputChange}
// //                             />
// //                             <FormControl fullWidth margin="dense">
// //                                 <InputLabel>Status</InputLabel>
// //                                 <Select
// //                                     name="status"
// //                                     value={editData.status || ""}
// //                                     onChange={handleInputChange}
// //                                 >
// //                                     <MenuItem value="Active">Active</MenuItem>
// //                                     <MenuItem value="Inactive">Inactive</MenuItem>
// //                                 </Select>
// //                             </FormControl>
// //                             <Button
// //                                 variant="outlined"
// //                                 component="label"
// //                                 sx={{ mt: 2, textTransform: "none" }}
// //                                 fullWidth
// //                             >
// //                                 Upload New Banner Image
// //                                 <input
// //                                     type="file"
// //                                     hidden
// //                                     accept="image/*"
// //                                     onChange={(e) => handleFileChange(e, undefined, "bannerImage")}
// //                                 />
// //                             </Button>
// //                         </Box>

// //                         <Divider sx={{ my: 4 }} />

// //                         <Box>
// //                             <Typography variant="h6" sx={{ mb: 2 }}>
// //                                 Subcategories
// //                             </Typography>
// //                             {editData.subCategories?.map((subCategory, index) => (
// //                                 <Paper
// //                                     key={index}
// //                                     elevation={3}
// //                                     sx={{
// //                                         p: 3,
// //                                         mb: 3,
// //                                         borderRadius: "12px",
// //                                         border: "1px solid #ddd",
// //                                     }}
// //                                 >
// //                                     <Typography variant="h6" sx={{ mb: 2 }}>
// //                                         Subcategory {index + 1}
// //                                     </Typography>
// //                                     <TextField
// //                                         label="Subcategory Name"
// //                                         fullWidth
// //                                         margin="dense"
// //                                         value={subCategory.name || ""}
// //                                         onChange={(e) =>
// //                                             handleSubCategoryChange(index, "name", e.target.value)
// //                                         }
// //                                     />
// //                                     <TextField
// //                                         label="Description"
// //                                         fullWidth
// //                                         margin="dense"
// //                                         multiline
// //                                         rows={2}
// //                                         value={subCategory.description || ""}
// //                                         onChange={(e) =>
// //                                             handleSubCategoryChange(index, "description", e.target.value)
// //                                         }
// //                                     />
// //                                     <TextField
// //                                         label="Location"
// //                                         fullWidth
// //                                         margin="dense"
// //                                         // multiline
// //                                         rows={2}
// //                                         value={subCategory.location || ""}
// //                                         onChange={(e) =>
// //                                             handleSubCategoryChange(index, "location", e.target.value)
// //                                         }
// //                                     />
// //                                     <TextField
// //                                         label="Extansion No"
// //                                         fullWidth
// //                                         margin="dense"
// //                                         // multiline
// //                                         rows={2}
// //                                         value={subCategory.extansion_no || ""}
// //                                         onChange={(e) =>
// //                                             handleSubCategoryChange(index, "extansion_no", e.target.value)
// //                                         }
// //                                     />

// //                                     <Typography variant="subtitle1" sx={{ mt: 2 }}>
// //                                         Timings
// //                                     </Typography>
// //                                     {subCategory.timings?.map((timing, timingIndex) => (
// //                                         <Box
// //                                             key={timingIndex}
// //                                             sx={{
// //                                                 display: "flex",
// //                                                 flexDirection: "column",
// //                                                 gap: 2,
// //                                                 mt: 2,
// //                                                 p: 2,
// //                                                 border: "1px solid #ccc",
// //                                                 borderRadius: "8px",
// //                                                 backgroundColor: "#f9f9f9",
// //                                             }}
// //                                         >
// //                                             <TextField
// //                                                 label="Title"
// //                                                 fullWidth
// //                                                 margin="dense"
// //                                                 // multiline
// //                                                 // rows={2}
// //                                                 value={timing.title || ""}
// //                                                 onChange={(e) =>
// //                                                     handleDayChange(
// //                                                         index,
// //                                                         timingIndex,
// //                                                         "title",
// //                                                         e.target.value
// //                                                     )
// //                                                 }
// //                                             />
// //                                             {/* Row 1: Start Day and End Day */}
// //                                             <Box sx={{ display: "flex", gap: 2 }}>
// //                                                 <FormControl fullWidth margin="dense">
// //                                                     <InputLabel>Start Day</InputLabel>
// //                                                     <Select
// //                                                         value={timing.startDay || ""}
// //                                                         onChange={(e) =>
// //                                                             handleDayChange(
// //                                                                 index,
// //                                                                 timingIndex,
// //                                                                 "startDay",
// //                                                                 e.target.value
// //                                                             )
// //                                                         }
// //                                                     >
// //                                                         {dayOptions.map((day) => (
// //                                                             <MenuItem key={day} value={day}>
// //                                                                 {day}
// //                                                             </MenuItem>
// //                                                         ))}
// //                                                     </Select>
// //                                                 </FormControl>
// //                                                 <FormControl fullWidth margin="dense">
// //                                                     <InputLabel>End Day</InputLabel>
// //                                                     <Select
// //                                                         value={timing.endDay || ""}
// //                                                         onChange={(e) =>
// //                                                             handleDayChange(
// //                                                                 index,
// //                                                                 timingIndex,
// //                                                                 "endDay",
// //                                                                 e.target.value
// //                                                             )
// //                                                         }
// //                                                     >
// //                                                         {dayOptions.map((day) => (
// //                                                             <MenuItem key={day} value={day}>
// //                                                                 {day}
// //                                                             </MenuItem>
// //                                                         ))}
// //                                                     </Select>
// //                                                 </FormControl>
// //                                             </Box>

// //                                             {/* Row 2: Start Time and End Time */}
// //                                             <Box sx={{ display: "flex", gap: 2 }}>
// //                                                 <Box sx={{ flex: 1 }}>
// //                                                     <Typography
// //                                                         variant="subtitle2"
// //                                                         sx={{
// //                                                             fontSize: "14px",
// //                                                             color: "#333",
// //                                                             fontWeight: "bold",
// //                                                             mb: 1,
// //                                                         }}
// //                                                     >
// //                                                         Start Time
// //                                                     </Typography>
// //                                                     <TimePicker
// //                                                         value={timing.startTime || null}
// //                                                         onChange={(value) =>
// //                                                             handleTimingChange(index, timingIndex, "startTime", value)
// //                                                         }
// //                                                         renderInput={(params) => (
// //                                                             <TextField
// //                                                                 {...params}
// //                                                                 fullWidth
// //                                                                 sx={{
// //                                                                     "& .MuiInputBase-root": {
// //                                                                         borderRadius: "6px",
// //                                                                         backgroundColor: "#fff",
// //                                                                     },
// //                                                                 }}
// //                                                             />
// //                                                         )}
// //                                                     />
// //                                                 </Box>
// //                                                 <Box sx={{ flex: 1 }}>
// //                                                     <Typography
// //                                                         variant="subtitle2"
// //                                                         sx={{
// //                                                             fontSize: "14px",
// //                                                             color: "#333",
// //                                                             fontWeight: "bold",
// //                                                             mb: 1,
// //                                                         }}
// //                                                     >
// //                                                         End Time
// //                                                     </Typography>
// //                                                     <TimePicker
// //                                                         value={timing.endTime || null}
// //                                                         onChange={(value) =>
// //                                                             handleTimingChange(index, timingIndex, "endTime", value)
// //                                                         }
// //                                                         renderInput={(params) => (
// //                                                             <TextField
// //                                                                 {...params}
// //                                                                 fullWidth
// //                                                                 sx={{
// //                                                                     "& .MuiInputBase-root": {
// //                                                                         borderRadius: "6px",
// //                                                                         backgroundColor: "#fff",
// //                                                                     },
// //                                                                 }}
// //                                                             />
// //                                                         )}
// //                                                     />
// //                                                 </Box>
// //                                             </Box>

// //                                             {/* Remove Button */}
// //                                             <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
// //                                                 <IconButton
// //                                                     color="error"
// //                                                     onClick={() => removeTiming(index, timingIndex)}
// //                                                 >
// //                                                     <Delete />
// //                                                 </IconButton>
// //                                             </Box>
// //                                         </Box>
// //                                     ))}

// //                                     <Button
// //                                         variant="outlined"
// //                                         sx={{ mt: 2 }}
// //                                         onClick={() => addTiming(index)}
// //                                     >
// //                                         Add Timing
// //                                     </Button>

// //                                     <Divider sx={{ my: 2 }} />

// //                                     <Button
// //                                         variant="outlined"
// //                                         component="label"
// //                                         fullWidth
// //                                         sx={{ mt: 2 }}
// //                                     >
// //                                         Upload New Subcategory Image
// //                                         <input
// //                                             type="file"
// //                                             hidden
// //                                             accept="image/*"
// //                                             onChange={(e) => handleFileChange(e, index, "images")}
// //                                         />
// //                                     </Button>
// //                                     <Button
// //                                         variant="outlined"
// //                                         component="label"
// //                                         fullWidth
// //                                         sx={{ mt: 2 }}
// //                                     >
// //                                         Upload Newv Menu File
// //                                         <input
// //                                             type="file"
// //                                             hidden
// //                                             accept=".pdf"
// //                                             onChange={(e) => handleFileChange(e, index, "menu")}
// //                                         />
// //                                     </Button>
// //                                     <Button
// //                                         variant="outlined"
// //                                         color="error"
// //                                         fullWidth
// //                                         sx={{ mt: 2 }}
// //                                         onClick={() => removeSubCategory(index)}
// //                                     >
// //                                         Remove Subcategory
// //                                     </Button>
// //                                 </Paper>
// //                             ))}
// //                             <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={addSubCategory}>
// //                                 Add Subcategory
// //                             </Button>
// //                         </Box>
// //                     </DialogContent>

// //                 </DialogContent>
// //                 <DialogActions>
// //                     <Button onClick={() => setEditDialogOpen(false)} color="secondary">
// //                         Cancel
// //                     </Button>
// //                     <Button onClick={handleSaveChanges} color="primary" startIcon={<Save />}>
// //                         Save Changes
// //                     </Button>
// //                 </DialogActions>
// //             </Dialog>
// //         </Box>
// //     );
// // };

// // export default SingleFoodAndBeverage;


// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     Button,
//     Card,
//     CardContent,
//     CardMedia,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     Divider,
//     FormControl,
//     Grid,
//     IconButton,
//     InputLabel,
//     MenuItem,
//     Paper,
//     Select,
//     TextField,
//     Typography,
// } from "@mui/material";
// import TimePicker from "react-time-picker";
// import "react-time-picker/dist/TimePicker.css";
// import "react-clock/dist/Clock.css";
// import { useParams } from "react-router-dom";
// import { fetchFoodAndBeverageDetails, updateFoodAndBeverageDetails } from "../api/foodAndBeverage";
// import { PUBLIC_API_URI } from "../api/config";
// import { showToast } from "../api/toast";
// import { FiEdit } from "react-icons/fi";
// import Breadcrumb from "../components/common/Breadcrumb";
// import EditFoodAndBeverage from "./EditFoodAndBeverage";

// const formatTo12Hour = (time) => {
//     if (!time) return ""; // Return empty if no time is selected
//     const [hours, minutes] = time.split(":").map(Number);
//     const period = hours >= 12 ? "PM" : "AM";
//     const formattedHours = hours % 12 || 12; // Convert to 12-hour format
//     return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
// };

// const SingleFoodAndBeverage = () => {
//     const { id } = useParams();
//     const [foodAndBeverage, setFoodAndBeverage] = useState({});
//     const [isEditDialogOpen, setEditDialogOpen] = useState(false);

//     useEffect(() => {
//         getFoodAndBeverageById(id);
//     }, [id]);

//     const getFoodAndBeverageById = async (categoryId) => {
//         try {
//             const response = await fetchFoodAndBeverageDetails(categoryId);
//             setFoodAndBeverage(response.data.foodAndBeverage);
//         } catch (error) {
//             console.error("Failed to fetch food and beverage details:", error);
//             showToast("Failed to fetch food and beverage details. Please try again.", "error");
//         }
//     };


//     const handleSave = () => {
//         // setFoodAndBeverage(updatedData);
//         getFoodAndBeverageById(id)
//         setEditDialogOpen(false);
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Breadcrumb />
//             <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
//                 Food & Beverage Details
//             </Typography>
//             <Card sx={{ display: "flex", flexDirection: "column", p: 3, gap: 3 }}>
//                 <CardMedia
//                     component="img"
//                     height="300"
//                     image={`${PUBLIC_API_URI}${foodAndBeverage?.bannerImage}`}
//                     alt={foodAndBeverage.name || "Banner"}
//                     sx={{ borderRadius: "12px" }}
//                 />
//                 <CardContent>
//                     <Typography variant="h5">{foodAndBeverage.name || "N/A"}</Typography>
//                     <Typography variant="body1">
//                         <strong>Description:</strong>
//                         <div
//                             dangerouslySetInnerHTML={{ __html: foodAndBeverage.description || "N/A" }}
//                         />
//                     </Typography>
//                     <Typography variant="body2" sx={{ mt: 1 }}>
//                         <strong>Location:</strong> {foodAndBeverage.location || "N/A"}
//                     </Typography>
//                     <Typography variant="body2" sx={{ mt: 1 }}>
//                         <strong>Extension No:</strong> {foodAndBeverage.extansion_no || "N/A"}
//                     </Typography>
//                     <Typography variant="body2" sx={{ mt: 1 }}>
//                         <strong>Timings:</strong>
//                         {foodAndBeverage.timings?.map((timing, i) => (
//                             <div key={i}>
//                                 <div>{timing.title}</div>
//                                 <div>{timing.startDay} - {timing.endDay}, {timing.startTime} - {timing.endTime}</div>
//                             </div>
//                         ))}
//                     </Typography>
//                     <Typography variant="body2" sx={{ mt: 1 }}>
//                         <strong>Status:</strong> {foodAndBeverage.status || "N/A"}
//                     </Typography>
//                     {foodAndBeverage.mainmenu && (
//                         <Button
//                             variant="outlined"
//                             color="primary"
//                             href={`${PUBLIC_API_URI}${foodAndBeverage.mainmenu}`}
//                             target="_blank"
//                             sx={{ mt: 2 }}
//                         >
//                             View Menu
//                         </Button>
//                     )}
//                 </CardContent>
//                 <Divider />
//                 <Typography variant="h6">Subcategories</Typography>
//                 <Grid container spacing={2}>
//                     {foodAndBeverage.subCategories?.map((subCategory, index) => (
//                         <Grid item xs={12} md={6} key={index}>
//                             <Paper sx={{ p: 2, borderRadius: "8px" }}>
//                                 <Typography variant="h6">{subCategory.name}</Typography>
//                                 <div
//                                     dangerouslySetInnerHTML={{ __html: subCategory.description || "N/A" }}
//                                 />
//                                 <Typography>{subCategory.location}</Typography>
//                                 <Typography>{subCategory.extansion_no}</Typography>
//                                 <Typography variant="body2" sx={{ mt: 1 }}>
//                                     <strong>Timings:</strong>
//                                     {subCategory.timings.map((timing, i) => (
//                                         <div key={i}>
//                                             {timing.title} - {timing.startDay} to {timing.endDay}, {timing.startTime} - {timing.endTime}
//                                         </div>
//                                     ))}
//                                 </Typography>
//                                 <Box>
//                                     {subCategory.images.length > 0 && (
//                                         subCategory.images.map((image, index) => (
//                                             <img
//                                                 key={index}
//                                                 src={`${PUBLIC_API_URI}${image}`}
//                                                 alt={`Subcategory Image ${index + 1}`}
//                                                 height={150}
//                                                 width={150}
//                                             />
//                                         ))
//                                     )}
//                                 </Box>
//                                 {subCategory.menu && (
//                                     <Button
//                                         variant="outlined"
//                                         color="primary"
//                                         href={`${PUBLIC_API_URI}${subCategory.menu}`}
//                                         target="_blank"
//                                         sx={{ mt: 2 }}
//                                     >
//                                         View Menu
//                                     </Button>
//                                 )}
//                             </Paper>
//                         </Grid>
//                     ))}
//                 </Grid>
//                 <Box sx={{ textAlign: "right" }}>
//                     <Button
//                         variant="contained"
//                         sx={{ mt: 2, width: '30%' }}
//                         onClick={() => setEditDialogOpen(true)}
//                     >
//                         Edit Food & Beverage
//                     </Button>
//                 </Box>
//             </Card>

//             <EditFoodAndBeverage
//                 categoryId={foodAndBeverage._id}
//                 isOpen={isEditDialogOpen}
//                 onClose={() => setEditDialogOpen(false)}
//                 onSave={handleSave}
//             />

//         </Box>
//     );
// };

// export default SingleFoodAndBeverage;


// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     Button,
//     Card,
//     CardContent,
//     CardMedia,
//     Divider,
//     Grid,
//     Paper,
//     Typography,
// } from "@mui/material";
// import { useParams } from "react-router-dom";
// import { fetchFoodAndBeverageDetails } from "../api/foodAndBeverage";
// import { PUBLIC_API_URI } from "../api/config";
// import { showToast } from "../api/toast";
// import Breadcrumb from "../components/common/Breadcrumb";
// import EditFoodAndBeverage from "./EditFoodAndBeverage";

// const SingleFoodAndBeverage = () => {
//     const { id } = useParams();
//     const [foodAndBeverage, setFoodAndBeverage] = useState({});
//     const [isEditDialogOpen, setEditDialogOpen] = useState(false);

//     useEffect(() => {
//         getFoodAndBeverageById(id);
//     }, [id]);

//     const getFoodAndBeverageById = async (categoryId) => {
//         try {
//             const response = await fetchFoodAndBeverageDetails(categoryId);
//             setFoodAndBeverage(response.data.foodAndBeverage);
//         } catch (error) {
//             console.error("Failed to fetch food and beverage details:", error);
//             showToast("Failed to fetch food and beverage details. Please try again.", "error");
//         }
//     };

//     const handleSave = () => {
//         getFoodAndBeverageById(id);
//         setEditDialogOpen(false);
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Breadcrumb />
//             <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
//                 Food & Beverage Details
//             </Typography>
//             <Card sx={{ display: "flex", flexDirection: "column", p: 3, gap: 3 }}>
//                 <CardMedia
//                     component="img"
//                     height="300"
//                     image={`${PUBLIC_API_URI}${foodAndBeverage?.bannerImage}`}
//                     alt={foodAndBeverage.name || "Banner"}
//                     sx={{ borderRadius: "12px" }}
//                 />
//                 <CardContent>
//                     <Typography variant="h5">{foodAndBeverage.name || "N/A"}</Typography>
//                     <Typography variant="body1">
//                         <strong>Description:</strong>
//                         <div
//                             dangerouslySetInnerHTML={{ __html: foodAndBeverage.description || "N/A" }}
//                         />
//                     </Typography>
//                     <Typography variant="body2" sx={{ mt: 1 }}>
//                         <strong>Location:</strong> {foodAndBeverage.location || "N/A"}
//                     </Typography>
//                     <Typography variant="body2" sx={{ mt: 1 }}>
//                         <strong>Extension No:</strong> {foodAndBeverage.extansion_no || "N/A"}
//                     </Typography>
//                     <Typography variant="body2" sx={{ mt: 1 }}>
//                         <strong>Timings:</strong>
//                         {foodAndBeverage.timings?.map((timing, i) => (
//                             <div key={i}>
//                                 <div>{timing.title}</div>
//                                 <div>
//                                     {timing.startDay} - {timing.endDay}, {timing.startTime} - {timing.endTime}
//                                 </div>
//                             </div>
//                         ))}
//                     </Typography>
//                     <Typography variant="body2" sx={{ mt: 1 }}>
//                         <strong>Status:</strong> {foodAndBeverage.status || "N/A"}
//                     </Typography>
//                     {foodAndBeverage.mainmenu && (
//                         <Button
//                             variant="outlined"
//                             color="primary"
//                             href={`${PUBLIC_API_URI}${foodAndBeverage.mainmenu}`}
//                             target="_blank"
//                             sx={{ mt: 2 }}
//                         >
//                             View Menu
//                         </Button>
//                     )}
//                 </CardContent>
//                 <Box sx={{ textAlign: "right" }}>
//                     <Button
//                         variant="contained"
//                         sx={{ mt: 2, width: '30%' }}
//                         onClick={() => setEditDialogOpen(true)}
//                     >
//                         Edit Food & Beverage
//                     </Button>
//                 </Box>
//             </Card>

//             <EditFoodAndBeverage
//                 categoryId={foodAndBeverage._id}
//                 isOpen={isEditDialogOpen}
//                 onClose={() => setEditDialogOpen(false)}
//                 onSave={handleSave}
//             />
//         </Box>
//     );
// };

// export default SingleFoodAndBeverage;


import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { fetchFoodAndBeverageDetails } from "../api/foodAndBeverage";
import { PUBLIC_API_URI } from "../api/config";
import { showToast } from "../api/toast";
import Breadcrumb from "../components/common/Breadcrumb";
import EditFoodAndBeverage from "./EditFoodAndBeverage";

const SingleFoodAndBeverage = () => {
    const { id } = useParams();
    const [foodAndBeverage, setFoodAndBeverage] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);

    useEffect(() => {
        getFoodAndBeverageById(id);
    }, [id]);

    const getFoodAndBeverageById = async (categoryId) => {
        try {
            const response = await fetchFoodAndBeverageDetails(categoryId);
            setFoodAndBeverage(response.data.foodAndBeverage);
        } catch (error) {
            console.error("Failed to fetch food and beverage details:", error);
            showToast("Failed to fetch food and beverage details. Please try again.", "error");
        }
    };

    const handleSave = () => {
        getFoodAndBeverageById(id);
        setEditDialogOpen(false);
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
                Food & Beverage Details
            </Typography>
            <Card sx={{ display: "flex", flexDirection: "column", p: 3, gap: 3 }}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {foodAndBeverage?.bannerImage?.map((image, index) => (
                        <CardMedia
                            key={index}
                            component="img"
                            height="200"
                            image={`${PUBLIC_API_URI}${image}`}
                            alt={`Banner ${index + 1}`}
                            sx={{ borderRadius: "12px", width: 200 }}
                        />
                    ))}
                </Box>
                <CardContent>
                    <Typography variant="h5">{foodAndBeverage.name || "N/A"}</Typography>
                    <Typography variant="body1">
                        <strong>Description:</strong>
                        <div
                            dangerouslySetInnerHTML={{ __html: foodAndBeverage.description || "N/A" }}
                        />
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Location:</strong> {foodAndBeverage.location || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Extension No:</strong> {foodAndBeverage.extansion_no || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Timings:</strong>
                        {foodAndBeverage.timings?.map((timing, i) => (
                            <div key={i}>
                                {timing.startDay} - {timing.endDay}, {timing.startTime} - {timing.endTime}
                            </div>
                        ))}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Status:</strong> {foodAndBeverage.status || "N/A"}
                    </Typography>
                    {foodAndBeverage.mainmenu && (
                        <Button
                            variant="outlined"
                            color="primary"
                            href={`${PUBLIC_API_URI}${foodAndBeverage.mainmenu}`}
                            target="_blank"
                            sx={{ mt: 2 }}
                        >
                            View Menu
                        </Button>
                    )}
                </CardContent>
                <Box sx={{ textAlign: "right" }}>
                    <Button
                        variant="contained"
                        sx={{ mt: 2, width: '30%' }}
                        onClick={() => setEditDialogOpen(true)}
                    >
                        Edit Food & Beverage
                    </Button>
                </Box>
            </Card>

            <EditFoodAndBeverage
                categoryId={foodAndBeverage._id}
                isOpen={isEditDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                onSave={handleSave}
            />
        </Box>
    );
};

export default SingleFoodAndBeverage;
