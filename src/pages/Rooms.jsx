import { Avatar, Box, Button, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { deleteRoom, fetchAllRooms } from "../api/room";
import { fetchAllCategories } from "../api/category";
import { formatDateTime, PUBLIC_API_URI } from "../api/config";

import { showToast } from "../api/toast";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { getRequest } from "../api/commonAPI";

const Rooms = () => {
    // const navigate = useNavigate();
    const [roomList, setRoomList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    // Fetch all categories (room types)
    const getAllCategories = async () => {
        try {
            const response = await fetchAllCategories();
            setCategories(response?.data || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            showToast("Failed to fetch room categories.", "error");
        }
    };

    // Fetch all rules/byelaws with pagination
    const getRooms = useCallback(async (pageNumber, pageSize) => {
        setLoading(true);
        try {
            // const response = await fetchAllRuleByeLaws({ page, limit });
            const response = await getRequest(`${PUBLIC_API_URI}/roomwithcategorys?page=${pageNumber}&limit=${pageSize}`);

            setRoomList(response?.data?.data || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalRooms || 0);
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
        getRooms(page, limit);
    }, [getRooms]);

    // // Fetch all rooms
    // const getRooms = async () => {
    //     setLoading(true)
    //     try {
    //         const response = await fetchAllRooms();
    //         setRoomList(response?.data?.data || []);
    //         setLoading(false)
    //     } catch (error) {
    //         console.error("Failed to fetch rooms:", error);
    //         setLoading(false)
    //         showToast("Failed to fetch rooms.", "error");
    //     }
    // };

    useEffect(() => {
        getAllCategories();
    }, []);

    // const handleDeleteClick = (room) => {
    //     setSelectedRoom(room);
    //     setOpenDialog(true);
    // };

    const handleConfirmDelete = async () => {
        const roomId = selectedRoom._id;
        try {
            await deleteRoom(roomId);
            getRooms(); // Refresh the list after deletion
            showToast("Room deleted successfully.", "success");
        } catch (error) {
            console.error("Failed to delete room:", error);
            showToast("Failed to delete room.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedRoom(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedRoom(null);
    };

    const roomColumns = [
        {
            accessorKey: "images",
            header: "Image",
            size: 100,
            Cell: ({ cell }) => (
                <Avatar
                    src={`${PUBLIC_API_URI}${cell.getValue()?.[0]}`}
                    alt="Room Image"
                    sx={{ width: 100, height: 100 }}
                />
            ),
        },
        // {
        //     accessorKey: "roomName",
        //     header: "Room Name",
        // },
        // {
        //     accessorKey: "roomDetails[0].roomNumber",
        //     header: "Room Number",
        //     Cell: ({ cell }) => cell.getValue() || "N/A",
        // },
        {
            accessorKey: "categoryName.name",
            header: "Room Type",
        },
        // {
        //     accessorKey: "pricingDetails[0].price",
        //     header: "Price",
        //     Cell: ({ cell }) => `₹${cell.getValue()}`,
        // },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "roomSize",
            header: "Room Size (sq.ft)",
        },
        {
            accessorKey: "amenities",
            header: "Amenities",
            Cell: ({ cell }) => cell.getValue()?.map((amenity) => amenity.name).join(", "),
        },
        {
            accessorKey: "features",
            header: "Features",
            Cell: ({ cell }) => {
                const features = cell.getValue();
                return `Smoking: ${features.smokingAllowed ? "Yes" : "No"}, Pet-Friendly: ${features.petFriendly ? "Yes" : "No"}, Accessible: ${features.accessible ? "Yes" : "No"}`;
            },
        },
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
                    marginBottom: "16px",
                }}
            >
                <Typography variant="h6">Rooms With Categories</Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Link to="/roomwith-category/add" style={{ textDecoration: "none" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiPlus />}
                            sx={{ borderRadius: "20px" }}
                        >
                            Add Room
                        </Button>
                    </Link>
                </Box>
            </Box>
            {/* <FormControl sx={{ marginBottom: "16px" }}>
                <InputLabel>Filter by Category</InputLabel>
                <Select
                    value={selectedCategory}
                    label="Filter by Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <MenuItem value="">All</MenuItem>
                    {categories.map((category) => (
                        <MenuItem key={category._id} value={category.categoryName.name}>
                            {category.categoryName.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl> */}
            <Table
                data={roomList.filter((room) =>
                    selectedCategory ? room.categoryName.name === selectedCategory : true
                )}
                fields={roomColumns}
                numberOfRows={roomList.length}
                enableTopToolBar={true}
                enableBottomToolBar={true}
                enablePagination={true}
                enableRowSelection={true}
                enableColumnFilters={true}
                enableEditing={true}
                enableColumnDragging={true}
                showPreview={true}
                routeLink="roomwith-category"
                isLoading={loading}
                // handleDelete={handleDeleteClick}
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
                title="Delete Room"
                message={`Are you sure you want to delete room "${selectedRoom?.roomName}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Rooms;

