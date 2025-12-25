const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { body } = require('express-validator');

// Validation middleware
const createInternshipValidation = [
    body('title').notEmpty().trim(),
    body('description').notEmpty(),
    body('location').notEmpty().trim(),
    body('internshipType').isIn(['onsite', 'remote', 'hybrid']),
    body('duration.value').isNumeric(),
    body('duration.unit').isIn(['weeks', 'months']),
    body('requiredSkills').isArray({ min: 1 })
];

// Public routes
router.get('/', internshipController.getAllInternships);
router.get('/search', internshipController.searchInternships);
router.get('/:id', internshipController.getInternshipById);

// Student routes
router.post('/:id/apply', 
    auth, 
    roleCheck('student'), 
    internshipController.applyForInternship
);

router.get('/student/recommendations',
    auth,
    roleCheck('student'),
    internshipController.getRecommendations
);

// Recruiter routes
router.post('/',
    auth,
    roleCheck('recruiter'),
    createInternshipValidation,
    internshipController.createInternship
);

router.put('/:id',
    auth,
    roleCheck('recruiter'),
    internshipController.updateInternship
);

router.delete('/:id',
    auth,
    roleCheck('recruiter'),
    internshipController.deleteInternship
);

module.exports = router;