const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { body } = require('express-validator');

// All routes require authentication and admin role
router.use(auth);
router.use(roleCheck('admin'));

// System statistics
router.get('/stats', adminController.getSystemStats);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserById);
router.put('/users/:userId/status', adminController.updateUserStatus);
router.delete('/users/:userId', adminController.deleteUser);

// Internship management
router.get('/internships', adminController.getAllInternshipsAdmin);
router.put('/internships/:internshipId', adminController.updateInternshipAdmin);
router.delete('/internships/:internshipId', adminController.deleteInternshipAdmin);

// Application management
router.get('/applications', adminController.getAllApplicationsAdmin);

// Skill management
router.route('/skills')
    .get((req, res) => adminController.manageSkills(req, res))
    .post((req, res) => adminController.manageSkills(req, res))
    .put((req, res) => adminController.manageSkills(req, res))
    .delete((req, res) => adminController.manageSkills(req, res));

// System operations
router.get('/logs', adminController.getSystemLogs);
router.post('/backup', adminController.backupDatabase);

module.exports = router;