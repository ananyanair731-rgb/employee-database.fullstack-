let employees = [];
let editingId = null;

document.addEventListener('DOMContentLoaded', async () => {
  if (!Layout.init('employees')) return;

  const role = AuthService.getRole();

  if (role === 'EMPLOYEE') {
    setupEmployeeSelfService();
    await loadMyProfile();
    return;
  }

  if (!PERMISSIONS.can('employee.viewAll') && !PERMISSIONS.can('employee.viewTeam')) {
    Utils.showAlert('Access denied.', 'error');
    return;
  }

  bindAdminHrEvents();
  applyUiPermissions();
  await loadEmployees();
});

function applyUiPermissions() {
  if (!PERMISSIONS.can('employee.create')) {
    document.getElementById('add-employee-btn')?.classList.add('hidden');
  }
  if (!PERMISSIONS.can('employee.assignRole')) {
    document.getElementById('account-role-group')?.classList.add('hidden');
  } else {
    document.getElementById('account-role-group')?.classList.remove('hidden');
  }
}

function bindAdminHrEvents() {
  document.getElementById('search-btn')?.addEventListener('click', searchEmployees);
  document.getElementById('search-input')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') searchEmployees();
  });
  document.getElementById('refresh-btn')?.addEventListener('click', loadEmployees);
  document.getElementById('add-employee-btn')?.addEventListener('click', () => openEmployeeModal());
  document.getElementById('employee-form')?.addEventListener('submit', saveEmployee);
  document.getElementById('modal-close')?.addEventListener('click', closeEmployeeModal);
  document.getElementById('modal-cancel')?.addEventListener('click', closeEmployeeModal);
}

function setupEmployeeSelfService() {
  document.getElementById('add-employee-btn')?.classList.add('hidden');
  document.querySelector('.toolbar')?.classList.add('hidden');
  document.querySelector('.card-header h3').textContent = 'My Profile';
  document.getElementById('edit-profile-btn')?.classList.remove('hidden');
  document.getElementById('edit-profile-btn')?.addEventListener('click', openSelfEditModal);
  document.getElementById('self-profile-form')?.addEventListener('submit', saveSelfProfile);
  document.getElementById('self-modal-close')?.addEventListener('click', () => {
    document.getElementById('self-profile-modal').classList.remove('active');
  });
}

