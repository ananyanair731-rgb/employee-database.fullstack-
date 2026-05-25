/**
 * Frontend route protection (complements backend JWT security)
 */
const Router = {
  getCurrentPage() {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  },

  isAuthPage() {
    return CONFIG.AUTH_PAGES.includes(this.getCurrentPage());
  },

  guard() {
    const page = this.getCurrentPage();

    if (this.isAuthPage()) {
      if (AuthService.isLoggedIn() && (page === 'login.html' || page === 'signup.html')) {
        window.location.href = PERMISSIONS.getHomePage();
        return false;
      }
      return true;
    }

    if (!AuthService.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }

    if (!PERMISSIONS.canAccessPage(page)) {
      Utils.showAlert?.('You do not have permission to access this page.', 'error');
      window.location.href = AuthService.getRedirectPath() || PERMISSIONS.getHomePage();
      return false;
    }

    return true;
  },

  requireAction(action, redirectOnFail = true) {
    if (!PERMISSIONS.can(action)) {
      if (redirectOnFail) {
        Utils.showAlert('Access denied for your role.', 'error');
      }
      return false;
    }
    return true;
  }
};
