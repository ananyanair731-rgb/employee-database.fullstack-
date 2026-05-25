/**
 * Shared app layout (sidebar + topbar)
 */
const Layout = {
  renderSidebar(activePage) {
    const nav = document.getElementById('sidebar-nav');
    if (!nav) return;

    const items = PERMISSIONS.getNavItems();
    nav.innerHTML = items.map(item => `
      <a href="${item.href}" class="nav-link ${activePage === item.page ? 'active' : ''}">
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-label">${item.label}</span>
      </a>`).join('');

    const user = AuthService.getUser();
    const role = AuthService.getRole();
    const userInfo = document.getElementById('sidebar-user');
    if (userInfo && user) {
      userInfo.innerHTML = `
        <div class="user-avatar">${user.username.charAt(0).toUpperCase()}</div>
        <div class="user-details">
          <strong>${user.username}</strong>
          <span class="role-badge role-${role.toLowerCase()}">${role}</span>
        </div>`;
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.onclick = () => AuthService.logout();
  },

  renderTopbar(pageKey) {
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = PERMISSIONS.getPageTitle(pageKey);
  },

  init(activePage) {
    if (!Router.guard()) return false;
    this.renderSidebar(activePage);
    this.renderTopbar(activePage);

    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
    return true;
  }
};
