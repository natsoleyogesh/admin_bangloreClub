import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { formatDateTime, PUBLIC_API_URI } from "../api/config";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { showToast } from "../api/toast";
import { deleteRuleByeLaw, fetchAllRuleByeLaws } from "../api/ruleByelaws";
import { getRequest } from "../api/commonAPI";


const Rules = () => {
    // const navigate = useNavigate();

    const [rulesList, setRulesList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRule, setSelectedRule] = useState(null);
    const [loading, setLoading] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    // Format date to "14 December 2024"
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    // Table columns definition
    const ruleColumns = [
        {
            accessorKey: "title", // Access nested data
            header: "Rule Title",
        },
        {
            accessorKey: "status", // Normal accessor key
            header: "Status",
        },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
        {
            accessorKey: "expiredDate",
            header: "Expiration Date",
            Cell: ({ cell }) => formatDate(cell.getValue()),
        },
        {
            accessorKey: "fileUrl", // PDF file path stored in the backend
            header: "Action",
            Cell: ({ row }) => (
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => window.open(`${PUBLIC_API_URI}${row.original.fileUrl}`, "_blank")}
                >
                    View PDF
                </Button>
            ),
        },
    ];

    // Fetch all rules/byelaws with pagination
    const fetchRules = useCallback(async (pageNumber, pageSize) => {
        setLoading(true);
        try {
            // const response = await fetchAllRuleByeLaws({ page, limit });
            const response = await getRequest(`${PUBLIC_API_URI}/rulebyelaws?page=${pageNumber}&limit=${pageSize}`);

            setRulesList(response?.data?.ruleByelaws || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalRulesBylaws || 0);
            if (response.data.pagination?.currentPage) {
                setPage(response.data.pagination.currentPage);
            }

            if (response.data.pagination?.pageSize) {
                setLimit(response.data.pagination.pageSize);
            }
        } catch (error) {
            console.error("Failed to fetch rules/byelaws:", error);
            showToast("Failed to fetch rules/byelaws. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchRules();
    }, [fetchRules]);

    // Handle delete button click
    const handleDeleteClick = (rule) => {
        setSelectedRule(rule);
        setOpenDialog(true);
    };

    // Confirm delete action
    const handleConfirmDelete = async () => {
        const ruleId = selectedRule._id;
        try {
            await deleteRuleByeLaw(ruleId);
            fetchRules();
            showToast("Rule/Byelaw deleted successfully.", "success");
        } catch (error) {
            console.error("Failed to delete rule/byelaw:", error);
            showToast(error.message || "Failed to delete rule/byelaw.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedRule(null);
        }
    };

    // Cancel delete action
    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedRule(null);
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                }}
            >
                <Typography variant="h6">Rules/ByeLaws</Typography>
                <Link to="/rulebyelaw/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Rule/ByeLaw
                    </Button>
                </Link>
            </Box>

            {/* Rules Table */}
            <Table
                data={rulesList}
                fields={ruleColumns}
                numberOfRows={rulesList.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="rulebyelaw"
                handleDelete={handleDeleteClick}
                isLoading={loading}
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

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={openDialog}
                title="Delete Rule/ByeLaw"
                message={`Are you sure you want to delete the rule/byelaw "${selectedRule?.title}"? This action cannot be undone.`}
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

