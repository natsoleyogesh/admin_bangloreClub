
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { TextField, Button, MenuItem, Select, InputLabel, FormControl, CircularProgress, Box } from "@mui/material";
// import { getRequest, putRequest } from "../../../api/commonAPI";
// import { PUBLIC_API_URI } from "../../../api/config";
// import { showToast } from "../../../api/toast";

// const UpdateQrData = () => {
//     // State variables
//     const [users, setUsers] = useState([]); // To store the list of users
//     const [selectedUserId, setSelectedUserId] = useState(""); // To store selected userId
//     const [oldQrCodeId, setOldQrCodeId] = useState(""); // To store old QR Code ID
//     const [newQrCodeId, setNewQrCodeId] = useState(""); // To store new QR Code ID
//     const [qrCodeImage, setQrCodeImage] = useState(""); // To store QR Code Image URL
//     const [loading, setLoading] = useState(false); // To show loading state

//     // Fetch all users when the component mounts
//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await getRequest("/admin/get-users"); // Update with the correct API endpoint
//                 setUsers(response.data.users); // Assuming the response has a 'users' array
//             } catch (error) {
//                 console.error("Error fetching users:", error);
//             }
//         };
//         fetchUsers();
//     }, []);

//     // Handle user selection
//     const handleUserChange = async (e) => {
//         const userId = e.target.value;
//         setSelectedUserId(userId);

//         // Fetch the user details based on selected userId
//         try {
//             const response = await getRequest(`/member-details/${userId}`); // Update with correct endpoint
//             const userData = response.data.user;

//             setOldQrCodeId(userData.qrCodeId || ""); // Set the old QR Code ID
//             setNewQrCodeId(userData.qrCodeId || ""); // Set the new QR Code ID (initially same as old)

//             // Check if qrCode exists and is not blank, otherwise set it to ""
//             console.log(userData, userData.qrCode, "userData");
//             if (userData.qrCode && userData.qrCode !== "") {
//                 setQrCodeImage(`${userData.qrCode}`); // Update with the correct endpoint for QR code image
//             } else {
//                 setQrCodeImage(""); // If qrCode is blank or not available, set it to ""
//             }
//         } catch (error) {
//             console.error("Error fetching user details:", error);
//         }
//     };


//     // Handle QR Code update
//     const handleQrCodeUpdate = async () => {
//         if (!newQrCodeId) {
//             showToast("Please provide a new QR code ID.", "error");
//             return;
//         }

//         setLoading(true);

//         try {
//             const response = await putRequest(`/update-qrCode/${selectedUserId}`, {
//                 qrCodeId: newQrCodeId, // The new QR code ID to update
//             });

//             if (response.status === 200) {
//                 showToast("QR code updated successfully!", "success");
//                 setOldQrCodeId(newQrCodeId); // Update the old QR Code ID with the new one
//                 setQrCodeImage(`${response.data.user.qrCode}`); // Update the QR code image with the new QR code
//             }
//         } catch (error) {
//             console.error("Error updating QR code:", error);
//             showToast(error.response.data.message || "Error updating QR code.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Box sx={{ padding: 3, maxWidth: 500, margin: "0 auto", backgroundColor: "#f9f9f9", borderRadius: 2 }}>
//                 <h2>Update QR Code</h2>

//                 <FormControl fullWidth sx={{ marginBottom: 2 }}>
//                     <InputLabel>Select User</InputLabel>
//                     <Select value={selectedUserId} onChange={handleUserChange} label="Select User">
//                         <MenuItem value="">Select a User</MenuItem>
//                         {users.map((user) => (
//                             <MenuItem key={user._id} value={user._id}>
//                                 {user.name} ({user.memberId})
//                             </MenuItem>
//                         ))}
//                     </Select>
//                 </FormControl>

//                 {selectedUserId && (
//                     <div>
//                         <TextField
//                             label="Old QR Code ID"
//                             value={oldQrCodeId}
//                             disabled
//                             fullWidth
//                             sx={{ marginBottom: 2 }}
//                         />

//                         <TextField
//                             label="New QR Code ID"
//                             value={newQrCodeId}
//                             onChange={(e) => setNewQrCodeId(e.target.value)}
//                             fullWidth
//                             sx={{ marginBottom: 2 }}
//                         />

