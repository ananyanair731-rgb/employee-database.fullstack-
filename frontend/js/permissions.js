/**
 * Role-Based Access Control (RBAC)
 * Aligns with Spring Boot @PreAuthorize rules
 */
const PERMISSIONS = {
  ROLES: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],

  PAGES: {
    'dashboard.html': ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
    'employees.html': ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
    'attendance.html': ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
    'leave.html': ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
    'payroll.html': ['ADMIN', 'HR', 'EMPLOYEE'],
    'tasks.html': ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
    'reports.html': ['ADMIN', 'HR', 'MANAGER'],
    'login.html': [],
    'signup.html': [],
    'index.html': []
  },

  NAV: [
    { href: 'dashboard.html', label: 'Dashboard', icon: '📊', page: 'dashboard', roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
    { href: 'employees.html', label: 'Employees', employeeLabel: 'My Profile', icon: '👥', page: 'employees', roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
    { href: 'attendance.html', label: 'Attendance', icon: '📅', page: 'attendance', roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
    { href: 'leave.html', label: 'Leave', icon: '🏖', page: 'leave', roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
    { href: 'payroll.html', label: 'Payroll', employeeLabel: 'My Salary', icon: '💰', page: 'payroll', roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { href: 'tasks.html', label: 'Tasks', icon: '✅', page: 'tasks', roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
    { href: 'reports.html', label: 'Reports', icon: '📈', page: 'reports', roles: ['ADMIN', 'HR', 'MANAGER'] }
  ],

  ACTIONS: {
    'employee.create': ['ADMIN', 'HR'],
    'employee.edit': ['ADMIN', 'HR'],
    'employee.delete': ['ADMIN'],
    'employee.assignRole': ['ADMIN'],
    'employee.viewAll': ['ADMIN', 'HR'],
    'employee.viewTeam': ['MANAGER'],
    'employee.viewSelf': ['EMPLOYEE'],
    'employee.editSelfLimited': ['EMPLOYEE'],
    'attendance.mark': ['ADMIN', 'HR', 'MANAGER'],
    'attendance.viewAll': ['ADMIN', 'HR', 'MANAGER'],
    'attendance.viewSelf': ['EMPLOYEE'],
    'leave.apply': ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
    'leave.approve': ['ADMIN', 'HR', 'MANAGER'],
    'leave.viewAll': ['ADMIN', 'HR'],
    'payroll.manage': ['ADMIN', 'HR'],
    'payroll.viewSelf': ['EMPLOYEE'],
    'tasks.assign': ['ADMIN', 'HR', 'MANAGER'],
    'tasks.manage': ['ADMIN', 'HR', 'MANAGER'],
    'tasks.updateStatus': ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
    'reports.view': ['ADMIN', 'HR', 'MANAGER'],
    'signup.admin': ['ADMIN']
  },

  getRole() {
    return typeof AuthService !== 'undefined' ? AuthService.getRole() : '';
  },

  can(action) {
    const role = this.getRole();
    const allowed = this.ACTIONS[action];
    return allowed ? allowed.includes(role) : false;
  },

  canAccessPage(page) {
    const role = this.getRole();
    const allowed = this.PAGES[page];
    if (!allowed) return true;
    if (allowed.length === 0) return true;
    return allowed.includes(role);
  },

  getNavItems() {
    const role = this.getRole();
    return this.NAV.filter(item => item.roles.includes(role)).map(item => ({
      ...item,
      label: (role === 'EMPLOYEE' && item.employeeLabel) ? item.employeeLabel : item.label
    }));
  },

  getHomePage() {
    return 'dashboard.html';
  },

  getPageTitle(page) {
    const titles = {
      dashboard: 'Dashboard',
      employees: PERMISSIONS.getRole() === 'EMPLOYEE' ? 'My Profile' : 'Employees',
      attendance: 'Attendance',
      leave: 'Leave Management',
      payroll: PERMISSIONS.getRole() === 'EMPLOYEE' ? 'My Salary' : 'Payroll',
      tasks: 'Tasks',
      reports: 'Reports'
    };
    return titles[page] || 'HRMS';
  }
};
