const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

// Applications / Internships
router.get('/applications', (req, res, next) => {
  req.query.type = 'applications';
  studentController.getAllRecords(req, res, next);
});

router.post('/applications', (req, res, next) => {
  req.body.record_type = 'applications';
  studentController.createRecord(req, res, next);
});

// Hackathons
router.get('/hackathons', (req, res, next) => {
  req.query.type = 'hackathons';
  studentController.getAllRecords(req, res, next);
});

router.post('/hackathons', (req, res, next) => {
  req.body.record_type = 'hackathons';
  studentController.createRecord(req, res, next);
});

// Common updates & deletions
router.put('/:id', studentController.updateRecord);
router.delete('/:id', studentController.deleteRecord);

module.exports = router;
