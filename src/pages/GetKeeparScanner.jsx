
// import React, { useState } from "react";
// import { QrReader } from "react-qr-reader";
// import jsQR from "jsqr";
// import { useNavigate } from "react-router-dom";
// import { fetchMemberDetails } from "../api/getKeeper";
// import { PUBLIC_API_URI } from "../api/config";

// const GetKeeparScanner = () => {
//     const [scannedData, setScannedData] = useState("");
//     const [userDetails, setUserDetails] = useState(null);
//     const [error, setError] = useState(""); // For errors during scanning or processing
//     const [status, setStatus] = useState(""); // Status for UI feedback
//     const navigate = useNavigate(); // Hook to navigate between pages
//     const [qrCode, setQrCode] = useState('')

//     const handleScan = async (data) => {
//         if (data) {
//             setScannedData(data);
//             try {
//                 const token = localStorage.getItem("token"); // Retrieve token from localStorage
//                 if (!token) {
//                     throw new Error("User is not authenticated. Token is missing.");
//                 }

//                 const { uniqueQRCodeData } = JSON.parse(data); // Parse the scanned QR code data
//                 console.log(JSON.parse(data), "data")
//                 const qrdata = { qrCode: uniqueQRCodeData };
//                 const response = await fetchMemberDetails(token, qrdata);
//                 console.log(response, "scanResult");
//                 if (response.status === 200) {
//                     const member = response.data.member;
//                     setUserDetails(member);

//                     if (member.status === "Active") {
//                         setStatus("success"); // Show success design
//                         setError(""); // Clear any previous error
//                     } else {
//                         setStatus("Inactive"); // Show inactive design
//                         setError(""); // Clear any previous error
//                     }
//                 } else {
//                     setStatus("error");
//                     setError("Failed to fetch member details.");
//                 }
//             } catch (err) {
//                 setStatus("error");
//                 setError(
//                     err.response?.data?.message || "Failed to fetch member details. Please try again."
//                 );
//                 console.error(err);
//             }
//         }
//     };

//     const handleError = (err) => {
//         console.error("Error scanning QR code:", err);
//         if (err?.name === "NotAllowedError") {
//             setError("Camera access was denied. Please allow camera permissions.");
//         } else if (err?.name === "NotFoundError") {
//             setError("No camera was found on the device.");
//         } else {
//             setError("Failed to scan QR code. Please try again.");
//         }
//         setStatus("error");
//     };

//     const handleBackToScanner = () => {
//         // Reset the state to enable a fresh scan
//         setScannedData("");
//         setUserDetails(null);
//         setError("");
//         setStatus("");
//     };

//     const styles = {
//         container: {
//             textAlign: "center",
//             marginTop: "80px",
//         },
//         scannerBox: {
//             width: "300px",
//             margin: "0 auto",
//         },
//         successUi: {
//             marginTop: "20px",
//             padding: "20px",
//             border: "2px solid #4CAF50",
//             borderRadius: "10px",
//             backgroundColor: "#f9fff9",
//             textAlign: "center",
//         },
//         inactiveUi: {
//             marginTop: "20px",
//             padding: "20px",
//             border: "2px solid #F44336",
//             borderRadius: "10px",
//             backgroundColor: "#fff9f9",
//             textAlign: "center",
//         },
//         successText: {
//             color: "#4CAF50",
//         },
//         inactiveText: {
//             color: "#F44336",
//         },
//         profilePicture: {
//             width: "100px",
//             height: "100px",
//             borderRadius: "50%",
//             marginBottom: "10px",
//             border: "2px solid #4CAF50",
//         },
//         inactiveProfilePicture: {
//             width: "100px",
//             height: "100px",
//             borderRadius: "50%",
//             marginBottom: "10px",
//             border: "2px solid red",
//         },
//         errorMessage: {
//             color: "red",
//             marginTop: "10px",
//             fontWeight: "bold",
//         },
//         fileInput: {
//             marginTop: "20px",
//         },
//         backButton: {
//             marginTop: "20px",
//             padding: "10px 20px",
//             backgroundColor: "#1976D2",
//             color: "#fff",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//         },
//     };

