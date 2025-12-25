import axios from 'axios';
import { APP_CONSTANTS } from '../utils/constants';

const api = axios.create({
    baseURL: APP_CONSTANTS.API.BASE_URL,
    timeout: APP_CONSTANTS.API.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            // Clear storage and redirect to login
            localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
            localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.USER);
            
            // Redirect to login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        // Handle network errors
        if (!error.response) {
            console.error('Network Error:', error.message);
            throw new Error('Network error. Please check your internet connection.');
        }

        // Handle server errors
        const { status, data } = error.response;
        
        let errorMessage = 'An unexpected error occurred';
        if (data?.message) {
            errorMessage = data.message;
        } else if (data?.error) {
            errorMessage = data.error;
        }

        // Custom error handling based on status code
        switch (status) {
            case 400:
                errorMessage = data.message || 'Bad request. Please check your input.';
                break;
            case 403:
                errorMessage = 'Access denied. You do not have permission to perform this action.';
                break;
            case 404:
                errorMessage = 'The requested resource was not found.';
                break;
            case 409:
                errorMessage = 'Conflict detected. This resource already exists.';
                break;
            case 500:
                errorMessage = 'Internal server error. Please try again later.';
                break;
            case 503:
                errorMessage = 'Service temporarily unavailable. Please try again later.';
                break;
        }

        throw new Error(errorMessage);
    }
);

// API methods for different resources
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (profileData) => api.put('/auth/profile', profileData),
    changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
};

export const studentAPI = {
    getDashboard: () => api.get('/students/dashboard'),
    getProfile: () => api.get('/students/profile'),
    updateProfile: (profileData) => api.put('/students/profile', profileData),
    uploadResume: (formData) => api.post('/students/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getApplications: (params) => api.get('/students/applications', { params }),
    getApplicationStats: () => api.get('/students/applications/stats'),
    deleteApplication: (id) => api.delete(`/students/applications/${id}`),
    getSkillSuggestions: () => api.get('/students/skills/suggestions'),
};

export const internshipAPI = {
    getAll: (params) => api.get('/internships', { params }),
    getById: (id) => api.get(`/internships/${id}`),
    search: (params) => api.get('/internships/search', { params }),
    create: (internshipData) => api.post('/internships', internshipData),
    update: (id, internshipData) => api.put(`/internships/${id}`, internshipData),
    delete: (id) => api.delete(`/internships/${id}`),
    apply: (id, applicationData) => api.post(`/internships/${id}/apply`, applicationData),
    getRecommendations: (limit) => api.get('/internships/student/recommendations', { 
        params: { limit } 
    }),
};

export const recruiterAPI = {
    getDashboard: () => api.get('/recruiters/dashboard'),
    getProfile: () => api.get('/recruiters/profile'),
    updateProfile: (profileData) => api.put('/recruiters/profile', profileData),
    getInternships: (params) => api.get('/recruiters/internships', { params }),
    getApplications: (params) => api.get('/recruiters/applications', { params }),
    updateApplicationStatus: (applicationId, statusData) => 
        api.put(`/recruiters/applications/${applicationId}/status`, statusData),
    getTopCandidates: (internshipId, limit) => 
        api.get(`/recruiters/internships/${internshipId}/top-candidates`, { 
            params: { limit } 
        }),
    getAnalytics: (params) => api.get('/recruiters/analytics', { params }),
    sendBulkEmail: (emailData) => api.post('/recruiters/bulk-email', emailData),
};

export const adminAPI = {
    getSystemStats: () => api.get('/admin/stats'),
    getAllUsers: (params) => api.get('/admin/users', { params }),
    getUserById: (userId) => api.get(`/admin/users/${userId}`),
    updateUserStatus: (userId, statusData) => 
        api.put(`/admin/users/${userId}/status`, statusData),
    deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
    getAllInternships: (params) => api.get('/admin/internships', { params }),
    updateInternship: (internshipId, updateData) => 
        api.put(`/admin/internships/${internshipId}`, updateData),
    deleteInternship: (internshipId) => api.delete(`/admin/internships/${internshipId}`),
    getAllApplications: (params) => api.get('/admin/applications', { params }),
    manageSkills: (skillData) => api.post('/admin/skills', skillData),
    getSystemLogs: () => api.get('/admin/logs'),
    backupDatabase: () => api.post('/admin/backup'),
};

// Utility functions
export const downloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getErrorMessage = (error) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.response?.data?.error) {
        return error.response.data.error;
    }
    if (error.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
};

export default api;