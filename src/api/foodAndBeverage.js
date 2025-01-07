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
export const fetchAllFoodAndBeverages = async () => {
    try {
        const response = await axiosInstance.get("/foodAndBeverages");
        return response; // Assuming the API returns user data in `response.data`
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Function to fetch member details by ID
export const fetchFoodAndBeverageDetails = async (id) => {
    try {
        // Make the GET request to fetch member details
        const response = await axiosInstance.get(`/foodAndBeverage/details/${id}`);
        // Return the member data from the response
        return response;
    } catch (error) {
        console.error(`Error fetching member details for ID ${id}:`, error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

// Function to fetch member details by ID
export const fetchEditFoodAndBeverageDetails = async (id) => {
    try {
        // Make the GET request to fetch member details
        const response = await axiosInstance.get(`/foodAndBeverage/edit/${id}`);
        // Return the member data from the response
        return response;
    } catch (error) {
        console.error(`Error fetching member details for ID ${id}:`, error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

export const updateFoodAndBeverageDetails = async (foodAndBeverageId, formData) => {
    try {
        const response = await axios.put(
            `${PUBLIC_API_URI}/foodAndBeverage/update-foodAndBeverage/${foodAndBeverageId}`,
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

export const addFoodAndBeverage = async (formData) => {
    try {
        const response = await axios.post(`${PUBLIC_API_URI}/foodAndBeverage/create`, formData, {
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
export const deleteFoodAndBeverage = async (foodAndBeverageId) => {
    try {
        const response = await axios.delete(`${PUBLIC_API_URI}/foodAndBeverage/delete/${foodAndBeverageId}`);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete member.');
    }
};


// Delete a banquet image
export const deleteFoodAndbeverageImage = async (banquetId, index) => {
    try {
        const response = await axiosInstance.delete(`/foodAndBeverage/deleteimage/${banquetId}/${index}`);
        return response; // Assuming the response confirms successful deletion
    } catch (error) {
        console.error("Error deleting banquet image:", error);
        throw new Error(error);
    }
};

// Upload an image for a banquet
export const uploadFoodAndbeveragesImage = async (banquetId, formData) => {
    try {
        const response = await axiosInstance.put(`/foodAndBeverage/upload-images/${banquetId}`, formData, {
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