import { authAPI } from './api';
import { APP_CONSTANTS } from '../utils/constants';

class AuthService {
    // Login user
    static async login(email, password) {
        try {
            const response = await authAPI.login({ email, password });
            const { token, user } = response.data.data;
            
            // Store token and user data
            localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN, token);
            localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.USER, JSON.stringify(user));
            
            return {
                success: true,
                user,
                token
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Login failed'
            };
        }
    }

    // Register user
    static async register(userData) {
        try {
            const response = await authAPI.register(userData);
            const { token, user } = response.data.data;
            
            // Store token and user data
            localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN, token);
            localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.USER, JSON.stringify(user));
            
            return {
                success: true,
                user,
                token
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Registration failed'
            };
        }
    }

    // Get current user
    static getCurrentUser() {
        try {
            const userStr = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.USER);
            if (!userStr) return null;
            
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    // Get current token
    static getToken() {
        return localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
    }

    // Check if user is authenticated
    static isAuthenticated() {
        return !!this.getToken();
    }

    // Check user role
    static hasRole(role) {
        const user = this.getCurrentUser();
        return user?.role === role;
    }

    // Check if user is student
    static isStudent() {
        return this.hasRole(APP_CONSTANTS.ROLES.STUDENT);
    }

    // Check if user is recruiter
    static isRecruiter() {
        return this.hasRole(APP_CONSTANTS.ROLES.RECRUITER);
    }

    // Check if user is admin
    static isAdmin() {
        return this.hasRole(APP_CONSTANTS.ROLES.ADMIN);
    }

    // Get user role
    static getUserRole() {
        const user = this.getCurrentUser();
        return user?.role;
    }

    // Get dashboard route based on role
    static getDashboardRoute() {
        const role = this.getUserRole();
        switch (role) {
            case APP_CONSTANTS.ROLES.STUDENT:
                return APP_CONSTANTS.ROUTES.STUDENT_DASHBOARD;
            case APP_CONSTANTS.ROLES.RECRUITER:
                return APP_CONSTANTS.ROUTES.RECRUITER_DASHBOARD;
            case APP_CONSTANTS.ROLES.ADMIN:
                return APP_CONSTANTS.ROUTES.ADMIN_DASHBOARD;
            default:
                return APP_CONSTANTS.ROUTES.HOME;
        }
    }

    // Logout user
    static logout() {
        localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.USER);
        
        // Redirect to login page
        window.location.href = APP_CONSTANTS.ROUTES.LOGIN;
    }

    // Update user profile
    static async updateProfile(profileData) {
        try {
            const response = await authAPI.updateProfile(profileData);
            const updatedUser = response.data.data;
            
            // Update stored user data
            localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.USER, JSON.stringify(updatedUser));
            
            return {
                success: true,
                user: updatedUser
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Profile update failed'
            };
        }
    }

    // Change password
    static async changePassword(currentPassword, newPassword) {
        try {
            await authAPI.changePassword({ currentPassword, newPassword });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Password change failed'
            };
        }
    }

    // Get user profile from server
    static async fetchProfile() {
        try {
            const response = await authAPI.getProfile();
            const user = response.data.data;
            
            // Update stored user data
            localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.USER, JSON.stringify(user));
            
            return {
                success: true,
                user
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch profile'
            };
        }
    }

    // Check if profile is complete
    static isProfileComplete() {
        const user = this.getCurrentUser();
        return user?.profileCompleted || false;
    }

    // Get user initials for avatar
    static getUserInitials() {
        const user = this.getCurrentUser();
        if (!user) return '?';
        
        if (user.role === APP_CONSTANTS.ROLES.STUDENT && user.firstName && user.lastName) {
            return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
        } else if (user.role === APP_CONSTANTS.ROLES.RECRUITER && user.contactPerson?.firstName) {
            return user.contactPerson.firstName.charAt(0).toUpperCase();
        } else if (user.email) {
            return user.email.charAt(0).toUpperCase();
        }
        
        return '?';
    }

    // Get user display name
    static getUserDisplayName() {
        const user = this.getCurrentUser();
        if (!user) return 'User';
        
        if (user.role === APP_CONSTANTS.ROLES.STUDENT && user.firstName && user.lastName) {
            return `${user.firstName} ${user.lastName}`;
        } else if (user.role === APP_CONSTANTS.ROLES.RECRUITER && user.contactPerson?.firstName) {
            return user.contactPerson.firstName;
        } else if (user.email) {
            return user.email.split('@')[0];
        }
        
        return 'User';
    }

    // Get user email
    static getUserEmail() {
        const user = this.getCurrentUser();
        return user?.email || '';
    }

    // Get user profile picture
    static getUserAvatar() {
        const user = this.getCurrentUser();
        return user?.avatar || user?.profilePicture || null;
    }
}

export default AuthService;