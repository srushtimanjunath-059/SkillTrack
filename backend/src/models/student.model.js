const db = require('../config/db');

class StudentModel {
  static async findById(id) {
    return db.findStudentById(id);
  }

  static async findByEmail(email) {
    return db.findStudentByEmail(email);
  }

  static async create(studentData) {
    return db.createStudent(studentData);
  }

  static async update(id, updates) {
    return db.updateStudent(id, updates);
  }

  static async getAll() {
    return db.getStudents();
  }
}

module.exports = StudentModel;
