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
export const fetchAllMembers = async () => {
    try {
        const response = await axiosInstance.get("/admin/all-users");
        return response.data; // Assuming the API returns user data in `response.data`
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Function to fetch member details by ID
export const fetchMemberDetails = async (id) => {
    try {
        // Make the GET request to fetch member details
        const response = await axiosInstance.get(`/admin/member/${id}`);
        // Return the member data from the response
        return response.data;
    } catch (error) {
        console.error(`Error fetching member details for ID ${id}:`, error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

export const updateProfilePicture = async (userId, formData) => {
    try {
        const response = await axiosInstance.put(
            `${PUBLIC_API_URI}/member/update-profile-picture/${userId}`,
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

export const updateMemberDetails = async (userId, memberData) => {
    try {
        const response = await axios.put(
            `${PUBLIC_API_URI}/admin/update-details/${userId}`,
            memberData,
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

export const addMember = async (formData) => {
    try {
        const response = await axios.post(`${PUBLIC_API_URI}/member/create`, formData, {
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
export const deleteMember = async (userId) => {
    try {
        const response = await axios.delete(`${PUBLIC_API_URI}/admin/delete-member/${userId}`);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete member.');
    }
};


// Function to fetch all users
export const fetchAllActiveMembers = async () => {
    try {
        const response = await axiosInstance.get("/admin/active-members");
        return response; // Assuming the API returns user data in `response.data`
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
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





export const uploadProofsImages = async (userId, formData) => {
    try {
        const response = await axiosInstance.put(
            `${PUBLIC_API_URI}/user/${userId}/proofs`,
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


// Delete a banquet image
export const deleteProofs = async (userId, index) => {
    try {
        const response = await axiosInstance.delete(`/user/${userId}/proofs/${index}`);
        return response; // Assuming the response confirms successful deletion
    } catch (error) {
        console.error("Error deleting banquet image:", error);
        throw new Error(error);
    }
};