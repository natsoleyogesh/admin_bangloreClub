import React, { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { fetchEventAttendenceDetails, fetchMemberDetails, fetchMemberDetailsByQrCode, markAttendance } from "../api/getKeeper";
import { formatDateTime } from "../api/config";
import { useNavigate, useParams } from "react-router-dom";
import Table from "../components/Table";
import { fetchEventDetails } from "../api/event";
import Breadcrumb from "../components/common/Breadcrumb";
import { showToast } from "../api/toast";

const GetKeeparScanner = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState({});
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
        { accessorKey: "email", header: "Email" },
        { accessorKey: "mobileNumber", header: "Mobile Number" },

        { accessorKey: "attendanceStatus", header: "Status" },
        { accessorKey: "qrCode", header: "QR Code" },
        { accessorKey: "gatekeeperName", header: "Gate Keeper Name" },
        {
            accessorKey: "scannedAt",
            header: "Scanned At",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];


    const getEventById = async (eventId) => {
        try {
            const response = await fetchEventDetails(eventId);
            const eventData = response.data.event;
            setEvent(eventData);
            // setEditEvent({ ...eventData, taxTypes: eventData.taxTypes || [] });
        } catch (error) {
            showToast("Failed to fetch event details.", "error");
        }
    };

    // Fetch attendance data for the event
    useEffect(() => {
        getEventById(eventId)
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
                console.log(parsedData, "parsedDatat");
                const qrdata = { qrData: parsedData };
                const response = await fetchMemberDetails(token, qrdata);
                console.log(response, "respponse")
                if (response.status === 200) {
                    const eventDetails = response.data.data.eventDetails;
                    const userDetails = response.data.data.userDetails;
                    // const guestName = response.data.data.guestName;

                    setEventDetails(eventDetails);
                    setUniqueQRCodeData(parsedData.uniqueQRCodeData)
                    // if (parsedData.type === "Guest" && guestName) {
                    //     setUserDetails({
                    //         name: guestName,
                    //         email: parsedData.guestEmail || "N/A",
                    //         mobileNumber: parsedData.guestContact || "N/A",
                    //         memberId: "N/A",
                    //     });
                    // } else
                    if (userDetails) {
                        setUserDetails(userDetails);
                    } else {
                        setError("Member details not found.");
                        // handleReject()
                    }

                    setStatus("success");
                } else {
                    setError("Failed to fetch member details.");
                    setStatus("error");
                }
            } catch (err) {
                console.error("Error handling scan:", err);
                setError(err.response.data.message || "Failed to fetch member details. Please try again.");
                setStatus("error");
            }
        }
    };

    const handleScanQrCode = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("User is not authenticated. Token is missing.");
            }

            // const parsedData = JSON.parse(data);
            // console.log(parsedData, "parsedDatat");
            // const qrdata = { qrData: parsedData };
            const response = await fetchMemberDetailsByQrCode(token, { qrCode: manualQRCode });
            console.log(response, "respponse")
            if (response.status === 200) {
                const eventDetails = response.data.data.eventDetails;
                const userDetails = response.data.data.userDetails;
                // const guestName = response.data.data.guestName;

                setEventDetails(eventDetails);
                setUniqueQRCodeData(manualQRCode)
                if (userDetails) {
                    setUserDetails(userDetails);
                } else {
                    setError("Member details not found.");
                    // handleReject()
                }

                setStatus("success");
            } else {
                setError("Failed to fetch member details.");
                setStatus("error");
            }
        } catch (err) {
            console.error("Error handling scan:", err);
            setError(err.response.data.message || "Failed to fetch member details. Please try again.");
            setStatus("error");
        }
    }

    const handleError = (err) => {
        console.error("Error scanning QR code:", err);
        setError("Failed to scan QR code. Please try again.");
        setStatus("error");
        // handleReject()

        setScannedData("");
        setUserDetails(null);
        setEventDetails(null);
        setError("");
        setStatus("");
        setUniqueQRCodeData("");
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
            setManualQRCode("");
            setError(err.response.data.message || "Failed to mark attendance. Please try again.");
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
        // fetchAllAttendance(eventId);
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
        eventTitle: {
            fontSize: "22px",
            fontWeight: "bold",
            marginBottom: "10px",
        },
        eventDetails: {
            fontSize: "16px",
            marginBottom: "10px",
        },
    };

    return (
        <div style={styles.container}>
            <button style={styles.button} onClick={navigateToAllEvents}>
                All Events
            </button>
            {/* <Breadcrumb /> */}

            <div>
                <p style={styles.eventTitle}>{event.eventTitle}</p>
                <p style={styles.eventDetails}>
                    <strong>Date:</strong> {new Date(event.eventStartDate).toLocaleDateString()}
                </p>
                <p style={styles.eventDetails}>
                    <strong>Available Tickets:</strong> {event.totalAvailableTickets}
                </p>
            </div>

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

            {/* <div>
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
            </div> */}
            <div>
                <input
                    type="text"
                    placeholder="Enter QR Code"
                    value={manualQRCode} // Binds the input value to the state
                    onChange={(e) => setManualQRCode(e.target.value.trim())} // Updates the state
                    style={styles.textField}
                />
                <button style={styles.button} onClick={handleScanQrCode}>
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
                    <p><strong>Name:</strong>    <strong>{userDetails.name}</strong></p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>Mobile Number:</strong> {userDetails.mobileNumber}</p>

                    {/* <p><strong>Mobile:</strong> {userDetails.mobileNumber}</p>
                    <p><strong>Member ID:</strong> {userDetails.memberId}</p> */}
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