//                         {qrCodeImage && (
//                             <Box sx={{ marginBottom: 2 }}>
//                                 <h3>QR Code Image</h3>
//                                 <img src={qrCodeImage} alt="QR Code" height={220} width={220} />
//                                 {/* Download Button */}
//                                 <a href={qrCodeImage} download={`qrCode_${newQrCodeId}.png`}>
//                                     <Button variant="outlined" sx={{ marginTop: 2 }}>Download QR Code</Button>
//                                 </a>
//                             </Box>
//                         )}

//                         <Button
//                             onClick={handleQrCodeUpdate}
//                             variant="contained"
//                             color="primary"
//                             disabled={loading}
//                             sx={{ width: "100%" }}
//                         >
//                             {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Update QR Code"}
//                         </Button>
//                     </div>
//                 )}
//             </Box>
//         </Box>
//     );
// };

// export default UpdateQrData;

// --------------working code ------------------------

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { TextField, Button, CircularProgress, Box, Autocomplete } from "@mui/material";
// import { getRequest, putRequest } from "../../../api/commonAPI";
// import { PUBLIC_API_URI } from "../../../api/config";
// import { showToast } from "../../../api/toast";

// const UpdateQrData = () => {
//     // State variables
//     const [users, setUsers] = useState([]); // To store the list of users
//     const [selectedUser, setSelectedUser] = useState(null); // To store selected user object
//     const [oldQrCodeId, setOldQrCodeId] = useState(""); // To store old QR Code ID
//     const [newQrCodeId, setNewQrCodeId] = useState(""); // To store new QR Code ID
//     const [qrCodeImage, setQrCodeImage] = useState(""); // To store QR Code Image URL
//     const [loading, setLoading] = useState(false); // To show loading state
//     const [fetching, setFetching] = useState(false); // To show loading while fetching users

//     // Fetch all users when the component mounts
//     useEffect(() => {
//         const fetchUsers = async () => {
//             setFetching(true);
//             try {
//                 const response = await getRequest("/admin/get-users"); // Update with the correct API endpoint
//                 setUsers(response.data.users || []); // Assuming the response has a 'users' array
//             } catch (error) {
//                 console.error("Error fetching users:", error);
//             } finally {
//                 setFetching(false);
//             }
//         };
//         fetchUsers();
//     }, []);

//     // Handle user selection
//     const handleUserChange = async (event, selectedUser) => {
//         if (!selectedUser) {
//             setSelectedUser(null);
//             setOldQrCodeId("");
//             setNewQrCodeId("");
//             setQrCodeImage("");
//             return;
//         }

//         setSelectedUser(selectedUser);

//         // Fetch the user details based on selected userId
//         try {
//             const response = await getRequest(`/member-details/${selectedUser._id}`); // Update with correct endpoint
//             const userData = response.data.user;

//             setOldQrCodeId(userData.qrCodeId || ""); // Set the old QR Code ID
//             setNewQrCodeId(userData.qrCodeId || ""); // Set the new QR Code ID (initially same as old)

//             if (userData.qrCode && userData.qrCode !== "") {
//                 setQrCodeImage(`${userData.qrCode}`); // Update with the correct endpoint for QR code image
//             } else {
//                 setQrCodeImage(""); // If qrCode is blank or not available, set it to ""
//             }
//         } catch (error) {
//             console.error("Error fetching user details:", error);
//         }
//     };

//     // Handle QR Code update
//     const handleQrCodeUpdate = async () => {
//         if (!newQrCodeId) {
//             showToast("Please provide a new QR code ID.", "error");
//             return;
//         }

//         setLoading(true);

//         try {
//             const response = await putRequest(`/update-qrCode/${selectedUser._id}`, {
//                 qrCodeId: newQrCodeId, // The new QR code ID to update
//             });

//             if (response.status === 200) {
//                 showToast("QR code updated successfully!", "success");
//                 setOldQrCodeId(newQrCodeId); // Update the old QR Code ID with the new one
//                 setQrCodeImage(`${response.data.user.qrCode}`); // Update the QR code image with the new QR code
//             }
//         } catch (error) {
//             console.error("Error updating QR code:", error);
//             showToast(error.response.data.message || "Error updating QR code.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Box sx={{ padding: 3, maxWidth: 500, margin: "0 auto", backgroundColor: "#f9f9f9", borderRadius: 2 }}>
//                 <h2>Update QR Code</h2>

