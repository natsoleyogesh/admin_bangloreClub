// import { Avatar, Box, Button, Typography } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import Table from "../components/Table";
// import { deleteMember, fetchAllMembers } from "../api/member";
// import { formatDateTime, PUBLIC_API_URI } from "../api/config";
// import { Link, useNavigate } from "react-router-dom";
// import ConfirmationDialog from "../api/ConfirmationDialog";
// import { showToast } from "../api/toast";
// import { FiPlus } from "react-icons/fi";

// const Customers = ({ uploadData }) => {

//   console.log(uploadData, "upload")
//   const navigate = useNavigate();

//   const [memberList, setmemberList] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedMember, setSelectedMember] = useState(null);
//   const [loading, setLoading] = useState(null)
//   const customersColumns = [
//     {
//       accessorKey: "profilePicture", //access nested data with dot notation
//       header: "Image",
//       size: 100,
//       Cell: ({ cell }) => (
//         <div>
//           <Avatar src={`${PUBLIC_API_URI}${cell.getValue()}`} sx={{ width: 30, height: 30 }} />
//         </div>
//       ),
//     },
//     {
//       accessorKey: "memberId",
//       header: "Member Id",
//     },
//     {
//       accessorKey: "name", //access nested data with dot notation
//       header: "Member Name",
//     },
//     {
//       accessorKey: "email",
//       header: "Email",
//     },
//     {
//       accessorKey: "mobileNumber",
//       header: "Phone Number",
//     },
//     {
//       accessorKey: "relation",
//       header: "Relation ship",
//       Cell: ({ cell }) => cell.getValue() || "N/A",
//     },
//     {
//       accessorKey: "address", //normal accessorKey
//       header: "Address",
//     },
//     {
//       accessorKey: "creditStop", // Exclusive Offer Column
//       header: "Credit Stop",
//       Cell: ({ cell }) => {
//         const value = cell.getValue();
//         return (
//           <Typography
//             variant="body2"
//             sx={{
//               color: value ? "green" : "inherit",
//               fontWeight: value ? "bold" : "normal",
//             }}
//           >
//             {value ? "YES" : "NO"}
//           </Typography>
//         );
//       },
//     },
//     {
//       accessorKey: "creditLimit",
//       header: "Credit Limit",
//       Cell: ({ cell }) => cell.getValue() || 0,
//     },
//     {
//       accessorKey: "createdAt",
//       header: "Created Date & Time",
//       Cell: ({ cell }) => formatDateTime(cell.getValue()),
//     },

//   ];

//   const getMembers = async () => {
//     setLoading(true)
//     try {
//       const users = await fetchAllMembers();
//       console.log(users.users, "user")
//       setmemberList(users?.users);
//       setLoading(false)
//     } catch (error) {
//       console.error("Failed to fetch members:", error);
//       setLoading(false)
//     }
//   };

//   useEffect(() => {

//     getMembers();
//   }, []);

//   console.log(memberList, "member")

//   const handleDeleteClick = (member) => {
//     setSelectedMember(member);
//     setOpenDialog(true);
//   };

//   const handleConfirmDelete = async () => {
//     const userId = selectedMember._id;
//     console.log(userId, "usersgshg")
//     try {
//       await deleteMember(userId);
//       getMembers()
//       // setMemberList(updatedList);
//       showToast("Member deleted successfully.", "success");
//     } catch (error) {
//       console.error("Failed to delete member:", error);
//       showToast(error.message || "Failed to delete member.", "error");
//     } finally {
//       setOpenDialog(false);
//       setSelectedMember(null);
//     }
//   };

//   const handleCancelDelete = () => {
//     setOpenDialog(false);
//     setSelectedMember(null);
//   };

//   // // Handle navigation to "Add Member" page
//   // const handleAddMember = () => {
//   //   navigate("/member/add");
//   // };



//   return (
//     <Box sx={{ pt: "80px", pb: "20px" }}>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "14px",
//         }}
//       >
//         <Typography variant="h6">
//           Primary Members
//         </Typography>
//         {!uploadData && <Link to="/member/add" style={{ textDecoration: "none" }}>
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<FiPlus />}
//             sx={{ borderRadius: "20px" }}
//           >
//             Add Member
//           </Button>
//         </Link>}
//       </Box>

