import axios from 'axios';
import { getToken, clearToken } from './jwt'; // Helpers from jwt.ts

// Base API URL
export const API_BASE_URL = 'http://192.168.0.117:8080/api';

// Endpoints
export const REGISTER_URL = `${API_BASE_URL}/users/register`;
export const LOGIN_URL = `${API_BASE_URL}/auth/login`;

// Create Axios instance
const ApiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000, // Timeout after 5 seconds
});

// Add interceptor to attach JWT token to every request
ApiClient.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
});

// Add interceptor to handle 401 Unauthorized globally
ApiClient.interceptors.response.use(
    (response) => response, // Forward valid responses
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Unauthorized: Redirecting to login');
            clearToken(); // Clear token from localStorage
            window.location.href = '/login'; // Redirect user to login page
        }
        return Promise.reject(error); // Forward other errors
    }
);

export default ApiClient;
