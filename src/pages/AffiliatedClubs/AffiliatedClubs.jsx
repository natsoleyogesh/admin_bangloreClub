// import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
// import React, { useEffect, useState } from "react";

// import { useNavigate } from "react-router-dom";
// import { FiPlus } from "react-icons/fi";
// import { deleteRequest, getRequest, postFormDataRequest } from "../../api/commonAPI";
// import { showToast } from "../../api/toast";
// import ConfirmationDialog from "../../api/ConfirmationDialog";
// import Table from "../../components/Table";
// import { formatDateTime } from "../../api/config";

// const AffiliatedClubs = () => {
//     // const navigate = useNavigate();

//     const [clubList, setClubList] = useState([]);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [openFileDialog, setOpenFileDialog] = useState(false);
//     const [selectedClub, setSelectedClub] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [selectedFile, setSelectedFile] = useState(null);

//     const [countries, setCountries] = useState([]);
//     const [countryDescription, setCountryDescription] = useState("all");

//     const ClubsColumns = [
//         {
//             accessorKey: "affiliateClubNo",
//             header: "Affiliate Club No",
//         },
//         {
//             accessorKey: "name", //access nested data with dot notation
//             header: "Club Name",
//         },
//         {
//             accessorKey: "email",
//             header: "Email",
//         },
//         {
//             accessorKey: "faxNumber",
//             header: "Fax Number",
//         },
//         {
//             accessorKey: "phoneNumber1",
//             header: "Phone Number 1",
//         },
//         {
//             accessorKey: "phoneNumber2",
//             header: "Phone Number 2",
//         },
//         {
//             accessorKey: "affiliateDate",
//             header: "Affiliated Date",
//             Cell: ({ cell }) => formatDateTime(cell.getValue()),
//         },
//         {
//             accessorKey: "deaffiliateDate",
//             header: "Deaffiliate Date & Time",
//             Cell: ({ cell }) => formatDateTime(cell.getValue()),
//         },
//         {
//             accessorKey: "cityOther",
//             header: "City",
//         },
//         {
//             accessorKey: "addr1",
//             header: "Address 1",
//         },
//         {
//             accessorKey: "addr2",
//             header: "Address 2",
//         },
//         {
//             accessorKey: "addr3",
//             header: "Address 3",
//         },
//         {
//             accessorKey: "cityDescription",
//             header: "City Description",
//         },
//         {
//             accessorKey: "pin",
//             header: "Pin",
//         },
//         {
//             accessorKey: "stateDescription",
//             header: "State Description",
//         },
//         {
//             accessorKey: "countryDescription",
//             header: "Country Description",
//         },
//         {
//             accessorKey: "createdAt",
//             header: "Created Date & Time",
//             Cell: ({ cell }) => formatDateTime(cell.getValue()),
//         },
//     ];

//     const getClubs = async () => {
//         setLoading(true);
//         try {
//             const queryParams = {
//             };
//             if (countryDescription !== "all") {
//                 queryParams.countryDescription = countryDescription
//             }
//             const queryString = new URLSearchParams(queryParams).toString();
//             const response = await getRequest(`/all-affiliated-clubs?${queryString}`);
//             setClubList(response?.data?.clubs);
//         } catch (error) {
//             console.error("Failed to fetch clubs:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getCountries = async () => {

//         try {
//             const response = await getRequest(`/countries`);
//             console.log(response.data, "rs")
//             setCountries(response?.data);
//         } catch (error) {
//             console.error("Failed to fetch clubs:", error);
//         }
//     };

//     useEffect(() => {
//         getCountries()
//     }, [])

//     useEffect(() => {
//         getClubs();
//     }, [countryDescription]);

//     const handleDeleteClick = (club) => {
//         setSelectedClub(club);
//         setOpenDialog(true);
//     };

//     const handleConfirmDelete = async () => {
//         const id = selectedClub._id;
//         try {
//             await deleteRequest(`/affiliated-club/${id}`);
//             showToast("Club deleted successfully.", "success");
//             getClubs();
//         } catch (error) {
//             console.error("Failed to delete club:", error);
//             showToast(error.message || "Failed to delete club.", "error");
//         } finally {
//             setOpenDialog(false);
//             setSelectedClub(null);
//         }
//     };