//                 {/* Searchable User Dropdown */}
//                 <Autocomplete
//                     options={users}
//                     getOptionLabel={(option) => `${option.name} (${option.memberId})`}
//                     value={selectedUser}
//                     onChange={handleUserChange}
//                     loading={fetching}
//                     renderInput={(params) => (
//                         <TextField
//                             {...params}
//                             label="Select User"
//                             variant="outlined"
//                             fullWidth
//                             InputProps={{
//                                 ...params.InputProps,
//                                 endAdornment: (
//                                     <>
//                                         {fetching ? <CircularProgress color="inherit" size={20} /> : null}
//                                         {params.InputProps.endAdornment}
//                                     </>
//                                 ),
//                             }}
//                         />
//                     )}
//                 />

//                 {selectedUser && (
//                     <div>
//                         <TextField
//                             label="Old QR Code ID"
//                             value={oldQrCodeId}
//                             disabled
//                             fullWidth
//                             sx={{ marginBottom: 2 }}
//                         />

//                         <TextField
//                             label="New QR Code ID"
//                             value={newQrCodeId}
//                             onChange={(e) => setNewQrCodeId(e.target.value)}
//                             fullWidth
//                             sx={{ marginBottom: 2 }}
//                         />

//                         {qrCodeImage && (
//                             <Box sx={{ marginBottom: 2 }}>
//                                 <h3>QR Code Image</h3>
//                                 <img src={qrCodeImage} alt="QR Code" height={220} width={220} />
//                                 {/* Download Button */}
//                                 <a href={qrCodeImage} download={`qrCode_${newQrCodeId}.png`}>
//                                     <Button variant="outlined" sx={{ marginTop: 2 }}>Download QR Code</Button>
//                                 </a>
//                             </Box>
//                         )}

//                         <Button
//                             onClick={handleQrCodeUpdate}
//                             variant="contained"
//                             color="primary"
//                             disabled={loading}
//                             sx={{ width: "100%" }}
//                         >
//                             {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Update QR Code"}
//                         </Button>
//                     </div>
//                 )}
//             </Box>
//         </Box>
//     );
// };

// export default UpdateQrData;
//========================================2222222222222222222222222
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { TextField, Button, CircularProgress, Box, Autocomplete } from "@mui/material";
// import { getRequest, putRequest } from "../../../api/commonAPI";
// import { PUBLIC_API_URI } from "../../../api/config";
// import { showToast } from "../../../api/toast";
// import debounce from "lodash.debounce";

// const UpdateQrData = () => {
//     const [users, setUsers] = useState([]); // Store user search results
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [oldQrCodeId, setOldQrCodeId] = useState("");
//     const [newQrCodeId, setNewQrCodeId] = useState("");
//     const [qrCodeImage, setQrCodeImage] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [fetching, setFetching] = useState(false);
//     const [searchQuery, setSearchQuery] = useState(""); // Store search input

//     // Fetch initial 10 users on component mount
//     useEffect(() => {
//         const fetchInitialUsers = async () => {
//             setFetching(true);
//             try {
//                 const response = await getRequest(`/admin/get-users?page=1&limit=10`); // Fetch only 10 initially
//                 setUsers(response.data.users || []);
//             } catch (error) {
//                 console.error("Error fetching initial users:", error);
//             } finally {
//                 setFetching(false);
//             }
//         };
//         fetchInitialUsers();
//     }, []);

//     // Function to fetch users dynamically based on search input
//     const fetchUsers = async (query) => {
//         if (!query) {
//             return; // If empty query, do nothing (keep initial users)
//         }

//         setFetching(true);
//         try {
//             const response = await getRequest(`/admin/get-users?search=${query}`); // Fetch all matching users
//             setUsers(response.data.users || []);
//         } catch (error) {
//             console.error("Error fetching users:", error);
//         } finally {
//             setFetching(false);
//         }
//     };

//     // Debounced function to limit API calls while typing
//     const debouncedFetchUsers = debounce((query) => fetchUsers(query), 500);

//     // Handle input change for searching users
//     const handleSearchChange = (event) => {
//         const query = event.target.value;
//         setSearchQuery(query);
//         if (!query) {
//             // Reset to initial users when search box is cleared
//             setFetching(true);
//             getRequest(`/admin/get-users?page=1&limit=10`)
//                 .then((response) => setUsers(response.data.users || []))
//                 .catch((error) => console.error("Error resetting user list:", error))
//                 .finally(() => setFetching(false));
//         } else {
//             debouncedFetchUsers(query);
//         }
//     };

//     // Handle user selection
//     const handleUserChange = async (event, selectedUser) => {
//         if (!selectedUser) {
//             setSelectedUser(null);
//             setOldQrCodeId("");
//             setNewQrCodeId("");
//             setQrCodeImage("");
//             return;
//         }

