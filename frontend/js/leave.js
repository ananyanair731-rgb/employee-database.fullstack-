let leaveRecords = [];

document.addEventListener('DOMContentLoaded', async () => {
  if (!Layout.init('leave')) return;
  await Utils.loadEmployeesForSelect('leave-employeeId');
  await Utils.loadEmployeesForSelect('filter-employeeId');

  document.getElementById('leave-form')?.addEventListener('submit', applyLeave);
  document.getElementById('load-leave-btn')?.addEventListener('click', loadLeaveRecords);
  document.getElementById('load-pending-btn')?.addEventListener('click', loadPendingLeave);
  document.getElementById('load-all-btn')?.addEventListener('click', loadAllLeave);

  if (!PERMISSIONS.can('leave.viewAll')) {
    document.getElementById('load-all-btn')?.classList.add('hidden');
  }
  if (!PERMISSIONS.can('leave.approve')) {
    document.querySelectorAll('.leave-approve-actions').forEach(el => el.classList.add('hidden'));
  }

  if (AuthService.getRole() === 'EMPLOYEE') {
    const empId = AuthService.getEmployeeId();
    if (empId) {
      document.getElementById('filter-employeeId').value = empId;
      loadLeaveRecords();
    }
  }
});

async function applyLeave(e) {
  e.preventDefault();
  const employeeId = document.getElementById('leave-employeeId').value;
  const errors = Utils.validateRequired(e.target, [
    { id: 'leave-employeeId', label: 'Employee' },
    { id: 'leave-type', label: 'Leave type' },
    { id: 'leave-from', label: 'From date' },
    { id: 'leave-to', label: 'To date' },
    { id: 'leave-reason', label: 'Reason' }
  ]);
  if (errors.length) {
    Utils.showAlert(errors.join('. '), 'error');
    return;
  }

  const payload = {
    leaveType: document.getElementById('leave-type').value,
    fromDate: document.getElementById('leave-from').value,
    toDate: document.getElementById('leave-to').value,
    reason: document.getElementById('leave-reason').value.trim()
  };

  Utils.setLoading(true);
  try {
    await ApiService.applyLeave(employeeId, payload);
    Utils.showAlert('Leave request submitted successfully!', 'success');
    e.target.reset();
    await loadLeaveRecords();
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

async function loadLeaveRecords() {
  const employeeId = document.getElementById('filter-employeeId').value;
  Utils.setLoading(true);
  try {
    let res;
    if (employeeId) {
      res = await ApiService.getLeaveByEmployee(employeeId);
    } else if (AuthService.hasAnyRole('ADMIN', 'HR')) {
      res = await ApiService.getAllLeave();
    } else {
      Utils.showAlert('Select an employee or use admin/HR account to view all.', 'warning');
      Utils.setLoading(false);
      return;
    }
    leaveRecords = Utils.extractData(res) || [];
    renderLeaveTable(leaveRecords);
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

async function loadPendingLeave() {
  Utils.setLoading(true);
  try {
    const res = await ApiService.getPendingLeave();
    leaveRecords = Utils.extractData(res) || [];
    renderLeaveTable(leaveRecords, true);
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

async function loadAllLeave() {
  Utils.setLoading(true);
  try {
    const res = await ApiService.getAllLeave();
    leaveRecords = Utils.extractData(res) || [];
    renderLeaveTable(leaveRecords, true);
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

function renderLeaveTable(list, showActions = false) {
  const tbody = document.getElementById('leave-tbody');
  const canApprove = AuthService.hasAnyRole('ADMIN', 'HR', 'MANAGER');

  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No leave requests found</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(r => `
    <tr>
      <td>${r.id}</td>
      <td>${Utils.getEmployeeName(r.employee)}</td>
      <td>${r.leaveType}</td>
      <td>${Utils.formatDate(r.fromDate)} - ${Utils.formatDate(r.toDate)}</td>
      <td>${r.reason || '-'}</td>
      <td><span class="badge badge-${r.status?.toLowerCase()}">${r.status}</span></td>
      <td>${r.approvedBy || '-'}</td>
      <td class="actions">
        ${(showActions || r.status === 'PENDING') && canApprove && r.status === 'PENDING' ? `
          <button class="btn btn-sm btn-success" onclick="leaveAction(${r.id}, 'APPROVED')">Approve</button>
          <button class="btn btn-sm btn-danger" onclick="leaveAction(${r.id}, 'REJECTED')">Reject</button>
        ` : ''}
        ${r.status === 'PENDING' ? `<button class="btn btn-sm btn-outline" onclick="cancelLeave(${r.id})">Cancel</button>` : ''}
      </td>
    </tr>`).join('');
}

async function leaveAction(id, status) {
  const user = AuthService.getUser();
  Utils.setLoading(true);
  try {
    await ApiService.leaveAction(id, status, user?.username || 'HR');
    Utils.showAlert(`Leave ${status.toLowerCase()} successfully!`, 'success');
    await loadPendingLeave();
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

async function cancelLeave(id) {
  if (!confirm('Cancel this leave request?')) return;
  Utils.setLoading(true);
  try {
    await ApiService.cancelLeave(id);
    Utils.showAlert('Leave cancelled.', 'success');
    await loadLeaveRecords();
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

window.leaveAction = leaveAction;
window.cancelLeave = cancelLeave;