//       <Table
//         data={memberList}
//         fields={customersColumns}
//         numberOfRows={memberList.length}
//         enableTopToolBar={true}
//         enableBottomToolBar={true}
//         enablePagination={true}
//         enableRowSelection={true}
//         enableColumnFilters={true}
//         enableEditing={true}
//         enableColumnDragging={true}
//         showPreview
//         routeLink="members"
//         handleDelete={handleDeleteClick}
//         isLoading={loading}
//       />
//       <ConfirmationDialog
//         open={openDialog}
//         title="Delete Member"
//         message={`Are you sure you want to delete member ${selectedMember?.name}? This action cannot be undone.`}
//         onConfirm={handleConfirmDelete}
//         onCancel={handleCancelDelete}
//         confirmText="Delete"
//         cancelText="Cancel"
//         loadingText="Deleting..."
//       />
//     </Box>
//   );
// };

// export default Customers;

// import { Avatar, Box, Button, Typography } from "@mui/material";
// import React, { useEffect, useState, useCallback } from "react";
// import Table from "../components/Table";
// import { deleteMember } from "../api/member";
// import { formatDateTime, PUBLIC_API_URI } from "../api/config";
// import { Link, useNavigate } from "react-router-dom";
// import ConfirmationDialog from "../api/ConfirmationDialog";
// import { showToast } from "../api/toast";
// import { FiPlus } from "react-icons/fi";
// import { getRequest } from "../api/commonAPI";

// const Customers = ({ uploadData }) => {
//   const navigate = useNavigate();
//   const [memberList, setMemberList] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedMember, setSelectedMember] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // ✅ Pagination State
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);

//   const customersColumns = [
//     {
//       accessorKey: "profilePicture",
//       header: "Image",
//       size: 100,
//       Cell: ({ cell }) => (
//         <Avatar src={`${PUBLIC_API_URI}${cell.getValue()}`} sx={{ width: 30, height: 30 }} />
//       ),
//     },
//     { accessorKey: "memberId", header: "Member Id" },
//     { accessorKey: "name", header: "Member Name" },
//     { accessorKey: "email", header: "Email" },
//     { accessorKey: "mobileNumber", header: "Phone Number" },
//     {
//       accessorKey: "relation",
//       header: "Relation ship",
//       Cell: ({ cell }) => cell.getValue() || "N/A",
//     },
//     { accessorKey: "address", header: "Address" },
//     {
//       accessorKey: "creditStop",
//       header: "Credit Stop",
//       Cell: ({ cell }) => (
//         <Typography variant="body2" sx={{ color: cell.getValue() ? "green" : "inherit", fontWeight: "bold" }}>
//           {cell.getValue() ? "YES" : "NO"}
//         </Typography>
//       ),
//     },
//     { accessorKey: "creditLimit", header: "Credit Limit", Cell: ({ cell }) => cell.getValue() || 0 },
//     { accessorKey: "createdAt", header: "Created Date & Time", Cell: ({ cell }) => formatDateTime(cell.getValue()) },
//   ];

//   // ✅ Fetch Members with Correct Page & Limit
//   const getMembers = useCallback(async (pageNumber = 1, pageSize = 10) => {
//     setLoading(true);
//     try {
//       const response = await getRequest(`${PUBLIC_API_URI}/admin/all-users?page=${pageNumber}&limit=${pageSize}`);
//       setMemberList(response?.data?.users || []);
//       setTotalPages(response?.data?.pagination?.totalPages || 1);
//       setTotalRecords(response?.data?.pagination?.totalUsers || 0);
//     } catch (error) {
//       console.error("Failed to fetch members:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     console.log("Fetching members for page:", page, "limit:", limit);
//     getMembers(page, limit);
//   }, [page, limit]);

//   // ✅ Handle Delete
//   const handleDeleteClick = (member) => {
//     setSelectedMember(member);
//     setOpenDialog(true);
//   };

//   // ✅ Confirm Deletion
//   const handleConfirmDelete = async () => {
//     try {
//       await deleteMember(selectedMember._id);
//       showToast("Member deleted successfully.", "success");
//       getMembers(page, limit); // ✅ Re-fetch updated members list
//     } catch (error) {
//       console.error("Failed to delete member:", error);
//       showToast(error.message || "Failed to delete member.", "error");
//     } finally {
//       setOpenDialog(false);
//       setSelectedMember(null);
//     }
//   };

