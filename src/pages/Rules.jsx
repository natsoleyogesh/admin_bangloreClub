import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { showToast } from "../api/toast";
import { fetchAllRuleByeLaws, deleteRuleByeLaw } from "../api/ruleByelaws";
import ConfirmationDialog from "../api/ConfirmationDialog"; import { formatDateTime } from "../api/config";
; // Adjust import path as necessary

const Rules = () => {
    const navigate = useNavigate();
    const [rules, setRules] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRule, setSelectedRule] = useState(null);
    const [loading, setLoading] = useState(null)
    // Format date utility
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Columns for the table
    const columns = [
        { accessorKey: "title", header: "Rule Title" },
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

    // Fetch all rules
    const fetchRules = async () => {
        setLoading(true)
        try {
            const response = await fetchAllRuleByeLaws("Rule");
            setRules(response?.data?.ruleByelaws || []);
            setLoading(false)
        } catch (error) {
            console.error("Error fetching rules:", error);
            setLoading(false)
            showToast("Failed to fetch rules. Please try again.", "error");
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    // Handle delete confirmation
    const handleDeleteClick = (rule) => {
        setSelectedRule(rule);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (selectedRule) {
                await deleteRuleByeLaw(selectedRule._id);
                showToast("Rule deleted successfully.", "success");
                fetchRules();
            }
        } catch (error) {
            console.error("Error deleting rule:", error);
            showToast("Failed to delete rule. Please try again.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedRule(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedRule(null);
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
                <Typography variant="h6">Rules</Typography>
                <Link to="/ruleByeLaw/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Rule
                    </Button>
                </Link>
            </Box>

            {/* Rules Table */}
            <Table
                data={rules}
                fields={columns}
                numberOfRows={rules.length}
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
                isLoading={loading}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={openDialog}
                title="Delete Rule"
                message={`Are you sure you want to delete the rule "${selectedRule?.title}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Rules;