//     return (
//         <div style={styles.container}>
//             <h2>QR Code Scanner</h2>

//             {/* Display errors if any */}
//             {error && <p style={styles.errorMessage}>{error}</p>}

//             {/* QR Scanner and File Upload */}
//             {(status === "" || status === "error") && (
//                 <>
//                     <div style={styles.scannerBox}>
//                         <QrReader
//                             onResult={(result, error) => {
//                                 if (result) handleScan(result?.text);
//                                 if (error) handleError(error);
//                             }}
//                             constraints={{ facingMode: "environment" }}
//                             style={{ width: "100%" }}
//                         />
//                     </div>
//                     <div>

//                     </div>
//                     <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => {
//                             const file = e.target.files[0];
//                             if (file) {
//                                 const reader = new FileReader();
//                                 reader.onload = () => {
//                                     const imageData = reader.result;
//                                     const canvas = document.createElement("canvas");
//                                     const context = canvas.getContext("2d");
//                                     const img = new Image();
//                                     img.onload = () => {
//                                         canvas.width = img.width;
//                                         canvas.height = img.height;
//                                         context.drawImage(img, 0, 0, img.width, img.height);
//                                         const imageData = context.getImageData(0, 0, img.width, img.height);
//                                         const qrCode = jsQR(imageData.data, img.width, img.height);
//                                         if (qrCode) {
//                                             handleScan(qrCode.data);
//                                         } else {
//                                             setError("No QR code detected in the uploaded image.");
//                                         }
//                                     };
//                                     img.src = imageData;
//                                 };
//                                 reader.readAsDataURL(file);
//                             }
//                         }}
//                         style={styles.fileInput}
//                     />
//                 </>
//             )}

//             {/* Success UI */}
//             {status === "success" && userDetails && (
//                 <div style={styles.successUi}>
//                     <h3 style={styles.successText}>✔ Authentication Successful</h3>
//                     <img
//                         src={`${PUBLIC_API_URI}${userDetails.profilePicture}` || "/placeholder-profile.png"}
//                         alt="Profile"
//                         style={styles.profilePicture}
//                     />
//                     <h4>{userDetails.name}</h4>
//                     <p><strong>Email:</strong> {userDetails.email}</p>
//                     <p><strong>Mobile:</strong> {userDetails.mobileNumber}</p>
//                     <p><strong>Member ID:</strong> {userDetails.memberId}</p>
//                     <button style={styles.backButton} onClick={handleBackToScanner}>
//                         Scan Again
//                     </button>
//                 </div>
//             )}

//             {/* Inactive User UI */}
//             {status === "Inactive" && (
//                 <div style={styles.inactiveUi}>
//                     <h3 style={styles.inactiveText}>✘ User is Not Activated</h3>
//                     <img
//                         src={`${PUBLIC_API_URI}${userDetails.profilePicture}` || "/placeholder-profile.png"}
//                         alt="Profile"
//                         style={styles.inactiveProfilePicture}
//                     />
//                     <h4>{userDetails.name}</h4>
//                     <p><strong>Email:</strong> {userDetails.email}</p>
//                     <p><strong>Mobile:</strong> {userDetails.mobileNumber}</p>
//                     <p><strong>Member ID:</strong> {userDetails.memberId}</p>
//                     <button style={styles.backButton} onClick={handleBackToScanner}>
//                         Scan Again
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default GetKeeparScanner;


// import React, { useEffect, useState } from "react";
// import { QrReader } from "react-qr-reader";
// import { fetchEventAttendenceDetails, fetchMemberDetails, markAttendance } from "../api/getKeeper"; // Update API import
// import { formatDateTime, PUBLIC_API_URI } from "../api/config";
// import { useNavigate, useParams } from "react-router-dom";
// import Table from "../components/Table";

