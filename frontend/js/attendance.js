let records = [];

document.addEventListener('DOMContentLoaded', async () => {
  if (!Layout.init('attendance')) return;
  await Utils.loadEmployeesForSelect('att-employeeId');

  document.getElementById('attendance-form')?.addEventListener('submit', markAttendance);
  document.getElementById('load-attendance-btn')?.addEventListener('click', loadAttendance);
  document.getElementById('load-by-date-btn')?.addEventListener('click', loadByDate);
  document.getElementById('att-date').value = new Date().toISOString().split('T')[0];

  if (!PERMISSIONS.can('attendance.mark')) {
    document.getElementById('mark-attendance-section')?.classList.add('hidden');
  }
  if (!PERMISSIONS.can('attendance.viewAll')) {
    document.getElementById('load-by-date-btn')?.classList.add('hidden');
  }

  if (AuthService.getRole() === 'EMPLOYEE') {
    const empId = AuthService.getEmployeeId();
    if (empId) loadAttendanceForEmployee(empId);
  }
});

async function loadAttendanceForEmployee(employeeId) {
  document.getElementById('filter-employeeId').value = employeeId;
  Utils.setLoading(true);
  try {
    const res = await ApiService.getAttendanceByEmployee(employeeId);
    records = Utils.extractData(res) || [];
    renderAttendanceTable(records);
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

async function markAttendance(e) {
  e.preventDefault();
  const employeeId = document.getElementById('att-employeeId').value;
  const errors = Utils.validateRequired(e.target, [
    { id: 'att-employeeId', label: 'Employee' },
    { id: 'att-date', label: 'Date' },
    { id: 'att-status', label: 'Status' }
  ]);
  if (errors.length) {
    Utils.showAlert(errors.join('. '), 'error');
    return;
  }

  const payload = {
    attendanceDate: document.getElementById('att-date').value,
    checkIn: document.getElementById('att-checkIn').value ? document.getElementById('att-checkIn').value + ':00' : null,
    checkOut: document.getElementById('att-checkOut').value ? document.getElementById('att-checkOut').value + ':00' : null,
    status: document.getElementById('att-status').value,
    remarks: document.getElementById('att-remarks').value.trim()
  };

  Utils.setLoading(true);
  try {
    await ApiService.markAttendance(employeeId, payload);
    Utils.showAlert('Attendance marked successfully!', 'success');
    e.target.reset();
    document.getElementById('att-date').value = new Date().toISOString().split('T')[0];
    await loadAttendance();
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

async function loadAttendance() {
  const employeeId = document.getElementById('filter-employeeId').value || document.getElementById('att-employeeId').value;
  if (!employeeId) {
    Utils.showAlert('Please select an employee to load records.', 'warning');
    return;
  }
  Utils.setLoading(true);
  try {
    const res = await ApiService.getAttendanceByEmployee(employeeId);
    records = Utils.extractData(res) || [];
    renderAttendanceTable(records);
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

async function loadByDate() {
  const date = document.getElementById('filter-date').value;
  if (!date) {
    Utils.showAlert('Please select a date.', 'warning');
    return;
  }
  Utils.setLoading(true);
  try {
    const res = await ApiService.getAttendanceByDate(date);
    records = Utils.extractData(res) || [];
    renderAttendanceTable(records);
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

function renderAttendanceTable(list) {
  const tbody = document.getElementById('attendance-tbody');
  const canDelete = AuthService.hasAnyRole('ADMIN', 'HR');

  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No attendance records found</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(r => `
    <tr>
      <td>${r.id}</td>
      <td>${Utils.getEmployeeName(r.employee)}</td>
      <td>${Utils.formatDate(r.attendanceDate)}</td>
      <td>${r.checkIn || '-'}</td>
      <td>${r.checkOut || '-'}</td>
      <td><span class="badge">${r.status}</span></td>
      <td class="actions">
        ${canDelete ? `<button class="btn btn-sm btn-danger" onclick="deleteAttendanceRecord(${r.id})">Delete</button>` : ''}
      </td>
    </tr>`).join('');
}

async function deleteAttendanceRecord(id) {
  if (!confirm('Delete this attendance record?')) return;
  Utils.setLoading(true);
  try {
    await ApiService.deleteAttendance(id);
    Utils.showAlert('Record deleted.', 'success');
    await loadAttendance();
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

window.deleteAttendanceRecord = deleteAttendanceRecord;
