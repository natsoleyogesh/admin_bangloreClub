import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation

import { fetchAllctiveEvents } from "../api/getKeeper";

const GetKeeparEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Hook for navigation

    // Fetch active events on component mount
    useEffect(() => {
        const getEvents = async () => {
            try {
                const token = localStorage.getItem("token"); // Retrieve token from localStorage
                if (!token) {
                    throw new Error("User is not authenticated. Token is missing.");
                }

                const response = await fetchAllctiveEvents();
                if (response.status === 200) {
                    setEvents(response.data.allEvents);
                } else {
                    setError("Failed to fetch events.");
                }
            } catch (err) {
                setError(err.response?.data?.message || "An error occurred while fetching events.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getEvents();
    }, []);

    const handleScanQR = (eventId) => {
        // Navigate to the scanner component with the eventId as a parameter
        navigate(`/gatekeeper/qrScanner/${eventId}`);
    };

    const styles = {
        container: {
            maxWidth: "800px",
            margin: "0 auto",
            padding: "20px",
            textAlign: "center",
            marginTop: "20px"
        },
        header: {
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "20px",
        },
        eventList: {
            display: "flex",
            flexDirection: "column",
            gap: "20px",
        },
        eventCard: {
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            textAlign: "left",
            transition: "box-shadow 0.3s ease",
            backgroundColor: "#fff",
        },
        eventCardHover: {
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        },
        eventTitle: {
            fontSize: "22px",
            fontWeight: "bold",
            marginBottom: "10px",
        },
        eventDetails: {
            fontSize: "16px",
            marginBottom: "10px",
        },
        button: {
            alignSelf: "center",
            padding: "10px 20px",
            backgroundColor: "#1976D2",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
            fontSize: "16px",
            transition: "background-color 0.3s ease",
        },
        buttonHover: {
            backgroundColor: "#135ba1",
        },
        noEvents: {
            fontSize: "18px",
            color: "#999",
        },
        error: {
            color: "red",
            marginTop: "20px",
        },
        loading: {
            fontSize: "18px",
            color: "#555",
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Active Events</h2>

            {/* Show loading spinner or message */}
            {loading && <p style={styles.loading}>Loading events...</p>}

            {/* Show error message */}
            {error && <p style={styles.error}>{error}</p>}

            {/* Render active events */}
            {!loading && events.length > 0 ? (
                <div style={styles.eventList}>
                    {events.map((event) => (
                        <div
                            key={event._id}
                            style={styles.eventCard}
                            onMouseOver={(e) =>
                                (e.currentTarget.style.boxShadow = styles.eventCardHover.boxShadow)
                            }
                            onMouseOut={(e) => (e.currentTarget.style.boxShadow = "")}
                        >
                            <p style={styles.eventTitle}>{event.eventTitle}</p>
                            <p style={styles.eventDetails}>
                                <strong>Date:</strong> {new Date(event.eventStartDate).toLocaleDateString()}
                            </p>
                            <p style={styles.eventDetails}>
                                <strong>Available Tickets:</strong> {event.totalAvailableTickets}
                            </p>
                            <button
                                style={styles.button}
                                onClick={() => handleScanQR(event._id)}
                                onMouseOver={(e) =>
                                    (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)
                                }
                                onMouseOut={(e) =>
                                    (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)
                                }
                            >
                                Scan QR
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                // Show message if no events are found
                !loading && <p style={styles.noEvents}>No active events found.</p>
            )}
        </div>
    );
};

export default GetKeeparEvents;
