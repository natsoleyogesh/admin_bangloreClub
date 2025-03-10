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
export const fetchAllDepartments = async () => {
    try {
        const response = await axiosInstance.get("/departments");
        return response; // Assuming the API returns user data in `response.data`
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Function to fetch member details by ID
export const fetchDepartmentDetails = async (id) => {
    try {
        // Make the GET request to fetch member details
        const response = await axiosInstance.get(`/department/${id}`);
        // Return the member data from the response
        return response;
    } catch (error) {
        console.error(`Error fetching member details for ID ${id}:`, error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

export const updateDepartmentDetails = async (departmentId, formData) => {
    try {
        const response = await axios.put(
            `${PUBLIC_API_URI}/department/${departmentId}`,
            formData
        );
        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const addDepartment = async (formData) => {
    try {
        const response = await axios.post(`${PUBLIC_API_URI}/department`, formData);
        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

// Delete Member API
export const deleteDepartment = async (departmentId) => {
    try {
        const response = await axios.delete(`${PUBLIC_API_URI}/department/${departmentId}`);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete member.');
    }
};


// Function to fetch all users
export const fetchAllActiveDepartments = async () => {
    try {
        const response = await axiosInstance.get("/active-departments");
        return response; // Assuming the API returns user data in `response.data`
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
