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
