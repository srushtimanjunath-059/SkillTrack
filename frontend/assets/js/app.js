/**
 * SkillTrack API Client
 * Seamlessly interfaces the frontend UI with the Express REST API backend
 */
const SkillTrackAPI = (() => {
  const isHttp = window.location.protocol.startsWith('http');
  const BASE_URL = (isHttp && (window.location.port === '5000' || window.location.port === ''))
    ? `${window.location.origin}/api`
    : 'http://localhost:5000/api';

  async function request(endpoint, options = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const token = localStorage.getItem('skilltrack_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const error = new Error(errorBody.message || `HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.data = errorBody;
      throw error;
    }
    return response.json();
  }

  return {
    baseUrl: BASE_URL,

    // Health
    async checkHealth() {
      return request('/health');
    },

    // Auth
    async login(email, password) {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (data.token) {
        localStorage.setItem('skilltrack_token', data.token);
      }
      return data;
    },

    async register(studentData) {
      const data = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(studentData)
      });
      if (data.token) {
        localStorage.setItem('skilltrack_token', data.token);
      }
      return data;
    },

    async getMe() {
      return request('/auth/me');
    },

    // Student profile & dashboard
    async getProfile() {
      return request('/student/profile');
    },

    async updateProfile(updates) {
      return request('/student/profile', {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },

    async getDashboard() {
      return request('/student/dashboard');
    },

    async getPublicProfile(studentId = '') {
      return request(`/student/public/${studentId}`);
    },

    // Records CRUD
    async getRecords(type = '') {
      const query = type ? `?type=${encodeURIComponent(type)}` : '';
      return request(`/student/records${query}`);
    },

    async createRecord(record) {
      return request('/student/records', {
        method: 'POST',
        body: JSON.stringify(record)
      });
    },

    async updateRecord(id, updates) {
      return request(`/student/records/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },

    async deleteRecord(id) {
      return request(`/student/records/${id}`, {
        method: 'DELETE'
      });
    }
  };
})();

if (typeof window !== 'undefined') {
  window.SkillTrackAPI = SkillTrackAPI;
}
