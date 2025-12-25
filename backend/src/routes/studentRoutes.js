const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');
const { body } = require('express-validator');

// Validation middleware
const updateProfileValidation = [
    body('firstName').optional().trim().notEmpty(),
    body('lastName').optional().trim().notEmpty(),
    body('university').optional().trim().notEmpty(),
    body('major').optional().trim().notEmpty(),
    body('graduationYear').optional().isInt({ min: 2020, max: 2030 }),
    body('gpa').optional().isFloat({ min: 0, max: 4.0 }),
    body('skills').optional().isArray()
];

// All routes require authentication and student role
router.use(auth);
router.use(roleCheck('student'));

// Profile routes
router.get('/profile', studentController.getProfile);
router.put('/profile', updateProfileValidation, studentController.updateProfile);
router.post('/upload-resume', upload.single('resume'), studentController.uploadResume);

// Application routes
router.get('/applications', studentController.getApplications);
router.get('/applications/stats', studentController.getApplicationStats);
router.delete('/applications/:id', studentController.deleteApplication);

// Dashboard and recommendations
router.get('/dashboard', studentController.getDashboardData);
router.get('/skills/suggestions', studentController.getSkillSuggestions);

module.exports = router;