import { Avatar, Box, Button, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { formatDateTime, PUBLIC_API_URI } from "../api/config";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { showToast } from "../api/toast";
import { deleteGCM, fetchAllGCMs } from "../api/gcm";
import { getRequest } from "../api/commonAPI";

const GCMs = () => {
    // const navigate = useNavigate();
    const [gcmList, setGcmList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedGCM, setSelectedGCM] = useState(null);
    const [loading, setLoading] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    // // Format date to "Wed, Apr 28 • 5:30 PM"
    // const formatDate = (dateString) => {
    //     const options = {
    //         year: "numeric",
    //         month: "short",
    //         day: "numeric",
    //         weekday: "short",
    //         hour: "numeric",
    //         minute: "numeric",
    //     };
    //     const date = new Date(dateString);
    //     return date.toLocaleDateString("en-US", options);
    // };

    // Define columns for the GCM table
    const GCMColumns = [
        {
            accessorKey: "image",
            header: "Profile Image",
            size: 100,
            Cell: ({ cell }) => (
                <Avatar
                    src={`${PUBLIC_API_URI}${cell.getValue()}`}
                    alt={"GCM Image"}
                    variant="rounded"
                    sx={{ width: 100, height: 100, objectFit: "cover" }}
                />
            ),
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "memberId",
            header: "Member ID",
        },
        {
            accessorKey: "designation",
            header: "Designation",
        },
        {
            accessorKey: "priority",
            header: "Priority",
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
        {
            accessorKey: "categories",
            header: "Categories & Subcategories",
            Cell: ({ row }) => (
                <>
                    {row.original.categories.map((cat, index) => (
                        <div key={index}>
                            <strong>{cat.name}</strong>: {cat.subCategories.map((sub) => sub.name).join(", ")}
                        </div>
                    ))}
                </>
            ),
        },
    ];

    // Fetch GCMs with pagination
    const getAllGCMs = useCallback(async (pageNumber, pageSize) => {
        setLoading(true);
        try {
            // const response = await fetchAllGCMs({ page, limit });
            const response = await getRequest(`${PUBLIC_API_URI}/gcms?page=${pageNumber}&limit=${pageSize}`);

            setGcmList(response?.data?.gcms || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalGCMs || 0);
        } catch (error) {
            console.error("Failed to fetch GCMs:", error);
            showToast(error.message || "Failed to fetch GCMs.", "error");
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        getAllGCMs();
    }, [getAllGCMs]);

    const handleDeleteClick = (gcm) => {
        setSelectedGCM(gcm);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        const gcmId = selectedGCM._id;
        try {
            await deleteGCM(gcmId);
            getAllGCMs();
            showToast("GCM deleted successfully.", "success");
        } catch (error) {
            console.error("Failed to delete GCM:", error);
            showToast(error.message || "Failed to delete GCM.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedGCM(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedGCM(null);
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                }}
            >
                <Typography variant="h6">General Committee Members</Typography>
                <Link to="/gcm/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add GCM
                    </Button>
                </Link>
            </Box>
            <Table
                data={gcmList}
                fields={GCMColumns}
                numberOfRows={gcmList.length}
                enableTopToolBar={true}
                enableBottomToolBar={true}
                enablePagination={true}
                enableRowSelection={true}
                enableColumnFilters={true}
                enableEditing={true}
                enableColumnDragging={true}
                showPreview={true}
                routeLink="gcm"
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
            <ConfirmationDialog
                open={openDialog}
                title="Delete GCM"
                message={`Are you sure you want to delete GCM ${selectedGCM?.name}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default GCMs;
