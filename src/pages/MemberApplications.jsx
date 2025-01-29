// import { Avatar, Box, Button, Chip, Typography } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import Table from "../components/Table";
// import { customers, customersColumns } from "../data/customers";
// import { formatDateTime, PUBLIC_API_URI } from "../api/config";
// import { Link, useNavigate } from "react-router-dom";
// import ConfirmationDialog from "../api/ConfirmationDialog";
// import { showToast } from "../api/toast";
// import { FiPlus } from "react-icons/fi";
// import { deleteMemberApplication, fetchAllMembersApplications } from "../api/memberWaiting";

// const MemberApplications = () => {

//     const navigate = useNavigate();

//     const [applicationsList, setApplicationList] = useState([]);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedApplication, setSelectedApplication] = useState(null);
//     const [loading, setLoading] = useState(null)
//     const applicationsColumns = [
//         {
//             accessorKey: "profilePicture", //access nested data with dot notation
//             header: "Image",
//             size: 100,
//             Cell: ({ cell }) => (
//                 <div>
//                     <Avatar src={`${PUBLIC_API_URI}${cell.getValue()}`} sx={{ width: 30, height: 30 }} />
//                 </div>
//             ),
//         },
//         {
//             accessorKey: "applicationId",
//             header: "Application Id",
//         },
//         {
//             accessorKey: "name", //access nested data with dot notation
//             header: "Applicant Name",
//         },
//         {
//             accessorKey: "email",
//             header: "Email",
//         },
//         {
//             accessorKey: "mobileNumber",
//             header: "Phone Number",
//         },
//         {
//             accessorKey: "address", //normal accessorKey
//             header: "Address",
//         },
//         {
//             accessorKey: "applicationStatus",
//             header: "Application Status",
//             Cell: ({ cell }) => (
//                 <Chip
//                     label={cell.getValue()}
//                     color={cell.getValue() === "Approved" ? "success" : "default"} // Approved, Pending, Rejected
//                     size="small"
//                 />
//             ),
//         },
//         {
//             accessorKey: "createdAt",
//             header: "Created Date & Time",
//             Cell: ({ cell }) => formatDateTime(cell.getValue()),
//         },

//     ];

//     const getApplications = async () => {
//         setLoading(true)
//         try {
//             const application = await fetchAllMembersApplications();
//             console.log(application.data?.applications, "user")
//             setApplicationList(application?.data?.applications);
//             setLoading(false)
//         } catch (error) {
//             console.error("Failed to fetch members:", error);
//             setLoading(false)
//         }
//     };

//     useEffect(() => {

//         getApplications();
//     }, []);

//     console.log(applicationsList, "member")

//     const handleDeleteClick = (application) => {
//         setSelectedApplication(application);
//         setOpenDialog(true);
//     };

//     const handleConfirmDelete = async () => {
//         const applicationId = selectedApplication._id;
//         console.log(applicationId, "usersgshg")
//         try {
//             await deleteMemberApplication(applicationId);
//             getApplications()
//             showToast("Application deleted successfully.", "success");
//         } catch (error) {
//             console.error("Failed to delete member:", error);
//             showToast(error.message || "Failed to delete member.", "error");
//         } finally {
//             setOpenDialog(false);
//             setSelectedApplication(null);
//         }
//     };

//     const handleCancelDelete = () => {
//         setOpenDialog(false);
//         setSelectedApplication(null);
//     };

//     // Handle navigation to "Add Member" page
//     const handleAddMember = () => {
//         navigate("/member/add");
//     };



//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Box
//                 sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: "14px",
//                 }}
//             >
//                 <Typography variant="h6">
//                     Applications
//                 </Typography>
//                 <Link to="/application/add" style={{ textDecoration: "none" }}>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<FiPlus />}
//                         sx={{ borderRadius: "20px" }}
//                     >
//                         Add Member
//                     </Button>
//                 </Link>
//             </Box>

