import axios from 'axios';
import { PUBLIC_API_URI } from './config';

const axiosInstance = axios.create({
    baseURL: PUBLIC_API_URI, // Change this to your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Common GET Request Function
export const getRequest = async (endpoint) => {
    try {
        const response = await axiosInstance.get(endpoint);
        return response;
    } catch (error) {
        console.error(`Error during GET request to ${endpoint}:`, error);
        throw error;
    }
};

// Common POST Request Function
export const postRequest = async (endpoint, data) => {
    try {
        const response = await axiosInstance.post(endpoint, data);
        return response;
    } catch (error) {
        console.error(`Error during POST request to ${endpoint}:`, error);
        throw error;
    }
};

// Common PUT Request Function
export const putRequest = async (endpoint, data) => {
    try {
        const response = await axiosInstance.put(endpoint, data);
        return response;
    } catch (error) {
        console.error(`Error during PUT request to ${endpoint}:`, error);
        throw error;
    }
};

// Common DELETE Request Function
export const deleteRequest = async (endpoint) => {
    try {
        const response = await axiosInstance.delete(endpoint);
        return response;
    } catch (error) {
        console.error(`Error during DELETE request to ${endpoint}:`, error);
        throw error;
    }
};

// Common POST Request with Form Data
export const postFormDataRequest = async (endpoint, formData) => {
    try {
        const response = await axiosInstance.post(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error(`Error during POST request with form data to ${endpoint}:`, error);
        throw error;
    }
};
