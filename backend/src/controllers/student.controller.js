const db = require('../config/db');

// Get current student profile
const getProfile = async (req, res) => {
  try {
    const student = db.findStudentById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const { password_hash: _, ...safeStudent } = student;
    return res.status(200).json({ success: true, profile: safeStudent });
  } catch (error) {
    console.error('getProfile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
};

// Update profile details
const updateProfile = async (req, res) => {
  try {
    const updated = db.updateStudent(req.user.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const { password_hash: _, ...safeStudent } = updated;
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      profile: safeStudent
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

// Get student dashboard summary metrics
const getDashboardSummary = async (req, res) => {
  try {
    const studentId = req.user.id;
    const records = db.getRecords((r) => r.student_id === studentId);

    const skills = records.filter((r) => r.record_type === 'skills');
    const applications = records.filter((r) => r.record_type === 'applications');
    const hackathons = records.filter((r) => r.record_type === 'hackathons');
    const deadlines = records.filter((r) => r.record_type === 'deadlines');
    const achievements = records.filter((r) => r.record_type === 'achievements');

    const totalLevel = skills.reduce((sum, s) => sum + (Number(s.level) || 0), 0);
    const avgProgress = skills.length ? Math.round(totalLevel / skills.length) : 0;

    return res.status(200).json({
      success: true,
      summary: {
        skillsCount: skills.length,
        applicationsCount: applications.length,
        hackathonsCount: hackathons.length,
        deadlinesCount: deadlines.length,
        achievementsCount: achievements.length,
        overallProgress: `${avgProgress}%`,
        upcomingDeadlines: deadlines
          .filter((d) => d.due_date && d.status !== 'Completed')
          .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
          .slice(0, 5)
      }
    });
  } catch (error) {
    console.error('getDashboardSummary error:', error);
    return res.status(500).json({ success: false, message: 'Failed to compute dashboard metrics.' });
  }
};

// Get public profile and public showcases
const getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const student = id ? db.findStudentById(id) : db.findStudentById('demo-student-001') || db.getStudents()[0];

    if (!student) {
      return res.status(404).json({ success: false, message: 'Public profile not found.' });
    }

    const publicRecords = db.getRecords(
      (r) => r.student_id === student.id && r.visibility === 'Public'
    );

    const { password_hash: _, email: __, ...safeStudent } = student;

    return res.status(200).json({
      success: true,
      profile: safeStudent,
      showcase: {
        skills: publicRecords.filter((r) => r.record_type === 'skills'),
        applications: publicRecords.filter((r) => r.record_type === 'applications'),
        hackathons: publicRecords.filter((r) => r.record_type === 'hackathons'),
        achievements: publicRecords.filter((r) => r.record_type === 'achievements')
      }
    });
  } catch (error) {
    console.error('getPublicProfile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load public profile.' });
  }
};

// Generic records CRUD for workspace modules
const getAllRecords = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { type } = req.query;

    const records = db.getRecords((r) => {
      const matchUser = r.student_id === studentId;
      return type ? matchUser && r.record_type === type : matchUser;
    });

    return res.status(200).json({
      success: true,
      count: records.length,
      records
    });
  } catch (error) {
    console.error('getAllRecords error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch records.' });
  }
};

const createRecord = async (req, res) => {
  try {
    const studentId = req.user.id;
    const recordData = {
      ...req.body,
      student_id: studentId
    };

    if (!recordData.record_type) {
      return res.status(400).json({ success: false, message: 'record_type is required.' });
    }

    const created = db.createRecord(recordData);
    return res.status(201).json({
      success: true,
      message: 'Record created successfully.',
      record: created
    });
  } catch (error) {
    console.error('createRecord error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create record.' });
  }
};

const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findRecordById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Record not found.' });
    }

    if (existing.student_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this record.' });
    }

    const updated = db.updateRecord(id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Record updated successfully.',
      record: updated
    });
  } catch (error) {
    console.error('updateRecord error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update record.' });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findRecordById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Record not found.' });
    }

    if (existing.student_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this record.' });
    }

    db.deleteRecord(id);
    return res.status(200).json({
      success: true,
      message: 'Record deleted successfully.'
    });
  } catch (error) {
    console.error('deleteRecord error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete record.' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getDashboardSummary,
  getPublicProfile,
  getAllRecords,
  createRecord,
  updateRecord,
  deleteRecord
};
