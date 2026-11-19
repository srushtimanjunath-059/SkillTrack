const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'skilltrack_super_secure_jwt_secret_key_2026';

const register = async (req, res) => {
  try {
    const { email, password, display_name, college, department, academic_year } = req.body;

    if (!email || !password || !display_name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and display name are required fields.'
      });
    }

    const existingStudent = db.findStudentByEmail(email);
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newStudent = db.createStudent({
      email,
      password_hash,
      display_name,
      college: college || '',
      department: department || '',
      academic_year: academic_year || '',
      details: ''
    });

    const token = jwt.sign(
      { id: newStudent.id, email: newStudent.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash: _, ...safeStudent } = newStudent;

    return res.status(201).json({
      success: true,
      message: 'Student account registered successfully.',
      token,
      student: safeStudent
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const student = db.findStudentByEmail(email);
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, student.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = jwt.sign(
      { id: student.id, email: student.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash: _, ...safeStudent } = student;

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      student: safeStudent
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

const getMe = async (req, res) => {
  try {
    const student = db.findStudentById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const { password_hash: _, ...safeStudent } = student;
    return res.status(200).json({
      success: true,
      student: safeStudent
    });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving profile.' });
  }
};

module.exports = {
  register,
  login,
  getMe
};
