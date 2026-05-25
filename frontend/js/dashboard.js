document.addEventListener('DOMContentLoaded', async () => {
  if (!Layout.init('dashboard')) return;
  renderRoleWelcome();
  await loadDashboardStats();
});

function renderRoleWelcome() {
  const role = AuthService.getRole();
  const user = AuthService.getUser();
  const el = document.getElementById('welcome-message');
  const hints = {
    ADMIN: 'Full system access — manage employees, roles, and all modules.',
    HR: 'Manage employee records, attendance, leave, and payroll.',
    MANAGER: 'View your team, approve leave, and track attendance.',
    EMPLOYEE: 'View your profile, apply for leave, and check attendance & salary.'
  };
  if (el) {
    el.innerHTML = `Welcome, <strong>${user?.username || 'User'}</strong> 
      <span class="role-badge role-${role.toLowerCase()}">${role}</span><br>
      <small>${hints[role] || ''}</small>`;
  }

  document.querySelectorAll('[data-role]').forEach(node => {
    const roles = node.dataset.role.split(',').map(r => r.trim());
    node.classList.toggle('hidden', !roles.includes(role));
  });
}

async function loadDashboardStats() {
  Utils.setLoading(true);
  const role = AuthService.getRole();
  let empId = AuthService.getEmployeeId();
  if (role === 'EMPLOYEE' && !empId) empId = await AuthService.refreshEmployeeId();

  try {
    if (PERMISSIONS.can('employee.viewAll') || PERMISSIONS.can('employee.viewTeam') || role === 'EMPLOYEE') {
      const empRes = await ApiService.getEmployees();
      const employees = Utils.extractData(empRes) || [];
      document.getElementById('stat-employees').textContent = employees.length;
    } else {
      document.getElementById('stat-employees').textContent = '—';
    }

    if (PERMISSIONS.can('leave.viewAll')) {
      const pendingRes = await ApiService.getPendingLeave();
      document.getElementById('stat-pending-leave').textContent =
        (Utils.extractData(pendingRes) || []).length;
    } else if (empId) {
      const leaveRes = await ApiService.getLeaveByEmployee(empId);
      const mine = Utils.extractData(leaveRes) || [];
      document.getElementById('stat-pending-leave').textContent =
        mine.filter(l => l.status === 'PENDING').length;
    } else {
      document.getElementById('stat-pending-leave').textContent = '—';
    }

    if (PERMISSIONS.can('tasks.manage')) {
      const tasksRes = await ApiService.getAllTasks();
      const tasks = Utils.extractData(tasksRes) || [];
      document.getElementById('stat-tasks').textContent =
        tasks.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED').length;
    } else if (empId) {
      const tasksRes = await ApiService.getTasksByEmployee(empId);
      const tasks = Utils.extractData(tasksRes) || [];
      document.getElementById('stat-tasks').textContent =
        tasks.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED').length;
    } else {
      document.getElementById('stat-tasks').textContent = '—';
    }

    if (PERMISSIONS.can('payroll.manage')) {
      const payrollRes = await ApiService.getAllPayrolls();
      const payrolls = Utils.extractData(payrollRes) || [];
      document.getElementById('stat-payroll').textContent =
        payrolls.filter(p => p.paymentStatus === 'PENDING').length;
    } else if (PERMISSIONS.can('payroll.viewSelf') && empId) {
      const payrollRes = await ApiService.getPayrollByEmployee(empId);
      document.getElementById('stat-payroll').textContent =
        (Utils.extractData(payrollRes) || []).length;
    } else {
      document.getElementById('stat-payroll').textContent = '—';
    }
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}
