const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = process.env.DATABASE_FILE
  ? path.resolve(__dirname, process.env.DATABASE_FILE)
  : path.resolve(__dirname, '../../database/skilltrack_data.json');

// Initial default seed dataset
const initialData = {
  students: [
    {
      id: 'demo-student-001',
      email: 'student@skilltrack.edu',
      // password: "password123" (hashed)
      password_hash: '$2a$10$wz9qW8w6XmQvL0e8x9qBduQjVl9lB7O2hP5Bq7I.k8n8J1eL1e.gW',
      display_name: 'Srushti M',
      college: 'National Institute of Technology',
      department: 'Computer Science and Engineering',
      academic_year: '3rd Year (2024-2028)',
      details: 'Passionate student software engineer focused on full-stack web development, open-source contribution, and AI applications.',
      avatar_url: '',
      created_at: new Date('2026-11-01T08:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  records: [
    {
      id: 'rec-skill-001',
      student_id: 'demo-student-001',
      record_type: 'skills',
      title: 'Full Stack JavaScript & Node.js',
      category: 'Technical',
      status: 'In progress',
      level: 85,
      start_date: '2026-08-01',
      due_date: '',
      interview_date: '',
      details: 'Built RESTful services, middleware architectures, relational schema design, and asynchronous APIs.',
      supporting_link: 'https://github.com',
      visibility: 'Public',
      created_at: new Date('2026-11-02T10:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'rec-skill-002',
      student_id: 'demo-student-001',
      record_type: 'skills',
      title: 'Database Architecture & SQL',
      category: 'Technical',
      status: 'In progress',
      level: 75,
      start_date: '2026-09-10',
      due_date: '',
      interview_date: '',
      details: 'Relational design, normalization, query optimization, indexing, and transactional integrity.',
      supporting_link: 'https://github.com',
      visibility: 'Public',
      created_at: new Date('2026-11-05T12:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'rec-app-001',
      student_id: 'demo-student-001',
      record_type: 'applications',
      company: 'Google',
      position: 'Software Engineering Intern',
      category: 'Internship',
      status: 'Interview',
      start_date: '2026-10-15',
      interview_date: '2026-11-28',
      due_date: '2026-11-28',
      details: 'Technical round focused on algorithms, data structures, and system design.',
      supporting_link: 'https://careers.google.com',
      visibility: 'Public',
      created_at: new Date('2026-11-08T09:30:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'rec-hack-001',
      student_id: 'demo-student-001',
      record_type: 'hackathons',
      title: 'National Hackathon 2026',
      organiser: 'Tech Innovators India',
      team: 'Team Quantum Builders',
      status: 'In progress',
      start_date: '2026-11-20',
      due_date: '2026-11-22',
      details: 'Developing an AI-driven learning tracking assistant for university campuses.',
      supporting_link: 'https://devpost.com',
      visibility: 'Public',
      created_at: new Date('2026-11-10T11:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'rec-dead-001',
      student_id: 'demo-student-001',
      record_type: 'deadlines',
      title: 'Capstone Project Proposal Submission',
      category: 'Project',
      priority: 'High',
      status: 'Planned',
      due_date: '2026-11-30',
      details: 'Submit final architecture diagram and API specifications to department advisor.',
      supporting_link: '',
      visibility: 'Private',
      created_at: new Date('2026-11-12T14:15:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'rec-achieve-001',
      student_id: 'demo-student-001',
      record_type: 'achievements',
      title: 'First Place - University Codefest',
      category: 'Competition',
      start_date: '2026-10-05',
      details: 'Won 1st place among 120+ teams for real-time collaborative workspace tool.',
      supporting_link: 'https://github.com',
      visibility: 'Public',
      created_at: new Date('2026-11-06T15:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};

// In-memory cache
let databaseCache = null;

function ensureDbFile() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    databaseCache = JSON.parse(JSON.stringify(initialData));
  }
}

function loadDatabase() {
  ensureDbFile();
  if (!databaseCache) {
    try {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      databaseCache = JSON.parse(content);
    } catch (err) {
      console.error('Error reading database file, resetting to defaults:', err);
      databaseCache = JSON.parse(JSON.stringify(initialData));
      saveDatabase();
    }
  }
  return databaseCache;
}

function saveDatabase() {
  ensureDbFile();
  const tempPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(databaseCache, null, 2), 'utf-8');
  fs.renameSync(tempPath, DB_PATH);
}

// Student queries
const db = {
  getStudents: () => {
    const data = loadDatabase();
    return data.students;
  },

  findStudentById: (id) => {
    const data = loadDatabase();
    return data.students.find((s) => s.id === id) || null;
  },

  findStudentByEmail: (email) => {
    const data = loadDatabase();
    return data.students.find((s) => s.email.toLowerCase() === email.toLowerCase()) || null;
  },

  createStudent: (studentData) => {
    const data = loadDatabase();
    const newStudent = {
      id: studentData.id || `student-${crypto.randomUUID()}`,
      email: studentData.email,
      password_hash: studentData.password_hash,
      display_name: studentData.display_name || 'New Student',
      college: studentData.college || '',
      department: studentData.department || '',
      academic_year: studentData.academic_year || '',
      details: studentData.details || '',
      avatar_url: studentData.avatar_url || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    data.students.push(newStudent);
    saveDatabase();
    return newStudent;
  },

  updateStudent: (id, updates) => {
    const data = loadDatabase();
    const index = data.students.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const allowed = ['display_name', 'college', 'department', 'academic_year', 'details', 'avatar_url'];
    allowed.forEach((field) => {
      if (updates[field] !== undefined) {
        data.students[index][field] = updates[field];
      }
    });
    data.students[index].updated_at = new Date().toISOString();
    saveDatabase();
    return data.students[index];
  },

  // Record queries
  getRecords: (filterFn) => {
    const data = loadDatabase();
    if (filterFn) {
      return data.records.filter(filterFn);
    }
    return data.records;
  },

  findRecordById: (id) => {
    const data = loadDatabase();
    return data.records.find((r) => r.id === id) || null;
  },

  createRecord: (recordData) => {
    const data = loadDatabase();
    const newRecord = {
      id: recordData.id || `rec-${crypto.randomUUID().slice(0, 8)}`,
      student_id: recordData.student_id,
      record_type: recordData.record_type,
      title: recordData.title || '',
      category: recordData.category || '',
      status: recordData.status || '',
      level: Number(recordData.level) || 0,
      start_date: recordData.start_date || '',
      due_date: recordData.due_date || '',
      interview_date: recordData.interview_date || '',
      details: recordData.details || '',
      supporting_link: recordData.supporting_link || '',
      visibility: recordData.visibility || 'Private',
      company: recordData.company || '',
      position: recordData.position || '',
      organiser: recordData.organiser || '',
      team: recordData.team || '',
      priority: recordData.priority || '',
      created_at: recordData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    data.records.push(newRecord);
    saveDatabase();
    return newRecord;
  },

  updateRecord: (id, updates) => {
    const data = loadDatabase();
    const index = data.records.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const fields = [
      'record_type', 'title', 'category', 'status', 'level',
      'start_date', 'due_date', 'interview_date', 'details',
      'supporting_link', 'visibility', 'company', 'position',
      'organiser', 'team', 'priority'
    ];

    fields.forEach((f) => {
      if (updates[f] !== undefined) {
        data.records[index][f] = f === 'level' ? Number(updates[f]) : updates[f];
      }
    });
    data.records[index].updated_at = new Date().toISOString();
    saveDatabase();
    return data.records[index];
  },

  deleteRecord: (id) => {
    const data = loadDatabase();
    const initialLen = data.records.length;
    data.records = data.records.filter((r) => r.id !== id);
    if (data.records.length !== initialLen) {
      saveDatabase();
      return true;
    }
    return false;
  }
};

// Initialize DB on require
ensureDbFile();

module.exports = db;
