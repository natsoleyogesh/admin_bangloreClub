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

// Function to fetch all users
export const fetchAllRequestsData = async () => {
    try {
        // Append query string to the API endpoint
        const response = await axiosInstance.get(`/requests?status=Pending`);
        console.log(response, "request response")
        return response; // Assuming the API returns user data in `response.data`
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// // Function to fetch member details by ID
export const fetchRequestDetails = async (id) => {
    try {
        // Make the GET request to fetch member details
        const response = await axiosInstance.get(`/request/${id}`);
        // Return the member data from the response
        return response;
    } catch (error) {
        console.error(`Error fetching member details for ID ${id}:`, error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

// export const updateBillingDetails = async (id, formData) => {
//     try {
//         const response = await axios.put(
//             `${PUBLIC_API_URI}/billing/${id}`,
//             formData
//         );
//         return response;
//     } catch (error) {
//         console.error("API Error:", error);
//         throw error;
//     }
// };

// export const addBilling = async (formData) => {
//     try {
//         const response = await axios.post(`${PUBLIC_API_URI}/billing/create`, formData);
//         return response;
//     } catch (error) {
//         console.error("API Error:", error);
//         throw error;
//     }
// };

// Delete Member API
export const deleteRequest = async (requestId) => {
    try {
        const response = await axios.delete(`${PUBLIC_API_URI}/request/${requestId}`);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete member.');
    }
};
