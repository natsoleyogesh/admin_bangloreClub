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

// Function to fetch all categories with optional isActive filter
export const fetchAllCategories = async (isActive = null) => {
    try {
        // Build query params object
        const params = isActive !== null ? { isActive: isActive.toString() } : {};

        const response = await axiosInstance.get("/category/all-categories", { params });
        return response; // Assuming the API returns categories in `response.data`
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

// Function to fetch member details by ID
export const fetchCategoryDetails = async (id) => {
    try {
        // Make the GET request to fetch member details
        const response = await axiosInstance.get(`/category/${id}`);
        // Return the member data from the response
        return response;
    } catch (error) {
        console.error(`Error fetching member details for ID ${id}:`, error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

export const updateCategoryDetails = async (categoryId, categoryData) => {
    try {
        const response = await axios.put(
            `${PUBLIC_API_URI}/category/update-category/${categoryId}`,
            categoryData,
            {
                headers: {
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
export const addCategory = async (formData) => {
    try {
        const response = await axios.post(`${PUBLIC_API_URI}/category/create`, formData);
        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

// Delete Member API
export const deleteCategory = async (categoryId) => {
    try {
        const response = await axios.delete(`${PUBLIC_API_URI}/category/delete-category/${categoryId}`);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete member.');
    }
};