//   return (
//     <Box sx={{ pt: "80px", pb: "20px" }}>
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
//         <Typography variant="h6">Primary Members</Typography>
//         {!uploadData && (
//           <Link to="/member/add" style={{ textDecoration: "none" }}>
//             <Button variant="contained" color="primary" startIcon={<FiPlus />} sx={{ borderRadius: "20px" }}>
//               Add Member
//             </Button>
//           </Link>
//         )}
//       </Box>

//       <Table
//         data={memberList}
//         fields={customersColumns}
//         enablePagination={true}
//         isLoading={loading}
//         pagination={{
//           page,
//           pageSize: limit,
//           totalPages,
//           totalRecords,
//           onPageChange: (newPage) => {
//             console.log("Updated Page:", newPage);
//             setPage(newPage);
//           },
//           onPageSizeChange: (newLimit) => {
//             console.log("Updated Page Size:", newLimit);
//             setLimit(newLimit);
//           },
//         }}
//       />

//       <ConfirmationDialog
//         open={openDialog}
//         title="Delete Member"
//         message={`Are you sure you want to delete member ${selectedMember?.name}? This action cannot be undone.`}
//         onConfirm={handleConfirmDelete}
//         onCancel={() => setOpenDialog(false)}
//         confirmText="Delete"
//         cancelText="Cancel"
//         loadingText="Deleting..."
//       />
//     </Box>
//   );
// };

// export default Customers;

// import { Avatar, Box, Button, Typography, CircularProgress, Pagination } from "@mui/material";
// import React, { useEffect, useState, useCallback } from "react";
// import Table from "../components/Table";
// import { deleteMember } from "../api/member";
// import { formatDateTime, PUBLIC_API_URI } from "../api/config";
// import { Link } from "react-router-dom";
// import ConfirmationDialog from "../api/ConfirmationDialog";
// import { showToast } from "../api/toast";
// import { FiPlus } from "react-icons/fi";
// import { getRequest } from "../api/commonAPI";

// const Customers = ({ uploadData }) => {
//   const [memberList, setMemberList] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedMember, setSelectedMember] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // ✅ Manual Pagination State
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [totalRecords, setTotalRecords] = useState(0);

//   const customersColumns = [
//     {
//       accessorKey: "profilePicture",
//       header: "Image",
//       size: 100,
//       Cell: ({ cell }) => (
//         <Avatar src={`${PUBLIC_API_URI}${cell.getValue()}`} sx={{ width: 30, height: 30 }} />
//       ),
//     },
//     { accessorKey: "memberId", header: "Member Id" },
//     { accessorKey: "name", header: "Member Name" },
//     { accessorKey: "email", header: "Email" },
//     { accessorKey: "mobileNumber", header: "Phone Number" },
//     {
//       accessorKey: "relation",
//       header: "Relation ship",
//       Cell: ({ cell }) => cell.getValue() || "N/A",
//     },
//     { accessorKey: "address", header: "Address" },
//     {
//       accessorKey: "creditStop",
//       header: "Credit Stop",
//       Cell: ({ cell }) => (
//         <Typography variant="body2" sx={{ color: cell.getValue() ? "green" : "inherit", fontWeight: "bold" }}>
//           {cell.getValue() ? "YES" : "NO"}
//         </Typography>
//       ),
//     },
//     { accessorKey: "creditLimit", header: "Credit Limit", Cell: ({ cell }) => cell.getValue() || 0 },
//     { accessorKey: "createdAt", header: "Created Date & Time", Cell: ({ cell }) => formatDateTime(cell.getValue()) },
//   ];

//   // ✅ Fetch Members with Pagination
//   const getMembers = useCallback(async (pageNumber = 1, pageSize = 10) => {
//     setLoading(true);
//     try {
//       const response = await getRequest(`${PUBLIC_API_URI}/admin/all-users?page=${pageNumber}&limit=${pageSize}`);
//       setMemberList(response?.data?.users || []);
//       setTotalRecords(response?.data?.pagination?.totalUsers || 0);
//     } catch (error) {
//       console.error("Failed to fetch members:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // ✅ Fetch Data when page or limit changes
//   useEffect(() => {
//     getMembers(page, limit);
//   }, [page, limit, getMembers]);

//   // ✅ Handle Delete
//   const handleDeleteClick = (member) => {
//     setSelectedMember(member);
//     setOpenDialog(true);
//   };

