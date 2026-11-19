const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Specialized helper routes for skills
router.use(authMiddleware);

router.get('/', (req, res, next) => {
  req.query.type = 'skills';
  studentController.getAllRecords(req, res, next);
});

router.post('/', (req, res, next) => {
  req.body.record_type = 'skills';
  studentController.createRecord(req, res, next);
});

router.put('/:id', studentController.updateRecord);
router.delete('/:id', studentController.deleteRecord);

module.exports = router;
