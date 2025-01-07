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
export const fetchAllNotifications = async (params) => {
    try {
        // const response = await axiosInstance.get("/billings");
        const queryString = new URLSearchParams(params).toString();

        // Append query string to the API endpoint
        const response = await axiosInstance.get(`/notifications?${queryString}`);
        return response; // Assuming the API returns user data in `response.data`
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const sendNotification = async (formData) => {
    try {
        const response = await axios.post(`${PUBLIC_API_URI}/notification/send`, formData, {
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