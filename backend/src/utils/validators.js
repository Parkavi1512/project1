const { body, param, query } = require('express-validator');
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const Internship = require('../models/Internship');
const Skill = require('../models/Skill');

class CustomValidators {
    /**
     * Validate MongoDB ObjectId
     * @param {string} id - ID to validate
     * @returns {boolean} True if valid
     */
    static isValidObjectId(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }

    /**
     * Validate email domain (allow only certain domains for recruiters)
     * @param {string} email - Email to validate
     * @param {string} role - User role
     * @returns {boolean} True if valid domain
     */
    static isValidEmailDomain(email, role = 'student') {
        if (role === 'recruiter') {
            const companyDomains = [
                'gmail.com', 'outlook.com', 'yahoo.com', // Temporary for testing
                // Add actual company domains in production
            ];
            const domain = email.split('@')[1];
            return companyDomains.includes(domain);
        }
        return true;
    }

    /**
     * Validate strong password
     * @param {string} password - Password to validate
     * @returns {boolean} True if strong
     */
    static isStrongPassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(password);
    }

    /**
     * Validate phone number
     * @param {string} phone - Phone number to validate
     * @returns {boolean} True if valid
     */
    static isValidPhoneNumber(phone) {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return phoneRegex.test(phone);
    }

    /**
     * Validate URL
     * @param {string} url - URL to validate
     * @returns {boolean} True if valid
     */
    static isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Validate date is in future
     * @param {Date} date - Date to validate
     * @returns {boolean} True if future date
     */
    static isFutureDate(date) {
        return new Date(date) > new Date();
    }

    /**
     * Validate date is in past
     * @param {Date} date - Date to validate
     * @returns {boolean} True if past date
     */
    static isPastDate(date) {
        return new Date(date) < new Date();
    }

    /**
     * Validate GPA
     * @param {number} gpa - GPA to validate
     * @returns {boolean} True if valid GPA
     */
    static isValidGPA(gpa) {
        return gpa >= 0 && gpa <= 4.0;
    }

    /**
     * Validate graduation year
     * @param {number} year - Year to validate
     * @returns {boolean} True if valid graduation year
     */
    static isValidGraduationYear(year) {
        const currentYear = new Date().getFullYear();
        return year >= currentYear && year <= currentYear + 5;
    }

    /**
     * Validate skill proficiency level
     * @param {string} proficiency - Proficiency level
     * @returns {boolean} True if valid proficiency
     */
    static isValidProficiency(proficiency) {
        const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
        return validLevels.includes(proficiency);
    }

    /**
     * Validate internship type
     * @param {string} type - Internship type
     * @returns {boolean} True if valid type
     */
    static isValidInternshipType(type) {
        const validTypes = ['onsite', 'remote', 'hybrid'];
        return validTypes.includes(type);
    }

    /**
     * Validate internship status
     * @param {string} status - Internship status
     * @returns {boolean} True if valid status
     */
    static isValidInternshipStatus(status) {
        const validStatuses = ['active', 'closed', 'draft'];
        return validStatuses.includes(status);
    }

    /**
     * Validate application status
     * @param {string} status - Application status
     * @returns {boolean} True if valid status
     */
    static isValidApplicationStatus(status) {
        const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'];
        return validStatuses.includes(status);
    }

    /**
     * Validate duration unit
     * @param {string} unit - Duration unit
     * @returns {boolean} True if valid unit
     */
    static isValidDurationUnit(unit) {
        const validUnits = ['weeks', 'months'];
        return validUnits.includes(unit);
    }

    /**
     * Validate stipend frequency
     * @param {string} frequency - Stipend frequency
     * @returns {boolean} True if valid frequency
     */
    static isValidStipendFrequency(frequency) {
        const validFrequencies = ['weekly', 'monthly', 'one-time', 'performance-based'];
        return validFrequencies.includes(frequency);
    }

    /**
     * Validate company size
     * @param {string} size - Company size
     * @returns {boolean} True if valid size
     */
    static isValidCompanySize(size) {
        const validSizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
        return validSizes.includes(size);
    }

    /**
     * Validate verification status
     * @param {string} status - Verification status
     * @returns {boolean} True if valid status
     */
    static isValidVerificationStatus(status) {
        const validStatuses = ['pending', 'verified', 'rejected'];
        return validStatuses.includes(status);
    }

    /**
     * Validate skill importance
     * @param {number} importance - Importance value
     * @returns {boolean} True if valid importance
     */
    static isValidSkillImportance(importance) {
        return importance >= 1 && importance <= 10;
    }

    /**
     * Validate skill proficiency for requirement
     * @param {string} proficiency - Proficiency level
     * @returns {boolean} True if valid proficiency
     */
    static isValidSkillProficiency(proficiency) {
        const validProficiencies = ['required', 'preferred', 'nice-to-have'];
        return validProficiencies.includes(proficiency);
    }
}

