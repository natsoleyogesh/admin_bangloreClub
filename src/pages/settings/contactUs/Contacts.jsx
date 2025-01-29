// import React, { useEffect, useState } from "react";
// import { Box, Button, Typography } from "@mui/material";
// import { FiPlus } from "react-icons/fi";
// import { Link } from "react-router-dom";
// import Table from "../../../components/Table";
// import ConfirmationDialog from "../../../components/ConfirmationDialog";
// import { showToast } from "../../../utils/toast";
// import { formatDateTime } from "../../../utils/helpers";
// import { deleteRequest, getRequest } from "../../../api/commonAPI";

// const ContactUs = () => {
//     // State variables
//     const [contact, setContact] = useState([]);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedContact, setSelectedContact] = useState(null);
//     const [loading, setLoading] = useState(false);

//     // Table column definitions
//     const columns = [
//         { accessorKey: "title", header: "Title" },
//         {
//             accessorKey: "description",
//             header: "Description",
//             Cell: ({ row }) => {
//                 const [showFull, setShowFull] = useState(false);

//                 const toggleShowMore = () => setShowFull(!showFull);

//                 const description = row.original.description;
//                 const truncatedDescription =
//                     description?.length > 50
//                         ? `${description.substring(0, 50)}...`
//                         : description;

//                 return (
//                     <div>
//                         <div
//                             dangerouslySetInnerHTML={{
//                                 __html: showFull ? description : truncatedDescription,
//                             }}
//                             style={{
//                                 maxHeight: showFull ? "none" : "100px",
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                                 whiteSpace: showFull ? "normal" : "nowrap",
//                             }}
//                         />
//                         {description?.length > 50 && (
//                             <Button
//                                 size="small"
//                                 color="primary"
//                                 onClick={toggleShowMore}
//                                 sx={{
//                                     padding: "2px 4px",
//                                     marginTop: "4px",
//                                     fontSize: "12px",
//                                     textTransform: "none",
//                                 }}
//                             >
//                                 {showFull ? "Show Less" : "Show More"}
//                             </Button>
//                         )}
//                     </div>
//                 );
//             },
//         },
//         { accessorKey: "status", header: "Status" },
//         {
//             accessorKey: "createdAt",
//             header: "Created Date & Time",
//             Cell: ({ cell }) => formatDateTime(cell.getValue()),
//         },
//     ];

//     // Fetch about entries
//     const fetchAbouts = async () => {
//         setLoading(true);
//         try {
//             const response = await getRequest("/abouts");
//             setAbouts(response?.data?.aboutEntries || []);
//         } catch (error) {
//             console.error("Error fetching about entries:", error);
//             showToast("Failed to fetch about entries. Please try again.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle delete about entry
//     const handleDeleteAbout = async () => {
//         if (!selectedAbout) return;

//         try {
//             await deleteRequest(`/abouts/${selectedAbout._id}`);
//             showToast("About entry deleted successfully.", "success");
//             fetchAbouts();
//         } catch (error) {
//             console.error("Error deleting about entry:", error);
//             showToast("Failed to delete about entry. Please try again.", "error");
//         } finally {
//             setOpenDialog(false);
//             setSelectedAbout(null);
//         }
//     };

//     // Lifecycle: Fetch about entries on component mount
//     useEffect(() => {
//         fetchAbouts();
//     }, []);

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             {/* Header Section */}
//             <Box
//                 sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     mb: 2,
//                 }}
//             >
//                 <Typography variant="h6">About Us</Typography>
//                 <Link to="/about/add" style={{ textDecoration: "none" }}>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<FiPlus />}
//                         sx={{ borderRadius: "20px" }}
//                     >
//                         Add About
//                     </Button>
//                 </Link>
//             </Box>

//             {/* About Us Table */}
//             <Table
//                 data={abouts}
//                 fields={columns}
//                 numberOfRows={abouts.length}
//                 enableTopToolBar
//                 enableBottomToolBar
//                 enablePagination
//                 enableRowSelection
//                 enableColumnFilters
//                 enableEditing
//                 enableColumnDragging
//                 showPreview
//                 routeLink="about"
//                 handleDelete={(about) => {
//                     setSelectedAbout(about);
//                     setOpenDialog(true);
//                 }}
//                 isLoading={loading}
//             />

//             {/* Delete Confirmation Dialog */}
//             <ConfirmationDialog
//                 open={openDialog}
//                 title="Delete About Entry"
//                 message={`Are you sure you want to delete the about entry "${selectedAbout?.title}"? This action cannot be undone.`}
//                 onConfirm={handleDeleteAbout}
//                 onCancel={() => {
//                     setOpenDialog(false);
//                     setSelectedAbout(null);
//                 }}
//                 confirmText="Delete"
//                 cancelText="Cancel"
//                 loadingText="Deleting..."
//             />
//         </Box>
//     );
// };

// export default ContactUs;


import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { FiPlus, FiTrash2, FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../../../components/Table"; // Assuming a reusable table component
import { getRequest, deleteRequest } from "../../../api/commonAPI";
import { showToast } from "../../../api/toast";
import ConfirmationDialog from "../../../api/ConfirmationDialog";
import { formatDateTime } from "../../../api/config";

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    // Fetch all contacts
    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await getRequest("/contacts");
            if (response?.data?.contacts) {
                setContacts(response.data.contacts);
            }
        } catch (error) {
            console.error("Failed to fetch contacts:", error);
            // showToast("Failed to fetch contacts. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Handle delete contact
    const handleDeleteContact = async () => {
        if (!selectedContact) return;

        try {
            const response = await deleteRequest(`/contacts/${selectedContact._id}`);
            if (response.status === 200) {
                showToast("Contact deleted successfully.", "success");
                fetchContacts(); // Refresh contacts list
            } else {
                showToast("Failed to delete contact. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error deleting contact:", error);
            showToast("An error occurred while deleting the contact.", "error");
        } finally {
            setOpenDeleteDialog(false);
            setSelectedContact(null);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const columns = [
        { accessorKey: "organizationName", header: "Organization Name" },
        {
            accessorKey: "email",
            header: "Email",
            Cell: ({ cell }) => <Typography>{cell.getValue()}</Typography>,
        },
        {
            accessorKey: "phoneNumbers",
            header: "Phone Numbers",
            Cell: ({ cell }) => (
                <Typography>{cell.getValue().join(", ")}</Typography>
            ),
        },
        {
            accessorKey: "address",
            header: "Address",
            Cell: ({ row }) => {
                const { street, city, state, postalCode, country } = row.original.address || {};
                return (
                    <Typography>
                        {street ? `${street}, ` : ""}
                        {city ? `${city}, ` : ""}
                        {state ? `${state}, ` : ""}
                        {postalCode ? `${postalCode}, ` : ""}
                        {country || ""}
                    </Typography>
                );
            },
        },
        { accessorKey: "status", header: "Status" },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];


    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Typography variant="h6">Contact Us</Typography>
                <Link to="/contactUs/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Contact Us
                    </Button>
                </Link>
            </Box>
            {/* About Us Table */}
            <Table
                data={contacts}
                fields={columns}
                numberOfRows={contacts.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="contactUs"
                handleDelete={(conatct) => {
                    setSelectedContact(conatct);
                    setOpenDeleteDialog(true);
                }}
                isLoading={loading}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={openDeleteDialog}
                title="Delete About Entry"
                message={`Are you sure you want to delete the Conatct entry "${selectedContact?.organizationName}"? This action cannot be undone.`}
                onConfirm={handleDeleteContact}
                onCancel={() => {
                    setOpenDeleteDialog(false);
                    setSelectedContact(null);
                }}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Contacts;