async function loadMyProfile() {
  Utils.setLoading(true);
  try {
    const res = await ApiService.getMyEmployeeProfile();
    const profile = Utils.extractData(res);
    employees = profile ? [profile] : [];
    renderEmployeesTable(employees);
    if (profile?.id) {
      const user = AuthService.getUser();
      localStorage.setItem(CONFIG.USER_KEY, JSON.stringify({ ...user, employeeId: profile.id }));
    }
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

async function loadEmployees() {
  Utils.setLoading(true);
  try {
    const res = await ApiService.getEmployees();
    employees = Utils.extractData(res) || [];
    renderEmployeesTable(employees);
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

async function searchEmployees() {
  const keyword = document.getElementById('search-input').value.trim();
  if (!keyword) return loadEmployees();
  Utils.setLoading(true);
  try {
    const res = await ApiService.searchEmployees(keyword);
    employees = Utils.extractData(res) || [];
    renderEmployeesTable(employees);
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

function renderEmployeesTable(list) {
  const tbody = document.getElementById('employees-tbody');
  const isEmployee = AuthService.getRole() === 'EMPLOYEE';

  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No records found</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(emp => `
    <tr>
      <td>${emp.employeeCode || emp.id}</td>
      <td>${emp.firstName} ${emp.lastName}</td>
      <td>${emp.email}</td>
      <td>${emp.department}</td>
      <td>${emp.designation}</td>
      <td>${emp.accountRole || emp.username ? (emp.accountRole || 'EMPLOYEE') : '-'}</td>
      <td>${emp.salary != null ? '₹' + Number(emp.salary).toLocaleString() : '-'}</td>
      <td><span class="badge badge-${(emp.employmentStatus || 'ACTIVE').toLowerCase()}">${emp.employmentStatus || 'ACTIVE'}</span></td>
      <td class="actions">
        <button class="btn btn-sm btn-outline" onclick="viewEmployee(${emp.id})">${isEmployee ? 'View' : 'View'}</button>
        ${PERMISSIONS.can('employee.edit') ? `<button class="btn btn-sm btn-primary" onclick="editEmployee(${emp.id})">Edit</button>` : ''}
        ${PERMISSIONS.can('employee.delete') ? `<button class="btn btn-sm btn-danger" onclick="deleteEmployee(${emp.id})">Delete</button>` : ''}
        ${emp.username ? `<small class="text-muted">@${emp.username}</small>` : ''}
      </td>
    </tr>`).join('');
}

function openEmployeeModal(emp = null) {
  editingId = emp?.id || null;
  document.getElementById('modal-title').textContent = emp ? 'Edit Employee' : 'Add Employee';
  fillEmployeeForm(emp);
  const credSection = document.getElementById('login-credentials-section');
  if (credSection) {
    credSection.classList.toggle('hidden', !!editingId);
    document.getElementById('emp-username').required = !editingId;
    document.getElementById('emp-password').required = !editingId;
  }
  document.getElementById('employee-modal').classList.add('active');
}

function fillEmployeeForm(emp) {
  const fields = ['firstName','lastName','email','phone','department','designation','salary','address','gender','employeeCode','managerName','dateOfJoining','dateOfBirth','employmentStatus','username'];
  const map = {
    firstName: 'emp-firstName', lastName: 'emp-lastName', email: 'emp-email', phone: 'emp-phone',
    department: 'emp-department', designation: 'emp-designation', salary: 'emp-salary',
    address: 'emp-address', gender: 'emp-gender', employeeCode: 'emp-employeeCode',
    managerName: 'emp-managerName', employmentStatus: 'emp-employmentStatus', username: 'emp-username'
  };
  Object.keys(map).forEach(k => {
    const el = document.getElementById(map[k]);
    if (!el || !emp) return;
    if (k === 'dateOfJoining' || k === 'dateOfBirth') {
      el.value = Utils.formatDate(emp[k]) !== '-' ? Utils.formatDate(emp[k]) : '';
    } else {
      el.value = emp[k] ?? '';
    }
  });
  document.getElementById('emp-password').value = '';
  const roleEl = document.getElementById('emp-accountRole');
  if (roleEl) roleEl.value = emp?.accountRole || 'EMPLOYEE';
}

function closeEmployeeModal() {
  document.getElementById('employee-modal').classList.remove('active');
  editingId = null;
  document.getElementById('employee-form')?.querySelectorAll('input, select, textarea').forEach(el => el.disabled = false);
  document.getElementById('form-submit-btn')?.classList.remove('hidden');
}

function viewEmployee(id) {
  const emp = employees.find(e => e.id === id);
  if (emp) {
    openEmployeeModal(emp);
    document.getElementById('employee-form').querySelectorAll('input, select').forEach(el => el.disabled = true);
    document.getElementById('form-submit-btn')?.classList.add('hidden');
  }
}

function editEmployee(id) {
  const emp = employees.find(e => e.id === id);
  if (emp) {
    openEmployeeModal(emp);
    document.getElementById('emp-username').disabled = true;
    document.getElementById('form-submit-btn')?.classList.remove('hidden');
  }
}

function openSelfEditModal() {
  const emp = employees[0];
  if (!emp) return;
  document.getElementById('self-phone').value = emp.phone || '';
  document.getElementById('self-address').value = emp.address || '';
  document.getElementById('self-gender').value = emp.gender || '';
  document.getElementById('self-profile-modal').classList.add('active');
}

async function saveSelfProfile(e) {
  e.preventDefault();
  Utils.setLoading(true);
  try {
    await ApiService.updateMyProfile({
      phone: document.getElementById('self-phone').value.trim(),
      address: document.getElementById('self-address').value.trim(),
      gender: document.getElementById('self-gender').value
    });
    Utils.showAlert('Profile updated successfully!', 'success');
    document.getElementById('self-profile-modal').classList.remove('active');
    await loadMyProfile();
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

async function saveEmployee(e) {
  e.preventDefault();
  const errors = Utils.validateRequired(e.target, [
    { id: 'emp-firstName', label: 'First name' },
    { id: 'emp-lastName', label: 'Last name' },
    { id: 'emp-email', label: 'Email', type: 'email' },
    { id: 'emp-phone', label: 'Phone' },
    { id: 'emp-department', label: 'Department' },
    { id: 'emp-designation', label: 'Designation' }
  ]);
  if (!editingId) {
    if (!document.getElementById('emp-username').value.trim()) errors.push('Login username is required');
    if ((document.getElementById('emp-password').value || '').length < 6) errors.push('Password min 6 characters');
  }
  if (errors.length) {
    Utils.showAlert(errors.join('. '), 'error');
    return;
  }

  const payload = buildEmployeePayload();
  Utils.setLoading(true);
  try {
    if (editingId) {
      await ApiService.updateEmployee(editingId, payload);
      Utils.showAlert('Employee updated!', 'success');
    } else {
      const res = await ApiService.addEmployee(payload);
      const created = Utils.extractData(res);
      Utils.showAlert(`Created! Login: ${created?.username || payload.username}`, 'success');
    }
    closeEmployeeModal();
    await loadEmployees();
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

function buildEmployeePayload() {
  const payload = {
    firstName: document.getElementById('emp-firstName').value.trim(),
    lastName: document.getElementById('emp-lastName').value.trim(),
    email: document.getElementById('emp-email').value.trim(),
    phone: document.getElementById('emp-phone').value.trim(),
    department: document.getElementById('emp-department').value.trim(),
    designation: document.getElementById('emp-designation').value.trim(),
    salary: parseFloat(document.getElementById('emp-salary').value) || 0,
    address: document.getElementById('emp-address').value.trim(),
    gender: document.getElementById('emp-gender').value,
    employeeCode: document.getElementById('emp-employeeCode').value.trim(),
    managerName: document.getElementById('emp-managerName').value.trim(),
    dateOfJoining: document.getElementById('emp-dateOfJoining').value || null,
    dateOfBirth: document.getElementById('emp-dateOfBirth').value || null,
    employmentStatus: document.getElementById('emp-employmentStatus').value
  };
  if (!editingId) {
    payload.username = document.getElementById('emp-username').value.trim();
    payload.password = document.getElementById('emp-password').value;
    const roleEl = document.getElementById('emp-accountRole');
    if (roleEl && PERMISSIONS.can('employee.assignRole')) {
      payload.accountRole = roleEl.value;
    } else {
      payload.accountRole = 'EMPLOYEE';
    }
  }
  return payload;
}

async function deleteEmployee(id) {
  if (!confirm('Delete employee and login account?')) return;
  Utils.setLoading(true);
  try {
    await ApiService.deleteEmployee(id);
    Utils.showAlert('Deleted successfully.', 'success');
    await loadEmployees();
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

window.viewEmployee = viewEmployee;
window.editEmployee = editEmployee;
window.deleteEmployee = deleteEmployee;