// Validation chains for different routes
const validationChains = {
    // Auth validations
    register: [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email address')
            .custom(async (email) => {
                const existingUser = await Student.findOne({ email }) || await Recruiter.findOne({ email });
                if (existingUser) {
                    throw new Error('Email already registered');
                }
                return true;
            }),
        
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .custom((password) => {
                if (!CustomValidators.isStrongPassword(password)) {
                    throw new Error('Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character');
                }
                return true;
            }),
        
        body('role')
            .isIn(['student', 'recruiter'])
            .withMessage('Role must be either student or recruiter'),
        
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords do not match');
                }
                return true;
            })
    ],

    studentRegister: [
        body('firstName')
            .notEmpty()
            .trim()
            .withMessage('First name is required')
            .isLength({ min: 2, max: 50 })
            .withMessage('First name must be between 2 and 50 characters'),
        
        body('lastName')
            .notEmpty()
            .trim()
            .withMessage('Last name is required')
            .isLength({ min: 2, max: 50 })
            .withMessage('Last name must be between 2 and 50 characters'),
        
        body('university')
            .notEmpty()
            .trim()
            .withMessage('University is required')
            .isLength({ min: 2, max: 100 })
            .withMessage('University name must be between 2 and 100 characters'),
        
        body('major')
            .notEmpty()
            .trim()
            .withMessage('Major is required')
            .isLength({ min: 2, max: 100 })
            .withMessage('Major must be between 2 and 100 characters'),
        
        body('graduationYear')
            .isInt({ min: new Date().getFullYear(), max: new Date().getFullYear() + 5 })
            .withMessage(`Graduation year must be between ${new Date().getFullYear()} and ${new Date().getFullYear() + 5}`),
        
        body('gpa')
            .optional()
            .isFloat({ min: 0, max: 4.0 })
            .withMessage('GPA must be between 0.0 and 4.0'),
        
        body('phone')
            .optional()
            .custom((phone) => {
                if (phone && !CustomValidators.isValidPhoneNumber(phone)) {
                    throw new Error('Please provide a valid phone number');
                }
                return true;
            })
    ],

    recruiterRegister: [
        body('companyName')
            .notEmpty()
            .trim()
            .withMessage('Company name is required')
            .isLength({ min: 2, max: 100 })
            .withMessage('Company name must be between 2 and 100 characters'),
        
        body('contactPerson.firstName')
            .notEmpty()
            .trim()
            .withMessage('Contact person first name is required')
            .isLength({ min: 2, max: 50 })
            .withMessage('First name must be between 2 and 50 characters'),
        
        body('contactPerson.lastName')
            .notEmpty()
            .trim()
            .withMessage('Contact person last name is required')
            .isLength({ min: 2, max: 50 })
            .withMessage('Last name must be between 2 and 50 characters'),
        
        body('companyWebsite')
            .optional()
            .custom((website) => {
                if (website && !CustomValidators.isValidURL(website)) {
                    throw new Error('Please provide a valid website URL');
                }
                return true;
            }),
        
        body('phone')
            .optional()
            .custom((phone) => {
                if (phone && !CustomValidators.isValidPhoneNumber(phone)) {
                    throw new Error('Please provide a valid phone number');
                }
                return true;
            }),
        
        body('companySize')
            .optional()
            .custom((size) => {
                if (size && !CustomValidators.isValidCompanySize(size)) {
                    throw new Error('Invalid company size');
                }
                return true;
            })
    ],

    login: [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email address'),
        
        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ],

    changePassword: [
        body('currentPassword')
            .notEmpty()
            .withMessage('Current password is required'),
        
        body('newPassword')
            .isLength({ min: 6 })
            .withMessage('New password must be at least 6 characters long')
            .custom((password) => {
                if (!CustomValidators.isStrongPassword(password)) {
                    throw new Error('Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character');
                }
                return true;
            }),
        
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    throw new Error('Passwords do not match');
                }
                return true;
            })
    ],

    updateProfile: [
        body('firstName')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('First name must be between 2 and 50 characters'),
        
        body('lastName')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Last name must be between 2 and 50 characters'),
        
        body('university')
            .optional()
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('University name must be between 2 and 100 characters'),
        
        body('major')
            .optional()
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Major must be between 2 and 100 characters'),
        
        body('graduationYear')
            .optional()
            .isInt({ min: new Date().getFullYear() - 5, max: new Date().getFullYear() + 5 })
            .withMessage(`Graduation year must be between ${new Date().getFullYear() - 5} and ${new Date().getFullYear() + 5}`),
        
        body('gpa')
            .optional()
            .isFloat({ min: 0, max: 4.0 })
            .withMessage('GPA must be between 0.0 and 4.0'),
        
        body('phone')
            .optional()
            .custom((phone) => {
                if (phone && !CustomValidators.isValidPhoneNumber(phone)) {
                    throw new Error('Please provide a valid phone number');
                }
                return true;
            }),
        
        body('skills')
            .optional()
            .isArray()
            .withMessage('Skills must be an array')
            .custom((skills) => {
                if (skills && skills.length > 20) {
                    throw new Error('You can only add up to 20 skills');
                }
                return true;
            }),
        
        body('skills.*.name')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Skill name must be between 2 and 50 characters'),
        
        body('skills.*.proficiency')
            .optional()
            .custom((proficiency) => {
                if (proficiency && !CustomValidators.isValidProficiency(proficiency)) {
                    throw new Error('Invalid proficiency level');
                }
                return true;
            }),
        
        body('skills.*.yearsOfExperience')
            .optional()
            .isInt({ min: 0, max: 50 })
            .withMessage('Years of experience must be between 0 and 50')
    ],

    createInternship: [
        body('title')
            .notEmpty()
            .trim()
            .withMessage('Internship title is required')
            .isLength({ min: 5, max: 200 })
            .withMessage('Title must be between 5 and 200 characters'),
        
        body('description')
            .notEmpty()
            .trim()
            .withMessage('Description is required')
            .isLength({ min: 50, max: 5000 })
            .withMessage('Description must be between 50 and 5000 characters'),
        
        body('location')
            .notEmpty()
            .trim()
            .withMessage('Location is required')
            .isLength({ min: 2, max: 100 })
            .withMessage('Location must be between 2 and 100 characters'),
        
        body('internshipType')
            .notEmpty()
            .custom((type) => {
                if (!CustomValidators.isValidInternshipType(type)) {
                    throw new Error('Invalid internship type');
                }
                return true;
            }),
        
        body('duration.value')
            .notEmpty()
            .isInt({ min: 1, max: 24 })
            .withMessage('Duration must be between 1 and 24'),
        
        body('duration.unit')
            .notEmpty()
            .custom((unit) => {
                if (!CustomValidators.isValidDurationUnit(unit)) {
                    throw new Error('Invalid duration unit');
                }
                return true;
            }),
        
        body('stipend.amount')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Stipend amount must be a positive number'),
        
        body('stipend.currency')
            .optional()
            .isLength({ min: 3, max: 3 })
            .withMessage('Currency must be a 3-letter code'),
        
        body('stipend.frequency')
            .optional()
            .custom((frequency) => {
                if (frequency && !CustomValidators.isValidStipendFrequency(frequency)) {
                    throw new Error('Invalid stipend frequency');
                }
                return true;
            }),
        
        body('requiredSkills')
            .isArray({ min: 1 })
            .withMessage('At least one required skill is needed'),
        
        body('requiredSkills.*.skill')
            .notEmpty()
            .trim()
            .withMessage('Skill name is required')
            .isLength({ min: 2, max: 50 })
            .withMessage('Skill name must be between 2 and 50 characters'),
        
        body('requiredSkills.*.proficiency')
            .optional()
            .custom((proficiency) => {
                if (proficiency && !CustomValidators.isValidSkillProficiency(proficiency)) {
                    throw new Error('Invalid skill proficiency level');
                }
                return true;
            }),
        
        body('requiredSkills.*.importance')
            .optional()
            .isInt({ min: 1, max: 10 })
            .withMessage('Skill importance must be between 1 and 10'),
        
        body('responsibilities')
            .optional()
            .isArray()
            .withMessage('Responsibilities must be an array'),
        
        body('requirements')
            .optional()
            .isArray()
            .withMessage('Requirements must be an array'),
        
        body('benefits')
            .optional()
            .isArray()
            .withMessage('Benefits must be an array'),
        
        body('applicationDeadline')
            .optional()
            .isISO8601()
            .withMessage('Invalid deadline date format')
            .custom((date) => {
                if (date && new Date(date) <= new Date()) {
                    throw new Error('Application deadline must be in the future');
                }
                return true;
            }),
        
        body('startDate')
            .optional()
            .isISO8601()
            .withMessage('Invalid start date format'),
        
        body('positionsAvailable')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Positions available must be at least 1'),
        
        body('category')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Category must be between 2 and 50 characters'),
        
        body('status')
            .optional()
            .custom((status) => {
                if (status && !CustomValidators.isValidInternshipStatus(status)) {
                    throw new Error('Invalid internship status');
                }
                return true;
            })
    ],

    updateInternship: [
        body('title')
            .optional()
            .trim()
            .isLength({ min: 5, max: 200 })
            .withMessage('Title must be between 5 and 200 characters'),
        
        body('description')
            .optional()
            .trim()
            .isLength({ min: 50, max: 5000 })
            .withMessage('Description must be between 50 and 5000 characters'),
        
        body('location')
            .optional()
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Location must be between 2 and 100 characters'),
        
        body('internshipType')
            .optional()
            .custom((type) => {
                if (type && !CustomValidators.isValidInternshipType(type)) {
                    throw new Error('Invalid internship type');
                }
                return true;
            }),
        
        body('duration.value')
            .optional()
            .isInt({ min: 1, max: 24 })
            .withMessage('Duration must be between 1 and 24'),
        
        body('duration.unit')
            .optional()
            .custom((unit) => {
                if (unit && !CustomValidators.isValidDurationUnit(unit)) {
                    throw new Error('Invalid duration unit');
                }
                return true;
            }),
        
        body('stipend.amount')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Stipend amount must be a positive number'),
        
        body('status')
            .optional()
            .custom((status) => {
                if (status && !CustomValidators.isValidInternshipStatus(status)) {
                    throw new Error('Invalid internship status');
                }
                return true;
            }),
        
        body('applicationDeadline')
            .optional()
            .isISO8601()
            .withMessage('Invalid deadline date format')
            .custom((date) => {
                if (date && new Date(date) <= new Date()) {
                    throw new Error('Application deadline must be in the future');
                }
                return true;
            })
    ],

    applyForInternship: [
        body('coverLetter')
            .optional()
            .trim()
            .isLength({ min: 10, max: 2000 })
            .withMessage('Cover letter must be between 10 and 2000 characters')
    ],

    updateApplicationStatus: [
        body('status')
            .notEmpty()
            .custom((status) => {
                if (!CustomValidators.isValidApplicationStatus(status)) {
                    throw new Error('Invalid application status');
                }
                return true;
            }),
        
        body('feedback')
            .optional()
            .trim()
            .isLength({ max: 1000 })
            .withMessage('Feedback cannot exceed 1000 characters'),
        
        body('interviewDate')
            .optional()
            .isISO8601()
            .withMessage('Invalid interview date format')
            .custom((date) => {
                if (date && new Date(date) <= new Date()) {
                    throw new Error('Interview date must be in the future');
                }
                return true;
            })
    ],

    updateRecruiterProfile: [
        body('companyName')
            .optional()
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Company name must be between 2 and 100 characters'),
        
        body('contactPerson.firstName')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('First name must be between 2 and 50 characters'),
        
        body('contactPerson.lastName')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Last name must be between 2 and 50 characters'),
        
        body('companyWebsite')
            .optional()
            .custom((website) => {
                if (website && !CustomValidators.isValidURL(website)) {
                    throw new Error('Please provide a valid website URL');
                }
                return true;
            }),
        
        body('phone')
            .optional()
            .custom((phone) => {
                if (phone && !CustomValidators.isValidPhoneNumber(phone)) {
                    throw new Error('Please provide a valid phone number');
                }
                return true;
            }),
        
        body('companySize')
            .optional()
            .custom((size) => {
                if (size && !CustomValidators.isValidCompanySize(size)) {
                    throw new Error('Invalid company size');
                }
                return true;
            }),
        
        body('industry')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Industry must be between 2 and 50 characters'),
        
        body('companyDescription')
            .optional()
            .trim()
            .isLength({ max: 1000 })
            .withMessage('Company description cannot exceed 1000 characters')
    ],

    bulkEmail: [
        body('applicationIds')
            .isArray({ min: 1 })
            .withMessage('At least one application ID is required'),
        
        body('applicationIds.*')
            .isMongoId()
            .withMessage('Invalid application ID'),
        
        body('subject')
            .notEmpty()
            .trim()
            .withMessage('Email subject is required')
            .isLength({ min: 5, max: 200 })
            .withMessage('Subject must be between 5 and 200 characters'),
        
        body('message')
            .notEmpty()
            .trim()
            .withMessage('Email message is required')
            .isLength({ min: 10, max: 5000 })
            .withMessage('Message must be between 10 and 5000 characters')
    ],

    manageSkill: [
        body('action')
            .isIn(['create', 'update', 'delete', 'get'])
            .withMessage('Invalid action'),
        
        body('skillId')
            .if(body('action').isIn(['update', 'delete']))
            .notEmpty()
            .withMessage('Skill ID is required for update/delete actions')
            .isMongoId()
            .withMessage('Invalid skill ID'),
        
        body('skillData')
            .if(body('action').isIn(['create', 'update']))
            .notEmpty()
            .withMessage('Skill data is required for create/update actions')
            .custom((skillData) => {
                if (skillData) {
                    if (!skillData.name || !skillData.name.trim()) {
                        throw new Error('Skill name is required');
                    }
                    if (skillData.name.length < 2 || skillData.name.length > 50) {
                        throw new Error('Skill name must be between 2 and 50 characters');
                    }
                    if (skillData.category && !['programming', 'design', 'data_science', 'marketing', 'business', 'language', 'soft_skills', 'technical', 'creative', 'analytical'].includes(skillData.category)) {
                        throw new Error('Invalid skill category');
                    }
                }
                return true;
            })
    ],

    // Query parameter validations
    paginationQuery: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer')
            .toInt(),
        
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100')
            .toInt(),
        
        query('sortBy')
            .optional()
            .isString()
            .trim()
            .withMessage('Sort by must be a string'),
        
        query('sortOrder')
            .optional()
            .isIn(['asc', 'desc'])
            .withMessage('Sort order must be either asc or desc')
    ],

    internshipQuery: [
        query('search')
            .optional()
            .trim()
            .isLength({ max: 100 })
            .withMessage('Search query cannot exceed 100 characters'),
        
        query('location')
            .optional()
            .trim()
            .isLength({ max: 100 })
            .withMessage('Location cannot exceed 100 characters'),
        
        query('type')
            .optional()
            .custom((type) => {
                if (type && !CustomValidators.isValidInternshipType(type)) {
                    throw new Error('Invalid internship type');
                }
                return true;
            }),
        
        query('category')
            .optional()
            .trim()
            .isLength({ max: 50 })
            .withMessage('Category cannot exceed 50 characters'),
        
        query('duration')
            .optional()
            .matches(/^\d+-\d+$/)
            .withMessage('Duration must be in format min-max'),
        
        query('minStipend')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Minimum stipend must be a positive number'),
        
        query('skills')
            .optional()
            .custom((skills) => {
                if (skills) {
                    const skillList = skills.split(',');
                    if (skillList.length > 10) {
                        throw new Error('Maximum 10 skills can be filtered at once');
                    }
                }
                return true;
            })
    ],

    // ID parameter validation
    validateIdParam: [
        param('id')
            .isMongoId()
            .withMessage('Invalid ID format')
    ],

    validateInternshipIdParam: [
        param('internshipId')
            .isMongoId()
            .withMessage('Invalid internship ID format')
            .custom(async (internshipId, { req }) => {
                const internship = await Internship.findById(internshipId);
                if (!internship) {
                    throw new Error('Internship not found');
                }
                
                // For recruiters, check if they own this internship
                if (req.user.role === 'recruiter' && internship.company.toString() !== req.user._id.toString()) {
                    throw new Error('Access denied to this internship');
                }
                
                return true;
            })
    ],

    validateApplicationIdParam: [
        param('applicationId')
            .isMongoId()
            .withMessage('Invalid application ID format')
            .custom(async (applicationId, { req }) => {
                const application = await Application.findById(applicationId);
                if (!application) {
                    throw new Error('Application not found');
                }
                
                // For students, check if this is their application
                if (req.user.role === 'student' && application.student.toString() !== req.user._id.toString()) {
                    throw new Error('Access denied to this application');
                }
                
                // For recruiters, check if they own the related internship
                if (req.user.role === 'recruiter') {
                    const internship = await Internship.findById(application.internship);
                    if (!internship || internship.company.toString() !== req.user._id.toString()) {
                        throw new Error('Access denied to this application');
                    }
                }
                
                return true;
            })
    ],

    validateUserIdParam: [
        param('userId')
            .isMongoId()
            .withMessage('Invalid user ID format')
    ]
};

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};

