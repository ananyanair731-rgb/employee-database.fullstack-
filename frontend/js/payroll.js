let payrollRecords = [];

document.addEventListener('DOMContentLoaded', async () => {
  if (!Layout.init('payroll')) return;

  const role = AuthService.getRole();

  if (role === 'EMPLOYEE') {
    document.getElementById('payroll-admin-section')?.classList.add('hidden');
    document.querySelector('.card-header h3').textContent = 'My Salary';
    let empId = AuthService.getEmployeeId();
    if (!empId) empId = await AuthService.refreshEmployeeId();
    if (empId) await loadMyPayroll(empId);
    else Utils.showAlert('No employee profile linked to your account.', 'warning');
    return;
  }

  if (!PERMISSIONS.can('payroll.manage')) {
    document.getElementById('payroll-main').innerHTML =
      '<p class="text-muted">Payroll access requires Admin or HR role.</p>';
    return;
  }

  await Utils.loadEmployeesForSelect('pay-employeeId');
  document.getElementById('payroll-form')?.addEventListener('submit', generatePayroll);
  document.getElementById('load-payroll-btn')?.addEventListener('click', loadPayrolls);
  document.getElementById('load-by-month-btn')?.addEventListener('click', loadByMonth);
  document.getElementById('pay-month').value = new Date().toISOString().substring(0, 7);
  await loadPayrolls();
});

async function loadMyPayroll(employeeId) {
  Utils.setLoading(true);
  try {
    const res = await ApiService.getPayrollByEmployee(employeeId);
    payrollRecords = Utils.extractData(res) || [];
    renderPayrollTable(payrollRecords);
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

async function generatePayroll(e) {
  e.preventDefault();
  if (!PERMISSIONS.can('payroll.manage')) return;
  const employeeId = document.getElementById('pay-employeeId').value;
  const payload = {
    payMonth: document.getElementById('pay-month').value,
    basicSalary: parseFloat(document.getElementById('pay-basic').value),
    hra: parseFloat(document.getElementById('pay-hra').value) || 0,
    da: parseFloat(document.getElementById('pay-da').value) || 0,
    otherAllowance: parseFloat(document.getElementById('pay-other-allow').value) || 0,
    pfDeduction: parseFloat(document.getElementById('pay-pf').value) || 0,
    taxDeduction: parseFloat(document.getElementById('pay-tax').value) || 0,
    otherDeduction: parseFloat(document.getElementById('pay-other-ded').value) || 0,
    daysWorked: parseInt(document.getElementById('pay-days').value) || 22
  };
  Utils.setLoading(true);
  try {
    await ApiService.generatePayroll(employeeId, payload);
    Utils.showAlert('Payroll generated!', 'success');
    e.target.reset();
    document.getElementById('pay-month').value = new Date().toISOString().substring(0, 7);
    await loadPayrolls();
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

async function loadPayrolls() {
  Utils.setLoading(true);
  try {
    const res = await ApiService.getAllPayrolls();
    payrollRecords = Utils.extractData(res) || [];
    renderPayrollTable(payrollRecords);
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

async function loadByMonth() {
  const month = document.getElementById('filter-month').value;
  if (!month) return Utils.showAlert('Select a month', 'warning');
  Utils.setLoading(true);
  try {
    const res = await ApiService.getPayrollByMonth(month);
    payrollRecords = Utils.extractData(res) || [];
    renderPayrollTable(payrollRecords);
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

function renderPayrollTable(list) {
  const tbody = document.getElementById('payroll-tbody');
  const canManage = PERMISSIONS.can('payroll.manage');
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No payroll records</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${Utils.getEmployeeName(p.employee)}</td>
      <td>${p.payMonth}</td>
      <td>₹${(p.grossSalary || 0).toLocaleString()}</td>
      <td>₹${(p.totalDeduction || 0).toLocaleString()}</td>
      <td>₹${(p.netSalary || 0).toLocaleString()}</td>
      <td><span class="badge badge-${(p.paymentStatus || 'pending').toLowerCase()}">${p.paymentStatus}</span></td>
      <td>${canManage && p.paymentStatus === 'PENDING' ? `<button class="btn btn-sm btn-success" onclick="markPaid(${p.id})">Mark Paid</button>` : '-'}</td>
    </tr>`).join('');
}

async function markPaid(id) {
  Utils.setLoading(true);
  try {
    await ApiService.markPayrollPaid(id);
    Utils.showAlert('Marked as PAID', 'success');
    await loadPayrolls();
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

window.markPaid = markPaid;