//   // ✅ Confirm Deletion
//   const handleConfirmDelete = async () => {
//     try {
//       await deleteMember(selectedMember._id);
//       showToast("Member deleted successfully.", "success");
//       getMembers(page, limit); // ✅ Re-fetch updated members list
//     } catch (error) {
//       console.error("Failed to delete member:", error);
//       showToast(error.message || "Failed to delete member.", "error");
//     } finally {
//       setOpenDialog(false);
//       setSelectedMember(null);
//     }
//   };

//   return (
//     <Box sx={{ pt: "80px", pb: "20px" }}>
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
//         <Typography variant="h6">Primary Members</Typography>
//         {!uploadData && (
//           <Link to="/member/add" style={{ textDecoration: "none" }}>
//             <Button variant="contained" color="primary" startIcon={<FiPlus />} sx={{ borderRadius: "20px" }}>
//               Add Member
//             </Button>
//           </Link>
//         )}
//       </Box>

//       {/* ✅ Retaining Your Original Table Design */}
//       <Table
//         data={memberList}
//         fields={customersColumns}
//         numberOfRows={memberList.length}
//         enableTopToolBar={true}
//         enableBottomToolBar={true}
//         enablePagination={false} // Disabling internal pagination, using manual pagination instead
//         enableRowSelection={true}
//         enableColumnFilters={true}
//         enableEditing={true}
//         enableColumnDragging={true}
//         showPreview
//         routeLink="members"
//         handleDelete={handleDeleteClick}
//         isLoading={loading}
//       />

//       {/* ✅ Pagination Component - Manual Pagination at Bottom */}
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//         <Pagination
//           count={Math.ceil(totalRecords / limit)} // ✅ Total pages calculation
//           page={page}
//           onChange={(event, value) => {
//             console.log("Updating Page to:", value);
//             setPage(value);
//           }}
//           color="primary"
//         />
//       </Box>

//       {/* ✅ Delete Confirmation Dialog */}
//       <ConfirmationDialog
//         open={openDialog}
//         title="Delete Member"
//         message={`Are you sure you want to delete member ${selectedMember?.name}? This action cannot be undone.`}
//         onConfirm={handleConfirmDelete}
//         onCancel={() => setOpenDialog(false)}
//         confirmText="Delete"
//         cancelText="Cancel"
//         loadingText="Deleting..."
//       />
//     </Box>
//   );
// };

// export default Customers;



