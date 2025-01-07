// src/api/users.js

import axios from "axios";
import { PUBLIC_API_URI } from "../config";

// Axios instance (Optional, for setting base URL and headers)
const axiosInstance = axios.create({
    baseURL: PUBLIC_API_URI, // Change this to your base URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Function to fetch all users
export const fetchDashBoardSales = async () => {
    try {
        const response = await axiosInstance.get("/dashboard/total-sales");
        return response; // Assuming the API returns user data in `response.data`
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};