//         setSelectedUser(selectedUser);

//         try {
//             const response = await getRequest(`/member-details/${selectedUser._id}`);
//             const userData = response.data.user;
//             setOldQrCodeId(userData.qrCodeId || "");
//             setNewQrCodeId(userData.qrCodeId || "");
//             setQrCodeImage(userData.qrCode || "");
//         } catch (error) {
//             console.error("Error fetching user details:", error);
//         }
//     };

//     // Handle QR Code update
//     const handleQrCodeUpdate = async () => {
//         if (!newQrCodeId) {
//             showToast("Please provide a new QR code ID.", "error");
//             return;
//         }

//         setLoading(true);

//         try {
//             const response = await putRequest(`/update-qrCode/${selectedUser._id}`, {
//                 qrCodeId: newQrCodeId,
//             });

//             if (response.status === 200) {
//                 showToast("QR code updated successfully!", "success");
//                 setOldQrCodeId(newQrCodeId);
//                 setQrCodeImage(response.data.user.qrCode);
//             }
//         } catch (error) {
//             console.error("Error updating QR code:", error);
//             showToast(error.response?.data?.message || "Error updating QR code.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Box sx={{ padding: 3, maxWidth: 500, margin: "0 auto", backgroundColor: "#f9f9f9", borderRadius: 2 }}>
//                 <h2>Update QR Code</h2>

//                 {/* Dynamic API-based User Search */}
//                 <Autocomplete
//                     options={users}
//                     getOptionLabel={(option) => `${option.name} (${option.memberId})`}
//                     value={selectedUser}
//                     onChange={handleUserChange}
//                     loading={fetching}
//                     renderInput={(params) => (
//                         <TextField
//                             {...params}
//                             label="Search User"
//                             variant="outlined"
//                             fullWidth
//                             onChange={handleSearchChange} // Call API on input change
//                             InputProps={{
//                                 ...params.InputProps,
//                                 endAdornment: (
//                                     <>
//                                         {fetching ? <CircularProgress color="inherit" size={20} /> : null}
//                                         {params.InputProps.endAdornment}
//                                     </>
//                                 ),
//                             }}
//                         />
//                     )}
//                 />

//                 {selectedUser && (
//                     <div>
//                         <TextField
//                             label="Old QR Code ID"
//                             value={oldQrCodeId}
//                             disabled
//                             fullWidth
//                             sx={{ marginBottom: 2 }}
//                         />

//                         <TextField
//                             label="New QR Code ID"
//                             value={newQrCodeId}
//                             onChange={(e) => setNewQrCodeId(e.target.value)}
//                             fullWidth
//                             sx={{ marginBottom: 2 }}
//                         />

//                         {qrCodeImage && (
//                             <Box sx={{ marginBottom: 2 }}>
//                                 <h3>QR Code Image</h3>
//                                 <img src={qrCodeImage} alt="QR Code" height={220} width={220} />
//                                 <a href={qrCodeImage} download={`qrCode_${newQrCodeId}.png`}>
//                                     <Button variant="outlined" sx={{ marginTop: 2 }}>Download QR Code</Button>
//                                 </a>
//                             </Box>
//                         )}

//                         <Button
//                             onClick={handleQrCodeUpdate}
//                             variant="contained"
//                             color="primary"
//                             disabled={loading}
//                             sx={{ width: "100%" }}
//                         >
//                             {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Update QR Code"}
//                         </Button>
//                     </div>
//                 )}
//             </Box>
//         </Box>
//     );
// };

// export default UpdateQrData;

import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, CircularProgress, Box, Autocomplete } from "@mui/material";
import { getRequest, putRequest } from "../../../api/commonAPI";
import { showToast } from "../../../api/toast";
import debounce from "lodash.debounce";

