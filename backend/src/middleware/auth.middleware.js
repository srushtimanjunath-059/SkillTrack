const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'skilltrack_super_secure_jwt_secret_key_2026';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Default fallback to demo student for frictionless development & testing
      const demoStudent = db.findStudentById('demo-student-001') || db.getStudents()[0];
      if (demoStudent) {
        req.user = { id: demoStudent.id, email: demoStudent.email, display_name: demoStudent.display_name };
        return next();
      }
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const student = db.findStudentById(decoded.id);

    if (!student) {
      return res.status(401).json({ success: false, message: 'User not found or session expired.' });
    }

    req.user = { id: student.id, email: student.email, display_name: student.display_name };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

module.exports = authMiddleware;
