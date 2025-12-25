const Student = require('../models/Student');
const Application = require('../models/Application');
const Internship = require('../models/Internship');
const matchingService = require('../services/matchingService');
const { validationResult } = require('express-validator');
const resumeParser = require('../services/resumeParser');
const Skill = require('../models/Skill');
const fs = require('fs');
const path = require('path');

const studentController = {
    // Get student profile
    getProfile: async (req, res) => {
        try {
            const student = await Student.findById(req.user._id)
                .select('-password')
                .populate('skills.skillId', 'name category');

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student profile not found'
                });
            }

            // Calculate profile completeness
            const completeness = calculateProfileCompleteness(student);

            res.json({
                success: true,
                data: {
                    ...student.toObject(),
                    profileCompleteness: completeness
                }
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

    // Update student profile
    updateProfile: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const updates = req.body;
            const student = await Student.findById(req.user._id);

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            // Handle skills array - convert skill names to skill objects
            if (updates.skills && Array.isArray(updates.skills)) {
                const skillPromises = updates.skills.map(async (skill) => {
                    let skillObj = skill;
                    
                    // If skill is a string (skill name), find or create skill
                    if (typeof skill === 'string') {
                        const existingSkill = await Skill.findOne({ 
                            name: skill.toLowerCase().trim() 
                        });
                        
                        if (existingSkill) {
                            skillObj = {
                                name: existingSkill.name,
                                proficiency: 'intermediate'
                            };
                            // Increment skill popularity
                            await existingSkill.incrementPopularity();
                        } else {
                            skillObj = {
                                name: skill.toLowerCase().trim(),
                                proficiency: 'intermediate'
                            };
                        }
                    }
                    
                    return skillObj;
                });

                updates.skills = await Promise.all(skillPromises);
            }

            // Update student fields
            Object.keys(updates).forEach(key => {
                if (key !== 'password' && key !== 'email' && key !== 'role') {
                    student[key] = updates[key];
                }
            });

            // Mark profile as completed if required fields are filled
            if (student.firstName && student.lastName && student.university && 
                student.major && student.skills?.length > 0) {
                student.profileCompleted = true;
                
                // Calculate profile score
                student.profileScore = calculateProfileScore(student);
            }

            await student.save();

            // Update profile in all applications
            await Application.updateMany(
                { student: student._id },
                { $set: { 'studentProfile': student } }
            );

            const studentData = await Student.findById(student._id)
                .select('-password');

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: studentData
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

    // Upload resume and parse
    uploadResume: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            const student = await Student.findById(req.user._id);
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            // Parse resume
            const resumePath = path.join(__dirname, '../../', req.file.path);
            const parsedData = await resumeParser.parseResume(resumePath);

            // Update student skills from resume
            if (parsedData.skills && parsedData.skills.length > 0) {
                const existingSkills = student.skills.map(s => s.name.toLowerCase());
                const newSkills = [];

                for (const skillName of parsedData.skills) {
                    if (!existingSkills.includes(skillName.toLowerCase())) {
                        // Find or create skill
                        let skill = await Skill.findOne({ 
                            name: skillName.toLowerCase() 
                        });

                        if (!skill) {
                            skill = new Skill({
                                name: skillName.toLowerCase(),
                                category: 'technical',
                                description: `Skill extracted from resume`
                            });
                            await skill.save();
                        } else {
                            await skill.incrementPopularity();
                        }

                        newSkills.push({
                            name: skill.name,
                            proficiency: parsedData.proficiency?.[skillName] || 'intermediate'
                        });
                    }
                }

                student.skills = [...student.skills, ...newSkills];
            }

            // Update other fields from resume
            if (parsedData.experience) {
                student.experience = parsedData.experience;
            }

            if (parsedData.education) {
                if (parsedData.education.degree && !student.degree) {
                    student.degree = parsedData.education.degree;
                }
                if (parsedData.education.university && !student.university) {
                    student.university = parsedData.education.university;
                }
            }

            // Save resume URL
            student.resumeUrl = `/uploads/resumes/${req.file.filename}`;
            student.profileCompleted = true;
            student.profileScore = calculateProfileScore(student);

            await student.save();

            res.json({
                success: true,
                message: 'Resume uploaded and parsed successfully',
                data: {
                    parsedData,
                    student: await Student.findById(student._id).select('-password')
                }
            });

        } catch (error) {
            console.error('Upload resume error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Get student's applications
    getApplications: async (req, res) => {
        try {
            const { status, page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;

            const query = { student: req.user._id };
            if (status) {
                query.status = status;
            }

            const applications = await Application.find(query)
                .populate('internship', 'title companyName location internshipType duration')
                .populate('student', 'firstName lastName university')
                .sort({ appliedAt: -1 })
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
            console.error('Get applications error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Get application statistics
    getApplicationStats: async (req, res) => {
        try {
            const studentId = req.user._id;

            const stats = await Application.aggregate([
                { $match: { student: studentId } },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]);

            const totalApplications = await Application.countDocuments({ student: studentId });
            const avgMatchScore = await Application.aggregate([
                { $match: { student: studentId } },
                {
                    $group: {
                        _id: null,
                        avgScore: { $avg: '$matchScore' }
                    }
                }
            ]);

            const response = {
                total: totalApplications,
                byStatus: {},
                averageMatchScore: avgMatchScore[0]?.avgScore || 0
            };

            stats.forEach(stat => {
                response.byStatus[stat._id] = stat.count;
            });

            res.json({
                success: true,
                data: response
            });

        } catch (error) {
            console.error('Get stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Get student dashboard data
    getDashboardData: async (req, res) => {
        try {
            const studentId = req.user._id;

            // Get student profile
            const student = await Student.findById(studentId)
                .select('-password');

            // Get applications stats
            const [applications, stats, recommendations] = await Promise.all([
                Application.find({ student: studentId })
                    .populate('internship', 'title companyName')
                    .sort({ appliedAt: -1 })
                    .limit(5),
                
                studentController.getApplicationStats(req, res, true),
                
                matchingService.getTopMatchesForStudent(studentId, 5)
            ]);

            // Get skill analysis
            const skillCategories = await analyzeStudentSkills(studentId);

            res.json({
                success: true,
                data: {
                    profile: student,
                    recentApplications: applications,
                    stats: stats.data || stats,
                    recommendations: recommendations,
                    skillAnalysis: skillCategories,
                    profileCompleteness: calculateProfileCompleteness(student)
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

    // Get skill suggestions
    getSkillSuggestions: async (req, res) => {
        try {
            const student = await Student.findById(req.user._id);
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            const existingSkills = student.skills.map(s => s.name.toLowerCase());

            // Get skills based on student's major/interests
            let query = {};
            if (student.major) {
                // Map majors to skill categories (simplified)
                const majorToCategory = {
                    'computer science': 'programming',
                    'engineering': 'technical',
                    'business': 'business',
                    'design': 'design',
                    'data science': 'data_science',
                    'marketing': 'marketing'
                };

                const category = majorToCategory[student.major.toLowerCase()];
                if (category) {
                    query.category = category;
                }
            }

            const suggestedSkills = await Skill.find(query)
                .where('name').nin(existingSkills)
                .sort({ trendingScore: -1, industryDemand: -1 })
                .limit(10);

            // Also get skills related to existing skills
            const relatedSkills = await getRelatedSkills(existingSkills);

            res.json({
                success: true,
                data: {
                    suggested: suggestedSkills,
                    related: relatedSkills,
                    trending: await Skill.getTrendingSkills(5)
                }
            });

        } catch (error) {
            console.error('Get skill suggestions error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Delete application
    deleteApplication: async (req, res) => {
        try {
            const application = await Application.findOne({
                _id: req.params.id,
                student: req.user._id
            });

            if (!application) {
                return res.status(404).json({
                    success: false,
                    message: 'Application not found or access denied'
                });
            }

            // Update internship applications count
            await Internship.findByIdAndUpdate(
                application.internship,
                { $inc: { applicationsReceived: -1 } }
            );

            await application.deleteOne();

            res.json({
                success: true,
                message: 'Application withdrawn successfully'
            });

        } catch (error) {
            console.error('Delete application error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    }
};

// Helper functions
function calculateProfileCompleteness(student) {
    let score = 0;
    let totalFields = 7; // Adjust based on required fields

    if (student.firstName && student.lastName) score += 2;
    if (student.university) score += 1;
    if (student.major) score += 1;
    if (student.degree) score += 1;
    if (student.graduationYear) score += 1;
    if (student.skills?.length > 0) score += 1;
    if (student.resumeUrl) score += 1;

    return Math.round((score / totalFields) * 100);
}

function calculateProfileScore(student) {
    let score = 0;

    // Skills (40%)
    if (student.skills?.length > 0) {
        const skillScore = Math.min(student.skills.length * 5, 40);
        score += skillScore;
    }

    // Education (30%)
    if (student.university && student.major && student.degree) {
        score += 30;
    } else if (student.university || student.major) {
        score += 15;
    }

    // GPA (10%)
    if (student.gpa) {
        if (student.gpa >= 3.5) score += 10;
        else if (student.gpa >= 3.0) score += 7;
        else if (student.gpa >= 2.5) score += 5;
        else score += 2;
    }

    // Experience/Projects (20%)
    if (student.resumeUrl) {
        score += 20;
    } else if (student.skills?.length >= 3) {
        score += 10;
    }

    return Math.min(score, 100);
}

async function analyzeStudentSkills(studentId) {
    const student = await Student.findById(studentId);
    if (!student || !student.skills) {
        return {};
    }

    const categories = {};
    student.skills.forEach(skill => {
        // Simple categorization based on skill names
        let category = 'other';
        
        if (skill.name.includes('python') || skill.name.includes('java') || 
            skill.name.includes('javascript') || skill.name.includes('c++')) {
            category = 'programming';
        } else if (skill.name.includes('design') || skill.name.includes('ui') || 
                   skill.name.includes('ux') || skill.name.includes('figma')) {
            category = 'design';
        } else if (skill.name.includes('data') || skill.name.includes('analysis') || 
                   skill.name.includes('sql') || skill.name.includes('excel')) {
            category = 'data';
        } else if (skill.name.includes('communication') || skill.name.includes('leadership') || 
                   skill.name.includes('teamwork')) {
            category = 'soft_skills';
        } else if (skill.name.includes('marketing') || skill.name.includes('sales') || 
                   skill.name.includes('business')) {
            category = 'business';
        }

        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(skill);
    });

    return categories;
}

async function getRelatedSkills(existingSkills) {
    const related = new Set();
    
    for (const skillName of existingSkills.slice(0, 5)) {
        const skill = await Skill.findOne({ name: skillName });
        if (skill && skill.relatedSkills?.length > 0) {
            const relatedSkillDocs = await Skill.find({
                _id: { $in: skill.relatedSkills }
            }).limit(3);
            
            relatedSkillDocs.forEach(s => {
                if (!existingSkills.includes(s.name)) {
                    related.add(s);
                }
            });
        }
    }
    
    return Array.from(related).slice(0, 10);
}

module.exports = studentController;