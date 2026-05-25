document.addEventListener('DOMContentLoaded', async () => {
  if (!Layout.init('reports')) return;
  if (!PERMISSIONS.can('reports.view')) {
    Utils.showAlert('Reports are not available for your role.', 'warning');
    return;
  }
  await loadReports();
});

async function loadReports() {
  Utils.setLoading(true);
  const role = AuthService.getRole();
  try {
    let employees = [];
    let pendingLeave = [];
    let tasks = [];
    let payrolls = [];

    const empRes = await ApiService.getEmployees();
    employees = Utils.extractData(empRes) || [];

    if (PERMISSIONS.can('leave.viewAll') || role === 'ADMIN' || role === 'HR') {
      const leaveRes = await ApiService.getAllLeave();
      const allLeave = Utils.extractData(leaveRes) || [];
      pendingLeave = allLeave.filter(l => l.status === 'PENDING');
    } else {
      const pendingRes = await ApiService.getPendingLeave();
      pendingLeave = Utils.extractData(pendingRes) || [];
    }

    if (PERMISSIONS.can('tasks.manage')) {
      const taskRes = await ApiService.getAllTasks();
      tasks = Utils.extractData(taskRes) || [];
    }

    if (PERMISSIONS.can('payroll.manage')) {
      const payRes = await ApiService.getAllPayrolls();
      payrolls = Utils.extractData(payRes) || [];
    }

    const byDept = {};
    employees.forEach(e => {
      byDept[e.department] = (byDept[e.department] || 0) + 1;
    });

    document.getElementById('rpt-total-employees').textContent = employees.length;
    document.getElementById('rpt-pending-leave').textContent = pendingLeave.length;
    document.getElementById('rpt-active-tasks').textContent =
      tasks.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED').length;
    document.getElementById('rpt-pending-payroll').textContent =
      payrolls.filter(p => p.paymentStatus === 'PENDING').length;

    const deptBody = document.getElementById('rpt-dept-tbody');
    const deptRows = Object.entries(byDept);
    deptBody.innerHTML = deptRows.length
      ? deptRows.map(([d, c]) => `<tr><td>${d}</td><td>${c}</td></tr>`).join('')
      : '<tr><td colspan="2" class="text-muted text-center">No data</td></tr>';

    const leaveBody = document.getElementById('rpt-leave-tbody');
    leaveBody.innerHTML = pendingLeave.length
      ? pendingLeave.slice(0, 10).map(l => `
        <tr>
          <td>${Utils.getEmployeeName(l.employee)}</td>
          <td>${l.leaveType}</td>
          <td>${Utils.formatDate(l.fromDate)} - ${Utils.formatDate(l.toDate)}</td>
          <td><span class="badge badge-pending">${l.status}</span></td>
        </tr>`).join('')
      : '<tr><td colspan="4" class="text-muted text-center">No pending leave</td></tr>';

    if (role === 'MANAGER') {
      document.getElementById('rpt-subtitle').textContent =
        `Team report — ${employees.length} employee(s) under your management`;
    }
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}
