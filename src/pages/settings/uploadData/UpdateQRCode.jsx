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

//             // Generate QR Code for the new QR Code ID
//             if (userData.qrCode) {
//                 setQrCodeImage(`${userData.qrCode}`); // Update with the correct endpoint for QR code image
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


import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, CircularProgress, Box } from "@mui/material";
import { getRequest, putRequest } from "../../../api/commonAPI";
import { PUBLIC_API_URI } from "../../../api/config";
import { showToast } from "../../../api/toast";

const UpdateQrData = () => {
    // State variables
    const [users, setUsers] = useState([]); // To store the list of users
    const [selectedUserId, setSelectedUserId] = useState(""); // To store selected userId
    const [oldQrCodeId, setOldQrCodeId] = useState(""); // To store old QR Code ID
    const [newQrCodeId, setNewQrCodeId] = useState(""); // To store new QR Code ID
    const [qrCodeImage, setQrCodeImage] = useState(""); // To store QR Code Image URL
    const [loading, setLoading] = useState(false); // To show loading state

    // Fetch all users when the component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getRequest("/admin/get-users"); // Update with the correct API endpoint
                setUsers(response.data.users); // Assuming the response has a 'users' array
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    // Handle user selection
    const handleUserChange = async (e) => {
        const userId = e.target.value;
        setSelectedUserId(userId);

        // Fetch the user details based on selected userId
        try {
            const response = await getRequest(`/member-details/${userId}`); // Update with correct endpoint
            const userData = response.data.user;

            setOldQrCodeId(userData.qrCodeId || ""); // Set the old QR Code ID
            setNewQrCodeId(userData.qrCodeId || ""); // Set the new QR Code ID (initially same as old)

            // Check if qrCode exists and is not blank, otherwise set it to ""
            console.log(userData, userData.qrCode, "userData");
            if (userData.qrCode && userData.qrCode !== "") {
                setQrCodeImage(`${userData.qrCode}`); // Update with the correct endpoint for QR code image
            } else {
                setQrCodeImage(""); // If qrCode is blank or not available, set it to ""
            }
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
            const response = await putRequest(`/update-qrCode/${selectedUserId}`, {
                qrCodeId: newQrCodeId, // The new QR code ID to update
            });

            if (response.status === 200) {
                showToast("QR code updated successfully!", "success");
                setOldQrCodeId(newQrCodeId); // Update the old QR Code ID with the new one
                setQrCodeImage(`${response.data.user.qrCode}`); // Update the QR code image with the new QR code
            }
        } catch (error) {
            console.error("Error updating QR code:", error);
            showToast(error.response.data.message || "Error updating QR code.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Box sx={{ padding: 3, maxWidth: 500, margin: "0 auto", backgroundColor: "#f9f9f9", borderRadius: 2 }}>
                <h2>Update QR Code</h2>

                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel>Select User</InputLabel>
                    <Select value={selectedUserId} onChange={handleUserChange} label="Select User">
                        <MenuItem value="">Select a User</MenuItem>
                        {users.map((user) => (
                            <MenuItem key={user._id} value={user._id}>
                                {user.name} ({user.memberId})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {selectedUserId && (
                    <div>
                        <TextField
                            label="Old QR Code ID"
                            value={oldQrCodeId}
                            disabled
                            fullWidth
                            sx={{ marginBottom: 2 }}
                        />

                        <TextField
                            label="New QR Code ID"
                            value={newQrCodeId}
                            onChange={(e) => setNewQrCodeId(e.target.value)}
                            fullWidth
                            sx={{ marginBottom: 2 }}
                        />

                        {qrCodeImage && (
                            <Box sx={{ marginBottom: 2 }}>
                                <h3>QR Code Image</h3>
                                <img src={qrCodeImage} alt="QR Code" height={220} width={220} />
                                {/* Download Button */}
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
