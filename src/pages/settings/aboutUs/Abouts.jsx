// import React, { useEffect, useState } from "react";
// import { Box, Button, Typography } from "@mui/material";
// import { FiPlus } from "react-icons/fi";
// import { Link } from "react-router-dom";
// import Table from "../../../components/Table";
// import ConfirmationDialog from "../../../api/ConfirmationDialog";
// import { showToast } from "../../../api/toast";
// import { formatDateTime } from "../../../api/config";
// import { deleteRequest, getRequest } from "../../../api/commonAPI";

// const AboutUs = () => {
//     // State variables
//     const [abouts, setAbouts] = useState([]);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedAbout, setSelectedAbout] = useState(null);
//     const [loading, setLoading] = useState(false);

//     // Table column definitions
//     const columns = [
//         { accessorKey: "title", header: "Title Name" },
//         {
//             accessorKey: "description",
//             header: "Description",
//             Cell: ({ row }) => {
//                 const [showFull, setShowFull] = React.useState(false);

//                 const toggleShowMore = () => setShowFull(!showFull);

//                 const description = row.original.description;

//                 const truncatedDescription = description?.length > 50
//                     ? `${description.substring(0, 50)}...`
//                     : description;

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

//     // Fetch designations data
//     const fetchAbout = async () => {
//         setLoading(true);
//         try {
//             const response = await getRequest("/abouts");
//             setAbouts(response?.data?.aboutEntries || []);
//         } catch (error) {
//             console.error("Error fetching designations:", error);
//             showToast("Failed to fetch designations. Please try again.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete a designation
//     const handleDeleteAbout = async () => {
//         if (!selectedAbout) return;

//         try {
//             await deleteRequest(`/about/${selectedAbout._id}`);
//             showToast("Designation deleted successfully.", "success");
//             fetchAbout();
//         } catch (error) {
//             console.error("Error deleting designation:", error);
//             showToast("Failed to delete designation. Please try again.", "error");
//         } finally {
//             setOpenDialog(false);
//             setSelectedAbout(null);
//         }
//     };

//     // Lifecycle: fetch designations on component mount
//     useEffect(() => {
//         fetchDesignations();
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
//                 <Typography variant="h6">Designations</Typography>
//                 <Link to="/designation/add" style={{ textDecoration: "none" }}>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<FiPlus />}
//                         sx={{ borderRadius: "20px" }}
//                     >
//                         Add Designation
//                     </Button>
//                 </Link>
//             </Box>

//             {/* Designations Table */}
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
//                 title="Delete Designation"
//                 message={`Are you sure you want to delete the about "${selectedAbout?.title}"? This action cannot be undone.`}
//                 onConfirm={handleDeleteDesignation}
//                 onCancel={() => {
//                     setOpenDialog(false);
//                     setSelectedDesignation(null);
//                 }}
//                 confirmText="Delete"
//                 cancelText="Cancel"
//                 loadingText="Deleting..."
//             />
//         </Box>
//     );
// };

// export default AboutUs;

import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { deleteRequest, getRequest } from "../../../api/commonAPI";
import { formatDateTime } from "../../../api/config";
import { showToast } from "../../../api/toast";
import Table from "../../../components/Table";
import ConfirmationDialog from "../../../api/ConfirmationDialog";

const AboutUs = () => {
    // State variables
    const [abouts, setAbouts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAbout, setSelectedAbout] = useState(null);
    const [loading, setLoading] = useState(false);

    // Table column definitions
    const columns = [
        { accessorKey: "title", header: "Title" },
        {
            accessorKey: "description",
            header: "Description",
            Cell: ({ row }) => {
                const [showFull, setShowFull] = useState(false);

                const toggleShowMore = () => setShowFull(!showFull);

                const description = row.original.description;
                const truncatedDescription =
                    description?.length > 50
                        ? `${description.substring(0, 50)}...`
                        : description;

                return (
                    <div>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: showFull ? description : truncatedDescription,
                            }}
                            style={{
                                maxHeight: showFull ? "none" : "100px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: showFull ? "normal" : "nowrap",
                            }}
                        />
                        {description?.length > 50 && (
                            <Button
                                size="small"
                                color="primary"
                                onClick={toggleShowMore}
                                sx={{
                                    padding: "2px 4px",
                                    marginTop: "4px",
                                    fontSize: "12px",
                                    textTransform: "none",
                                }}
                            >
                                {showFull ? "Show Less" : "Show More"}
                            </Button>
                        )}
                    </div>
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

    // Fetch about entries
    const fetchAbouts = async () => {
        setLoading(true);
        try {
            const response = await getRequest("/abouts");
            setAbouts(response?.data?.aboutEntries || []);
        } catch (error) {
            console.error("Error fetching about entries:", error);
            showToast("Failed to fetch about entries. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Handle delete about entry
    const handleDeleteAbout = async () => {
        if (!selectedAbout) return;

        try {
            await deleteRequest(`/abouts/${selectedAbout._id}`);
            showToast("About entry deleted successfully.", "success");
            fetchAbouts();
        } catch (error) {
            console.error("Error deleting about entry:", error);
            showToast("Failed to delete about entry. Please try again.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedAbout(null);
        }
    };

    // Lifecycle: Fetch about entries on component mount
    useEffect(() => {
        fetchAbouts();
    }, []);

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            {/* Header Section */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Typography variant="h6">About Us</Typography>
                <Link to="/aboutUs/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add About
                    </Button>
                </Link>
            </Box>

            {/* About Us Table */}
            <Table
                data={abouts}
                fields={columns}
                numberOfRows={abouts.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="aboutUs"
                handleDelete={(about) => {
                    setSelectedAbout(about);
                    setOpenDialog(true);
                }}
                isLoading={loading}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={openDialog}
                title="Delete About Entry"
                message={`Are you sure you want to delete the about entry "${selectedAbout?.title}"? This action cannot be undone.`}
                onConfirm={handleDeleteAbout}
                onCancel={() => {
                    setOpenDialog(false);
                    setSelectedAbout(null);
                }}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default AboutUs;