//             <Table
//                 data={applicationsList}
//                 fields={applicationsColumns}
//                 numberOfRows={applicationsList.length}
//                 enableTopToolBar={true}
//                 enableBottomToolBar={true}
//                 enablePagination={true}
//                 enableRowSelection={true}
//                 enableColumnFilters={true}
//                 enableEditing={true}
//                 enableColumnDragging={true}
//                 showPreview
//                 routeLink="application"
//                 handleDelete={handleDeleteClick}
//                 isLoading={loading}
//             />
//             <ConfirmationDialog
//                 open={openDialog}
//                 title="Delete Member"
//                 message={`Are you sure you want to delete Application ${selectedApplication?.name}? This action cannot be undone.`}
//                 onConfirm={handleConfirmDelete}
//                 onCancel={handleCancelDelete}
//                 confirmText="Delete"
//                 cancelText="Cancel"
//                 loadingText="Deleting..."
//             />
//         </Box>
//     );
// };

// export default MemberApplications;


// import { Avatar, Box, Button, Chip, Typography } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import Table from "../components/Table";
// import { formatDateTime, PUBLIC_API_URI } from "../api/config";
// import { Link, useNavigate } from "react-router-dom";
// import ConfirmationDialog from "../api/ConfirmationDialog";
// import { showToast } from "../api/toast";
// import { FiPlus } from "react-icons/fi";
// import { deleteMemberApplication, fetchAllMembersApplications } from "../api/memberWaiting";

// const MemberApplications = () => {
//     const navigate = useNavigate();

//     const [applicationsList, setApplicationList] = useState([]);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedApplication, setSelectedApplication] = useState(null);
//     const [loading, setLoading] = useState(null);
//     const [columns, setColumns] = useState([]);

//     const getApplications = async () => {
//         setLoading(true);
//         try {
//             const response = await fetchAllMembersApplications();
//             const data = response?.data || [];

//             // Extract dynamic seconder keys
//             const seconderKeys = new Set();
//             data.forEach((item) => {
//                 Object.keys(item.seconders || {}).forEach((key) => seconderKeys.add(key));
//             });

//             // Define columns dynamically, including seconder columns
//             const dynamicColumns = [
//                 {
//                     accessorKey: "profilePicture",
//                     header: "Image",
//                     size: 100,
//                     Cell: ({ cell }) => (
//                         <Avatar
//                             src={`${PUBLIC_API_URI}${cell.getValue()}`}
//                             sx={{ width: 30, height: 30 }}
//                         />
//                     ),
//                 },
//                 {
//                     accessorKey: "applicationNumber",
//                     header: "Application Number",
//                 },
//                 {
//                     accessorKey: "applicantName",
//                     header: "Applicant Name",
//                 },
//                 {
//                     accessorKey: "proposer.name",
//                     header: "Proposer Name",
//                 },
//                 {
//                     accessorKey: "proposer.accountNumber",
//                     header: "Proposer Account Number",
//                 },
//                 ...Array.from(seconderKeys).map((key) => ({
//                     accessorKey: `seconders.${key}.name`,
//                     header: key.toUpperCase().replace("-", " "),
//                 })),
//                 {
//                     accessorKey: "applicationStatus",
//                     header: "Application Status",
//                     Cell: ({ cell }) => (
//                         <Chip
//                             label={cell.getValue()}
//                             color={cell.getValue() === "Approved" ? "success" : "default"} // Approved, Pending, Rejected
//                             size="small"
//                         />
//                     ),
//                 },
//                 {
//                     accessorKey: "createdAt",
//                     header: "Created Date & Time",
//                     Cell: ({ cell }) => formatDateTime(cell.getValue()),
//                 },
//             ];

//             setColumns(dynamicColumns);
//             setApplicationList(data);
//             setLoading(false);
//         } catch (error) {
//             console.error("Failed to fetch members:", error);
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getApplications();
//     }, []);

//     const handleDeleteClick = (application) => {
//         setSelectedApplication(application);
//         setOpenDialog(true);
//     };

//     const handleConfirmDelete = async () => {
//         const applicationId = selectedApplication._id;
//         try {
//             await deleteMemberApplication(applicationId);
//             getApplications();
//             showToast("Application deleted successfully.", "success");
//         } catch (error) {
//             console.error("Failed to delete member:", error);
//             showToast(error.message || "Failed to delete member.", "error");
//         } finally {
//             setOpenDialog(false);
//             setSelectedApplication(null);
//         }
//     };

//     const handleCancelDelete = () => {
//         setOpenDialog(false);
//         setSelectedApplication(null);
//     };

