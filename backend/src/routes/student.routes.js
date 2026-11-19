const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Profile routes
router.get('/profile', authMiddleware, studentController.getProfile);
router.put('/profile', authMiddleware, studentController.updateProfile);
router.get('/dashboard', authMiddleware, studentController.getDashboardSummary);
router.get('/public/:id?', studentController.getPublicProfile);

// Unified record management endpoints
router.get('/records', authMiddleware, studentController.getAllRecords);
router.post('/records', authMiddleware, studentController.createRecord);
router.put('/records/:id', authMiddleware, studentController.updateRecord);
router.delete('/records/:id', authMiddleware, studentController.deleteRecord);

module.exports = router;
