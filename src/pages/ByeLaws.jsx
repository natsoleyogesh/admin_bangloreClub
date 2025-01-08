import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../components/Table";
import ConfirmationDialog from "../api/ConfirmationDialog"; // Adjust import path as necessary
// import { showToast } from "../utils/toast"; // Adjust import path as necessary
import { fetchAllRuleByeLaws, deleteRuleByeLaw } from "../api/ruleByelaws";
import { showToast } from "../api/toast";
import { formatDateTime } from "../api/config";

const ByeLaws = () => {
    const [byeLaws, setByeLaws] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedByeLaw, setSelectedByeLaw] = useState(null);

    // Format date utility
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Columns for the table
    const columns = [
        { accessorKey: "title", header: "ByeLaw Title" },
        // { accessorKey: "description", header: "Description" },
        {
            accessorKey: "description",
            header: "Description",
            Cell: ({ row }) => {
                const [showFull, setShowFull] = React.useState(false);

                const toggleShowMore = () => setShowFull(!showFull);

                const description = row.original.description;

                const truncatedDescription = description?.length > 50
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
        { accessorKey: "type", header: "Type" },
        // { accessorKey: "category", header: "Category" },
        { accessorKey: "status", header: "Status" },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    // Fetch all bye-laws
    const fetchByeLaws = async () => {
        try {
            const response = await fetchAllRuleByeLaws("Byelaw");
            setByeLaws(response?.data?.ruleByelaws || []);
        } catch (error) {
            console.error("Error fetching bye-laws:", error);
            showToast("Failed to fetch bye-laws. Please try again.", "error");
        }
    };

    useEffect(() => {
        fetchByeLaws();
    }, []);

    // Handle delete confirmation
    const handleDeleteClick = (byeLaw) => {
        setSelectedByeLaw(byeLaw);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (selectedByeLaw) {
                await deleteRuleByeLaw(selectedByeLaw._id);
                showToast("ByeLaw deleted successfully.", "success");
                fetchByeLaws();
            }
        } catch (error) {
            console.error("Error deleting bye-law:", error);
            showToast("Failed to delete bye-law. Please try again.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedByeLaw(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedByeLaw(null);
    };

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
                <Typography variant="h6">ByeLaws</Typography>
                <Link to="/ruleByeLaw/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add ByeLaw
                    </Button>
                </Link>
            </Box>

            {/* ByeLaws Table */}
            <Table
                data={byeLaws}
                fields={columns}
                numberOfRows={byeLaws.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="ruleByeLaw"
                handleDelete={handleDeleteClick}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={openDialog}
                title="Delete ByeLaw"
                message={`Are you sure you want to delete the bye-law "${selectedByeLaw?.title}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default ByeLaws;
