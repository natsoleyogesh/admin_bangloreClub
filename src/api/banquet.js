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

// Add Authorization token to default headers
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


// Function to fetch all categories with optional isActive filter
export const fetchAllBanquetCategories = async () => {
    try {
        const response = await axiosInstance.get("/all-banquet-categories");
        return response; // Assuming the API returns categories in `response.data`
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};


// Function to fetch member details by ID
export const fetchBanquetCategoryDetails = async (id) => {
    try {
        // Make the GET request to fetch member details
        const response = await axiosInstance.get(`/banquet-category/${id}`);
        // Return the member data from the response
        return response;
    } catch (error) {
        console.error(`Error fetching member details for ID ${id}:`, error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

export const updateBanquetCategoryDetails = async (categoryId, categoryData) => {
    try {
        const response = await axios.put(
            `${PUBLIC_API_URI}/banquet-category/${categoryId}`,
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
export const addBanquetCategory = async (formData) => {
    try {
        const response = await axios.post(`${PUBLIC_API_URI}/banquet-category`, formData);
        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

// Delete Member API
export const deleteBanquetCategory = async (categoryId) => {
    try {
        const response = await axios.delete(`${PUBLIC_API_URI}/banquet-category/${categoryId}`);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete member.');
    }
};


// Function to fetch all categories with optional isActive filter
export const fetchActiveAllBanquetCategories = async () => {
    try {
        const response = await axiosInstance.get("/all-banquet-categories?status=Active");
        return response; // Assuming the API returns categories in `response.data`
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};


// Fetch all banquets
export const fetchAllBanquets = async () => {
    try {
        const response = await axiosInstance.get("/banquets");
        return response; // Assuming the data is in response.data
    } catch (error) {
        console.error("Error fetching all banquets:", error);
        throw new Error(error);
    }
};

// Fetch banquet details by ID
export const fetchBanquetDetails = async (id) => {
    try {
        const response = await axiosInstance.get(`/banquet/${id}`);
        return response; // Assuming the banquet details are in response.data
    } catch (error) {
        console.error(`Error fetching banquet details for ID ${id}:`, error);
        throw new Error(error);
    }
};

// Fetch banquet details by ID
export const fetchEditBanquetDetails = async (id) => {
    try {
        const response = await axiosInstance.get(`/banquet-editDetails/${id}`);
        return response; // Assuming the banquet details are in response.data
    } catch (error) {
        console.error(`Error fetching banquet details for ID ${id}:`, error);
        throw new Error(error);
    }
};

// Update banquet details
export const updateBanquetDetails = async (banquetId, banquetData) => {
    try {
        const response = await axiosInstance.put(`/banquet/update-banquet/${banquetId}`, banquetData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response; // Assuming the updated banquet data is in response.data
    } catch (error) {
        console.error("Error updating banquet details:", error);
        throw new Error(error);
    }
};

// Add a new banquet
export const addBanquet = async (formData) => {
    try {
        console.log(formData, "banquet.jsformdata")

        const response = await axiosInstance.post("/banquet/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response; // Assuming the created banquet data is in response.data
    } catch (error) {
        console.log("Error adding banquet:", error);
        // throw new Error(error);
        return error;
    }
};

// Delete a banquet by ID
export const deleteBanquet = async (banquetId) => {
    try {
        const response = await axiosInstance.delete(`/banquet/delete-banquet/${banquetId}`);
        return response; // Assuming the response confirms successful deletion
    } catch (error) {
        console.error("Error deleting banquet:", error);
        throw new Error(error);
    }
};

// Delete a banquet image
export const deleteBanquetImage = async (banquetId, index) => {
    try {
        const response = await axiosInstance.delete(`/banquet/delete-image/${banquetId}/${index}`);
        return response; // Assuming the response confirms successful deletion
    } catch (error) {
        console.error("Error deleting banquet image:", error);
        throw new Error(error);
    }
};

// Upload an image for a banquet
export const uploadBanquetImage = async (banquetId, formData) => {
    try {
        const response = await axiosInstance.put(`/banquet/upload-image/${banquetId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response; // Assuming the response contains the updated banquet data
    } catch (error) {
        console.error("Error uploading banquet image:", error);
        throw new Error(error);
    }
};

// Banquet Booking APIs Functions


// Fetch all banquets
export const fetchAllBanquetBookingss = async () => {
    try {
        const response = await axiosInstance.get("/banquet-bookings");
        return response; // Assuming the data is in response.data
    } catch (error) {
        console.error("Error fetching all banquets:", error);
        throw new Error(error);
    }
};

// Fetch banquet details by ID
export const fetchBanquetBookingDetails = async (banquetId) => {
    try {
        const response = await axiosInstance.get(`/banquet-booking/${banquetId}`);
        return response; // Assuming the banquet details are in response.data
    } catch (error) {
        console.error(`Error fetching banquet details for banquetId ${banquetId}:`, error);
        throw new Error(error);
    }
};


// Delete a banquet by ID
export const deleteBanquetBooking = async (banquetId) => {
    try {
        const response = await axiosInstance.delete(`/banquet-booking/${banquetId}`);
        return response; // Assuming the response confirms successful deletion
    } catch (error) {
        console.error("Error deleting banquet:", error);
        throw new Error(error);
    }
};

// Update banquet details
export const updateBanquetBooking = async (banquetData) => {
    try {
        const response = await axiosInstance.post(`/banquet-booking-allocate`, banquetData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response; // Assuming the updated banquet data is in response.data
    } catch (error) {
        console.error("Error updating banquet details:", error);
        throw new Error(error);
    }
};