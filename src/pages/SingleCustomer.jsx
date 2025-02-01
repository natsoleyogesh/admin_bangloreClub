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
  Table as TableData,
  InputLabel,
  FormControlLabel,
  Switch,
  Divider
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteMember, deleteProofs, fetchMemberDetails, updateMemberDetails, updateProfilePicture, uploadProofsImages } from "../api/member";
import Table from "../components/Table";
import { invoiceDataColumns } from "../data/invoiceList";
import { formatDate, formatDateForInput, formatDateTime, PUBLIC_API_URI } from "../api/config";
import { showToast } from "../api/toast";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { FiEye, FiPlus, FiTrash } from "react-icons/fi";
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
    accessorKey: "relation",
    header: "Relation ship",
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
    accessorKey: "creditStop", // Exclusive Offer Column
    header: "Credit Stop",
    Cell: ({ cell }) => {
      const value = cell.getValue();
      return (
        <Typography
          variant="body2"
          sx={{
            color: value ? "green" : "inherit",
            fontWeight: value ? "bold" : "normal",
          }}
        >
          {value ? "YES" : "NO"}
        </Typography>
      );
    },
  },
  {
    accessorKey: "creditLimit",
    header: "Credit Limit",
    Cell: ({ cell }) => cell.getValue() || 0,
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
  const imageInput = useRef(null);
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
    relation,
    uploadProofs,
    vehicleModel,
    vehicleNumber,
    drivingLicenceNumber,
    creditStop,
    creditLimit,
    qrCodeId,
    cardId,
    qrCode,
    title, activatedDate } = member;
  console.log(member, "dfkk")


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

  const handleToggleChange = (event) => {
    setEditMember({ ...editMember, creditStop: event.target.checked }); // Toggles between true (Yes) and false (No)
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      console.log(editMember, "editmem")
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
      showToast(error.response.data.message || "Failed to update member details. Please try again.", "error");
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


  const handleDeleteImage = async (index) => {
    try {
      await deleteProofs(id, index);
      getMemberById(id);
      showToast("Image deleted successfully.", "success");
    } catch (error) {
      showToast("Failed to delete image.", "error");
    }
  };

  const handleUploadProofImage = async (event) => {
    const files = Array.from(event.target.files); // Convert FileList to an array
    const maxSize = 20 * 1024 * 1024 // 20 mb in bytes

    if (!files || files.length === 0) {
      showToast("No files selected.", "error");
      return;
    }

    const validFiles = [];
    const invalidFiles = [];

    // Validate file sizes
    files.forEach((file) => {
      if (file.size <= maxSize) {
        validFiles.push(file); // Add valid files to the array
      } else {
        invalidFiles.push(file.name); // Collect names of invalid files
      }
    });

    // Show a toast for invalid files, if any
    if (invalidFiles.length > 0) {
      showToast(
        `The following files exceed 100KB and were not added: ${invalidFiles.join(", ")}`,
        "error"
      );
    }

    // If no valid files, stop the upload process
    if (validFiles.length === 0) {
      showToast("No valid files to upload.", "error");
      return;
    }

    // Create FormData and append valid files
    const formData = new FormData();
    validFiles.forEach((file) => formData.append("proofs", file));

    try {
      const response = await uploadProofsImages(id, formData);
      if (response.status === 200) {
        // Refresh data and show success message
        getMemberById(id);
        showToast("Images uploaded successfully.", "success");
      } else {
        showToast("Failed to upload images.", "error");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      showToast(error.response.data.message || "Failed to upload images. Please try again.", "error");
    }
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
        {relation === "Primary" && (<Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          sx={{ borderRadius: "20px" }}
          onClick={handleAddFamilyMember}
        >
          Add Family Member
        </Button>)}
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
            <Typography variant="h6">{title} {name || "N/A"}</Typography>
            <Typography variant="body2" color="textSecondary">
              Member ID: {memberId || "N/A"}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <TableData>
                <TableBody>
                  <TableRow>
                    <TableCell><Typography variant="subtitle2">Relation ship:</Typography></TableCell>
                    <TableCell><Typography variant="body2">{relation || "N/A"}</Typography></TableCell>
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
                  <TableRow>
                    <TableCell><Typography variant="subtitle2">Vehicle Model:</Typography></TableCell>
                    <TableCell><Typography variant="body2">{vehicleModel || "N/A"}</Typography></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><Typography variant="subtitle2">Vehicle Number:</Typography></TableCell>
                    <TableCell><Typography variant="body2">{vehicleNumber || "N/A"}</Typography></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><Typography variant="subtitle2">Driving Licence Number:</Typography></TableCell>
                    <TableCell><Typography variant="body2">{drivingLicenceNumber || "N/A"}</Typography></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><Typography variant="subtitle2">Credit Stop:</Typography></TableCell>
                    <TableCell><Typography variant="body2">{creditStop ? "Yes" : "No"}</Typography></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><Typography variant="subtitle2">Credit Limit:</Typography></TableCell>
                    <TableCell><Typography variant="body2">{creditLimit || 0}</Typography></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><Typography variant="subtitle2">QR Code ID:</Typography></TableCell>
                    <TableCell><Typography variant="body2">{qrCodeId || "N/A"}</Typography></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><Typography variant="subtitle2">Card ID:</Typography></TableCell>
                    <TableCell><Typography variant="body2">{cardId || "N/A"}</Typography></TableCell>
                  </TableRow>
                  <Divider />
                  <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>QR Code Image</InputLabel>
                  <Box sx={{ position: "relative" }} mb={2}>
                    <img src={`${qrCode}`} alt="qrCode" height={180} width={180} />
                    {/* Uncomment this if you want to enable the delete functionality */}
                    {/* <IconButton onClick={() => handleDeleteImage(index)}>
                      <FiTrash />
                    </IconButton> */}
                  </Box>
                  <Box mb={2}>
                    <Divider />
                  </Box>


                  {/* <Box sx={{ position: "relative", display: "inline-block" }}>
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
                  </Box> */}
                  <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Proof Image</InputLabel>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {uploadProofs && uploadProofs.length > 0 && (
                      uploadProofs.map((image, index) => (
                        <Box key={index} sx={{ position: "relative" }}>
                          <img src={`${PUBLIC_API_URI}${image}`} alt="Proof" height={120} width={120} />
                          {/* Uncomment this if you want to enable the delete functionality */}
                          <IconButton onClick={() => handleDeleteImage(index)}>
                            <FiTrash />
                          </IconButton>
                        </Box>
                      ))
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {/* Hidden file input */}
                      <input
                        type="file"
                        hidden
                        ref={imageInput}
                        multiple
                        accept="image/*"
                        onChange={handleUploadProofImage}
                      />

                      {/* Upload button */}
                      <Button
                        variant="outlined"
                        component="label"
                        onClick={() => imageInput.current.click()}
                      >
                        Upload New Proof Images
                      </Button>

                      {/* Small message */}
                      <Typography variant="caption" color="textSecondary">
                        Only 3 files are allowed, and each must be less than 20 MB.
                      </Typography>
                    </div>
                  </Box>

                </TableBody>
              </TableData>
            </Box>

            <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleEditClick}>
              Edit Member
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          {relation === "Primary" && (
            <><Typography variant="h6">Dependent List</Typography>
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
                showPreview
                routeLink="members"
                handleDelete={handleDeleteClick}
              />
            </>
          )}
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
                startIcon={<FiEye />}
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
                startIcon={<FiEye />}
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
            <MenuItem value="Dr.(Mrs)">Dr.(Mrs)</MenuItem>
            <MenuItem value="Dr.(Mr)">Dr.(Mr)</MenuItem>
            <MenuItem value="Dr.(Ms)">Dr.(Ms)</MenuItem>
            <MenuItem value="M/S.">M/S.</MenuItem>
            <MenuItem value="Lt.Col.">Lt.Col.</MenuItem>
            <MenuItem value="Gp.Capt.">Gp.Capt.</MenuItem>
            <MenuItem value="Prof.">Prof.</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="MemberShip ID"
            type="text"
            fullWidth
            name="memberId"
            value={editMember.memberId || ""}
            onChange={handleInputChange}
            disabled={relation !== "Primary"}
          />
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

          {editMember.relation !== "Primary" && <TextField
            margin="dense"
            label="Relation ship"
            select
            fullWidth
            name="relation"
            value={editMember.relation || ""}
            onChange={handleInputChange}
          >
            <MenuItem value="Spouse">Spouse</MenuItem>
            {/* <MenuItem value="Daughter">Daughter</MenuItem> */}
            <MenuItem value="Child">Child</MenuItem>
            <MenuItem value="Dependent">Dependent</MenuItem>
            <MenuItem value="Senior Dependent">Senior Dependent</MenuItem>
          </TextField>}

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
          <TextField
            margin="dense"
            label="Driving Licence Number"
            type="text"
            fullWidth
            name="drivingLicenceNumber"
            value={editMember.drivingLicenceNumber || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Vehicle Model"
            type="text"
            fullWidth
            name="vehicleModel"
            value={editMember.vehicleModel || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Vehicle Number"
            type="text"
            fullWidth
            name="vehicleNumber"
            value={editMember.vehicleNumber || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Credit Limit"
            type="number"
            fullWidth
            name="creditLimit"
            value={editMember.creditLimit}
            onChange={handleInputChange}
            inputProps={{ min: 0 }} // Prevent negative values when using number input
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography>{editMember.creditStop ? "Yes" : "No"}</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={editMember.creditStop}
                  onChange={handleToggleChange}
                />
              }
              label="Credit Stop"
            />
          </Box>

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

