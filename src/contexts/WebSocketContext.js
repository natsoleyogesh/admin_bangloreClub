// // WebSocketContext.js
// import React, { createContext, useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
// import { fetchAllRequestsData } from '../api/request';

// export const WebSocketContext = createContext();

// export const WebSocketProvider = ({ children }) => {
//     const [requests, setRequests] = useState([]); // State to store all requests
//     const [socket, setSocket] = useState(null); // State to store WebSocket connection

//     useEffect(() => {
//         // Fetch all requests initially
//         let intervalId;

//         const fetchAllRequests = async () => {
//             try {
//                 const response = await fetchAllRequestsData() // Replace with your API endpoint
//                 console.log(response)
//                 // const data = await response.json();
//                 if (response.status === 200) {
//                     setRequests(response.data.requests); // Set the initial state with fetched data
//                 }
//             } catch (error) {
//                 console.error('Error fetching all requests:', error);
//             }
//         };

//         // Fetch initial data
//         fetchAllRequests();
//         // Set up interval to fetch every 10 seconds
//         // intervalId = setInterval(fetchAllRequests, 10000);
//         // Cleanup on unmount

//         // Establish WebSocket connection
//         const socketConnection = io('http://localhost:3005'); // Replace with your WebSocket server URL
//         setSocket(socketConnection);

//         // Listen for new requests
//         socketConnection.on('new-request', (newRequest) => {
//             console.log('New request received:', newRequest);
//             setRequests((prevRequests) => [...prevRequests, newRequest]); // Update requests in real-time
//         });

//         // Cleanup on unmount
//         return () => {
//             socketConnection.disconnect();
//             // clearInterval(intervalId); // Clear the interval
//         };

//         //   return () => {
//         //     clearInterval(intervalId); // Clear the interval
//         // };
//     }, []);

//     return (
//         <WebSocketContext.Provider value={{ requests, socket }}>
//             {children}
//         </WebSocketContext.Provider>
//     );
// };


import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { fetchAllRequestsData } from "../api/request";

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const [requests, setRequests] = useState([]); // State to store all requests
    const [socket, setSocket] = useState(null); // State to store WebSocket connection
    const [notification, setNotification] = useState(null); // State to store the latest notification

    useEffect(() => {
        let intervalId;

        const fetchAllRequests = async () => {
            try {
                const response = await fetchAllRequestsData(); // Replace with your API endpoint
                if (response.status === 200) {
                    setRequests(response.data.requests); // Set the initial state with fetched data
                }
            } catch (error) {
                console.error("Error fetching all requests:", error);
            }
        };

        // Fetch initial data
        fetchAllRequests();

        // Set up interval to fetch every 10 seconds
        intervalId = setInterval(fetchAllRequests, 10000);

        // Establish WebSocket connection
        // const socketConnection = io("http://localhost:3005"); // Replace with your WebSocket server URL
        const socketConnection = io("https://13.60.85.75/"); // Replace with your WebSocket server URL
        setSocket(socketConnection);

        // Listen for new requests
        socketConnection.on("new-request", (newRequest) => {
            console.log("New request received:", newRequest);
            // setRequests((prevRequests) => [...prevRequests, newRequest]); // Update requests in real-time

            // Show notification for the new request
            setNotification(newRequest);

            // Clear the notification after a timeout
            setTimeout(() => setNotification(null), 5000); // Clear after 5 seconds
        });

        // Cleanup on unmount
        return () => {
            socketConnection.disconnect();
            clearInterval(intervalId);
        };
    }, []);

    // Remove a request by ID
    const removeRequest = (id) => {
        setRequests((prevRequests) => prevRequests.filter((request) => request._id !== id));
    };

    return (
        <WebSocketContext.Provider value={{ requests, socket, notification, removeRequest }}>
            {children}
        </WebSocketContext.Provider>
    );
};
