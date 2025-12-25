import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthService from '../services/auth';
import { APP_CONSTANTS } from '../utils/constants';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            try {
                const currentUser = AuthService.getCurrentUser();
                if (currentUser && AuthService.isAuthenticated()) {
                    // Verify token by fetching fresh profile
                    const result = await AuthService.fetchProfile();
                    if (result.success) {
                        setUser(result.user);
                    } else {
                        // Token might be invalid, logout
                        AuthService.logout();
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        try {
            const result = await AuthService.login(email, password);
            
            if (result.success) {
                setUser(result.user);
                toast.success('Login successful!');
                
                // Redirect based on role
                const dashboardRoute = AuthService.getDashboardRoute();
                navigate(dashboardRoute);
                
                return { success: true };
            } else {
                toast.error(result.error || 'Login failed');
                return { success: false, error: result.error };
            }
        } catch (error) {
            toast.error(error.message || 'Login failed');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (userData) => {
        setLoading(true);
        try {
            const result = await AuthService.register(userData);
            
            if (result.success) {
                setUser(result.user);
                toast.success('Registration successful!');
                
                // Redirect based on role
                const dashboardRoute = AuthService.getDashboardRoute();
                navigate(dashboardRoute);
                
                return { success: true };
            } else {
                toast.error(result.error || 'Registration failed');
                return { success: false, error: result.error };
            }
        } catch (error) {
            toast.error(error.message || 'Registration failed');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        setLoading(true);
        try {
            AuthService.logout();
            setUser(null);
            toast.success('Logged out successfully');
            navigate(APP_CONSTANTS.ROUTES.LOGIN);
        } catch (error) {
            toast.error('Logout failed');
        } finally {
            setLoading(false);
        }
    };

    // Update profile function
    const updateProfile = async (profileData) => {
        setLoading(true);
        try {
            const result = await AuthService.updateProfile(profileData);
            
            if (result.success) {
                setUser(result.user);
                toast.success('Profile updated successfully');
                return { success: true, user: result.user };
            } else {
                toast.error(result.error || 'Profile update failed');
                return { success: false, error: result.error };
            }
        } catch (error) {
            toast.error(error.message || 'Profile update failed');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Change password function
    const changePassword = async (currentPassword, newPassword) => {
        setLoading(true);
        try {
            const result = await AuthService.changePassword(currentPassword, newPassword);
            
            if (result.success) {
                toast.success('Password changed successfully');
                return { success: true };
            } else {
                toast.error(result.error || 'Password change failed');
                return { success: false, error: result.error };
            }
        } catch (error) {
            toast.error(error.message || 'Password change failed');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Check if user has role
    const hasRole = (role) => {
        return user?.role === role;
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!user && AuthService.isAuthenticated();
    };

    // Get user role
    const getUserRole = () => {
        return user?.role;
    };

    // Get dashboard route
    const getDashboardRoute = () => {
        return AuthService.getDashboardRoute();
    };

    // Get user initials
    const getUserInitials = () => {
        return AuthService.getUserInitials();
    };

    // Get user display name
    const getUserDisplayName = () => {
        return AuthService.getUserDisplayName();
    };

    // Get user email
    const getUserEmail = () => {
        return AuthService.getUserEmail();
    };

    // Check if profile is complete
    const isProfileComplete = () => {
        return AuthService.isProfileComplete();
    };

    // Refresh user data
    const refreshUser = async () => {
        try {
            const result = await AuthService.fetchProfile();
            if (result.success) {
                setUser(result.user);
            }
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        hasRole,
        isAuthenticated,
        getUserRole,
        getDashboardRoute,
        getUserInitials,
        getUserDisplayName,
        getUserEmail,
        isProfileComplete,
        refreshUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};