// const GetKeeparScanner = () => {
//     const { eventId } = useParams();
//     const navigate = useNavigate();
//     const [scannedData, setScannedData] = useState("");
//     const [manualQRCode, setManualQRCode] = useState(""); // For manual QR code entry
//     const [userDetails, setUserDetails] = useState(null);
//     const [eventDetails, setEventDetails] = useState(null);
//     const [error, setError] = useState(""); // For errors during scanning or processing
//     const [status, setStatus] = useState(""); // Status for UI feedback
//     const [uniqueQRCodeData, setUniqueQRCodeData] = useState(""); // Store unique QR code for attendance marking
//     const [attendance, setAttendance] = useState([]);


//     // Table columns definition
//     const columns = [
//         { accessorKey: "name", header: "Name" },

//         { accessorKey: "attendanceStatus", header: "Status" },
//         { accessorKey: "qrCode", header: "QR Code" },
//         { accessorKey: "gatekeeperName", header: "Gate Keeper Name" },

//         {
//             accessorKey: "scannedAt",
//             header: "Scanned At",
//             Cell: ({ cell }) => formatDateTime(cell.getValue()),
//         },

//     ];

//     useEffect(() => {
//         fetchAllAttendence(eventId)
//     }, [eventId])

//     const fetchAllAttendence = async (eventId) => {
//         try {
//             const response = await fetchEventAttendenceDetails(eventId);
//             if (response.status === 200) {
//                 setAttendance(response.data.attendees);
//             } else {
//                 // setError("Failed to fetch events.");
//                 setAttendance([])
//             }
//         } catch (err) {
//             // setError(err.response?.data?.message || "An error occurred while fetching events.");
//             console.error(err);
//         }
//     }

//     const handleScan = async (data) => {
//         if (data) {
//             setScannedData(data);
//             try {
//                 const token = localStorage.getItem("token"); // Retrieve token from localStorage
//                 if (!token) {
//                     throw new Error("User is not authenticated. Token is missing.");
//                 }

//                 const parsedData = JSON.parse(data); // Parse the scanned QR code data
//                 const qrdata = { qrData: parsedData }; // Pass the entire QR data object
//                 const response = await fetchMemberDetails(token, qrdata);

//                 if (response.status === 200) {
//                     const eventDetails = response.data.eventDetails;
//                     const userDetails = response.data.userDetails;
//                     const guestName = response.data.guestName;

//                     // Update the state based on the API response
//                     setEventDetails(eventDetails);
//                     if (parsedData.type === "Guest" && guestName) {
//                         setUserDetails({
//                             name: guestName,
//                             email: "N/A", // Guests might not have an email
//                             mobileNumber: "N/A", // Guests might not have a mobile number
//                             memberId: "N/A", // Guests might not have a member ID
//                         });
//                         setStatus("success");
//                         setError(""); // Clear any previous error
//                     } else if (userDetails) {
//                         setUserDetails(userDetails);
//                         setStatus("success");
//                         setError(""); // Clear any previous error
//                     } else {
//                         setStatus("error");
//                         setError("Member details not found.");
//                     }
//                 } else {
//                     setStatus("error");
//                     setError("Failed to fetch member details.");
//                 }
//             } catch (err) {
//                 setStatus("error");
//                 setError(
//                     err.response?.data?.message || "Failed to fetch member details. Please try again."
//                 );
//                 console.error(err);
//             }
//         }
//     };

//     const handleError = (err) => {
//         console.error("Error scanning QR code:", err);
//         if (err?.name === "NotAllowedError") {
//             setError("Camera access was denied. Please allow camera permissions.");
//         } else if (err?.name === "NotFoundError") {
//             setError("No camera was found on the device.");
//         } else {
//             setError("Failed to scan QR code. Please try again.");
//         }
//         setStatus("error");
//     };

//     const handleMarkAttendance = async () => {
//         try {
//             const token = localStorage.getItem("token"); // Retrieve token from localStorage
//             if (!token) {
//                 throw new Error("User is not authenticated. Token is missing.");
//             }

