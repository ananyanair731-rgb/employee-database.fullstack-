/**
 * Authentication Service
 */
const AuthService = {
  saveSession(jwtResponse) {
    localStorage.setItem(CONFIG.TOKEN_KEY, jwtResponse.token);
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify({
      id: jwtResponse.id,
      username: jwtResponse.username,
      email: jwtResponse.email,
      role: jwtResponse.role,
      employeeId: jwtResponse.employeeId || null,
      redirectPath: jwtResponse.redirectPath || CONFIG.ROLE_REDIRECT[(jwtResponse.role || '').replace('ROLE_', '')] || 'dashboard.html'
    }));
  },

  getRoleFromResponse(role) {
    return role ? role.replace('ROLE_', '') : '';
  },

  getUser() {
    const raw = localStorage.getItem(CONFIG.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  getRole() {
    const user = this.getUser();
    if (!user || !user.role) return '';
    return user.role.replace('ROLE_', '');
  },

  getEmployeeId() {
    const user = this.getUser();
    return user?.employeeId || null;
  },

  getRedirectPath() {
    const user = this.getUser();
    const role = this.getRole();
    return user?.redirectPath || CONFIG.ROLE_REDIRECT[role] || 'dashboard.html';
  },

  isLoggedIn() {
    return !!localStorage.getItem(CONFIG.TOKEN_KEY);
  },

  clearSession() {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
  },

  logout() {
    this.clearSession();
    window.location.href = 'login.html';
  },

  hasAnyRole(...roles) {
    const current = this.getRole();
    return roles.includes(current);
  },

  async login(username, password) {
    const response = await ApiService.login({ username, password });
    this.saveSession(response);
    return response;
  },

  async signup(formData) {
    return ApiService.signup(formData);
  },

  async refreshEmployeeId() {
    try {
      const res = await ApiService.getMyEmployeeProfile();
      const emp = Utils.extractData(res);
      if (emp?.id) {
        const user = this.getUser();
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify({ ...user, employeeId: emp.id }));
        return emp.id;
      }
    } catch (e) { /* not linked */ }
    return null;
  }
};
