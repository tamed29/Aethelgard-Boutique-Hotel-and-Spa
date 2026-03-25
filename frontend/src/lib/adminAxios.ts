import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Specialized Axios instance for Admin operations.
 * Enforces withCredentials for JWT cookie handling.
 */
export const adminAxios = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});
 
// Request interceptor for Bearer token
adminAxios.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('[adminAxios] Attaching token to request:', config.url);
        } else {
            console.warn('[adminAxios] No token found in localStorage for:', config.url);
        }
    }
    return config;
});

// Response interceptor for global error handling (e.g. 401 redirects)
adminAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Force redirect to login if unauthorized
            if (typeof window !== 'undefined') {
                window.location.href = '/login?error=unauthorized';
            }
        }
        return Promise.reject(error);
    }
);

export default adminAxios;