//     // Handle navigation to "Add Member" page
//     const handleAddMember = () => {
//         navigate("/member/add");
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Box
//                 sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: "14px",
//                 }}
//             >
//                 <Typography variant="h6">Applications</Typography>
//                 <Link to="/application/add" style={{ textDecoration: "none" }}>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<FiPlus />}
//                         sx={{ borderRadius: "20px" }}
//                     >
//                         Add Member
//                     </Button>
//                 </Link>
//             </Box>

//             <Table
//                 data={applicationsList}
//                 fields={columns}
// numberOfRows={applicationsList.length}
// enableTopToolBar={true}
// enableBottomToolBar={true}
// enablePagination={true}
// enableRowSelection={true}
// enableColumnFilters={true}
// enableEditing={true}
// enableColumnDragging={true}
// showPreview
// routeLink="application"
// handleDelete={handleDeleteClick}
// isLoading={loading}
//             />
//             <ConfirmationDialog
//                 open={openDialog}
//                 title="Delete Member"
//                 message={`Are you sure you want to delete Application ${selectedApplication?.name}? This action cannot be undone.`}
//                 onConfirm={handleConfirmDelete}
//                 onCancel={handleCancelDelete}
//                 confirmText="Delete"
//                 cancelText="Cancel"
//                 loadingText="Deleting..."
//             />
//         </Box>
//     );
// };

// export default MemberApplications;


// import {
//     Avatar,
//     Box,
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     TextField,
//     Typography,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import MaterialReactTable from "material-react-table";
// import { FiPlus } from "react-icons/fi";
// import { formatDateTime } from "../api/config";
// import { showToast } from "../api/toast";
// import { addMemberApplication, fetchAllMembersApplications } from "../api/memberWaiting";

// const MemberApplications = () => {
//     const [applicationsList, setApplicationsList] = useState([]);
//     const [columns, setColumns] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [openUploadDialog, setOpenUploadDialog] = useState(false);
//     const [file, setFile] = useState(null);

//     const fetchApplications = async (search = "") => {
//         setLoading(true);
//         try {
//             const response = await fetchAllMembersApplications({ search });
//             const data = response.data || [];

//             // Extract dynamic seconder keys
//             const seconderKeys = new Set();
//             data.forEach((item) => {
//                 Object.keys(item.seconders || {}).forEach((key) => seconderKeys.add(key));
//             });

//             // Define table columns dynamically
//             const dynamicColumns = [
//                 {
//                     accessorKey: "applicationNumber",
//                     header: "Application Number",
//                 },
//                 {
//                     accessorKey: "applicantName",
//                     header: "Applicant Name",
//                 },
//                 {
//                     accessorKey: "applicationDate",
//                     header: "Application Date",
//                     Cell: ({ cell }) => formatDateTime(cell.getValue()),
//                 },
//                 {
//                     accessorKey: "proposer.name",
//                     header: "Proposer",
//                 },
//                 {
//                     accessorKey: "proposer.accountNumber",
//                     header: "A/C No",
//                 },
//                 ...Array.from(seconderKeys).map((key) => ({
//                     accessorKey: `seconders.${key}.name`,
//                     header: `${key.replace("seconder-", "Seconder ")}`,
//                 })),
//                 ...Array.from(seconderKeys).map((key) => ({
//                     accessorKey: `seconders.${key}.accountNumber`,
//                     header: `${key.replace("seconder-", "Seconder ")} Account Number`,
//                 })),
//             ];

//             setColumns(dynamicColumns);
//             setApplicationsList(data);
//         } catch (error) {
//             console.error("Failed to fetch applications:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchApplications();
//     }, []);

//     const handleSearch = async (event) => {
//         const value = event.target.value;
//         setSearchTerm(value);
//         await fetchApplications(value);
//     };

//     const handleFileUpload = async () => {
//         if (!file) {
//             showToast("Please select a file to upload.", "warning");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("file", file);

//         try {
//             await addMemberApplication(formData);
//             showToast("File uploaded successfully.", "success");
//             fetchApplications();
//         } catch (error) {
//             console.error("Failed to upload file:", error);
//             showToast(error.response?.data?.message || "Failed to upload file.", "error");
//         } finally {
//             setOpenUploadDialog(false);
//             setFile(null);
//         }
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Box
//                 sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: "14px",
//                 }}
//             >
//                 <Typography variant="h6">Member Applications</Typography>
//                 <Box>
//                     <TextField
//                         placeholder="Search..."
//                         value={searchTerm}
//                         onChange={handleSearch}
//                         size="small"
//                         variant="outlined"
//                         sx={{ marginRight: "10px" }}
//                     />
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<FiPlus />}
//                         onClick={() => setOpenUploadDialog(true)}
//                     >
//                         Upload File
//                     </Button>
//                 </Box>
//             </Box>

