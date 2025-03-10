// src/api/users.js

import axios from "axios";
import { PUBLIC_API_URI } from "./config";

// Axios instance (Optional, for setting base URL and headers)
const axiosInstance = axios.create({
    baseURL: PUBLIC_API_URI, // Change this to your base URL
    headers: {
        "Content-Type": "application/json",
    },
});
// Add a request interceptor to dynamically set the Authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Function to fetch all users
export const fetchAllEvents = async () => {
    try {
        const response = await axiosInstance.get("/event/all-events-list?isAdmin=true");
        return response; // Assuming the API returns user data in `response.data`
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Function to fetch member details by ID
export const fetchEventDetails = async (id, operation = "") => {
    try {
        // Make the GET request to fetch member details
        // const response = await axiosInstance.get(`/event/get-event/${id}`);
        // // Return the member data from the response
        // Construct the query string with the optional operation
        const queryParams = operation ? `?operation=${operation}` : "";

        // Make the GET request to fetch event details
        const response = await axiosInstance.get(`/event/get-event/${id}${queryParams}`);
        return response;

    } catch (error) {
        console.error(`Error fetching member details for ID ${id}:`, error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

// export const updateProfilePicture = async (userId, formData) => {
//     try {
//         const response = await axiosInstance.put(
//             `${PUBLIC_API_URI}/member/update-profile-picture/${userId}`,
//             formData,
//             {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             }
//         );
//         return response;
//     } catch (error) {
//         console.error("API Error:", error);
//         throw error;
//     }
// };

export const updateEventDetails = async (eventId, formData) => {
    try {
        const response = await axios.put(
            `${PUBLIC_API_URI}/event/update-event/${eventId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const addEvent = async (formData) => {
    try {
        const response = await axios.post(`${PUBLIC_API_URI}/event/create`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

// Delete Member API
export const deleteEvent = async (eventId) => {
    try {
        const response = await axios.delete(`${PUBLIC_API_URI}/event/delete-event/${eventId}`);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete member.');
    }
};



// Function to fetch all users
export const fetchAllBookings = async (params) => {
    try {
        const queryString = new URLSearchParams(params).toString();

        const response = await axiosInstance.get(`/event/all-bookings?${queryString}`);
        return response; // Assuming the API returns user data in `response.data`
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Function to fetch member details by ID
export const fetchBookingDetails = async (id) => {
    try {
        // Make the GET request to fetch member details
        const response = await axiosInstance.get(`/event/event-booking-details/${id}`);
        // Return the member data from the response
        return response;
    } catch (error) {
        console.error(`Error fetching member details for ID ${id}:`, error);
        throw error; // Rethrow the error for handling in the calling function
    }
};


// Delete Member API
export const deleteBooking = async (bookingId) => {
    try {
        const response = await axios.delete(`${PUBLIC_API_URI}/event/booking-delete/${bookingId}`);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete member.');
    }
};


export const updateBookingDetails = async (bookingId, formData) => {
    try {
        const response = await axios.put(
            `${PUBLIC_API_URI}/event/booking-status/${bookingId}`,
            formData,
        );
        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};