import { Avatar, Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import Table from "../components/Table";
import { deleteMember } from "../api/member";
import { formatDateTime, PUBLIC_API_URI } from "../api/config";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { showToast } from "../api/toast";
import { FiPlus } from "react-icons/fi";
import { getRequest } from "../api/commonAPI";

const Customers = ({ uploadData }) => {
  const navigate = useNavigate();
  const [memberList, setMemberList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);  // Default to page 1
  const [limit, setLimit] = useState(10); // Default to 10 records per page
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const customersColumns = [
    {
      accessorKey: "profilePicture",
      header: "Image",
      size: 100,
      Cell: ({ cell }) => (
        <Avatar src={`${PUBLIC_API_URI}${cell.getValue()}`} sx={{ width: 30, height: 30 }} />
      ),
    },
    { accessorKey: "memberId", header: "Member Id" },
    { accessorKey: "name", header: "Member Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "mobileNumber", header: "Phone Number" },
    {
      accessorKey: "relation",
      header: "Relation ship",
      Cell: ({ cell }) => cell.getValue() || "N/A",
    },
    { accessorKey: "address", header: "Address" },
    {
      accessorKey: "creditStop",
      header: "Credit Stop",
      Cell: ({ cell }) => (
        <Typography variant="body2" sx={{ color: cell.getValue() ? "green" : "inherit", fontWeight: "bold" }}>
          {cell.getValue() ? "YES" : "NO"}
        </Typography>
      ),
    },
    { accessorKey: "creditLimit", header: "Credit Limit", Cell: ({ cell }) => cell.getValue() || 0 },
    { accessorKey: "createdAt", header: "Created Date & Time", Cell: ({ cell }) => formatDateTime(cell.getValue()) },
  ];

  // Fetch Members
  // const getMembers = useCallback(async (pageNumber, pageSize) => {
  //   setLoading(true);
  //   try {
  //     const response = await getRequest(`${PUBLIC_API_URI}/admin/all-users?page=${pageNumber}&limit=${pageSize}`);
  //     setMemberList(response?.data?.users || []);
  //     setTotalPages(response?.data?.pagination.totalPages || 1);
  //     setTotalRecords(response?.data?.pagination.totalUsers || 0);
  //   } catch (error) {
  //     console.error("Failed to fetch members:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  const getMembers = useCallback(async (pageNumber, pageSize) => {
    setLoading(true);
    try {
      const response = await getRequest(`${PUBLIC_API_URI}/admin/all-users?page=${pageNumber}&limit=${pageSize}`);

      if (response?.data) {
        setMemberList(response.data.users || []);

        // Ensure that we update pagination only if values exist
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalRecords(response.data.pagination?.totalUsers || 0);

        if (response.data.pagination?.currentPage) {
          setPage(response.data.pagination.currentPage);
        }

        if (response.data.pagination?.pageSize) {
          setLimit(response.data.pagination.pageSize);
        }
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setLoading(false);
    }
  }, []);


  // Re-fetch when page/limit changes
  useEffect(() => {
    getMembers(page, limit);
  }, [page, limit]);

  // Handle Delete
  const handleDeleteClick = (member) => {
    setSelectedMember(member);
    setOpenDialog(true);
  };

  // Confirm Deletion
  const handleConfirmDelete = async () => {
    try {
      await deleteMember(selectedMember._id);
      showToast("Member deleted successfully.", "success");
      getMembers(page, limit); // Re-fetch updated members list
    } catch (error) {
      console.error("Failed to delete member:", error);
      showToast(error.message || "Failed to delete member.", "error");
    } finally {
      setOpenDialog(false);
      setSelectedMember(null);
    }
  };

  return (
    <Box sx={{ pt: "80px", pb: "20px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <Typography variant="h6">Primary Members</Typography>
        {!uploadData && (
          <Link to="/member/add" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary" startIcon={<FiPlus />} sx={{ borderRadius: "20px" }}>
              Add Member
            </Button>
          </Link>
        )}
      </Box>

      <Table
        data={memberList}
        fields={customersColumns}
        numberOfRows={memberList.length}
        enableTopToolBar={true}
        enableBottomToolBar={true}
        enablePagination={true}
        enableRowSelection={false}
        enableColumnFilters={true}
        enableEditing={true}
        enableColumnDragging={true}
        showPreview
        routeLink="members"
        handleDelete={handleDeleteClick}
        isLoading={loading}
        // pagination={{
        //   page: page || 1,
        //   pageSize: limit || 10,
        //   totalPages: totalPages || 1,
        //   totalRecords: totalRecords || 0,
        //   onPageChange: (newPage) => {
        //     if (!isNaN(newPage) && newPage > 0) {
        //       console.log("Pagination Change -> New Page:", newPage);
        //       setPage(newPage);
        //     } else {
        //       console.warn("Invalid page number:", newPage);
        //     }
        //   },
        //   onPageSizeChange: (newLimit) => {
        //     if (!isNaN(newLimit) && newLimit > 0) {
        //       console.log("Pagination Change -> New Limit:", newLimit);
        //       setLimit(newLimit);
        //     } else {
        //       console.warn("Invalid page size:", newLimit);
        //     }
        //   },
        // }}
        pagination={{
          page: page > 0 ? page : 1,
          pageSize: limit > 0 ? limit : 10,
          totalPages: totalPages || 1,
          totalRecords: totalRecords || 0,
          onPageChange: (newPage) => {
            if (!isNaN(newPage) && newPage > 0) {
              console.log("Setting Page to:", newPage);
              setPage(newPage);
            } else {
              console.warn("Invalid page number received:", newPage);
            }
          },
          onPageSizeChange: (newLimit) => {
            if (!isNaN(newLimit) && newLimit > 0) {
              console.log("Setting Page Size to:", newLimit);
              setLimit(newLimit);
            } else {
              console.warn("Invalid page size received:", newLimit);
            }
          },
        }}



      />


      <ConfirmationDialog
        open={openDialog}
        title="Delete Member"
        message={`Are you sure you want to delete member ${selectedMember?.name}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpenDialog(false)}
        confirmText="Delete"
        cancelText="Cancel"
        loadingText="Deleting..."
      />
    </Box>
  );
};

export default Customers;