const UpdateQrData = () => {
    const [users, setUsers] = useState([]); // Store user search results
    const [selectedUser, setSelectedUser] = useState(null);
    const [oldQrCodeId, setOldQrCodeId] = useState("");
    const [newQrCodeId, setNewQrCodeId] = useState("");
    const [qrCodeImage, setQrCodeImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // Store search input

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(true); // Track if more data is available
    const scrollRef = useRef(null); // Reference for detecting scroll

    // Fetch initial users on mount
    useEffect(() => {
        fetchUsers({ search: "", page: 1, reset: true });
    }, []);

    // Function to fetch users dynamically based on search input and pagination
    const fetchUsers = async ({ search, page, reset = false }) => {
        if (page > totalPages || fetching) return; // Stop fetching if we reach the last page or already fetching

        setFetching(true);
        try {
            const response = await getRequest(`/admin/get-users?search=${search}&page=${page}&limit=10`);

            setUsers((prevUsers) => (reset ? response.data.users : [...prevUsers, ...response.data.users]));
            setTotalPages(response.data.pagination.totalPages);
            setHasMore(page < response.data.pagination.totalPages);
            setPage(page);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setFetching(false);
        }
    };

    // Debounced function to limit API calls while typing
    const debouncedFetchUsers = debounce((query) => {
        fetchUsers({ search: query, page: 1, reset: true });
    }, 500);

    // Handle input change for searching users
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        setPage(1);
        debouncedFetchUsers(query);
    };

    // Detect scroll position in Autocomplete dropdown to load more data
    const handleScroll = (event) => {
        const bottom =
            event.target.scrollHeight - event.target.scrollTop <= event.target.clientHeight + 20;
        if (bottom && hasMore && !fetching) {
            fetchUsers({ search: searchQuery, page: page + 1, reset: false });
        }
    };

    // Handle user selection
    const handleUserChange = async (event, selectedUser) => {
        if (!selectedUser) {
            setSelectedUser(null);
            setOldQrCodeId("");
            setNewQrCodeId("");
            setQrCodeImage("");
            return;
        }

        setSelectedUser(selectedUser);

        try {
            const response = await getRequest(`/member-details/${selectedUser._id}`);
            const userData = response.data.user;
            setOldQrCodeId(userData.qrCodeId || "");
            setNewQrCodeId(userData.qrCodeId || "");
            setQrCodeImage(userData.qrCode || "");
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    // Handle QR Code update
    const handleQrCodeUpdate = async () => {
        if (!newQrCodeId) {
            showToast("Please provide a new QR code ID.", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await putRequest(`/update-qrCode/${selectedUser._id}`, {
                qrCodeId: newQrCodeId,
            });

            if (response.status === 200) {
                showToast("QR code updated successfully!", "success");
                setOldQrCodeId(newQrCodeId);
                setQrCodeImage(response.data.user.qrCode);
            }
        } catch (error) {
            console.error("Error updating QR code:", error);
            showToast(error.response?.data?.message || "Error updating QR code.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Box sx={{ padding: 3, maxWidth: 500, margin: "0 auto", backgroundColor: "#f9f9f9", borderRadius: 2 }}>
                <h2>Update QR Code</h2>

                {/* Autocomplete with Infinite Scroll */}
                <Autocomplete
                    options={users}
                    getOptionLabel={(option) => `${option.name} (${option.memberId})`}
                    value={selectedUser}
                    onChange={handleUserChange}
                    loading={fetching}
                    ListboxProps={{
                        ref: scrollRef,
                        onScroll: handleScroll, // Infinite Scroll Handler
                        style: { maxHeight: 200, overflow: "auto" },
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search User"
                            variant="outlined"
                            fullWidth
                            onChange={handleSearchChange}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {fetching ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                />

                {/* Show "Load More" button if more pages exist */}
                {/* {hasMore && (
                    <Button
                        onClick={() => fetchUsers({ search: searchQuery, page: page + 1, reset: false })}
                        variant="outlined"
                        sx={{ mt: 2, width: "100%" }}
                        disabled={fetching}
                    >
                        {fetching ? <CircularProgress size={20} /> : "Load More"}
                    </Button>
                )} */}

                {selectedUser && (
                    <div>
                        <TextField label="Old QR Code ID" value={oldQrCodeId} disabled fullWidth sx={{ marginBottom: 2 }} />
                        <TextField label="New QR Code ID" value={newQrCodeId} onChange={(e) => setNewQrCodeId(e.target.value)} fullWidth sx={{ marginBottom: 2 }} />

                        {qrCodeImage && (
                            <Box sx={{ marginBottom: 2 }}>
                                <h3>QR Code Image</h3>
                                <img src={qrCodeImage} alt="QR Code" height={220} width={220} />
                                <a href={qrCodeImage} download={`qrCode_${newQrCodeId}.png`}>
                                    <Button variant="outlined" sx={{ marginTop: 2 }}>Download QR Code</Button>
                                </a>
                            </Box>
                        )}

                        <Button
                            onClick={handleQrCodeUpdate}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            sx={{ width: "100%" }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Update QR Code"}
                        </Button>
                    </div>
                )}
            </Box>
        </Box>
    );
};

export default UpdateQrData;

