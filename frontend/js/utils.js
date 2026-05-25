/**
 * Shared UI utilities
 */
const Utils = {
  showAlert(message, type = 'info', containerId = 'alert-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
    container.innerHTML = `
      <div class="alert alert-${type}" role="alert">
        <span class="alert-icon">${icons[type] || icons.info}</span>
        <span>${message}</span>
        <button class="alert-close" onclick="this.parentElement.remove()">&times;</button>
      </div>`;

    if (type === 'success') {
      setTimeout(() => { container.innerHTML = ''; }, 5000);
    }
  },

  setLoading(show, overlayId = 'loading-overlay') {
    const overlay = document.getElementById(overlayId);
    if (overlay) overlay.classList.toggle('active', show);
  },

  formatDate(dateStr) {
    if (!dateStr) return '-';
    return dateStr.split('T')[0];
  },

  formatDateTime(dateStr) {
    if (!dateStr) return '-';
    return dateStr.replace('T', ' ').substring(0, 16);
  },

  getEmployeeName(emp) {
    if (!emp) return '-';
    if (typeof emp === 'object') {
      if (emp.firstName) return `${emp.firstName} ${emp.lastName || ''}`.trim();
      if (emp.id) return `Employee #${emp.id}`;
    }
    return String(emp);
  },

  getEmployeeId(record) {
    if (!record) return null;
    if (record.employee?.id) return record.employee.id;
    if (record.assignedTo?.id) return record.assignedTo.id;
    return record.employeeId || null;
  },

  extractData(response) {
    if (Array.isArray(response)) return response;
    if (response?.data !== undefined) return response.data;
    return response;
  },

  validateRequired(form, fields) {
    const errors = [];
    fields.forEach(({ id, label, type }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const value = el.value?.trim();
      if (!value) {
        errors.push(`${label} is required`);
        el.classList.add('input-error');
      } else {
        el.classList.remove('input-error');
        if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(`${label} must be a valid email`);
          el.classList.add('input-error');
        }
      }
    });
    return errors;
  },

  initAppLayout(activePage) {
    return Layout.init(activePage);
  },

  async loadEmployeesForSelect(selectId, includeEmpty = true) {
    const select = document.getElementById(selectId);
    if (!select) return [];
    try {
      let employees = [];
      if (AuthService.getRole() === 'EMPLOYEE') {
        const empId = AuthService.getEmployeeId();
        if (empId) {
          const res = await ApiService.getEmployee(empId);
          const emp = Utils.extractData(res);
          if (emp) employees = [emp];
        } else {
          const res = await ApiService.getMyEmployeeProfile();
          const emp = Utils.extractData(res);
          if (emp) {
            employees = [emp];
            const user = AuthService.getUser();
            localStorage.setItem(CONFIG.USER_KEY, JSON.stringify({ ...user, employeeId: emp.id }));
          }
        }
      } else {
        const res = await ApiService.getEmployees();
        employees = Utils.extractData(res) || [];
      }
      select.innerHTML = includeEmpty ? '<option value="">Select Employee</option>' : '';
      employees.forEach(emp => {
        select.innerHTML += `<option value="${emp.id}">${emp.firstName} ${emp.lastName} (${emp.employeeCode || emp.id})</option>`;
      });
      if (AuthService.getRole() === 'EMPLOYEE' && employees.length === 1) {
        select.value = employees[0].id;
        select.disabled = true;
      }
      return employees;
    } catch (e) {
      select.innerHTML = '<option value="">Unable to load employees</option>';
      return [];
    }
  }
};
