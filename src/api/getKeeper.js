// src/api/getKeeper.js

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
export const fetchAllctiveEvents = async () => {
    try {
        const response = await axiosInstance.get("/event/all-events");
        return response; // Assuming the API returns user data in `response.data`
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Function to fetch member details by ID
export const fetchEventAttendenceDetails = async (eventId) => {
    try {
        // Make the GET request to fetch member details
        const response = await axiosInstance.get(`/get-attendance/${eventId}`);
        // Return the member data from the response
        return response;
    } catch (error) {
        console.error(`Error fetching member details for ID ${eventId}:`, error);
        throw error; // Rethrow the error for handling in the calling function
    }
};



export const fetchMemberDetails = async (token, data) => {
    try {
        console.log(token, data, "data")
        const response = await axios.post(
            `${PUBLIC_API_URI}/getmember-details`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};



export const fetchMemberDetailsByQrCode = async (token, data) => {
    try {
        console.log(token, data, "data")
        const response = await axios.post(
            `${PUBLIC_API_URI}/getmember-details-qrCode`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const markAttendance = async (token, data) => {
    try {
        console.log(token, data, "data")
        const response = await axios.post(
            `${PUBLIC_API_URI}/mark-attendance`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};



