
// import React, { createContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { fetchAllRequestsData } from "../api/request";

// export const WebSocketContext = createContext();

// export const WebSocketProvider = ({ children }) => {
//     const [requests, setRequests] = useState([]); // State to store all requests
//     const [socket, setSocket] = useState(null); // State to store WebSocket connection
//     const [notification, setNotification] = useState(null); // State to store the latest notification

//     useEffect(() => {
//         let intervalId;

//         const fetchAllRequests = async () => {
//             try {
//                 const response = await fetchAllRequestsData(); // Replace with your API endpoint
//                 if (response.status === 200) {
//                     setRequests(response.data.requests); // Set the initial state with fetched data
//                 }
//             } catch (error) {
//                 console.error("Error fetching all requests:", error);
//             }
//         };

//         // Fetch initial data
//         fetchAllRequests();

//         // Set up interval to fetch every 10 seconds
//         intervalId = setInterval(fetchAllRequests, 10000);

//         // Establish WebSocket connection
//         // const socketConnection = io("http://localhost:3005"); // Replace with your WebSocket server URL
//         const socketConnection = io("https://13.60.85.75/"); // Replace with your WebSocket server URL
//         setSocket(socketConnection);

//         // Listen for new requests
//         socketConnection.on("new-request", (newRequest) => {
//             console.log("New request received:", newRequest);
//             // setRequests((prevRequests) => [...prevRequests, newRequest]); // Update requests in real-time

//             // Show notification for the new request
//             setNotification(newRequest);

//             // Clear the notification after a timeout
//             setTimeout(() => setNotification(null), 5000); // Clear after 5 seconds
//         });

//         // Cleanup on unmount
//         return () => {
//             socketConnection.disconnect();
//             clearInterval(intervalId);
//         };
//     }, []);

//     // Remove a request by ID
//     const removeRequest = (id) => {
//         setRequests((prevRequests) => prevRequests.filter((request) => request._id !== id));
//     };

//     return (
//         <WebSocketContext.Provider value={{ requests, socket, notification, removeRequest }}>
//             {children}
//         </WebSocketContext.Provider>
//     );
// };


import React, { createContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { fetchAllRequestsData } from "../api/request";
import { getRequest } from "../api/commonAPI";
import { PUBLIC_API_URI } from "../api/config";

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const [requests, setRequests] = useState([]); // Paginated Requests
    const [socket, setSocket] = useState(null);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(false);

    // Pagination State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const fetchRequests = useCallback(async (pageNumber = 1, pageSize = 10) => {
        setLoading(true);
        try {
            // const response = await fetchAllRequestsData({ page: pageNumber, limit: pageSize });
            const response = await getRequest(`${PUBLIC_API_URI}/requests?status=Pending&page=${pageNumber}&limit=${pageSize}`);

            if (response.status === 200) {
                setRequests(response.data.requests || []);
                setTotalPages(response.data.pagination.totalPages || 1);
                setTotalRecords(response.data.pagination.totalRequest || 0);
            }
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let intervalId;

        fetchRequests(page, limit); // Initial fetch

        // Fetch data every 10 seconds to keep in sync with API
        intervalId = setInterval(() => fetchRequests(page, limit), 10000);

        // Establish WebSocket connection
        // const socketConnection = io("https://13.60.85.75/");
        const socketConnection = io("https://app.bangaloreclub.com/");

        setSocket(socketConnection);

        // Listen for new requests
        socketConnection.on("new-request", (newRequest) => {
            console.log("New request received:", newRequest);

            setRequests((prevRequests) => {
                // Insert the new request at the beginning, keeping the pagination limit
                const updatedRequests = [newRequest, ...prevRequests].slice(0, limit);
                return updatedRequests;
            });

            // Show notification
            setNotification(newRequest);
            setTimeout(() => setNotification(null), 5000);
        });

        return () => {
            socketConnection.disconnect();
            clearInterval(intervalId);
        };
    }, [page, limit, fetchRequests]);

    // Function to remove a request
    const removeRequest = (id) => {
        setRequests((prevRequests) => prevRequests.filter((request) => request._id !== id));
    };

    return (
        <WebSocketContext.Provider value={{
            requests, socket, notification, removeRequest,
            page, setPage, limit, setLimit, totalPages, totalRecords, loading
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};