//     const handleCancelDelete = () => {
//         setOpenDialog(false);
//         setSelectedClub(null);
//     };

//     const handleUploadFile = async () => {
//         if (!selectedFile) {
//             showToast("Please select a file first.", "error");
//             return;
//         }
//         const formData = new FormData();
//         formData.append("file", selectedFile);
//         try {
//             await postFormDataRequest("/upload-affiliated-clubs", formData);
//             showToast("File uploaded and clubs updated successfully.", "success");
//             getClubs();
//         } catch (error) {
//             console.error("Failed to upload file:", error);
//             showToast(error.message || "Failed to upload file.", "error");
//         } finally {
//             setOpenFileDialog(false);
//             setSelectedFile(null);
//         }
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Box
//                 sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: "14px",
//                 }}
//             >
//                 <Typography variant="h6">Affiliated Clubs</Typography>

//                 <Button
//                     variant="contained"
//                     color="primary"
//                     startIcon={<FiPlus />}
//                     sx={{ borderRadius: "20px" }}
//                     onClick={() => setOpenFileDialog(true)}
//                 >
//                     Add Clubs
//                 </Button>
//             </Box>
//             <Grid container spacing={2} alignItems="center" mb={2}>
//                 <Grid item xs={12} sm={3} md={2}>
//                     <InputLabel>Select Country</InputLabel>
//                     <FormControl fullWidth size="small">
//                         <Select
//                             value={countryDescription}
//                             onChange={(e) => setCountryDescription(e.target.value)}
//                         >
//                             <MenuItem value="all">All</MenuItem>
//                             {countries.map((option) => (
//                                 <MenuItem key={option.id} value={option.name}>
//                                     {option.name}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Grid>
//             </Grid>

//             <Table
// data={clubList}
// fields={ClubsColumns}
// numberOfRows={clubList.length}
// enableTopToolBar={true}
// enableBottomToolBar={true}
// enablePagination={true}
// enableRowSelection={true}
// enableColumnFilters={true}
// enableEditing={true}
// enableColumnDragging={true}
// showPreview
// routeLink="affiliated-club"
// handleDelete={handleDeleteClick}
//                 isLoading={loading}
//             />

//             {/* Confirmation Dialog for Deleting a Club */}
//             <ConfirmationDialog
//                 open={openDialog}
//                 title="Delete Club"
//                 message={`Are you sure you want to delete club ${selectedClub?.name}? This action cannot be undone.`}
//                 onConfirm={handleConfirmDelete}
//                 onCancel={handleCancelDelete}
//                 confirmText="Delete"
//                 cancelText="Cancel"
//                 loadingText="Deleting..."
//             />

// //             {/* Dialog for File Upload */}
//             <Dialog open={openFileDialog} onClose={() => setOpenFileDialog(false)}>
//                 <DialogTitle>Upload Clubs</DialogTitle>
//                 <DialogContent>
//                     <input
//                         type="file"
//                         accept=".xlsx, .xls"
//                         onChange={(e) => setSelectedFile(e.target.files[0])}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenFileDialog(false)}>Cancel</Button>
//                     <Button onClick={handleUploadFile} variant="contained" color="primary">
//                         Upload
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box >
//     );
// };

// export default AffiliatedClubs;


import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { FiPlus } from "react-icons/fi";
import { deleteRequest, getRequest, postFormDataRequest } from "../../api/commonAPI";
import { showToast } from "../../api/toast";
import ConfirmationDialog from "../../api/ConfirmationDialog";
import Table from "../../components/Table";
import { formatDateTime } from "../../api/config";

