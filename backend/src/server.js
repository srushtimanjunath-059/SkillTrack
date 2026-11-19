const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const skillsRoutes = require('./routes/skills.routes');
const opportunitiesRoutes = require('./routes/opportunities.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
const frontendPath = path.resolve(__dirname, '../../frontend');
app.use(express.static(frontendPath));

// Health Check API
app.get('/api/health', (req, res) => {
  const students = db.getStudents();
  const records = db.getRecords();
  res.status(200).json({
    status: 'online',
    service: 'SkillTrack Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    metrics: {
      registeredStudents: students.length,
      totalRecords: records.length
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/opportunities', opportunitiesRoutes);

// Catch-all API 404
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Serve frontend index.html for any frontend navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  SkillTrack Server is running!`);
  console.log(`  Port: ${PORT}`);
  console.log(`  API Health: http://localhost:${PORT}/api/health`);
  console.log(`  Web App:    http://localhost:${PORT}`);
  console.log(`===============================================`);
});

module.exports = { app, server };
