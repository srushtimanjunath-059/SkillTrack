-- SkillTrack Relational Database Schema
-- Compatible with SQLite3, PostgreSQL, and MySQL

CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL,
    college TEXT,
    department TEXT,
    academic_year TEXT,
    details TEXT,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS records (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    record_type TEXT NOT NULL CHECK(record_type IN ('profile', 'skills', 'applications', 'hackathons', 'deadlines', 'achievements')),
    title TEXT,
    category TEXT,
    status TEXT,
    level INTEGER DEFAULT 0,
    start_date TEXT,
    due_date TEXT,
    interview_date TEXT,
    details TEXT,
    supporting_link TEXT,
    visibility TEXT DEFAULT 'Private' CHECK(visibility IN ('Private', 'Public')),
    company TEXT,
    position TEXT,
    organiser TEXT,
    team TEXT,
    priority TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_records_student_type ON records(student_id, record_type);
CREATE INDEX IF NOT EXISTS idx_records_visibility ON records(visibility);
CREATE INDEX IF NOT EXISTS idx_records_due_date ON records(due_date);