//             const qrCodeToVerify = manualQRCode || uniqueQRCodeData; // Use manual QR code if entered
//             if (!qrCodeToVerify) {
//                 setError("Please scan or enter a QR code.");
//                 return;
//             }

//             const attendanceResponse = await markAttendance(token, { qrCode: qrCodeToVerify });
//             if (attendanceResponse.status === 200) {
//                 setStatus("attendanceMarked");
//                 fetchAllAttendence(eventId)
//                 setError(""); // Clear any previous error
//             } else {
//                 setStatus("error");
//                 setError("Failed to mark attendance.");
//             }
//         } catch (err) {
//             setStatus("error");
//             setError(err.response?.data?.message || "Failed to mark attendance. Please try again.");
//             console.error(err);
//         }
//     };

//     const handleReject = () => {
//         // Reset the state to enable a fresh scan
//         setScannedData("");
//         fetchAllAttendence(eventId)
//         setUserDetails(null);
//         setEventDetails(null);
//         setError("");
//         setStatus("");
//         setUniqueQRCodeData("");
//         setManualQRCode(""); // Reset manual QR code input
//     };

//     const styles = {
//         container: {
//             textAlign: "center",
//             marginTop: "80px",
//         },
//         scannerBox: {
//             width: "300px",
//             margin: "0 auto",
//         },
//         successUi: {
//             marginTop: "20px",
//             padding: "20px",
//             border: "2px solid #4CAF50",
//             borderRadius: "10px",
//             backgroundColor: "#f9fff9",
//             textAlign: "center",
//         },
//         button: {
//             margin: "10px",
//             padding: "10px 20px",
//             backgroundColor: "#1976D2",
//             color: "#fff",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//         },
//         rejectButton: {
//             margin: "10px",
//             padding: "10px 20px",
//             backgroundColor: "#F44336",
//             color: "#fff",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//         },
//         errorMessage: {
//             color: "red",
//             marginTop: "10px",
//             fontWeight: "bold",
//         },
//         textField: {
//             marginTop: "20px",
//             padding: "10px",
//             width: "80%",
//             fontSize: "16px",
//         },
//     };
//     const handleAllEvents = (eventId) => {
//         // Navigate to the scanner component with the eventId as a parameter
//         navigate(`/gatekeeper/events`);
//     };

//     return (
//         <div style={styles.container}>

//             <button style={styles.button} onClick={handleAllEvents}>
//                 All Events
//             </button>

//             <h2>QR Code Scanner</h2>

//             {/* Display errors if any */}
//             {error && <p style={styles.errorMessage}>{error}</p>}

//             {/* QR Scanner and File Upload */}
//             {(status === "" || status === "error") && (
//                 <div style={styles.scannerBox}>
//                     <QrReader
//                         onResult={(result, error) => {
//                             if (result) handleScan(result?.text);
//                             if (error) handleError(error);
//                         }}
//                         constraints={{ facingMode: "environment" }}
//                         style={{ width: "100%" }}
//                     />
//                 </div>
//             )}

//             {/* Manual QR Code Input */}
//             <div>
//                 <input
//                     type="text"
//                     placeholder="Enter QR Code"
//                     value={manualQRCode}
//                     onChange={(e) => setManualQRCode(e.target.value)}
//                     style={styles.textField}
//                 />
//                 <button style={styles.button} onClick={handleMarkAttendance}>
//                     Verify
//                 </button>
//             </div>

//             {/* Success UI */}
//             {status === "success" && userDetails && (
//                 <div style={styles.successUi}>
//                     <h3>✔ QR Code Scanned Successfully</h3>
//                     {eventDetails && (
//                         <>
//                             <p><strong>Event:</strong> {eventDetails.title}</p>
//                             <p><strong>Date:</strong> {new Date(eventDetails.date).toLocaleDateString()}</p>
//                         </>
//                     )}
//                     <h4>{userDetails.name}</h4>
//                     <p><strong>Email:</strong> {userDetails.email}</p>
//                     <p><strong>Mobile:</strong> {userDetails.mobileNumber}</p>
//                     <p><strong>Member ID:</strong> {userDetails.memberId}</p>
//                     <div>
//                         <button style={styles.button} onClick={handleMarkAttendance}>
//                             Accept
//                         </button>
//                         <button style={styles.rejectButton} onClick={handleReject}>
//                             Reject
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Attendance Marked UI */}
//             {status === "attendanceMarked" && (
//                 <div style={styles.successUi}>
//                     <h3>✔ Attendance Marked Successfully</h3>
//                     <button style={styles.button} onClick={handleReject}>
//                         Scan Another QR Code
//                     </button>
//                 </div>
//             )}