//             <MaterialReactTable
//                 columns={columns}
//                 data={applicationsList}
//                 isLoading={loading}
//                 enablePagination
//                 enableSorting
//                 enableColumnResizing
//                 enableColumnFilters
//                 enableGlobalFilter
//             />

//             <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)}>
//                 <DialogTitle>Upload Member Applications</DialogTitle>
//                 <DialogContent>
//                     <input
//                         type="file"
//                         onChange={(e) => setFile(e.target.files[0])}
//                         accept=".xlsx, .xls"
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
//                     <Button onClick={handleFileUpload} variant="contained" color="primary">
//                         Upload
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default MemberApplications;


import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import MaterialReactTable from "material-react-table";
import { FiPlus } from "react-icons/fi";
import { formatDateTime } from "../api/config";
import { showToast } from "../api/toast";
import { addMemberApplication, fetchAllMembersApplications } from "../api/memberWaiting";
import { getRequest } from "../api/commonAPI";

const MemberApplications = () => {
    const [applicationsList, setApplicationsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    const [file, setFile] = useState(null);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const queryParams = {
                search: ""
            };
            if (searchTerm) {
                queryParams.search = searchTerm
            }
            const queryString = new URLSearchParams(queryParams).toString();
            const response = await getRequest(`/membershipwaitings?${queryString}`);
            const data = response.data || [];
            setApplicationsList(data);
        } catch (error) {
            console.error("Failed to fetch applications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [searchTerm]);

    const handleSearch = async (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        await fetchApplications(value);
    };

    const handleFileUpload = async () => {
        if (!file) {
            showToast("Please select a file to upload.", "warning");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            await addMemberApplication(formData);
            showToast("File uploaded successfully.", "success");
            fetchApplications();
        } catch (error) {
            console.error("Failed to upload file:", error);
            showToast(error.response?.data?.message || "Failed to upload file.", "error");
        } finally {
            setOpenUploadDialog(false);
            setFile(null);
        }
    };

    const columns = useMemo(() => {
        if (!applicationsList.length) return [];

        const seconderKeys = new Set();
        applicationsList.forEach((item) => {
            Object.keys(item.seconders || {}).forEach((key) => seconderKeys.add(key));
        });

        const seconderColumns = Array.from(seconderKeys).flatMap((key) => [
            {
                accessorKey: `seconders.${key}.name`,
                header: `${key.replace("seconder-", "Seconder-")}`,
            },
            {
                accessorKey: `seconders.${key}.accountNumber`,
                header: `A/C No`,
            },
        ]);

        return [
            {
                accessorKey: "applicationNumber",
                header: "Application Number",
            },
            {
                accessorKey: "applicantName",
                header: "Applicant Name",
            },
            {
                accessorKey: "applicationDate",
                header: "Application Date",
                Cell: ({ cell }) => formatDateTime(cell.getValue()),
            },
            {
                accessorKey: "proposer.name",
                header: "Proposer Name",
            },
            {
                accessorKey: "proposer.accountNumber",
                header: "Proposer Account Number",
            },
            ...seconderColumns,
        ];
    }, [applicationsList]);

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
                <Typography variant="h6">Member Applications</Typography>
                <Box>
                    <TextField
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        variant="outlined"
                        sx={{ marginRight: "10px" }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        onClick={() => setOpenUploadDialog(true)}
                    >
                        Upload File
                    </Button>
                </Box>
            </Box>

            <MaterialReactTable
                columns={columns}
                data={applicationsList}
                isLoading={loading}
                enablePagination
                enableSorting
                enableColumnResizing
                enableColumnFilters
                enableGlobalFilter
                state={{ loading }} // Pass the loading state here
            />

            <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)}>
                <DialogTitle>Upload Member Applications</DialogTitle>
                <DialogContent>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        accept=".xlsx, .xls"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
                    <Button onClick={handleFileUpload} variant="contained" color="primary">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MemberApplications;
