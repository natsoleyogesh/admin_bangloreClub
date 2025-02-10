import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEditOfferDetails, fetchOfferDetails, updateOfferDetails } from "../api/offer";
import { formatDate, formatDateMoment, PUBLIC_API_URI } from "../api/config";
import { showToast } from "../api/toast";
import { FiEdit } from "react-icons/fi";
import ReactQuill from "react-quill";
import Breadcrumb from "../components/common/Breadcrumb";
import { fetchAllActiveDepartments } from "../api/masterData/department";


// const departmentOptions = ["Recharge", "Purchase", "Subscription", "Entertainment", "Other"];

const SingleOffer = () => {
    const { id } = useParams();
    const [offer, setOffer] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editOffer, setEditOffer] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeDepartments, setActiveDepartments] = useState([]);

    // Fetch offer details by ID
    useEffect(() => {
        getEditOfferById(id);
        getOfferById(id);
    }, [id]);

    const getOfferById = async (offerId) => {
        try {
            const response = await fetchOfferDetails(offerId);
            setOffer(response.data.offer);
        } catch (error) {
            console.error("Failed to fetch offer details:", error);
            showToast("Failed to fetch offer details. Please try again.", "error");
        }
    };

    const getEditOfferById = async (offerId) => {
        try {
            const response = await fetchEditOfferDetails(offerId);
            setEditOffer(response.data.offer);
        } catch (error) {
            console.error("Failed to fetch offer details:", error);
            showToast("Failed to fetch offer details. Please try again.", "error");
        }
    };


    useEffect(() => {
        getActiveDepartments()
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
    // // Format time (e.g., "01:25 PM")
    // const formatTime = (timeString) => {
    //     if (!timeString) return "N/A";
    //     const [hour, minute] = timeString.split(":").map(Number);
    //     const date = new Date();
    //     date.setHours(hour, minute);
    //     return date.toLocaleTimeString(undefined, {
    //         hour: "2-digit",
    //         minute: "2-digit",
    //         hour12: true,
    //     });
    // };

    // Handle input changes
    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setEditOffer((prev) => ({ ...prev, [name]: value }));
    // };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Parse numbers correctly
        const parsedValue = ["discountAmount", "discountPercentage"].includes(name)
            ? value === "" ? null : parseFloat(value)
            : value;

        setEditOffer((prev) => ({ ...prev, [name]: parsedValue }));
    };

    // Handle checkbox change
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setEditOffer((prev) => ({ ...prev, [name]: checked }));
    };

    // Handle image selection
    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    // Handle dialog open/close
    const handleEditClick = () => setEditDialogOpen(true);
    const handleDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedImage(null);
    };

    // Save changes to the offer
    const handleSaveChanges = async () => {
        try {
            const formData = new FormData();
            // Object.entries(editOffer).forEach(([key, value]) => {
            //     formData.append(key, value);
            // });
            Object.entries(editOffer).forEach(([key, value]) => {
                // Append only valid values to FormData
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            if (selectedImage) {
                formData.append("bannerImage", selectedImage);
            }

            const response = await updateOfferDetails(id, formData);
            if (response.status === 200 && response.data.offer) {
                getOfferById(id)
                // setOffer(response.data.offer);
                // setEditOffer(response.data.offer);
                setEditDialogOpen(false);
                showToast("Offer details updated successfully!", "success");
            }
        } catch (error) {
            console.error("Failed to update offer details:", error);
            showToast("Failed to update offer details. Please try again.", "error");
        }
    };

    // Get color for status
    const getStatusColor = (status) => {
        switch (status) {
            case "Active": return "primary";
            case "Inactive": return "error";
            case "Complete": return "success";
            default: return "default";
        }
    };



    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Offer Details
            </Typography>
            <Paper sx={{ p: 3, mb: 3, borderRadius: "12px", border: "1px solid", borderColor: "divider" }}>
                <Grid container spacing={4}>
                    {/* Offer Image */}
                    <Grid item xs={12} md={5}>
                        <Avatar
                            src={offer.bannerImage ? `${PUBLIC_API_URI}${offer.bannerImage}` : ""}
                            alt={offer.title || "Offer Image"}
                            variant="rounded"
                            sx={{ width: "100%", height: "300px", objectFit: "cover" }}
                        />
                    </Grid>

                    {/* Offer Details */}
                    <Grid item xs={12} md={7}>
                        <Typography variant="h4">{offer.title || "N/A"}</Typography>
                        <Typography variant="body1">
                            <strong>Start Date:</strong> {formatDateMoment(offer.startDate)}
                        </Typography>
                        <Typography variant="body1">
                            <strong>End Date:</strong> {formatDateMoment(offer.endDate)}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Description:</strong>
                            <div
                                dangerouslySetInnerHTML={{ __html: offer.description || "N/A" }}
                            // style={{ maxHeight: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                            />
                        </Typography>
                        <Typography variant="body1">
                            <strong>Coupon Code:</strong> {offer.couponCode || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Discount %:</strong> {offer.discountPercentage || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Type:</strong> {offer.type || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Department:</strong> {offer.department || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Show Exclusive:</strong> {offer.showExclusive ? "Yes" : "No"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Discount Offer:</strong> {offer.discountOffer ? "Yes" : "No"}
                        </Typography>
                        <Typography variant="body1" sx={{ color: getStatusColor(offer.status) }}>
                            <strong>Status:</strong> {offer.status || "N/A"}
                        </Typography>
                        <Typography variant="body1" >
                            <strong>Show Banner Home:</strong> {offer.showBanner === true ? "Yes" : "No"}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleEditClick}
                        >
                            Edit Offer
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit Offer Details</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Offer Title"
                        fullWidth
                        margin="dense"
                        name="title"
                        value={editOffer.title || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Start Date"
                        type="date"
                        fullWidth
                        margin="dense"
                        name="startDate"
                        value={editOffer.startDate?.slice(0, 10) || ""}
                        onChange={handleInputChange}
                        inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        fullWidth
                        margin="dense"
                        name="endDate"
                        value={editOffer.endDate?.slice(0, 10) || ""}
                        onChange={handleInputChange}
                        inputProps={{ min: new Date().toISOString().split("T")[0] }} // Allow only today and future dates
                    />
                    <TextField
                        label="Discount Percentage"
                        fullWidth
                        margin="dense"
                        name="discountPercentage"
                        value={editOffer.discountPercentage || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Coupon Code"
                        fullWidth
                        margin="dense"
                        name="couponCode"
                        value={editOffer.couponCode || ""}
                        onChange={handleInputChange}
                    />
                    {/* <TextField
                        label="Description"
                        fullWidth
                        margin="dense"
                        name="description"
                        multiline
                        rows={4}
                        value={editOffer.description || ""}
                        onChange={handleInputChange}
                    /> */}
                    {/* Use ReactQuill for About Event */}
                    <InputLabel sx={{ fontWeight: "bold", mt: 2 }}>Description</InputLabel>
                    <ReactQuill
                        value={editOffer.description || ""}
                        onChange={(value) => setEditOffer({ ...editOffer, description: value })}
                        style={{ height: "150px", marginBottom: "100px" }}
                    />

                    <TextField
                        label="Status"
                        select
                        fullWidth
                        margin="dense"
                        name="status"
                        value={editOffer.status || ""}
                        onChange={handleInputChange}
                    >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                        <MenuItem value="Complete">Complete</MenuItem>
                    </TextField>
                    <TextField
                        label="Type"
                        select
                        fullWidth
                        margin="dense"
                        name="type"
                        value={editOffer.type || ""}
                        onChange={handleInputChange}
                    >
                        <MenuItem value="New">New</MenuItem>
                        <MenuItem value="Current">Current</MenuItem>
                    </TextField>
                    {/* Show Exclusive Checkbox */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="showExclusive"
                                checked={editOffer.showExclusive || false}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label="Show Exclusive"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="discountOffer"
                                checked={editOffer.discountOffer || false}
                                onChange={handleCheckboxChange}
                            />
                        }
                        label="Discount Offer"
                    />

                    {/* Department */}
                    <Box sx={{ mb: 2 }}>
                        {/* <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Department</InputLabel> */}

                        <FormControl fullWidth >
                            <Select
                                name="department"
                                value={editOffer.department || ""}
                                onChange={handleInputChange}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select department
                                </MenuItem>
                                {activeDepartments.map((option) => (
                                    <MenuItem key={option._id} value={option._id}>
                                        {option.departmentName}
                                    </MenuItem>
                                ))}
                            </Select>

                        </FormControl>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="showBanner"
                                    checked={editOffer.showBanner}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label="Show Banner In Home"
                        />
                    </Box>

                    <Avatar
                        src={selectedImage ? URL.createObjectURL(selectedImage) : `${PUBLIC_API_URI}${editOffer.bannerImage}`}
                        alt="Offer Image"
                        variant="rounded"
                        sx={{ width: "100%", height: "200px", objectFit: "cover", mb: 2 }}
                    />
                    <Button variant="contained" component="label" fullWidth>
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
        </Box >
    );
};

export default SingleOffer;



