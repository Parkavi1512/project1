// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Application Constants
export const USER_ROLES = {
  STUDENT: 'student',
  RECRUITER: 'recruiter',
  ADMIN: 'admin'
};

export const INTERNSHIP_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  REMOTE: 'remote',
  HYBRID: 'hybrid'
};

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted'
};

export const INTERNSHIP_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  EXPIRED: 'expired',
  FILLED: 'filled'
};

export const SKILL_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
};

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD MMM YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD MMM YYYY, hh:mm A'
};

// File Configuration
export const FILE_CONFIG = {
  MAX_RESUME_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_RESUME_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
};

// API Endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // User
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  
  // Student
  STUDENT_PROFILE: '/students/profile',
  STUDENT_APPLICATIONS: '/students/applications',
  STUDENT_RECOMMENDATIONS: '/students/recommendations',
  
  // Recruiter
  RECRUITER_DASHBOARD: '/recruiters/dashboard',
  POST_INTERNSHIP: '/recruiters/internships',
  RECRUITER_INTERNSHIPS: '/recruiters/internships',
  RECRUITER_APPLICATIONS: '/recruiters/applications',
  RECRUITER_ANALYTICS: '/recruiters/analytics',
  
  // Internships
  INTERNSHIPS: '/internships',
  SEARCH_INTERNSHIPS: '/internships/search',
  
  // Applications
  APPLY_INTERNSHIP: '/applications',
  APPLICATION_STATUS: '/applications/status',
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_STATS: '/admin/stats'
};

// Theme Colors
export const COLORS = {
  PRIMARY: '#1976d2',
  SECONDARY: '#9c27b0',
  SUCCESS: '#2e7d32',
  ERROR: '#d32f2f',
  WARNING: '#ed6c02',
  INFO: '#0288d1',
  
  // Custom colors
  BACKGROUND: '#f5f5f5',
  CARD_BACKGROUND: '#ffffff',
  TEXT_PRIMARY: '#212121',
  TEXT_SECONDARY: '#757575',
  BORDER: '#e0e0e0'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'internship_matcher_token',
  USER: 'internship_matcher_user',
  ROLE: 'internship_matcher_role',
  THEME: 'internship_matcher_theme',
  RECENT_SEARCHES: 'recent_searches'
};

// Matching Algorithm Weights
export const MATCHING_WEIGHTS = {
  SKILLS: 0.35,
  LOCATION: 0.25,
  PREFERENCES: 0.20,
  EXPERIENCE: 0.15,
  EDUCATION: 0.05
};

// Application Settings
export const SETTINGS = {
  ITEMS_PER_PAGE: 10,
  AUTO_LOGOUT_MINUTES: 30,
  MAX_BOOKMARKS: 50,
  SESSION_TIMEOUT: 3600000 // 1 hour in milliseconds
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a valid file.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  APPLICATION_SUBMITTED: 'Application submitted successfully!',
  INTERNSHIP_POSTED: 'Internship posted successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  ACCOUNT_CREATED: 'Account created successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!'
};

export default {
  API_URL,
  USER_ROLES,
  INTERNSHIP_TYPES,
  APPLICATION_STATUS,
  VALIDATION_PATTERNS,
  ENDPOINTS,
  COLORS,
  STORAGE_KEYS,
  SETTINGS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};