const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { body } = require('express-validator');

// Validation middleware
const updateProfileValidation = [
    body('companyName').optional().trim().notEmpty(),
    body('contactPerson.firstName').optional().trim().notEmpty(),
    body('contactPerson.lastName').optional().trim().notEmpty(),
    body('companyWebsite').optional().isURL(),
    body('industry').optional().trim().notEmpty()
];

const updateApplicationValidation = [
    body('status').isIn(['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted']),
    body('feedback').optional().trim(),
    body('interviewDate').optional().isISO8601()
];

const bulkEmailValidation = [
    body('applicationIds').isArray().notEmpty(),
    body('subject').trim().notEmpty(),
    body('message').trim().notEmpty()
];

// All routes require authentication and recruiter role
router.use(auth);
router.use(roleCheck('recruiter'));

// Profile routes
router.get('/profile', recruiterController.getProfile);
router.put('/profile', updateProfileValidation, recruiterController.updateProfile);

// Internship management
router.get('/internships', recruiterController.getInternships);

// Application management
router.get('/applications', recruiterController.getApplications);
router.put('/applications/:applicationId/status', 
    updateApplicationValidation, 
    recruiterController.updateApplicationStatus
);

// Candidate matching
router.get('/internships/:internshipId/top-candidates', recruiterController.getTopCandidates);

// Dashboard and analytics
router.get('/dashboard', recruiterController.getDashboardData);
router.get('/analytics', recruiterController.getAnalytics);

// Bulk operations
router.post('/bulk-email', bulkEmailValidation, recruiterController.sendBulkEmail);

module.exports = router;