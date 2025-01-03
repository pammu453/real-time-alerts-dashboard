import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/alerts'; // Replace with your backend URL if deployed

// Fetch alerts with optional filters, pagination
export const fetchAlerts = async (filters = {}, page = 1, pageSize = 10) => {
    const params = {
        ...filters,
        page,
        pageSize,
    };
    try {
        const response = await axios.get("http://localhost:5000/api/alerts", { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching alerts:', error.response?.data || error.message);
        throw error;
    }
};

// Create a new alert
export const createAlert = async (alertData) => {
    try {
        const response = await axios.post(API_BASE_URL, alertData);
        return response.data;
    } catch (error) {
        console.error('Error creating alert:', error.response?.data || error.message);
        throw error;
    }
};

// Toggle the read status of an alert
export const updateAlertReadStatus = async (id) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/${id}/read`);
        return response.data;
    } catch (error) {
        console.error('Error updating alert read status:', error.response?.data || error.message);
        throw error;
    }
};

// Snooze an alert (postpone its timestamp)
export const snoozeAlert = async (id) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/${id}/snooze`);
        return response.data;
    } catch (error) {
        console.error('Error snoozing alert:', error.response?.data || error.message);
        throw error;
    }
};

// Escalate an alert to 'Critical'
export const escalateAlert = async (id) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/${id}/escalate`);
        return response.data;
    } catch (error) {
        console.error('Error escalating alert:', error.response?.data || error.message);
        throw error;
    }
};

// Delete (dismiss) an alert
export const deleteAlert = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
        console.error('Error deleting alert:', error.response?.data || error.message);
        throw error;
    }
};