//             {/* Amenities Table */}
//             <div>Attendant Member List</div>
//             <Table
//                 data={attendance}
//                 fields={columns}
//                 numberOfRows={attendance.length}
//                 enableTopToolBar
//                 enableBottomToolBar
//                 enablePagination
//                 enableRowSelection
//                 enableColumnFilters
//                 enableEditing
//                 enableColumnDragging
//             />


//         </div>
//     );
// };

// export default GetKeeparScanner;


import React, { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { fetchEventAttendenceDetails, fetchMemberDetails, markAttendance } from "../api/getKeeper";
import { formatDateTime } from "../api/config";
import { useNavigate, useParams } from "react-router-dom";
import Table from "../components/Table";

const GetKeeparScanner = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [scannedData, setScannedData] = useState("");
    const [manualQRCode, setManualQRCode] = useState("");
    const [userDetails, setUserDetails] = useState(null);
    const [eventDetails, setEventDetails] = useState(null);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");
    const [uniqueQRCodeData, setUniqueQRCodeData] = useState("");
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(null)
    // Define table columns
    const columns = [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "attendanceStatus", header: "Status" },
        { accessorKey: "qrCode", header: "QR Code" },
        { accessorKey: "gatekeeperName", header: "Gate Keeper Name" },
        {
            accessorKey: "scannedAt",
            header: "Scanned At",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    // Fetch attendance data for the event
    useEffect(() => {
        fetchAllAttendance(eventId);
    }, [eventId]);

    const fetchAllAttendance = async (eventId) => {
        setLoading(true)
        try {
            const response = await fetchEventAttendenceDetails(eventId);
            if (response.status === 200) {
                setAttendance(response.data.attendees);
                setLoading(false)
            } else {
                setAttendance([]);
                setLoading(false)
            }
        } catch (err) {
            console.error("Error fetching attendance:", err);
            setAttendance([]);
            setLoading(false)
        }
    };

    const handleScan = async (data) => {
        if (data) {
            setScannedData(data);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("User is not authenticated. Token is missing.");
                }

                const parsedData = JSON.parse(data);
                const qrdata = { qrData: parsedData };
                const response = await fetchMemberDetails(token, qrdata);
                console.log(response, "respponse")
                if (response.status === 200) {
                    const eventDetails = response.data.data.eventDetails;
                    const userDetails = response.data.data.userDetails;
                    const guestName = response.data.data.guestName;

                    setEventDetails(eventDetails);

                    if (parsedData.type === "Guest" && guestName) {
                        setUserDetails({
                            name: guestName,
                            email: "N/A",
                            mobileNumber: "N/A",
                            memberId: "N/A",
                        });
                    } else if (userDetails) {
                        setUserDetails(userDetails);
                    } else {
                        setError("Member details not found.");
                        handleReject()
                    }

                    setStatus("success");
                } else {
                    setError("Failed to fetch member details.");
                    setStatus("error");
                }
            } catch (err) {
                console.error("Error handling scan:", err);
                setError("Failed to fetch member details. Please try again.");
                setStatus("error");
            }
        }
    };

    const handleError = (err) => {
        console.error("Error scanning QR code:", err);
        setError("Failed to scan QR code. Please try again.");
        setStatus("error");
        handleReject()
    };

    const handleMarkAttendance = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("User is not authenticated. Token is missing.");
            }

            const qrCodeToVerify = manualQRCode || uniqueQRCodeData;
            if (!qrCodeToVerify) {
                setError("Please scan or enter a QR code.");
                return;
            }

            const attendanceResponse = await markAttendance(token, { qrCode: qrCodeToVerify });
            if (attendanceResponse.status === 200) {
                setStatus("attendanceMarked");
                fetchAllAttendance(eventId);
            } else {
                setError("Failed to mark attendance.");
                setManualQRCode("");
                setStatus("error");
            }
        } catch (err) {
            console.error("Error marking attendance:", err);
            setError(err.response.data.message || "Failed to mark attendance. Please try again.");
            setManualQRCode("");
            setStatus("error");
        }
    };

    const handleReject = () => {
        setScannedData("");
        setUserDetails(null);
        setEventDetails(null);
        setError("");
        setStatus("");
        setUniqueQRCodeData("");
        setManualQRCode("");
        fetchAllAttendance(eventId);
    };

    const navigateToAllEvents = () => {
        navigate("/gatekeeper/events");
    };

    const styles = {
        container: { textAlign: "center", marginTop: "80px" },
        scannerBox: { width: "300px", margin: "0 auto" },
        successUi: {
            marginTop: "20px",
            padding: "20px",
            border: "2px solid #4CAF50",
            borderRadius: "10px",
            backgroundColor: "#f9fff9",
            textAlign: "center",
        },
        button: {
            margin: "10px",
            padding: "10px 20px",
            backgroundColor: "#1976D2",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
        },
        rejectButton: {
            margin: "10px",
            padding: "10px 20px",
            backgroundColor: "#F44336",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
        },
        errorMessage: { color: "red", marginTop: "10px", fontWeight: "bold" },
        textField: { marginTop: "20px", padding: "10px", width: "80%", fontSize: "16px" },
    };

    return (
        <div style={styles.container}>
            <button style={styles.button} onClick={navigateToAllEvents}>
                All Events
            </button>

            <h2>QR Code Scanner</h2>

            {error && <p style={styles.errorMessage}>{error}</p>}

            {(status === "" || status === "error") && (
                <div style={styles.scannerBox}>
                    <QrReader
                        onResult={(result, error) => {
                            if (result) handleScan(result?.text);
                            if (error) handleError(error);
                        }}
                        constraints={{ facingMode: "environment" }}
                        style={{ width: "100%" }}
                    />
                </div>
            )}

            <div>
                <input
                    type="text"
                    placeholder="Enter QR Code"
                    value={manualQRCode}
                    onChange={(e) => setManualQRCode(e.target.value)}
                    style={styles.textField}
                />
                <button style={styles.button} onClick={handleMarkAttendance}>
                    Verify
                </button>
            </div>

            {status === "success" && userDetails && (
                <div style={styles.successUi}>
                    <h3>✔ QR Code Scanned Successfully</h3>
                    {eventDetails && (
                        <>
                            <p><strong>Event:</strong> {eventDetails.title}</p>
                            <p><strong>Date:</strong> {new Date(eventDetails.date).toLocaleDateString()}</p>
                        </>
                    )}
                    <h4>{userDetails.name}</h4>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>Mobile:</strong> {userDetails.mobileNumber}</p>
                    <p><strong>Member ID:</strong> {userDetails.memberId}</p>
                    <div>
                        <button style={styles.button} onClick={handleMarkAttendance}>
                            Accept
                        </button>
                        <button style={styles.rejectButton} onClick={handleReject}>
                            Reject
                        </button>
                    </div>
                </div>
            )}

            {status === "attendanceMarked" && (
                <div style={styles.successUi}>
                    <h3>✔ Attendance Marked Successfully</h3>
                    <button style={styles.button} onClick={handleReject}>
                        Scan Another QR Code
                    </button>
                </div>
            )}

            <div>Attendant Member List</div>
            <Table
                data={attendance}
                fields={columns}
                numberOfRows={attendance.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                isLoading={loading}
            />
        </div>
    );
};

export default GetKeeparScanner;
