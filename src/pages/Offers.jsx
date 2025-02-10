import { Avatar, Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { formatDateTime, PUBLIC_API_URI } from "../api/config";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { showToast } from "../api/toast";
import { deleteOffer, fetchAllOffers } from "../api/offer";

const Offers = () => {


    // const navigate = useNavigate();

    const [offerList, setOfferList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [loading, setLoading] = useState(null)
    // Format date to "14 December 2024"
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

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


    const offerColumns = [
        {
            accessorKey: "bannerImage", //access nested data with dot notation
            header: "Image",
            size: 100,
            Cell: ({ cell }) => (
                <div>
                    <Avatar src={`${PUBLIC_API_URI}${cell.getValue()}`} alt={"Offer Image"} variant="rounded" sx={{ width: 100, height: 100, objectFit: "cover" }} />
                </div>
            ),
        },
        {
            accessorKey: "title", //access nested data with dot notation
            header: "Offer Title",
        },
        {
            accessorKey: "description",
            header: "Offer Description",
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
        {
            accessorKey: "startDate",
            header: "Start Date",
            Cell: ({ cell }) => formatDate(cell.getValue()),
        },
        {
            accessorKey: "endDate",
            header: "End Date",
            Cell: ({ cell }) => formatDate(cell.getValue()),
        },
        {
            accessorKey: "couponCode", //normal accessorKey
            header: "Offer Coupon Code",
        },
        {
            accessorKey: "discountPercentage", //normal accessorKey
            header: "Offer Discount %",
        },
        {
            accessorKey: "type", //normal accessorKey
            header: "Offer Type",
        },
        {
            accessorKey: "department", //normal accessorKey
            header: "Offer Department",
        },
        {
            accessorKey: "showExclusive", // Exclusive Offer Column
            header: "Exclusive Offer",
            Cell: ({ cell }) => {
                const value = cell.getValue();
                return (
                    <Typography
                        variant="body2"
                        sx={{
                            color: value ? "green" : "inherit",
                            fontWeight: value ? "bold" : "normal",
                        }}
                    >
                        {value ? "YES" : "NO"}
                    </Typography>
                );
            },
        },
        {
            accessorKey: "status", //normal accessorKey
            header: "Offer Status",
        },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },

    ];

    const getOffers = async () => {
        setLoading(true)
        try {
            const offer = await fetchAllOffers();
            console.log(offer.data.offers, "user")
            setOfferList(offer?.data.offers);
            setLoading(false)
        } catch (error) {
            console.error("Failed to fetch members:", error);
            setLoading(false)
        }
    };

    useEffect(() => {

        getOffers();
    }, []);

    console.log(offerList, "member")

    const handleDeleteClick = (event) => {
        setSelectedOffer(event);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        const offerId = selectedOffer._id;
        console.log(offerId, "usersgshg")
        try {
            await deleteOffer(offerId);
            getOffers()

            showToast("offer deleted successfully.", "success");
        } catch (error) {
            console.error("Failed to delete member:", error);
            showToast(error.message || "Failed to delete member.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedOffer(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedOffer(null);
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
                <Typography variant="h6">Offers</Typography>
                <Link to="/offer/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Offer
                    </Button>
                </Link>
            </Box>
            <Table
                data={offerList}
                fields={offerColumns}
                numberOfRows={offerList.length}
                enableTopToolBar={true}
                enableBottomToolBar={true}
                enablePagination={true}
                enableRowSelection={true}
                enableColumnFilters={true}
                enableEditing={true}
                enableColumnDragging={true}
                showPreview={true}
                routeLink="offer"
                handleDelete={handleDeleteClick}
                isLoading={loading}
            />
            <ConfirmationDialog
                open={openDialog}
                title="Delete Offer"
                message={`Are you sure you want to delete offer ${selectedOffer?.title}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Offers;