// Export everything
module.exports = {
    CustomValidators,
    validationChains,
    handleValidationErrors,
    
    // Individual validation chains for easy import
    registerValidation: [...validationChains.register, handleValidationErrors],
    studentRegisterValidation: [...validationChains.studentRegister, handleValidationErrors],
    recruiterRegisterValidation: [...validationChains.recruiterRegister, handleValidationErrors],
    loginValidation: [...validationChains.login, handleValidationErrors],
    changePasswordValidation: [...validationChains.changePassword, handleValidationErrors],
    updateProfileValidation: [...validationChains.updateProfile, handleValidationErrors],
    createInternshipValidation: [...validationChains.createInternship, handleValidationErrors],
    updateInternshipValidation: [...validationChains.updateInternship, handleValidationErrors],
    applyForInternshipValidation: [...validationChains.applyForInternship, handleValidationErrors],
    updateApplicationStatusValidation: [...validationChains.updateApplicationStatus, handleValidationErrors],
    updateRecruiterProfileValidation: [...validationChains.updateRecruiterProfile, handleValidationErrors],
    bulkEmailValidation: [...validationChains.bulkEmail, handleValidationErrors],
    manageSkillValidation: [...validationChains.manageSkill, handleValidationErrors],
    paginationQueryValidation: [...validationChains.paginationQuery, handleValidationErrors],
    internshipQueryValidation: [...validationChains.internshipQuery, handleValidationErrors],
    validateIdParam: [...validationChains.validateIdParam, handleValidationErrors],
    validateInternshipIdParam: [...validationChains.validateInternshipIdParam, handleValidationErrors],
    validateApplicationIdParam: [...validationChains.validateApplicationIdParam, handleValidationErrors],
    validateUserIdParam: [...validationChains.validateUserIdParam, handleValidationErrors]
};