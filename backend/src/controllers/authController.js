const User = require('../models/User');
const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const emailService = require('../services/emailService');

const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
    );
};

const authController = {
    // Register new user
    register: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { email, password, role, ...profileData } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this email already exists'
                });
            }

            let user;
            if (role === 'student') {
                user = new Student({
                    email,
                    password,
                    role,
                    ...profileData
                });
            } else if (role === 'recruiter') {
                user = new Recruiter({
                    email,
                    password,
                    role,
                    ...profileData
                });
            } else {
                // Admin registration handled separately
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role specified'
                });
            }

            await user.save();

            // Generate token
            const token = generateToken(user._id, user.role);

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            // Send welcome email
            const name = role === 'student' 
                ? `${profileData.firstName} ${profileData.lastName}`
                : profileData.contactPerson?.firstName || 'User';
            
            await emailService.sendWelcomeEmail(email, name, role);

            res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: {
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                        role: user.role,
                        profileCompleted: user.profileCompleted
                    }
                }
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during registration',
                error: error.message
            });
        }
    },

    // Login user
    login: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Check if user is active
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Account is deactivated. Please contact admin.'
                });
            }

            // Verify password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Generate token
            const token = generateToken(user._id, user.role);

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            // Get user data based on role
            let userData;
            if (user.role === 'student') {
                userData = await Student.findById(user._id).select('-password');
            } else if (user.role === 'recruiter') {
                userData = await Recruiter.findById(user._id).select('-password');
            } else {
                userData = user;
            }

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    user: userData
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during login',
                error: error.message
            });
        }
    },

    // Get current user profile
    getProfile: async (req, res) => {
        try {
            let user;
            if (req.user.role === 'student') {
                user = await Student.findById(req.user._id).select('-password');
            } else if (req.user.role === 'recruiter') {
                user = await Recruiter.findById(req.user._id).select('-password');
            } else {
                user = await User.findById(req.user._id).select('-password');
            }

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                data: user
            });

        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Update profile
    updateProfile: async (req, res) => {
        try {
            const updates = req.body;
            let user;

            if (req.user.role === 'student') {
                user = await Student.findById(req.user._id);
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'Student not found'
                    });
                }

                // Update student-specific fields
                Object.keys(updates).forEach(key => {
                    if (key !== 'password' && key !== 'email' && key !== 'role') {
                        user[key] = updates[key];
                    }
                });

                // Mark profile as completed if required fields are filled
                if (user.firstName && user.lastName && user.university && user.major && user.skills?.length > 0) {
                    user.profileCompleted = true;
                }

            } else if (req.user.role === 'recruiter') {
                user = await Recruiter.findById(req.user._id);
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'Recruiter not found'
                    });
                }

                // Update recruiter-specific fields
                Object.keys(updates).forEach(key => {
                    if (key !== 'password' && key !== 'email' && key !== 'role') {
                        user[key] = updates[key];
                    }
                });

            } else {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid user role'
                });
            }

            await user.save();

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: user
            });

        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Change password
    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;

            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Verify current password
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Update password
            user.password = newPassword;
            await user.save();

            res.json({
                success: true,
                message: 'Password changed successfully'
            });

        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    }
};

module.exports = authController;