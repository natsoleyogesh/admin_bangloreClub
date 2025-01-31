import { Avatar, Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import { customers, customersColumns } from "../data/customers";
import { deleteMember, fetchAllMembers } from "../api/member";
import { formatDateTime, PUBLIC_API_URI } from "../api/config";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { showToast } from "../api/toast";
import { FiPlus } from "react-icons/fi";

const Customers = ({ uploadData }) => {

  console.log(uploadData, "upload")
  const navigate = useNavigate();

  const [memberList, setmemberList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(null)
  const customersColumns = [
    {
      accessorKey: "profilePicture", //access nested data with dot notation
      header: "Image",
      size: 100,
      Cell: ({ cell }) => (
        <div>
          <Avatar src={`${PUBLIC_API_URI}${cell.getValue()}`} sx={{ width: 30, height: 30 }} />
        </div>
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
    },
    {
      accessorKey: "mobileNumber",
      header: "Phone Number",
    },
    {
      accessorKey: "relation",
      header: "Relation ship",
      Cell: ({ cell }) => cell.getValue() || "N/A",
    },
    {
      accessorKey: "address", //normal accessorKey
      header: "Address",
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
      accessorKey: "createdAt",
      header: "Created Date & Time",
      Cell: ({ cell }) => formatDateTime(cell.getValue()),
    },

  ];

  const getMembers = async () => {
    setLoading(true)
    try {
      const users = await fetchAllMembers();
      console.log(users.users, "user")
      setmemberList(users?.users);
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch members:", error);
      setLoading(false)
    }
  };

  useEffect(() => {

    getMembers();
  }, []);

  console.log(memberList, "member")

  const handleDeleteClick = (member) => {
    setSelectedMember(member);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    const userId = selectedMember._id;
    console.log(userId, "usersgshg")
    try {
      await deleteMember(userId);
      getMembers()
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

  // Handle navigation to "Add Member" page
  const handleAddMember = () => {
    navigate("/member/add");
  };



  return (
    <Box sx={{ pt: "80px", pb: "20px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
        }}
      >
        <Typography variant="h6">
          Primary Members
        </Typography>
        {!uploadData && <Link to="/member/add" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FiPlus />}
            sx={{ borderRadius: "20px" }}
          >
            Add Member
          </Button>
        </Link>}
      </Box>

      <Table
        data={memberList}
        fields={customersColumns}
        numberOfRows={memberList.length}
        enableTopToolBar={true}
        enableBottomToolBar={true}
        enablePagination={true}
        enableRowSelection={true}
        enableColumnFilters={true}
        enableEditing={true}
        enableColumnDragging={true}
        showPreview
        routeLink="members"
        handleDelete={handleDeleteClick}
        isLoading={loading}
      />
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

export default Customers;
