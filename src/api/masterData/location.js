// src/api/location.js

import axios from "axios";
import { PUBLIC_API_URI } from "../config";

// Axios instance (Optional, for setting base URL and headers)
const axiosInstance = axios.create({
    baseURL: PUBLIC_API_URI, // Replace this with your actual base URL
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Fetch all countries
 * @returns {Promise<Array>} Array of country objects
 */
export const fetchAllCountries = async () => {
    try {
        const response = await axiosInstance.get("/countries");
        return response.data; // Assuming the API response contains data in `response.data`
    } catch (error) {
        console.error("Error fetching countries:", error);
        throw new Error("Unable to fetch countries.");
    }
};

/**
 * Fetch all states for a given country
 * @param {string} countryCode - ISO code of the country
 * @returns {Promise<Array>} Array of state objects
 */
export const fetchAllStates = async (countryCode) => {
    if (!countryCode) {
        throw new Error("Country code is required to fetch states.");
    }
    try {
        const response = await axiosInstance.get(`/countries/${countryCode}/states`);
        return response.data; // Assuming the API response contains data in `response.data`
    } catch (error) {
        console.error(`Error fetching states for country code ${countryCode}:`, error);
        throw new Error("Unable to fetch states.");
    }
};

/**
 * Fetch all cities for a given country and state
 * @param {string} countryCode - ISO code of the country
 * @param {string} stateCode - ISO code of the state
 * @returns {Promise<Array>} Array of city objects
 */
export const fetchAllCities = async (countryCode, stateCode) => {
    if (!countryCode || !stateCode) {
        throw new Error("Country code and state code are required to fetch cities.");
    }
    try {
        const response = await axiosInstance.get(
            `/countries/${countryCode}/states/${stateCode}/cities`
        );
        return response.data; // Assuming the API response contains data in `response.data`
    } catch (error) {
        console.error(
            `Error fetching cities for country code ${countryCode} and state code ${stateCode}:`,
            error
        );
        throw new Error("Unable to fetch cities.");
    }
};
