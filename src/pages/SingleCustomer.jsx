// All imports must be declared at the top
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
  Table as TableData
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteMember, fetchMemberDetails, updateMemberDetails, updateProfilePicture } from "../api/member";
import Table from "../components/Table";
import { invoiceDataColumns } from "../data/invoiceList";
import { formatDate, formatDateForInput, formatDateTime, PUBLIC_API_URI } from "../api/config";
import { showToast } from "../api/toast";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { FiPlus } from "react-icons/fi";
import LocationSelector from "../components/common/LocationSelector";
import Breadcrumb from "../components/common/Breadcrumb";

const memberDataColumns = [
  {
    accessorKey: "profilePicture",
    header: "Profile Picture",
    Cell: ({ cell }) => (
      cell.getValue() ? (
        <img
          src={`${PUBLIC_API_URI}${cell.getValue()}`}
          alt="Profile"
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
      ) : (
        "N/A"
      )
    ),
  },
  {
    accessorKey: "memberId",
    header: "Member Id",
  },
  {
    accessorKey: "name", //access nested data with dot notation
    header: "Member Name",
  },
  {
    accessorKey: "email",
    header: "Email",
    Cell: ({ cell }) => cell.getValue() || "N/A",
  },
  {
    accessorKey: "mobileNumber",
    header: "Phone Number",
    Cell: ({ cell }) => cell.getValue() || "N/A",
  },
  {
    accessorKey: "address", //normal accessorKey
    header: "Address",
    Cell: ({ cell }) => cell.getValue() || "N/A",
  },
  {
    accessorKey: "city",
    header: "City",
    Cell: ({ cell }) => cell.getValue() || "N/A",
  },
  {
    accessorKey: "state",
    header: "State",
    Cell: ({ cell }) => cell.getValue() || "N/A",
  },
  {
    accessorKey: "country",
    header: "Country",
    Cell: ({ cell }) => cell.getValue() || "N/A",
  },
  {
    accessorKey: "pin",
    header: "Pin Code",
    Cell: ({ cell }) => cell.getValue() || "N/A",
  },
  {
    accessorKey: "dateOfBirth",
    header: "Date of Birth",
    Cell: ({ cell }) => {
      const value = cell.getValue();
      return value ? formatDateTime(cell.getValue()) : "N/A";
    },
  },
  {
    accessorKey: "maritalStatus",
    header: "Marital Status",
    Cell: ({ cell }) => cell.getValue() || "N/A",
  },
  {
    accessorKey: "marriageDate",
    header: "Marriage Date",
    Cell: ({ cell }) => {
      const value = cell.getValue();
      return value ? formatDateTime(cell.getValue()) : "N/A";
    },
  },
  {
    accessorKey: "activatedDate",
    header: "Activated Date",
    Cell: ({ cell }) => {
      const value = cell.getValue();
      return value ? formatDateTime(cell.getValue()) : "N/A";
    },
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    Cell: ({ cell }) => {
      const value = cell.getValue();
      return value ? formatDateTime(cell.getValue()) : "N/A";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Create Date",
    Cell: ({ cell }) => {
      const value = cell.getValue();
      return value ? formatDateTime(cell.getValue()) : "N/A";
    },
  },
];



const SingleProduct = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [member, setMember] = useState({});
  const [memberList, setmemberList] = useState([]);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editMember, setEditMember] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  console.log(id)
  // Fetch member details

  const getMemberById = async (id) => {
    try {
      const user = await fetchMemberDetails(id);
      setMember(user.user);
      setmemberList(user.user.familyMembers);
      setEditMember(user.user);
    } catch (error) {
      console.error("Failed to fetch member details:", error);
    }
  };

  useEffect(() => {

    getMemberById(id);
  }, [id]);


  console.log(member, memberList, "memberList")
  const { _id, memberId, name, email, address, mobileNumber, familyMembers, profilePicture, status, address1,
    address2,
    city,
    state,
    country,
    pin,
    dateOfBirth,
    maritalStatus,
    marriageDate,
    title, activatedDate } = member;
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
        const response = await updateProfilePicture(id, formData);
        if (response.status === 200 && response.data.profilePicture) {
          setMember((prev) => ({
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
    setEditMember({ ...editMember, [name]: value });
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      // Call the update API with the edited member details
      const response = await updateMemberDetails(id, editMember);
      if (response.status === 200 && response.data.user) {
        // Update the local state with the new member details
        setMember(response.data.user);
        setEditMember(response.data.user);
        setEditDialogOpen(false);
        showToast("Member details updated successfully!", "success");
      }
    } catch (error) {
      console.error("Failed to update member details:", error);
      showToast("Failed to update member details. Please try again.", "error");
    }
  };

  const handleDeleteClick = (member) => {
    setSelectedMember(member);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    const userId = selectedMember._id;
    console.log(userId, "usersgshg")
    try {
      await deleteMember(userId);
      getMemberById(id);
      const updatedList = memberList.filter((item) => item.userId !== userId);
      // setMemberList(updatedList);
      showToast("Member deleted successfully.", "success");
    } catch (error) {
      console.error("Failed to delete member:", error);
      showToast(error.message || "Failed to delete member.", "error");
    } finally {
      setOpenDialog(false);
      setSelectedMember(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedMember(null);
  };


  // Handle navigation to "Add Family Member" page
  const handleAddFamilyMember = () => {
    navigate(`/member/${id}/add-family-member`);
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
          Member Details
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          sx={{ borderRadius: "20px" }}
          onClick={handleAddFamilyMember}
        >
          Add Family Member
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ boxShadow: 3, borderRadius: "12px", p: "20px", textAlign: "center" }}>
            {/* <Avatar sx={{ width: "80px", height: "80px", mx: "auto", mb: 2 }} /> */}
            {/* <Avatar
              src={profilePicture ? `${PUBLIC_API_URI}${profilePicture}` : ''}
              sx={{ width: "80px", height: "80px", mx: "auto" }}
            /> */}
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
              Member ID: {memberId || "N/A"}
            </Typography>

            {/* <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Title: <span style={{ opacity: 0.7 }}>{title || "N/A"}</span></Typography>
              <Typography variant="subtitle2">Email: <span style={{ opacity: 0.7 }}>{email || "N/A"}</span></Typography>
              <Typography variant="subtitle2">Phone: <span style={{ opacity: 0.7 }}>{mobileNumber || "N/A"}</span></Typography>
              <Typography variant="subtitle2">Address: <span style={{ opacity: 0.7 }}>{address || "N/A"}</span></Typography>
              <Typography variant="subtitle2">Address Line 1: <span style={{ opacity: 0.7 }}>{address1 || "N/A"}</span></Typography>
              <Typography variant="subtitle2">Address Line 2: <span style={{ opacity: 0.7 }}>{address2 || "N/A"}</span></Typography>
              <Typography variant="subtitle2">City: <span style={{ opacity: 0.7 }}>{city || "N/A"}</span></Typography>
              <Typography variant="subtitle2">State: <span style={{ opacity: 0.7 }}>{state || "N/A"}</span></Typography>
              <Typography variant="subtitle2">Country: <span style={{ opacity: 0.7 }}>{country || "N/A"}</span></Typography>
              <Typography variant="subtitle2">Pin Code: <span style={{ opacity: 0.7 }}>{pin || "N/A"}</span></Typography>
              <Typography variant="subtitle2">Date of Birth: <span style={{ opacity: 0.7 }}>{formatDate(dateOfBirth)}</span></Typography>
              <Typography variant="subtitle2">Marital Status: <span style={{ opacity: 0.7 }}>{maritalStatus || "N/A"}</span></Typography>
              <Typography variant="subtitle2">Marriage Date: <span style={{ opacity: 0.7 }}>{formatDate(marriageDate)}</span></Typography>
              <Typography variant="subtitle2">Status: <span style={{ opacity: 0.7 }}>{status || "N/A"}</span></Typography>
              <Typography variant="subtitle2">Membership Activated Date: <span style={{ opacity: 0.7 }}>{formatDate(activatedDate)}</span></Typography>

            </Box> */}
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
                    <TableCell><Typography variant="subtitle2">Status:</Typography></TableCell>
                    <TableCell><Typography variant="body2">{status || "N/A"}</Typography></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><Typography variant="subtitle2">Membership Activated Date:</Typography></TableCell>
                    <TableCell><Typography variant="body2">{formatDate(activatedDate)}</Typography></TableCell>
                  </TableRow>
                </TableBody>
              </TableData>
            </Box>

            <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleEditClick}>
              Edit Member
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <Typography variant="h6">Member List</Typography>
          <Table
            data={memberList}
            fields={memberDataColumns}
            numberOfRows={memberList?.length || 0}
            enableTopToolBar={false}
            enableBottomToolBar={false}
            enablePagination={false}
            enableRowSelection={false}
            enableColumnFilters={false}
            enableEditing={true}
            enableColumnDragging={false}
            // showPreview
            routeLink="customers"
            handleDelete={handleDeleteClick}
          />
          {/* Action Buttons */}
          <Grid
            item
            xs={12}
            md={6}
            display="flex"
            justifyContent="flex-start"
            flexWrap="wrap"
            gap={2}
          >
            {/* Link to All Invoices */}
            <Link to={`/billings/${_id}`} style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FiPlus />}
                sx={{
                  borderRadius: "20px",
                  textTransform: "capitalize",
                  padding: "10px 20px",
                }}
              >
                All Invoices of {name}
              </Button>
            </Link>

            {/* Link to All Transactions */}
            <Link to={`/transactions/${_id}`} style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<FiPlus />}
                sx={{
                  borderRadius: "20px",
                  textTransform: "capitalize",
                  padding: "10px 10px",
                }}
              >
                All Transactions of {name}
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Member Details</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            select
            fullWidth
            name="title"
            value={editMember.title || ""}
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
            value={editMember.name || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            name="email"
            value={editMember.email || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            type="text"
            fullWidth
            name="mobileNumber"
            value={editMember.mobileNumber || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            name="address"
            value={editMember.address || ""}
            onChange={handleInputChange}
          />
          {/* <TextField
            margin="dense"
            label="Age"
            type="number"
            fullWidth
            name="age"
            value={editMember.age || ""}
            onChange={handleInputChange}
          /> */}
          <TextField
            margin="dense"
            label="Address Line 1"
            type="text"
            fullWidth
            name="address1"
            value={editMember.address1 || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Address Line 2"
            type="text"
            fullWidth
            name="address2"
            value={editMember.address2 || ""}
            onChange={handleInputChange}
          />
          {/* <TextField
            margin="dense"
            label="City"
            type="text"
            fullWidth
            name="city"
            value={editMember.city || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="State"
            type="text"
            fullWidth
            name="state"
            value={editMember.state || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Country"
            type="text"
            fullWidth
            name="country"
            value={editMember.country || ""}
            onChange={handleInputChange}
          /> */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Location
            </Typography>
            <LocationSelector
              onLocationChange={(location) => {
                setEditMember({
                  ...editMember,
                  state: location.state,
                  city: location.city,
                  country: location.country, // Optional if country is editable
                });
              }}
              defaultLocation={{
                country: editMember.country || "India", // Pre-fill country
                state: editMember.state || "Madhya Pradesh", // Pre-fill state if available
                city: editMember.city || "", // Pre-fill city if available
              }}
            />
          </Box>
          <TextField
            margin="dense"
            label="Pin Code"
            type="text"
            fullWidth
            name="pin"
            value={editMember.pin || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Date of Birth"
            type="date"
            fullWidth
            name="dateOfBirth"
            // value={editMember.dateOfBirth || ""}
            value={formatDateForInput(editMember.dateOfBirth)} // Ensure proper format
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Marital Status"
            select
            fullWidth
            name="maritalStatus"
            value={editMember.maritalStatus || ""}
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
            value={editMember.marriageDate || ""}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />

          <TextField label="Status" select fullWidth margin="dense" name="status" value={editMember.status || ""} onChange={handleInputChange}>
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
        message={`Are you sure you want to delete member ${selectedMember?.name}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
        loadingText="Deleting..."
      />
    </Box>
  );
};

export default SingleProduct;