const AffiliatedClubs = () => {
    const [clubList, setClubList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openFileDialog, setOpenFileDialog] = useState(false);
    const [selectedClub, setSelectedClub] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    // const [countries, setCountries] = useState([]);
    // const [states, setStates] = useState([]);
    // Country & State Selection
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState({ name: "all", id: "all" }); // Country name & ID
    const [selectedState, setSelectedState] = useState("all");
    const [fetchingStates, setFetchingStates] = useState(false);
    // Pagination State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const ClubsColumns = [
        { accessorKey: "affiliateClubNo", header: "Affiliate Club No" },
        { accessorKey: "name", header: "Club Name" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "faxNumber", header: "Fax Number" },
        { accessorKey: "phoneNumber1", header: "Phone Number 1" },
        { accessorKey: "phoneNumber2", header: "Phone Number 2" },
        { accessorKey: "affiliateDate", header: "Affiliated Date", Cell: ({ cell }) => formatDateTime(cell.getValue()) },
        { accessorKey: "deaffiliateDate", header: "Deaffiliate Date & Time", Cell: ({ cell }) => formatDateTime(cell.getValue()) },
        { accessorKey: "cityOther", header: "City" },
        { accessorKey: "addr1", header: "Address 1" },
        { accessorKey: "addr2", header: "Address 2" },
        { accessorKey: "addr3", header: "Address 3" },
        { accessorKey: "cityDescription", header: "City Description" },
        { accessorKey: "pin", header: "Pin" },
        { accessorKey: "stateDescription", header: "State Description" },
        { accessorKey: "countryDescription", header: "Country Description" },
        { accessorKey: "createdAt", header: "Created Date & Time", Cell: ({ cell }) => formatDateTime(cell.getValue()) },
    ];

    // const getClubs = useCallback(async (pageNumber = 1, pageSize = 10) => {
    //     setLoading(true);
    //     try {
    //         const queryParams = { page: pageNumber, limit: pageSize };
    //         if (countryDescription !== "all") {
    //             queryParams.countryDescription = countryDescription;
    //         }
    //         if (stateDescription !== "all") {
    //             queryParams.stateDescription = stateDescription;
    //         }
    //         const queryString = new URLSearchParams(queryParams).toString();
    //         const response = await getRequest(`/all-affiliated-clubs?${queryString}`);
    //         setClubList(response?.data?.clubs || []);
    //         setTotalPages(response?.data?.pagination?.totalPages || 1);
    //         setTotalRecords(response?.data?.pagination?.totalClubs || 0);
    //         if (response.data.pagination?.currentPage) {
    //             setPage(response.data.pagination.currentPage);
    //         }

    //         if (response.data.pagination?.pageSize) {
    //             setLimit(response.data.pagination.pageSize);
    //         }
    //     } catch (error) {
    //         console.error("Failed to fetch clubs:", error);
    //         showToast(error.message || "Failed to fetch clubs.", "error");
    //     } finally {
    //         setLoading(false);
    //     }
    // }, [countryDescription, stateDescription]);


    /** 📌 Fetch Clubs Based on Selected Filters & Pagination */
    const getClubs = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = { page, limit };
            if (selectedCountry.name !== "all") queryParams.countryDescription = selectedCountry.name;
            if (selectedState !== "all") queryParams.stateDescription = selectedState;

            const queryString = new URLSearchParams(queryParams).toString();
            const response = await getRequest(`/all-affiliated-clubs?${queryString}`);

            setClubList(response?.data?.clubs || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setTotalRecords(response?.data?.pagination?.totalClubs || 0);
        } catch (error) {
            console.error("Failed to fetch clubs:", error);
            showToast("Failed to fetch clubs.", "error");
        } finally {
            setLoading(false);
        }
    }, [selectedCountry, selectedState, page, limit]);

    /** 📌 Fetch List of Countries */
    const getCountries = async () => {
        try {
            const response = await getRequest(`/countries`);
            const countryOptions = [{ id: "all", name: "all" }, ...response?.data];
            setCountries(countryOptions);
        } catch (error) {
            console.error("Failed to fetch countries:", error);
        }
    };

    /** 📌 Fetch States Based on Selected Country */
    const getStates = async (countryId) => {
        if (countryId === "all") {
            setStates([]);
            return;
        }

        setFetchingStates(true);
        try {
            const response = await getRequest(`/countries/${countryId}/states`);
            setStates(response?.data);
        } catch (error) {
            console.error("Failed to fetch states:", error);
        } finally {
            setFetchingStates(false);
        }
    };


    useEffect(() => {
        getCountries();
        getClubs();
    }, []);

    useEffect(() => {
        getClubs();
    }, [selectedCountry, selectedState, page, limit]);


    /** 📌 Handle Country Change */
    const handleCountryChange = (event) => {
        const selectedCountryId = event.target.value;
        const countryObj = countries.find((c) => c.id === selectedCountryId);
        setSelectedCountry(countryObj);
        setSelectedState("all"); // Reset state when country changes
        getStates(countryObj.id);
    };



    const handleDeleteClick = (club) => {
        setSelectedClub(club);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteRequest(`/affiliated-club/${selectedClub._id}`);
            showToast("Club deleted successfully.", "success");
            getClubs(page, limit);
        } catch (error) {
            console.error("Failed to delete club:", error);
            showToast(error.message || "Failed to delete club.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedClub(null);
        }
    };

    const handleUploadFile = async () => {
        if (!selectedFile) {
            showToast("Please select a file first.", "error");
            return;
        }
        const formData = new FormData();
        formData.append("file", selectedFile);
        try {
            await postFormDataRequest("/upload-affiliated-clubs", formData);
            showToast("File uploaded and clubs updated successfully.", "success");
            getClubs(page, limit);
        } catch (error) {
            console.error("Failed to upload file:", error);
            showToast(error.message || "Failed to upload file.", "error");
        } finally {
            setOpenFileDialog(false);
            setSelectedFile(null);
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <Typography variant="h6">Affiliated Clubs</Typography>
                <Button variant="contained" color="primary" startIcon={<FiPlus />} sx={{ borderRadius: "20px" }} onClick={() => setOpenFileDialog(true)}>
                    Add Clubs
                </Button>
            </Box>
            {/* <Grid container spacing={2} alignItems="center" mb={2}>
                <Grid item xs={12} sm={3} md={2}>
                    <InputLabel>Select Country</InputLabel>
                    <FormControl fullWidth size="small">
                        <Select value={countryDescription} onChange={(e) => setCountryDescription(e.target.value)}>
                            <MenuItem value="all">All</MenuItem>
                            {countries.map((option) => (
                                <MenuItem key={option.id} value={option.name}>{option.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                {countryDescription != "all" && <Grid item xs={12} sm={3} md={2}>
                    <InputLabel>Select State</InputLabel>
                    <FormControl fullWidth size="small">
                        <Select value={stateDescription} onChange={(e) => setStateDescription(e.target.value)}>
                            <MenuItem value="all">All</MenuItem>
                            {states.map((option) => (
                                <MenuItem key={option.id} value={option.name}>{option.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>}
            </Grid> */}
            {/* Country & State Filters */}
            <Grid container spacing={2} alignItems="center" mb={2}>
                <Grid item xs={12} sm={3} md={2}>
                    <InputLabel>Select Country</InputLabel>
                    <FormControl fullWidth size="small">
                        <Select value={selectedCountry.id} onChange={handleCountryChange}>
                            {countries.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={3} md={2}>
                    <InputLabel>Select State</InputLabel>
                    <FormControl fullWidth size="small" disabled={selectedCountry.id === "all"}>
                        <Select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                            {states.map((option) => (
                                <MenuItem key={option.id} value={option.name}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {fetchingStates && <CircularProgress size={20} />}
                </Grid>
            </Grid>

            <Table
                data={clubList}
                fields={ClubsColumns}
                numberOfRows={clubList.length}
                enableTopToolBar={true}
                enableBottomToolBar={true}
                enablePagination={true}
                enableRowSelection={true}
                enableColumnFilters={true}
                enableEditing={true}
                enableColumnDragging={true}
                showPreview
                routeLink="affiliated-club"
                handleDelete={handleDeleteClick}
                isLoading={loading}
                pagination={{
                    page,
                    pageSize: limit,
                    totalPages,
                    totalRecords,
                    onPageChange: (newPage) => setPage(newPage),
                    onPageSizeChange: (newLimit) => setLimit(newLimit),
                }}
            />

            <ConfirmationDialog open={openDialog} title="Delete Club" message={`Are you sure you want to delete club ${selectedClub?.name}?`} onConfirm={handleConfirmDelete} onCancel={() => setOpenDialog(false)} confirmText="Delete" cancelText="Cancel" loadingText="Deleting..." />

            {/* Dialog for File Upload */}
            <Dialog open={openFileDialog} onClose={() => setOpenFileDialog(false)}>
                <DialogTitle>Upload Clubs</DialogTitle>
                <DialogContent>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenFileDialog(false)}>Cancel</Button>
                    <Button onClick={handleUploadFile} variant="contained" color="primary">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AffiliatedClubs;
