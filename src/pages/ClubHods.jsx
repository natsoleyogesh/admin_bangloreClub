import { Avatar, Box, Button, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { formatDateTime, PUBLIC_API_URI } from "../api/config";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { showToast } from "../api/toast";
import { deleteHod, fetchAllHods } from "../api/clubhods";
import { getRequest } from "../api/commonAPI";

const ClubHods = () => {


    // const navigate = useNavigate();

    const [hodList, setHodList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedHod, setSelectedHod] = useState(null);
    const [loading, setLoading] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    // // Format date to "14 December 2024"
    // const formatDate = (dateString) => {
    //     const options = { year: 'numeric', month: 'long', day: 'numeric' };
    //     const date = new Date(dateString);
    //     return date.toLocaleDateString(undefined, options);
    // };

    // Format time to "01:00 PM"
    // const formatTime = (timeString) => {
    //     const [hour, minute] = timeString.split(':').map(Number);
    //     const date = new Date();
    //     date.setHours(hour, minute);
    //     return date.toLocaleTimeString(undefined, {
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         hour12: true,
    //     });
    // };


    const hodColumns = [
        {
            accessorKey: "image", //access nested data with dot notation
            header: "Image",
            size: 100,
            Cell: ({ cell }) => (
                <div>
                    <Avatar src={`${PUBLIC_API_URI}${cell.getValue()}`} alt={"Hod Image"} variant="rounded" sx={{ width: 100, height: 100, objectFit: "cover" }} />
                    {/* <img
                        src={`${PUBLIC_API_URI}${cell.getValue()}}`}
                        // sx={{ width: 120, height: 120 }}
                        height={120}
                        width={120}
                    /> */}
                </div>
            ),
        },
        {
            accessorKey: "name", //access nested data with dot notation
            header: "Hod Name",
        },
        {
            accessorKey: "email", //access nested data with dot notation
            header: "Email",
        },

        {
            accessorKey: "contactNumber", //normal accessorKey
            header: "Hod Contact Number",
        },
        {
            accessorKey: "designation", //access nested data with dot notation
            header: "Designation",
        },
        {
            accessorKey: "department", //normal accessorKey
            header: "Department",
        },
        {
            accessorKey: "status", //normal accessorKey
            header: "Status",
        },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },


    ];

    // Fetch HODs with pagination
    const getHods = useCallback(async (pageNumber, pageSize) => {
        setLoading(true);
        try {
            // const response = await fetchAllHods({ page, limit });
            const response = await getRequest(`${PUBLIC_API_URI}/hods?page=${pageNumber}&limit=${pageSize}`);

            setHodList(response?.data?.hods || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalHODs || 0);
        } catch (error) {
            console.error("Failed to fetch HODs:", error);
            showToast("Failed to fetch HODs. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        getHods();
    }, [getHods]);


    console.log(hodList, "member")

    const handleDeleteClick = (hod) => {
        setSelectedHod(hod);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        const hodId = selectedHod._id;
        console.log(hodId, "usersgshg")
        try {
            await deleteHod(hodId);
            getHods()

            showToast("Hod deleted successfully.", "success");
        } catch (error) {
            console.error("Failed to delete hod:", error);
            showToast(error.message || "Failed to delete HOD.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedHod(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedHod(null);
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
                <Typography variant="h6">Events</Typography>
                <Link to="/hod/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add HOD
                    </Button>
                </Link>
            </Box>
            <Table
                data={hodList}
                fields={hodColumns}
                numberOfRows={hodList.length}
                enableTopToolBar={true}
                enableBottomToolBar={true}
                enablePagination={true}
                enableRowSelection={true}
                enableColumnFilters={true}
                enableEditing={true}
                enableColumnDragging={true}
                showPreview={true}
                routeLink="hod"
                handleDelete={handleDeleteClick}
                isLoading={loading}
                totalDownloadspagination={{
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
                title="Delete Hod"
                message={`Are you sure you want to delete HOD ${selectedHod?.name}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default ClubHods;
