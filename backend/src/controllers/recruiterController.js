const Recruiter = require('../models/Recruiter');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const Student = require('../models/Student');
const matchingService = require('../services/matchingService');
const { validationResult } = require('express-validator');
const emailService = require('../services/emailService');

const recruiterController = {
    // Get recruiter profile
    getProfile: async (req, res) => {
        try {
            const recruiter = await Recruiter.findById(req.user._id)
                .select('-password');

            if (!recruiter) {
                return res.status(404).json({
                    success: false,
                    message: 'Recruiter profile not found'
                });
            }

            res.json({
                success: true,
                data: recruiter
            });

        } catch (error) {
            console.error('Get recruiter profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Update recruiter profile
    updateProfile: async (req, res) => {
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

            const updates = req.body;

            // Update fields
            Object.keys(updates).forEach(key => {
                if (key !== 'password' && key !== 'email' && key !== 'role') {
                    recruiter[key] = updates[key];
                }
            });

            await recruiter.save();

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: recruiter
            });

        } catch (error) {
            console.error('Update recruiter profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Get recruiter's internships
    getInternships: async (req, res) => {
        try {
            const { status, page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;

            const query = { company: req.user._id };
            if (status) {
                query.status = status;
            }

            const internships = await Internship.find(query)
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

    // Get applications for recruiter's internships
    getApplications: async (req, res) => {
        try {
            const { 
                status, 
                internshipId, 
                page = 1, 
                limit = 10,
                sortBy = 'appliedAt',
                sortOrder = 'desc'
            } = req.query;

            const skip = (page - 1) * limit;
            const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

            // Build query
            const query = {};
            
            // Get all internship IDs for this recruiter
            const internships = await Internship.find({ 
                company: req.user._id 
            }).select('_id');
            
            const internshipIds = internships.map(i => i._id);
            query.internship = { $in: internshipIds };

            if (internshipId) {
                // Verify the internship belongs to this recruiter
                const isValidInternship = internshipIds.some(id => 
                    id.toString() === internshipId
                );
                
                if (isValidInternship) {
                    query.internship = internshipId;
                } else {
                    return res.status(403).json({
                        success: false,
                        message: 'Access denied to this internship'
                    });
                }
            }

            if (status) {
                query.status = status;
            }

            const applications = await Application.find(query)
                .populate('internship', 'title companyName location')
                .populate('student', 'firstName lastName university major skills resumeUrl')
                .sort(sort)
                .skip(skip)
                .limit(Number(limit));

            const total = await Application.countDocuments(query);

            // Calculate statistics
            const stats = await Application.aggregate([
                { $match: { internship: { $in: internshipIds } } },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        avgMatchScore: { $avg: '$matchScore' }
                    }
                }
            ]);

            res.json({
                success: true,
                data: {
                    applications,
                    statistics: stats,
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(total / limit),
                        totalItems: total,
                        itemsPerPage: Number(limit)
                    }
                }
            });

        } catch (error) {
            console.error('Get applications error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Update application status
    updateApplicationStatus: async (req, res) => {
        try {
            const { status, feedback, interviewDate } = req.body;
            const { applicationId } = req.params;

            // Find application and verify recruiter has access
            const application = await Application.findById(applicationId)
                .populate('internship')
                .populate('student');

            if (!application) {
                return res.status(404).json({
                    success: false,
                    message: 'Application not found'
                });
            }

            // Verify the internship belongs to this recruiter
            const internship = await Internship.findOne({
                _id: application.internship,
                company: req.user._id
            });

            if (!internship) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied to this application'
                });
            }

            // Update application
            application.status = status;
            if (feedback) {
                application.recruiterFeedback = feedback;
            }
            if (interviewDate) {
                application.interviewDate = new Date(interviewDate);
            }

            // Add note
            application.notes.push({
                content: `Status changed to ${status}`,
                addedBy: 'recruiter',
                addedAt: new Date()
            });

            await application.save();

            // Send email notification to student
            if (application.student.email) {
                await emailService.sendApplicationStatusUpdate(
                    application.student.email,
                    application.student.firstName,
                    internship.title,
                    status,
                    feedback
                );
            }

            res.json({
                success: true,
                message: 'Application status updated successfully',
                data: application
            });

        } catch (error) {
            console.error('Update application status error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Get top candidates for an internship
    getTopCandidates: async (req, res) => {
        try {
            const { internshipId } = req.params;
            const limit = parseInt(req.query.limit) || 20;

            // Verify the internship belongs to this recruiter
            const internship = await Internship.findOne({
                _id: internshipId,
                company: req.user._id
            });

            if (!internship) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied to this internship'
                });
            }

            // Get top candidates using matching service
            const candidates = await matchingService.getTopCandidatesForInternship(
                internshipId,
                limit
            );

            res.json({
                success: true,
                data: {
                    internship,
                    candidates
                }
            });

        } catch (error) {
            console.error('Get top candidates error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Get recruiter dashboard data
    getDashboardData: async (req, res) => {
        try {
            const recruiterId = req.user._id;

            // Get recruiter profile
            const recruiter = await Recruiter.findById(recruiterId)
                .select('-password');

            // Get statistics
            const [internships, applications, recentApplications] = await Promise.all([
                Internship.find({ company: recruiterId }),
                Application.aggregate([
                    {
                        $lookup: {
                            from: 'internships',
                            localField: 'internship',
                            foreignField: '_id',
                            as: 'internship'
                        }
                    },
                    { $unwind: '$internship' },
                    { $match: { 'internship.company': recruiterId } },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 },
                            pending: {
                                $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                            },
                            shortlisted: {
                                $sum: { $cond: [{ $eq: ['$status', 'shortlisted'] }, 1, 0] }
                            },
                            rejected: {
                                $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
                            },
                            avgMatchScore: { $avg: '$matchScore' }
                        }
                    }
                ]),
                Application.find({})
                    .populate({
                        path: 'internship',
                        match: { company: recruiterId }
                    })
                    .populate('student', 'firstName lastName university')
                    .sort({ appliedAt: -1 })
                    .limit(5)
                    .then(apps => apps.filter(app => app.internship)) // Filter out null internships
            ]);

            // Get active internships
            const activeInternships = internships.filter(i => i.status === 'active');

            // Calculate metrics
            const stats = applications[0] || {
                total: 0,
                pending: 0,
                shortlisted: 0,
                rejected: 0,
                avgMatchScore: 0
            };

            res.json({
                success: true,
                data: {
                    profile: recruiter,
                    statistics: {
                        totalInternships: internships.length,
                        activeInternships: activeInternships.length,
                        totalApplications: stats.total,
                        pendingApplications: stats.pending,
                        shortlistedCandidates: stats.shortlisted,
                        averageMatchScore: Math.round(stats.avgMatchScore || 0)
                    },
                    recentApplications,
                    activeInternships: activeInternships.slice(0, 5)
                }
            });

        } catch (error) {
            console.error('Get dashboard error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Get analytics data
    getAnalytics: async (req, res) => {
        try {
            const recruiterId = req.user._id;
            const { timeframe = '30d' } = req.query;

            let dateFilter = new Date();
            switch (timeframe) {
                case '7d':
                    dateFilter.setDate(dateFilter.getDate() - 7);
                    break;
                case '30d':
                    dateFilter.setDate(dateFilter.getDate() - 30);
                    break;
                case '90d':
                    dateFilter.setDate(dateFilter.getDate() - 90);
                    break;
                default:
                    dateFilter.setDate(dateFilter.getDate() - 30);
            }

            // Get applications over time
            const applicationsOverTime = await Application.aggregate([
                {
                    $lookup: {
                        from: 'internships',
                        localField: 'internship',
                        foreignField: '_id',
                        as: 'internship'
                    }
                },
                { $unwind: '$internship' },
                { $match: { 
                    'internship.company': recruiterId,
                    appliedAt: { $gte: dateFilter }
                }},
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$appliedAt" }
                        },
                        count: { $sum: 1 },
                        avgScore: { $avg: '$matchScore' }
                    }
                },
                { $sort: { '_id': 1 } }
            ]);

            // Get applications by status
            const applicationsByStatus = await Application.aggregate([
                {
                    $lookup: {
                        from: 'internships',
                        localField: 'internship',
                        foreignField: '_id',
                        as: 'internship'
                    }
                },
                { $unwind: '$internship' },
                { $match: { 'internship.company': recruiterId }},
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        avgScore: { $avg: '$matchScore' }
                    }
                }
            ]);

            // Get top skills from applicants
            const topSkills = await Application.aggregate([
                {
                    $lookup: {
                        from: 'internships',
                        localField: 'internship',
                        foreignField: '_id',
                        as: 'internship'
                    }
                },
                { $unwind: '$internship' },
                { $match: { 'internship.company': recruiterId }},
                {
                    $lookup: {
                        from: 'students',
                        localField: 'student',
                        foreignField: '_id',
                        as: 'student'
                    }
                },
                { $unwind: '$student' },
                { $unwind: '$student.skills' },
                {
                    $group: {
                        _id: '$student.skills.name',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]);

            // Get university distribution
            const universityDistribution = await Application.aggregate([
                {
                    $lookup: {
                        from: 'internships',
                        localField: 'internship',
                        foreignField: '_id',
                        as: 'internship'
                    }
                },
                { $unwind: '$internship' },
                { $match: { 'internship.company': recruiterId }},
                {
                    $lookup: {
                        from: 'students',
                        localField: 'student',
                        foreignField: '_id',
                        as: 'student'
                    }
                },
                { $unwind: '$student' },
                {
                    $group: {
                        _id: '$student.university',
                        count: { $sum: 1 },
                        avgScore: { $avg: '$matchScore' }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 8 }
            ]);

            res.json({
                success: true,
                data: {
                    applicationsOverTime,
                    applicationsByStatus,
                    topSkills,
                    universityDistribution,
                    timeframe
                }
            });

        } catch (error) {
            console.error('Get analytics error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Send bulk email to applicants
    sendBulkEmail: async (req, res) => {
        try {
            const { applicationIds, subject, message } = req.body;

            // Verify all applications belong to this recruiter
            const applications = await Application.find({
                _id: { $in: applicationIds }
            }).populate('internship student');

            // Filter applications that belong to this recruiter
            const validApplications = [];
            for (const app of applications) {
                const internship = await Internship.findOne({
                    _id: app.internship,
                    company: req.user._id
                });
                if (internship) {
                    validApplications.push(app);
                }
            }

            // Send emails
            const emailPromises = validApplications.map(app => 
                emailService.sendCustomEmail(
                    app.student.email,
                    subject,
                    message.replace('{studentName}', app.student.firstName)
                           .replace('{internshipTitle}', app.internship.title)
                           .replace('{companyName}', app.internship.companyName)
                )
            );

            await Promise.all(emailPromises);

            res.json({
                success: true,
                message: `Emails sent to ${validApplications.length} applicants`
            });

        } catch (error) {
            console.error('Send bulk email error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    }
};

module.exports = recruiterController;