// Application Constants
module.exports = {
    // User Roles
    ROLES: {
        STUDENT: 'student',
        RECRUITER: 'recruiter',
        ADMIN: 'admin'
    },

    // Internship Types
    INTERNSHIP_TYPES: {
        ONSITE: 'onsite',
        REMOTE: 'remote',
        HYBRID: 'hybrid'
    },

    // Internship Status
    INTERNSHIP_STATUS: {
        ACTIVE: 'active',
        CLOSED: 'closed',
        DRAFT: 'draft'
    },

    // Application Status
    APPLICATION_STATUS: {
        PENDING: 'pending',
        REVIEWED: 'reviewed',
        SHORTLISTED: 'shortlisted',
        REJECTED: 'rejected',
        ACCEPTED: 'accepted'
    },

    // Verification Status
    VERIFICATION_STATUS: {
        PENDING: 'pending',
        VERIFIED: 'verified',
        REJECTED: 'rejected'
    },

    // Skill Proficiency Levels
    PROFICIENCY_LEVELS: {
        BEGINNER: 'beginner',
        INTERMEDIATE: 'intermediate',
        ADVANCED: 'advanced',
        EXPERT: 'expert'
    },

    // Skill Requirement Levels
    SKILL_REQUIREMENT_LEVELS: {
        REQUIRED: 'required',
        PREFERRED: 'preferred',
        NICE_TO_HAVE: 'nice-to-have'
    },

    // Company Sizes
    COMPANY_SIZES: {
        SIZE_1_10: '1-10',
        SIZE_11_50: '11-50',
        SIZE_51_200: '51-200',
        SIZE_201_500: '201-500',
        SIZE_501_1000: '501-1000',
        SIZE_1000_PLUS: '1000+'
    },

    // Duration Units
    DURATION_UNITS: {
        WEEKS: 'weeks',
        MONTHS: 'months'
    },

    // Stipend Frequencies
    STIPEND_FREQUENCIES: {
        WEEKLY: 'weekly',
        MONTHLY: 'monthly',
        ONE_TIME: 'one-time',
        PERFORMANCE_BASED: 'performance-based'
    },

    // Skill Categories
    SKILL_CATEGORIES: {
        PROGRAMMING: 'programming',
        DESIGN: 'design',
        DATA_SCIENCE: 'data_science',
        MARKETING: 'marketing',
        BUSINESS: 'business',
        LANGUAGE: 'language',
        SOFT_SKILLS: 'soft_skills',
        TECHNICAL: 'technical',
        CREATIVE: 'creative',
        ANALYTICAL: 'analytical'
    },

    // File Upload
    FILE_UPLOAD: {
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_RESUME_TYPES: ['.pdf', '.doc', '.docx'],
        ALLOWED_IMAGE_TYPES: ['.jpg', '.jpeg', '.png', '.gif'],
        UPLOAD_DIR: 'uploads'
    },

    // Matching Algorithm Weights (Default)
    MATCHING_WEIGHTS: {
        SKILLS: 0.4,
        INTERESTS: 0.3,
        LOCATION: 0.2,
        DURATION: 0.1
    },

    // Pagination Defaults
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 100
    },

    // Email Templates
    EMAIL_TEMPLATES: {
        WELCOME_STUDENT: 'welcome_student',
        WELCOME_RECRUITER: 'welcome_recruiter',
        APPLICATION_CONFIRMATION: 'application_confirmation',
        APPLICATION_STATUS_UPDATE: 'application_status_update',
        NEW_APPLICATION_NOTIFICATION: 'new_application_notification',
        INTERNSHIP_MATCH_NOTIFICATION: 'internship_match_notification'
    },

    // Response Messages
    MESSAGES: {
        // Success Messages
        REGISTRATION_SUCCESS: 'Registration successful',
        LOGIN_SUCCESS: 'Login successful',
        LOGOUT_SUCCESS: 'Logged out successfully',
        PROFILE_UPDATED: 'Profile updated successfully',
        PASSWORD_CHANGED: 'Password changed successfully',
        INTERNSHIP_CREATED: 'Internship created successfully',
        INTERNSHIP_UPDATED: 'Internship updated successfully',
        INTERNSHIP_DELETED: 'Internship deleted successfully',
        APPLICATION_SUBMITTED: 'Application submitted successfully',
        APPLICATION_UPDATED: 'Application updated successfully',
        APPLICATION_WITHDRAWN: 'Application withdrawn successfully',
        RESUME_UPLOADED: 'Resume uploaded successfully',
        EMAIL_SENT: 'Email sent successfully',

        // Error Messages
        UNAUTHORIZED: 'Please authenticate',
        FORBIDDEN: 'Access denied. Insufficient permissions.',
        NOT_FOUND: 'Resource not found',
        VALIDATION_ERROR: 'Validation failed',
        SERVER_ERROR: 'Internal server error',
        DUPLICATE_ENTRY: 'Duplicate entry found',
        INVALID_CREDENTIALS: 'Invalid credentials',
        ACCOUNT_INACTIVE: 'Account is deactivated',
        FILE_TOO_LARGE: 'File size exceeds limit',
        INVALID_FILE_TYPE: 'Invalid file type',
        DEADLINE_PASSED: 'Application deadline has passed',
        ALREADY_APPLIED: 'You have already applied for this internship',
        NO_POSITIONS_AVAILABLE: 'No positions available'
    },

    // HTTP Status Codes
    STATUS_CODES: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        INTERNAL_SERVER_ERROR: 500
    },

    // Regex Patterns
    REGEX: {
        EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PHONE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        OBJECT_ID: /^[0-9a-fA-F]{24}$/
    },

    // JWT Configuration
    JWT: {
        EXPIRES_IN: '7d',
        ISSUER: 'internship-matcher-api'
    },

    // Cache Keys
    CACHE_KEYS: {
        TRENDING_SKILLS: 'trending_skills',
        POPULAR_INTERNSHIPS: 'popular_internships',
        USER_PROFILE: 'user_profile_',
        INTERNSHIP_DETAILS: 'internship_details_',
        RECOMMENDATIONS: 'recommendations_'
    },

    // Validation Limits
    VALIDATION_LIMITS: {
        SKILLS_MAX: 20,
        INTERESTS_MAX: 10,
        CAREER_GOALS_MAX: 5,
        PREFERRED_LOCATIONS_MAX: 5,
        REQUIRED_SKILLS_MAX: 15,
        RESPONSIBILITIES_MAX: 20,
        REQUIREMENTS_MAX: 20,
        BENEFITS_MAX: 15
    },

    // Profile Score Weights
    PROFILE_SCORE_WEIGHTS: {
        SKILLS: 40,
        EDUCATION: 30,
        GPA: 10,
        EXPERIENCE: 20
    },

    // Application Settings
    APPLICATION_SETTINGS: {
        MAX_APPLICATIONS_PER_STUDENT: 50,
        MAX_ACTIVE_INTERNSHIPS_PER_RECRUITER: 20,
        APPLICATION_DEADLINE_BUFFER_DAYS: 7
    },

    // Analytics Timeframes
    ANALYTICS_TIMEFRAMES: {
        LAST_7_DAYS: '7d',
        LAST_30_DAYS: '30d',
        LAST_90_DAYS: '90d',
        LAST_YEAR: '1y'
    },

    // Environment Variables
    ENVIRONMENTS: {
        DEVELOPMENT: 'development',
        PRODUCTION: 'production',
        TEST: 'test'
    }
};