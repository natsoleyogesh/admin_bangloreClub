import React, { useContext } from "react";
import { WebSocketContext } from "../contexts/WebSocketContext";


const NotificationPopup = () => {
    const { notification } = useContext(WebSocketContext);

    if (!notification) return null; // If no notification, don't render anything

    const styles = {
        popup: {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#2e7d32",
            color: "white",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            animation: "fadeInOut 5s ease-in-out",
        },
        keyframes: `
            @keyframes fadeInOut {
                0% {
                    opacity: 0;
                    transform: translateY(10px);
                }
                10%, 90% {
                    opacity: 1;
                    transform: translateY(0);
                }
                100% {
                    opacity: 0;
                    transform: translateY(10px);
                }
            }
        `,
    };

    // Dynamically add keyframes to the document
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(styles.keyframes, styleSheet.cssRules.length);

    return (
        <div style={styles.popup}>
            <p>New Request Arrived!</p>
            <p>
                <strong>ID:</strong> {notification._id} <br />
                <strong>Description:</strong> {notification.description}
            </p>
        </div>
    );
};

export default NotificationPopup;
