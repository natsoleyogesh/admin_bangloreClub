import { Avatar, Box, Button, Chip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import { customers, customersColumns } from "../data/customers";
import { formatDateTime, PUBLIC_API_URI } from "../api/config";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { showToast } from "../api/toast";
import { FiPlus } from "react-icons/fi";
import { deleteMemberApplication, fetchAllMembersApplications } from "../api/memberWaiting";

const MemberApplications = () => {

    const navigate = useNavigate();

    const [applicationsList, setApplicationList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [loading, setLoading] = useState(null)
    const applicationsColumns = [
        {
            accessorKey: "profilePicture", //access nested data with dot notation
            header: "Image",
            size: 100,
            Cell: ({ cell }) => (
                <div>
                    <Avatar src={`${PUBLIC_API_URI}${cell.getValue()}`} sx={{ width: 30, height: 30 }} />
                </div>
            ),
        },
        {
            accessorKey: "applicationId",
            header: "Application Id",
        },
        {
            accessorKey: "name", //access nested data with dot notation
            header: "Applicant Name",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "mobileNumber",
            header: "Phone Number",
        },
        {
            accessorKey: "address", //normal accessorKey
            header: "Address",
        },
        {
            accessorKey: "applicationStatus",
            header: "Application Status",
            Cell: ({ cell }) => (
                <Chip
                    label={cell.getValue()}
                    color={cell.getValue() === "Approved" ? "success" : "default"} // Approved, Pending, Rejected
                    size="small"
                />
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },

    ];

    const getApplications = async () => {
        setLoading(true)
        try {
            const application = await fetchAllMembersApplications();
            console.log(application.data?.applications, "user")
            setApplicationList(application?.data?.applications);
            setLoading(false)
        } catch (error) {
            console.error("Failed to fetch members:", error);
            setLoading(false)
        }
    };

    useEffect(() => {

        getApplications();
    }, []);

    console.log(applicationsList, "member")

    const handleDeleteClick = (application) => {
        setSelectedApplication(application);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        const applicationId = selectedApplication._id;
        console.log(applicationId, "usersgshg")
        try {
            await deleteMemberApplication(applicationId);
            getApplications()
            showToast("Application deleted successfully.", "success");
        } catch (error) {
            console.error("Failed to delete member:", error);
            showToast(error.message || "Failed to delete member.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedApplication(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedApplication(null);
    };

    // Handle navigation to "Add Member" page
    const handleAddMember = () => {
        navigate("/member/add");
    };



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
                <Typography variant="h6">
                    Applications
                </Typography>
                <Link to="/application/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Member
                    </Button>
                </Link>
            </Box>

            <Table
                data={applicationsList}
                fields={applicationsColumns}
                numberOfRows={applicationsList.length}
                enableTopToolBar={true}
                enableBottomToolBar={true}
                enablePagination={true}
                enableRowSelection={true}
                enableColumnFilters={true}
                enableEditing={true}
                enableColumnDragging={true}
                showPreview
                routeLink="application"
                handleDelete={handleDeleteClick}
                isLoading={loading}
            />
            <ConfirmationDialog
                open={openDialog}
                title="Delete Member"
                message={`Are you sure you want to delete Application ${selectedApplication?.name}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default MemberApplications;
