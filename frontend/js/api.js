/**
 * API Service Layer - handles all HTTP requests with JWT
 */
const ApiService = {
  getToken() {
    return localStorage.getItem(CONFIG.TOKEN_KEY);
  },

  getHeaders(includeAuth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (includeAuth) {
      const token = this.getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async request(endpoint, options = {}) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(options.auth !== false),
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type');
      let data = null;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.status === 401) {
        AuthService.clearSession();
        if (!CONFIG.AUTH_PAGES.some(p => window.location.pathname.endsWith(p))) {
          window.location.href = 'login.html?expired=1';
        }
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const message = data?.message || data?.error || (typeof data === 'object' ? JSON.stringify(data) : data) || `Request failed (${response.status})`;
        throw new Error(message);
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Ensure Spring Boot is running on http://localhost:8080');
      }
      throw error;
    }
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body, auth = true) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body), auth });
  },

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  // Auth
  signup(data) {
    return this.post('/auth/signup', data, false);
  },

  login(data) {
    return this.post('/auth/login', data, false);
  },

  // Employees
  getEmployees() {
    return this.get('/employees');
  },

  getMyEmployeeProfile() {
    return this.get('/employees/me');
  },

  updateMyProfile(data) {
    return this.put('/employees/me', data);
  },

  getEmployee(id) {
    return this.get(`/employees/${id}`);
  },

  addEmployee(data) {
    return this.post('/employees', data);
  },

  updateEmployee(id, data) {
    return this.put(`/employees/${id}`, data);
  },

  deleteEmployee(id) {
    return this.delete(`/employees/${id}`);
  },

  searchEmployees(keyword) {
    return this.get(`/employees/search?keyword=${encodeURIComponent(keyword)}`);
  },

  getEmployeesByDepartment(department) {
    return this.get(`/employees/department/${encodeURIComponent(department)}`);
  },

  // Attendance
  markAttendance(employeeId, data) {
    return this.post(`/attendance/employee/${employeeId}`, data);
  },

  getAttendanceByEmployee(employeeId) {
    return this.get(`/attendance/employee/${employeeId}`);
  },

  getAttendanceByDate(date) {
    return this.get(`/attendance/date/${date}`);
  },

  getAttendanceByRange(employeeId, from, to) {
    return this.get(`/attendance/employee/${employeeId}/range?from=${from}&to=${to}`);
  },

  updateAttendance(id, data) {
    return this.put(`/attendance/${id}`, data);
  },

  deleteAttendance(id) {
    return this.delete(`/attendance/${id}`);
  },

  // Leave
  applyLeave(employeeId, data) {
    return this.post(`/leave/employee/${employeeId}/apply`, data);
  },

  getAllLeave() {
    return this.get('/leave/all');
  },

  getLeaveByEmployee(employeeId) {
    return this.get(`/leave/employee/${employeeId}`);
  },

  getPendingLeave() {
    return this.get('/leave/pending');
  },

  leaveAction(leaveId, status, approvedBy) {
    return this.put(`/leave/${leaveId}/action`, { status, approvedBy });
  },

  cancelLeave(leaveId) {
    return this.put(`/leave/${leaveId}/cancel`, {});
  },

  // Tasks
  assignTask(employeeId, data) {
    return this.post(`/tasks/employee/${employeeId}/assign`, data);
  },

  getAllTasks() {
    return this.get('/tasks');
  },

  getTask(id) {
    return this.get(`/tasks/${id}`);
  },

  getTasksByEmployee(employeeId) {
    return this.get(`/tasks/employee/${employeeId}`);
  },

  updateTaskStatus(id, status) {
    return this.put(`/tasks/${id}/status`, { status });
  },

  updateTask(id, data) {
    return this.put(`/tasks/${id}`, data);
  },

  deleteTask(id) {
    return this.delete(`/tasks/${id}`);
  },

  // Payroll
  generatePayroll(employeeId, data) {
    return this.post(`/payroll/employee/${employeeId}/generate`, data);
  },

  getAllPayrolls() {
    return this.get('/payroll/all');
  },

  getPayrollByEmployee(employeeId) {
    return this.get(`/payroll/employee/${employeeId}`);
  },

  getPayrollByMonth(month) {
    return this.get(`/payroll/month/${month}`);
  },

  getPayroll(id) {
    return this.get(`/payroll/${id}`);
  },

  markPayrollPaid(id) {
    return this.put(`/payroll/${id}/mark-paid`, {});
  },

  updatePayroll(id, data) {
    return this.put(`/payroll/${id}`, data);
  }
};
