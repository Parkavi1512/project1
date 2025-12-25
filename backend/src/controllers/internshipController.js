const Internship = require('../models/Internship');
const Application = require('../models/Application');
const Recruiter = require('../models/Recruiter');
const matchingService = require('../services/matchingService');
const emailService = require('../services/emailService');
const { validationResult } = require('express-validator');

const internshipController = {
    // Create new internship
    createInternship: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const recruiter = await Recruiter.findById(req.user._id);
            if (!recruiter) {
                return res.status(404).json({
                    success: false,
                    message: 'Recruiter not found'
                });
            }

            const internshipData = {
                ...req.body,
                company: req.user._id,
                companyName: recruiter.companyName
            };

            const internship = new Internship(internshipData);
            await internship.save();

            // Update recruiter's posted internships count
            recruiter.postedInternshipsCount += 1;
            await recruiter.save();

            res.status(201).json({
                success: true,
                message: 'Internship created successfully',
                data: internship
            });

        } catch (error) {
            console.error('Create internship error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Get all internships with filters
    getAllInternships: async (req, res) => {
        try {
            const {
                page = 1,
                limit = 10,
                search,
                location,
                type,
                category,
                duration,
                minStipend,
                skills
            } = req.query;

            const query = { status: 'active' };

            // Search filter
            if (search) {
                query.$text = { $search: search };
            }

            // Location filter
            if (location) {
                query.location = new RegExp(location, 'i');
            }

            // Type filter
            if (type) {
                query.internshipType = type;
            }

            // Category filter
            if (category) {
                query.category = new RegExp(category, 'i');
            }

            // Duration filter
            if (duration) {
                const [min, max] = duration.split('-').map(Number);
                if (min && max) {
                    query['duration.value'] = { $gte: min, $lte: max };
                }
            }

            // Stipend filter
            if (minStipend) {
                query['stipend.amount'] = { $gte: Number(minStipend) };
            }

            // Skills filter
            if (skills) {
                const skillList = skills.split(',').map(s => s.trim().toLowerCase());
                query['requiredSkills.skill'] = { $in: skillList };
            }

            const skip = (page - 1) * limit;

            const internships = await Internship.find(query)
                .populate('company', 'companyName companyLogo industry')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit));

            const total = await Internship.countDocuments(query);

            res.json({
                success: true,
                data: {
                    internships,
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(total / limit),
                        totalItems: total,
                        itemsPerPage: Number(limit)
                    }
                }
            });

        } catch (error) {
            console.error('Get internships error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Get internship by ID
    getInternshipById: async (req, res) => {
        try {
            const internship = await Internship.findById(req.params.id)
                .populate('company', 'companyName companyLogo companyDescription industry website');

            if (!internship) {
                return res.status(404).json({
                    success: false,
                    message: 'Internship not found'
                });
            }

            // Check if user has applied (for students)
            let hasApplied = false;
            if (req.user && req.user.role === 'student') {
                const application = await Application.findOne({
                    student: req.user._id,
                    internship: internship._id
                });
                hasApplied = !!application;
            }

            res.json({
                success: true,
                data: {
                    ...internship.toObject(),
                    hasApplied
                }
            });

        } catch (error) {
            console.error('Get internship error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Update internship
    updateInternship: async (req, res) => {
        try {
            const internship = await Internship.findOne({
                _id: req.params.id,
                company: req.user._id
            });

            if (!internship) {
                return res.status(404).json({
                    success: false,
                    message: 'Internship not found or access denied'
                });
            }

            Object.keys(req.body).forEach(key => {
                internship[key] = req.body[key];
            });

            await internship.save();

            res.json({
                success: true,
                message: 'Internship updated successfully',
                data: internship
            });

        } catch (error) {
            console.error('Update internship error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Delete internship
    deleteInternship: async (req, res) => {
        try {
            const internship = await Internship.findOne({
                _id: req.params.id,
                company: req.user._id
            });

            if (!internship) {
                return res.status(404).json({
                    success: false,
                    message: 'Internship not found or access denied'
                });
            }

            // Instead of deleting, mark as closed
            internship.status = 'closed';
            await internship.save();

            res.json({
                success: true,
                message: 'Internship closed successfully'
            });

        } catch (error) {
            console.error('Delete internship error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Apply for internship
    applyForInternship: async (req, res) => {
        try {
            const { coverLetter } = req.body;
            const studentId = req.user._id;
            const internshipId = req.params.id;

            // Check if internship exists and is active
            const internship = await Internship.findById(internshipId);
            if (!internship || internship.status !== 'active') {
                return res.status(404).json({
                    success: false,
                    message: 'Internship not available'
                });
            }

            // Check if application deadline has passed
            if (internship.applicationDeadline && new Date() > internship.applicationDeadline) {
                return res.status(400).json({
                    success: false,
                    message: 'Application deadline has passed'
                });
            }

            // Check if student has already applied
            const existingApplication = await Application.findOne({
                student: studentId,
                internship: internshipId
            });

            if (existingApplication) {
                return res.status(400).json({
                    success: false,
                    message: 'You have already applied for this internship'
                });
            }

            // Calculate match score
            const Student = require('../models/Student');
            const student = await Student.findById(studentId);
            const matchScore = await matchingService.calculateMatchScore(student, internship);

            // Create application
            const application = new Application({
                student: studentId,
                internship: internshipId,
                coverLetter,
                matchScore
            });

            await application.save();

            // Update internship applications count
            internship.applicationsReceived += 1;
            await internship.save();

            // Send confirmation email to student
            await emailService.sendApplicationConfirmation(
                req.user.email,
                student.fullName,
                internship.title,
                internship.companyName
            );

            // Send notification to recruiter
            const recruiter = await Recruiter.findById(internship.company);
            if (recruiter) {
                await emailService.sendNewApplicationNotification(
                    recruiter.email,
                    recruiter.contactPerson.firstName,
                    student.fullName,
                    internship.title
                );
            }

            res.status(201).json({
                success: true,
                message: 'Application submitted successfully',
                data: application
            });

        } catch (error) {
            console.error('Apply internship error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Get recommended internships for student
    getRecommendations: async (req, res) => {
        try {
            const studentId = req.user._id;
            const limit = parseInt(req.query.limit) || 10;

            const matches = await matchingService.getTopMatchesForStudent(studentId, limit);

            res.json({
                success: true,
                data: matches
            });

        } catch (error) {
            console.error('Get recommendations error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Search internships
    searchInternships: async (req, res) => {
        try {
            const { q, location, skills, page = 1, limit = 10 } = req.query;

            const query = { status: 'active' };

            if (q) {
                query.$text = { $search: q };
            }

            if (location) {
                query.location = new RegExp(location, 'i');
            }

            if (skills) {
                const skillList = skills.split(',').map(s => s.trim().toLowerCase());
                query['requiredSkills.skill'] = { $in: skillList };
            }

            const skip = (page - 1) * limit;
            const internships = await Internship.find(query)
                .populate('company', 'companyName companyLogo')
                .skip(skip)
                .limit(Number(limit))
                .sort({ createdAt: -1 });

            const total = await Internship.countDocuments(query);

            res.json({
                success: true,
                data: {
                    internships,
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(total / limit),
                        totalItems: total
                    }
                }
            });

        } catch (error) {
            console.error('Search internships error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    }
};

module.exports = internshipController;