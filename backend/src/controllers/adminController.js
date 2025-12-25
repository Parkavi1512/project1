const User = require('../models/User');
const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const Skill = require('../models/Skill');
const { validationResult } = require('express-validator');

const adminController = {
    // Get system statistics
    getSystemStats: async (req, res) => {
        try {
            const [
                totalUsers,
                totalStudents,
                totalRecruiters,
                totalInternships,
                totalApplications,
                activeInternships,
                pendingVerifications,
                recentSignups
            ] = await Promise.all([
                User.countDocuments(),
                Student.countDocuments(),
                Recruiter.countDocuments(),
                Internship.countDocuments(),
                Application.countDocuments(),
                Internship.countDocuments({ status: 'active' }),
                Recruiter.countDocuments({ verificationStatus: 'pending' }),
                User.find().sort({ createdAt: -1 }).limit(10).select('-password')
            ]);

            // Get applications by status
            const applicationsByStatus = await Application.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]);

            // Get platform growth (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const recentStats = await User.aggregate([
                {
                    $match: {
                        createdAt: { $gte: thirtyDaysAgo }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                        },
                        count: { $sum: 1 },
                        students: {
                            $sum: { $cond: [{ $eq: ["$role", "student"] }, 1, 0] }
                        },
                        recruiters: {
                            $sum: { $cond: [{ $eq: ["$role", "recruiter"] }, 1, 0] }
                        }
                    }
                },
                { $sort: { '_id': 1 } }
            ]);

            res.json({
                success: true,
                data: {
                    overview: {
                        totalUsers,
                        totalStudents,
                        totalRecruiters,
                        totalInternships,
                        totalApplications,
                        activeInternships,
                        pendingVerifications
                    },
                    applicationsByStatus,
                    recentSignups,
                    platformGrowth: recentStats
                }
            });

        } catch (error) {
            console.error('Get system stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Get all users with filters
    getAllUsers: async (req, res) => {
        try {
            const {
                role,
                status,
                search,
                page = 1,
                limit = 20,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = req.query;

            const skip = (page - 1) * limit;
            const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

            const query = {};
            if (role) query.role = role;
            if (status === 'active') query.isActive = true;
            if (status === 'inactive') query.isActive = false;

            if (search) {
                query.$or = [
                    { email: { $regex: search, $options: 'i' } }
                ];

                // For students, search by name
                if (role === 'student' || !role) {
                    const students = await Student.find({
                        $or: [
                            { firstName: { $regex: search, $options: 'i' } },
                            { lastName: { $regex: search, $options: 'i' } }
                        ]
                    }).select('_id');
                    
                    query.$or.push({ _id: { $in: students.map(s => s._id) } });
                }

                // For recruiters, search by company name
                if (role === 'recruiter' || !role) {
                    const recruiters = await Recruiter.find({
                        companyName: { $regex: search, $options: 'i' }
                    }).select('_id');
                    
                    query.$or.push({ _id: { $in: recruiters.map(r => r._id) } });
                }
            }

            const total = await User.countDocuments(query);
            
            // Get base user data
            let users = await User.find(query)
                .select('-password')
                .sort(sort)
                .skip(skip)
                .limit(Number(limit));

            // Enrich with role-specific data
            const enrichedUsers = await Promise.all(users.map(async (user) => {
                let userData = user.toObject();
                
                if (user.role === 'student') {
                    const student = await Student.findById(user._id)
                        .select('firstName lastName university major profileScore');
                    if (student) {
                        userData = { ...userData, ...student.toObject() };
                    }
                } else if (user.role === 'recruiter') {
                    const recruiter = await Recruiter.findById(user._id)
                        .select('companyName contactPerson verificationStatus postedInternshipsCount');
                    if (recruiter) {
                        userData = { ...userData, ...recruiter.toObject() };
                    }
                }

                return userData;
            }));

            res.json({
                success: true,
                data: {
                    users: enrichedUsers,
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(total / limit),
                        totalItems: total,
                        itemsPerPage: Number(limit)
                    }
                }
            });

        } catch (error) {
            console.error('Get all users error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Get user by ID
    getUserById: async (req, res) => {
        try {
            const userId = req.params.id;
            let user;

            // Try to find user in base collection
            const baseUser = await User.findById(userId).select('-password');
            if (!baseUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Get role-specific data
            if (baseUser.role === 'student') {
                user = await Student.findById(userId)
                    .select('-password')
                    .populate('skills.skillId', 'name category');
            } else if (baseUser.role === 'recruiter') {
                user = await Recruiter.findById(userId)
                    .select('-password');
            } else {
                user = baseUser;
            }

            // Get additional data based on role
            let additionalData = {};
            if (baseUser.role === 'student') {
                const [applications, recommendations] = await Promise.all([
                    Application.find({ student: userId })
                        .populate('internship', 'title companyName status')
                        .limit(10),
                    Internship.find({ status: 'active' })
                        .populate('company', 'companyName')
                        .limit(5)
                ]);

                additionalData = {
                    applications,
                    recommendations: recommendations.map(internship => ({
                        internship,
                        matchScore: Math.floor(Math.random() * 30) + 70 // Mock score
                    }))
                };
            } else if (baseUser.role === 'recruiter') {
                const [internships, applications] = await Promise.all([
                    Internship.find({ company: userId }),
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
                        { $match: { 'internship.company': userId } },
                        {
                            $group: {
                                _id: '$status',
                                count: { $sum: 1 }
                            }
                        }
                    ])
                ]);

                additionalData = {
                    internships,
                    applicationStats: applications
                };
            }

            res.json({
                success: true,
                data: {
                    ...user.toObject(),
                    ...additionalData
                }
            });

        } catch (error) {
            console.error('Get user by ID error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Update user status
    updateUserStatus: async (req, res) => {
        try {
            const { userId } = req.params;
            const { isActive, verificationStatus, notes } = req.body;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Update fields
            if (isActive !== undefined) {
                user.isActive = isActive;
            }

            // Update verification status for recruiters
            if (verificationStatus && user.role === 'recruiter') {
                const recruiter = await Recruiter.findById(userId);
                if (recruiter) {
                    recruiter.verificationStatus = verificationStatus;
                    await recruiter.save();
                }
            }

            // Add admin notes
            if (notes) {
                user.adminNotes = user.adminNotes || [];
                user.adminNotes.push({
                    content: notes,
                    addedBy: req.user._id,
                    addedAt: new Date()
                });
            }

            await user.save();

            res.json({
                success: true,
                message: 'User status updated successfully',
                data: user
            });

        } catch (error) {
            console.error('Update user status error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Delete user
    deleteUser: async (req, res) => {
        try {
            const { userId } = req.params;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Soft delete - mark as inactive
            user.isActive = false;
            user.deletedAt = new Date();
            user.deletedBy = req.user._id;

            await user.save();

            res.json({
                success: true,
                message: 'User deactivated successfully'
            });

        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Get all internships (admin view)
    getAllInternshipsAdmin: async (req, res) => {
        try {
            const {
                status,
                company,
                search,
                page = 1,
                limit = 20,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = req.query;

            const skip = (page - 1) * limit;
            const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

            const query = {};
            if (status) query.status = status;
            if (company) query.company = company;

            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { 'requiredSkills.skill': { $regex: search, $options: 'i' } }
                ];
            }

            const internships = await Internship.find(query)
                .populate('company', 'companyName email contactPerson')
                .sort(sort)
                .skip(skip)
                .limit(Number(limit));

            const total = await Internship.countDocuments(query);

            // Get statistics
            const stats = await Internship.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        avgApplications: { $avg: '$applicationsReceived' }
                    }
                }
            ]);

            res.json({
                success: true,
                data: {
                    internships,
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
            console.error('Get all internships error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Update internship (admin)
    updateInternshipAdmin: async (req, res) => {
        try {
            const { internshipId } = req.params;
            const updates = req.body;

            const internship = await Internship.findById(internshipId);
            if (!internship) {
                return res.status(404).json({
                    success: false,
                    message: 'Internship not found'
                });
            }

            // Update fields
            Object.keys(updates).forEach(key => {
                internship[key] = updates[key];
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

    // Delete internship (admin)
    deleteInternshipAdmin: async (req, res) => {
        try {
            const { internshipId } = req.params;

            const internship = await Internship.findById(internshipId);
            if (!internship) {
                return res.status(404).json({
                    success: false,
                    message: 'Internship not found'
                });
            }

            // Hard delete for admin
            await internship.deleteOne();

            // Also delete related applications
            await Application.deleteMany({ internship: internshipId });

            res.json({
                success: true,
                message: 'Internship and related applications deleted successfully'
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

    // Get all applications (admin view)
    getAllApplicationsAdmin: async (req, res) => {
        try {
            const {
                status,
                student,
                recruiter,
                page = 1,
                limit = 20,
                sortBy = 'appliedAt',
                sortOrder = 'desc'
            } = req.query;

            const skip = (page - 1) * limit;
            const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

            const query = {};
            if (status) query.status = status;
            if (student) query.student = student;

            // Filter by recruiter (through internship)
            if (recruiter) {
                const internships = await Internship.find({ company: recruiter })
                    .select('_id');
                query.internship = { $in: internships.map(i => i._id) };
            }

            const applications = await Application.find(query)
                .populate('internship', 'title companyName')
                .populate('student', 'firstName lastName university email')
                .sort(sort)
                .skip(skip)
                .limit(Number(limit));

            const total = await Application.countDocuments(query);

            res.json({
                success: true,
                data: {
                    applications,
                    pagination: {
                        currentPage: Number(page),
                        totalPages: Math.ceil(total / limit),
                        totalItems: total,
                        itemsPerPage: Number(limit)
                    }
                }
            });

        } catch (error) {
            console.error('Get all applications error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Manage skills
    manageSkills: async (req, res) => {
        try {
            const { action, skillId, skillData } = req.body;

            switch (action) {
                case 'create':
                    const newSkill = new Skill(skillData);
                    await newSkill.save();
                    res.json({
                        success: true,
                        message: 'Skill created successfully',
                        data: newSkill
                    });
                    break;

                case 'update':
                    const updatedSkill = await Skill.findByIdAndUpdate(
                        skillId,
                        skillData,
                        { new: true }
                    );
                    res.json({
                        success: true,
                        message: 'Skill updated successfully',
                        data: updatedSkill
                    });
                    break;

                case 'delete':
                    await Skill.findByIdAndDelete(skillId);
                    res.json({
                        success: true,
                        message: 'Skill deleted successfully'
                    });
                    break;

                case 'get':
                    const skills = await Skill.find()
                        .sort({ popularity: -1 });
                    res.json({
                        success: true,
                        data: skills
                    });
                    break;

                default:
                    res.status(400).json({
                        success: false,
                        message: 'Invalid action'
                    });
            }

        } catch (error) {
            console.error('Manage skills error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Get system logs (mock - in production use Winston or similar)
    getSystemLogs: async (req, res) => {
        try {
            // This is a mock implementation
            // In production, you would query from a logging database
            const logs = [
                {
                    timestamp: new Date().toISOString(),
                    level: 'INFO',
                    message: 'System started successfully',
                    user: 'system'
                },
                {
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    level: 'INFO',
                    message: 'New student registered: John Doe',
                    user: 'john@example.com'
                }
            ];

            res.json({
                success: true,
                data: logs
            });

        } catch (error) {
            console.error('Get system logs error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Backup database (mock - in production use MongoDB backup tools)
    backupDatabase: async (req, res) => {
        try {
            // This is a mock implementation
            // In production, implement proper database backup
            const backupInfo = {
                timestamp: new Date().toISOString(),
                status: 'completed',
                fileSize: '1.2GB',
                collections: ['users', 'students', 'recruiters', 'internships', 'applications']
            };

            res.json({
                success: true,
                message: 'Database backup initiated',
                data: backupInfo
            });

        } catch (error) {
            console.error('Backup database error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    }
};

module.exports = adminController;