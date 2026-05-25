let tasks = [];

document.addEventListener('DOMContentLoaded', async () => {
  if (!Layout.init('tasks')) return;
  await Utils.loadEmployeesForSelect('task-employeeId');

  document.getElementById('task-form')?.addEventListener('submit', assignTask);
  document.getElementById('load-tasks-btn')?.addEventListener('click', loadTasks);
  document.getElementById('load-by-employee-btn')?.addEventListener('click', loadTasksByEmployee);

  if (!PERMISSIONS.can('tasks.assign')) {
    document.getElementById('assign-task-section')?.classList.add('hidden');
  }

  await loadTasks();
});

async function assignTask(e) {
  e.preventDefault();
  const employeeId = document.getElementById('task-employeeId').value;
  const errors = Utils.validateRequired(e.target, [
    { id: 'task-employeeId', label: 'Employee' },
    { id: 'task-title', label: 'Title' }
  ]);
  if (errors.length) {
    Utils.showAlert(errors.join('. '), 'error');
    return;
  }

  const user = AuthService.getUser();
  const payload = {
    title: document.getElementById('task-title').value.trim(),
    description: document.getElementById('task-description').value.trim(),
    assignedBy: user?.username || 'Manager',
    dueDate: document.getElementById('task-dueDate').value || null,
    priority: document.getElementById('task-priority').value,
    status: 'ASSIGNED'
  };

  Utils.setLoading(true);
  try {
    await ApiService.assignTask(employeeId, payload);
    Utils.showAlert('Task assigned successfully!', 'success');
    e.target.reset();
    await loadTasks();
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

async function loadTasks() {
  Utils.setLoading(true);
  try {
    let res;
    if (AuthService.hasAnyRole('ADMIN', 'HR', 'MANAGER')) {
      res = await ApiService.getAllTasks();
    } else {
      const empId = document.getElementById('filter-employeeId')?.value;
      if (!empId) {
        Utils.showAlert('Select an employee in the filter to view tasks.', 'info');
        Utils.setLoading(false);
        return;
      }
      res = await ApiService.getTasksByEmployee(empId);
    }
    tasks = Utils.extractData(res) || [];
    renderTasksTable(tasks);
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

async function loadTasksByEmployee() {
  const employeeId = document.getElementById('filter-employeeId').value;
  if (!employeeId) {
    Utils.showAlert('Select an employee.', 'warning');
    return;
  }
  Utils.setLoading(true);
  try {
    const res = await ApiService.getTasksByEmployee(employeeId);
    tasks = Utils.extractData(res) || [];
    renderTasksTable(tasks);
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

function renderTasksTable(list) {
  const tbody = document.getElementById('tasks-tbody');
  const canDelete = AuthService.hasAnyRole('ADMIN', 'MANAGER');
  const canUpdateStatus = true;

  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No tasks found</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(t => `
    <tr>
      <td>${t.id}</td>
      <td>${t.title}</td>
      <td>${Utils.getEmployeeName(t.assignedTo)}</td>
      <td>${t.assignedBy || '-'}</td>
      <td>${Utils.formatDate(t.dueDate)}</td>
      <td><span class="badge">${t.priority}</span></td>
      <td><span class="badge badge-${(t.status || '').toLowerCase().replace('_', '-')}">${t.status}</span></td>
      <td class="actions">
        ${canUpdateStatus && t.status !== 'COMPLETED' ? `
          <button class="btn btn-sm btn-primary" onclick="updateStatus(${t.id}, 'IN_PROGRESS')">Start</button>
          <button class="btn btn-sm btn-success" onclick="updateStatus(${t.id}, 'COMPLETED')">Complete</button>
        ` : ''}
        ${canDelete ? `<button class="btn btn-sm btn-danger" onclick="deleteTask(${t.id})">Delete</button>` : ''}
      </td>
    </tr>`).join('');
}

async function updateStatus(id, status) {
  Utils.setLoading(true);
  try {
    await ApiService.updateTaskStatus(id, status);
    Utils.showAlert('Task status updated!', 'success');
    await loadTasks();
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

async function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  Utils.setLoading(true);
  try {
    await ApiService.deleteTask(id);
    Utils.showAlert('Task deleted.', 'success');
    await loadTasks();
  } catch (err) {
    Utils.showAlert(err.message, 'error');
  } finally {
    Utils.setLoading(false);
  }
}

window.updateStatus = updateStatus;
window.deleteTask = deleteTask;
