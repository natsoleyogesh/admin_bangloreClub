import {
    Avatar,
    Box,
    Grid,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton,
    MenuItem,
    TableBody,
    TableRow,
    TableCell,
    Table as TableData,
    Checkbox,
    Autocomplete,
    Chip,
    InputLabel,
    FormControl
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteMember, fetchMemberDetails, updateMemberDetails, updateProfilePicture } from "../api/member";
import Table from "../components/Table";
import { invoiceDataColumns } from "../data/invoiceList";
import { formatDate, formatDateForInput, PUBLIC_API_URI } from "../api/config";
import { showToast } from "../api/toast";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { FiPlus } from "react-icons/fi";
import { deleteMemberApplication, fetchAllActiveMembers, fetchMemberApplicationDetails, updateMemberApplicationDetails, updateMemberApplicationStatus, updateMemberProfilePicture } from "../api/memberWaiting";
import Breadcrumb from "../components/common/Breadcrumb";
import LocationSelector from "../components/common/LocationSelector";


const SingleApplication = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const [application, setApplication] = useState({});
    const [sponsorList, setSponsorList] = useState([]);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editApplication, setEditApplication] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const [memberList, setMemberList] = useState([]);
    console.log(id)
    // Fetch member details

    const getApplicationById = async (id) => {
        try {
            const application = await fetchMemberApplicationDetails(id);
            setApplication(application.data.application);
            setSponsorList(application.data.application.sponsoredBy);
            setEditApplication(application.data.application);
        } catch (error) {
            console.error("Failed to fetch member details:", error);
        }
    };

    useEffect(() => {

        getApplicationById(id);
    }, []);

    const { name, email, address, mobileNumber, profilePicture, status, address1,
        address2,
        city,
        state,
        country,
        pin,
        dateOfBirth,
        maritalStatus,
        marriageDate,
        title, applicationStatus } = application;
    console.log(profilePicture, "dfkk")


    // Handle profile picture change
    const handleProfilePictureChange = () => {
        document.getElementById("profile-picture-input").click();
    };

    // Handle file input change
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("profilePicture", file);

            try {
                const response = await updateMemberProfilePicture(id, formData);
                if (response.status === 200) {
                    setApplication((prev) => ({
                        ...prev,
                        profilePicture: response.data.profilePicture,
                    }));
                    showToast("Profile Image Update Successfully!", "success")
                }
            } catch (error) {
                console.error("Error updating profile picture:", error);
                showToast("Error updating profile Image", "error")

            }
        }
    };


    // Handle edit button click
    const handleEditClick = () => {
        setEditDialogOpen(true);
    };

    // Handle dialog close
    const handleDialogClose = () => {
        setEditDialogOpen(false);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditApplication({ ...editApplication, [name]: value });
    };

    const getSponsors = async () => {
        try {
            const sponsors = await fetchAllActiveMembers();
            console.log(sponsors.data?.users, "user")
            setMemberList(sponsors?.data.users);
        } catch (error) {
            console.error("Failed to fetch members:", error);
        }
    };

    useEffect(() => {

        getSponsors();
    }, [id

    ]);

    // Handle save changes
    const handleSaveChanges = async () => {
        try {
            // Call the update API with the edited member details
            const response = await updateMemberApplicationDetails(id, editApplication);
            if (response.status === 200) {
                // Update the local state with the new member details
                getApplicationById(id);
                setApplication(response.data.data);
                setEditApplication(response.data.data);
                setEditDialogOpen(false);
                showToast("Application details updated successfully!", "success");
            }
        } catch (error) {
            console.error("Failed to update member details:", error);
            showToast("Failed to update member details. Please try again.", "error");
        }
    };

    // Handle save changes
    const handleUpdateStatus = async (requestId, status) => {
        try {
            // Call the update API with the edited member details
            const formData = { requestId, status }
            const response = await updateMemberApplicationStatus(formData);
            if (response.status === 200) {
                // Update the local state with the new member details
                getApplicationById(id);
                showToast(response.data.message || "Application Status updated successfully!", "success");
            }
        } catch (error) {
            console.error("Failed to update member details:", error);
            showToast("Failed to update member details. Please try again.", "error");
        }
    };


    const handleConfirmDelete = async () => {
        const applicationId = selectedApplication._id;
        console.log(applicationId, "usersgshg")
        try {
            await deleteMemberApplication(applicationId);
            getApplicationById(id);
            // setMemberList(updatedList);
            showToast("Sponsor deleted successfully.", "success");
        } catch (error) {
            console.error("Failed to delete member:", error);
            showToast(error.message || "Failed to delete member.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedApplication(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedApplication(null);
    };

    const handleAddSponsor = (newValue) => {
        // Update the sponsoredBy array with the selected sponsors' _id
        const newSponsorsIds = newValue.map(sponsor => sponsor._id); // Get the IDs of the selected sponsors

        // Merge the new sponsors with the existing ones, ensuring no duplicates
        const updatedSponsors = [
            ...editApplication.sponsoredBy,  // Keep existing sponsors
            ...newSponsorsIds.filter(id => !editApplication.sponsoredBy.includes(id)),  // Only add new sponsors
        ];

        setEditApplication((prevState) => ({
            ...prevState,
            sponsoredBy: updatedSponsors, // Update the state with the merged sponsor list
        }));
    };

    const handleRemoveSponsor = (sponsorId) => {
        // Remove the sponsor by their _id
        console.log(sponsorId, "sponsorId")
        setEditApplication((prevState) => ({
            ...prevState,
            sponsoredBy: prevState.sponsoredBy.filter(id => id._id !== sponsorId), // Remove the sponsor ID from the list
        }));
    };





    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "14px",
                }}
            >
                <Typography variant="h5" sx={{ mb: 3 }}>
                    Application Details
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={8}>
                    <Paper sx={{ boxShadow: 3, borderRadius: "12px", p: "20px", textAlign: "center" }}>
                        <Box sx={{ position: "relative", display: "inline-block" }}>
                            <Avatar
                                src={profilePicture ? `${PUBLIC_API_URI}${profilePicture}` : ""}
                                sx={{ width: "80px", height: "80px", mx: "auto" }}
                            />
                            <IconButton
                                sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    backgroundColor: "white",
                                    boxShadow: 1,
                                }}
                                onClick={handleProfilePictureChange}
                            >
                                <EditIcon />
                            </IconButton>
                        </Box>
                        <input
                            type="file"
                            accept="image/*"
                            id="profile-picture-input"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <Typography variant="h6">{name || "N/A"}</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Application ID: {application?.applicationId || "N/A"}
                        </Typography>
                        <Box>
                            <TableRow>
                                <TableCell><Typography variant="subtitle2">Application Status:</Typography></TableCell>
                                <TableCell><Typography variant="body2">{applicationStatus || "N/A"}</Typography></TableCell>
                            </TableRow>
                            {application.applicationStatus === "Pending" ? (
                                <Box sx={{ marginTop: "5px" }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        sx={{ borderRadius: "20px" }}
                                        // Use an anonymous function to call handleUpdateStatus on click
                                        onClick={() => handleUpdateStatus(application._id, "Approved")}
                                    >
                                        Approved
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={{ borderRadius: "20px" }}
                                        // Use an anonymous function to call handleUpdateStatus on click
                                        onClick={() => handleUpdateStatus(application._id, "Rejected")}
                                    >
                                        Reject
                                    </Button>
                                </Box>
                            ) : null}
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <TableData>
                                <TableBody>
                                    <TableRow>
                                        <TableCell><Typography variant="subtitle2">Title:</Typography></TableCell>
                                        <TableCell><Typography variant="body2">{title || "N/A"}</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Typography variant="subtitle2">Email:</Typography></TableCell>
                                        <TableCell><Typography variant="body2">{email || "N/A"}</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Typography variant="subtitle2">Phone:</Typography></TableCell>
                                        <TableCell><Typography variant="body2">{mobileNumber || "N/A"}</Typography></TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell><Typography variant="subtitle2">Address:</Typography></TableCell>
                                        <TableCell><Typography variant="body2">{address || "N/A"}</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Typography variant="subtitle2">Address Line 1:</Typography></TableCell>
                                        <TableCell><Typography variant="body2">{address1 || "N/A"}</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Typography variant="subtitle2">Address Line 2:</Typography></TableCell>
                                        <TableCell><Typography variant="body2">{address2 || "N/A"}</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Typography variant="subtitle2">City:</Typography></TableCell>
                                        <TableCell><Typography variant="body2">{city || "N/A"}</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Typography variant="subtitle2">State:</Typography></TableCell>
                                        <TableCell><Typography variant="body2">{state || "N/A"}</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Typography variant="subtitle2">Country:</Typography></TableCell>
                                        <TableCell><Typography variant="body2">{country || "N/A"}</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Typography variant="subtitle2">Pin Code:</Typography></TableCell>
                                        <TableCell><Typography variant="body2">{pin || "N/A"}</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Typography variant="subtitle2">Date of Birth:</Typography></TableCell>
                                        <TableCell><Typography variant="body2">{formatDate(dateOfBirth)}</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Typography variant="subtitle2">Marital Status:</Typography></TableCell>
                                        <TableCell><Typography variant="body2">{maritalStatus || "N/A"}</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Typography variant="subtitle2">Marriage Date:</Typography></TableCell>
                                        <TableCell><Typography variant="body2">{formatDate(marriageDate)}</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Typography variant="subtitle2">Sponsored By:</Typography></TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                <ol>
                                                    {sponsorList.map((data, index) => (
                                                        <li key={index}>{`${data.name} (${data.memberId})`} </li>
                                                    ))}
                                                </ol>
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Typography variant="subtitle2">Status:</Typography></TableCell>
                                        <TableCell><Typography variant="body2">{status || "N/A"}</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                    </TableRow>
                                </TableBody>
                            </TableData>
                        </Box>

                        <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleEditClick}>
                            Edit Member
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Edit Member Application Details</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Title"
                        select
                        fullWidth
                        name="title"
                        value={editApplication.title || ""}
                        onChange={handleInputChange}
                    >
                        <MenuItem value="Mr.">Mr.</MenuItem>
                        <MenuItem value="Mrs.">Mrs.</MenuItem>
                        <MenuItem value="Ms.">Ms.</MenuItem>
                        <MenuItem value="Dr.">Dr.</MenuItem>
                    </TextField>
                    <TextField
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        name="name"
                        value={editApplication.name || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        name="email"
                        value={editApplication.email || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Phone Number"
                        type="text"
                        fullWidth
                        name="mobileNumber"
                        value={editApplication.mobileNumber || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Address"
                        type="text"
                        fullWidth
                        name="address"
                        value={editApplication.address || ""}
                        onChange={handleInputChange}
                    />
                    {/* <TextField
                        margin="dense"
                        label="Age"
                        type="number"
                        fullWidth
                        name="age"
                        value={editApplication.age || ""}
                        onChange={handleInputChange}
                    /> */}
                    <TextField
                        margin="dense"
                        label="Address Line 1"
                        type="text"
                        fullWidth
                        name="address1"
                        value={editApplication.address1 || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Address Line 2"
                        type="text"
                        fullWidth
                        name="address2"
                        value={editApplication.address2 || ""}
                        onChange={handleInputChange}
                    />
                    {/* <TextField
                        margin="dense"
                        label="City"
                        type="text"
                        fullWidth
                        name="city"
                        value={editApplication.city || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="State"
                        type="text"
                        fullWidth
                        name="state"
                        value={editApplication.state || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Country"
                        type="text"
                        fullWidth
                        name="country"
                        value={editApplication.country || ""}
                        onChange={handleInputChange}
                    /> */}
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Location
                        </Typography>
                        <LocationSelector
                            onLocationChange={(location) => {
                                setEditApplication({
                                    ...editApplication,
                                    state: location.state,
                                    city: location.city,
                                    country: location.country, // Optional if country is editable
                                });
                            }}
                            defaultLocation={{
                                country: editApplication.country || "India", // Pre-fill country
                                state: editApplication.state || "", // Pre-fill state if available
                                city: editApplication.city || "", // Pre-fill city if available
                            }}
                        />
                    </Box>
                    <TextField
                        margin="dense"
                        label="Pin Code"
                        type="text"
                        fullWidth
                        name="pin"
                        value={editApplication.pin || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Date of Birth"
                        type="date"
                        fullWidth
                        name="dateOfBirth"
                        // value={editMember.dateOfBirth || ""}
                        value={formatDateForInput(editApplication.dateOfBirth)} // Ensure proper format
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        margin="dense"
                        label="Marital Status"
                        select
                        fullWidth
                        name="maritalStatus"
                        value={editApplication.maritalStatus || ""}
                        onChange={handleInputChange}
                    >
                        <MenuItem value="Single">Single</MenuItem>
                        <MenuItem value="Married">Married</MenuItem>
                        <MenuItem value="Divorced">Divorced</MenuItem>
                        <MenuItem value="Widowed">Widowed</MenuItem>
                    </TextField>
                    <TextField
                        margin="dense"
                        label="Marriage Date"
                        type="date"
                        fullWidth
                        name="marriageDate"
                        value={editApplication.marriageDate || ""}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    {/* <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Sponsors</InputLabel>
                    <FormControl fullWidth margin="dense">
                        <Autocomplete
                            multiple
                            value={editApplication.sponsoredBy.map(_id =>
                                memberList.find(member => member._id === _id) // Find sponsor objects from memberList
                            ).filter(Boolean)} // Remove undefined values (in case there are IDs without matching members)
                            onChange={(event, newValue) => handleAddSponsor(newValue)} // Handle sponsor addition/removal
                            options={memberList}  // Ensure memberList is loaded with possible sponsors
                            getOptionLabel={(option) => `${option.name} (${option.memberId})`} // Show the name and memberId
                            renderInput={(params) => <TextField {...params} label="Select Sponsors" />}
                            isOptionEqualToValue={(option, value) => option._id === value._id} // Compare using _id
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox checked={selected} />
                                    {`${option.name} (${option.memberId})`}
                                </li>
                            )}
                            filterOptions={(options, state) => {
                                return options.filter(option =>
                                    option.name.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                                    option.memberId.includes(state.inputValue)
                                );
                            }}
                        />
                    </FormControl>

                    <div>
                      
                        {editApplication.sponsoredBy.map(sponsorId => {
                            const sponsor = memberList.find(member => member._id === sponsorId); // Find sponsor object
                            if (!sponsor) return null; // Skip if the sponsor object is not found
                            return (
                                <Chip
                                    key={sponsor._id}
                                    label={`${sponsor.name} (${sponsor.memberId})`}
                                    onDelete={() => handleRemoveSponsor(sponsor._id)} // Handle sponsor removal
                                    color="primary"
                                />
                            );
                        })}
                    </div> */}

                    {/* <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Sponsors</InputLabel>
                    <FormControl fullWidth margin="dense">
                        <Autocomplete
                            multiple
                            value={editApplication.sponsoredBy
                                ? editApplication.sponsoredBy
                                    .map(_id => memberList.find(member => member._id === _id)) // Map IDs to sponsor objects
                                    .filter(Boolean) // Remove undefined values (in case an ID doesn't match any member)
                                : []} // Fallback to empty array if sponsoredBy is undefined
                            onChange={(event, newValue) => handleAddSponsor(newValue)} // Handle sponsor addition/removal
                            options={memberList}  // Ensure memberList is loaded with possible sponsors
                            getOptionLabel={(option) => `${option.name} (${option.memberId})`} // Show the name and memberId
                            renderInput={(params) => <TextField {...params} label="Select Sponsors" />}
                            isOptionEqualToValue={(option, value) => option._id === value._id} // Compare using _id
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox checked={selected} />
                                    {`${option.name} (${option.memberId})`}
                                </li>
                            )}
                            filterOptions={(options, state) => {
                                // Allow searching by name or memberId
                                return options.filter(option =>
                                    option.name.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                                    option.memberId.includes(state.inputValue)
                                );
                            }}
                        />
                    </FormControl>

                    <div>
                        
                        {editApplication.sponsoredBy && editApplication.sponsoredBy.length > 0 &&
                            editApplication.sponsoredBy.map(sponsorId => {
                                const sponsor = memberList.find(member => member._id === sponsorId); // Find sponsor object
                                if (!sponsor) return null; // Skip if the sponsor object is not found
                                return (
                                    <Chip
                                        key={sponsor._id}
                                        label={`${sponsor.name} (${sponsor.memberId})`}
                                        onDelete={() => handleRemoveSponsor(sponsor._id)} // Handle sponsor removal
                                        color="primary"
                                    />
                                );
                            })
                        }
                    </div> */}

                    {/* <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Sponsors</InputLabel>
                    <FormControl fullWidth margin="dense">
                        <Autocomplete
                            multiple
                            value={editApplication.sponsoredBy ? editApplication.sponsoredBy.map(_id =>
                                memberList.find(member => member._id === _id) // Find the sponsor object using _id
                            ).filter(Boolean) : []} // Remove any undefined values in case some _id does not match
                            onChange={(event, newValue) => handleAddSponsor(newValue)} // Handle sponsor addition/removal
                            options={memberList}  // List of all possible members (to select from)
                            getOptionLabel={(option) => `${option.name} (${option.memberId})`} // Display name and memberId
                            isOptionEqualToValue={(option, value) => option._id === value._id} // Compare by _id
                            renderInput={(params) => <TextField {...params} label="Select Sponsors" />}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox checked={selected} />
                                    {`${option.name} (${option.memberId})`}
                                </li>
                            )}
                            filterOptions={(options, state) => {
                                // Filter options by name or memberId
                                return options.filter(option =>
                                    option.name.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                                    option.memberId.includes(state.inputValue)
                                );
                            }}
                        />
                    </FormControl> */}

                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Sponsors</InputLabel>
                    <FormControl fullWidth margin="dense">
                        <Autocomplete
                            multiple
                            value={editApplication.sponsoredBy ? editApplication.sponsoredBy.map(_id =>
                                memberList.find(member => member._id === _id) // Find sponsor objects from memberList based on _id
                            ).filter(Boolean) : []} // Remove undefined if no matching sponsor found
                            onChange={(event, newValue) => handleAddSponsor(newValue)} // Handle adding/removing sponsors
                            options={memberList}  // All available members to select from
                            getOptionLabel={(option) => `${option.name} (${option.memberId})`} // Show name and memberId
                            isOptionEqualToValue={(option, value) => option._id === value._id} // Ensure the correct sponsor is selected
                            renderInput={(params) => <TextField {...params} label="Select Sponsors" />}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox checked={selected} />
                                    {`${option.name} (${option.memberId})`}
                                </li>
                            )}
                            filterOptions={(options, state) => {
                                // Filter options by name or memberId for searching
                                return options.filter(option =>
                                    option.name.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                                    option.memberId.includes(state.inputValue)
                                );
                            }}
                        />
                    </FormControl>

                    {/* Render existing sponsors as chips, with the ability to remove */}
                    <div>
                        {editApplication.sponsoredBy && editApplication.sponsoredBy.map(_id => {
                            // console.log(_id._id,"fgfgfgfg")
                            const sponsor = memberList.find(member => member._id === _id._id); // Find the sponsor object by _id
                            return sponsor ? (
                                <Chip
                                    key={sponsor._id}
                                    label={`${sponsor.name} (${sponsor.memberId})`}
                                    onDelete={() => handleRemoveSponsor(sponsor._id)} // Handle sponsor removal
                                    color="primary"
                                />
                            ) : null;
                        })}
                    </div>




                    <TextField label="Status" select fullWidth margin="dense" name="status" value={editApplication.status || ""} onChange={handleInputChange}>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>
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

            <ConfirmationDialog
                open={openDialog}
                title="Delete Member"
                message={`Are you sure you want to delete sponsor ${selectedApplication?.name}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default SingleApplication;