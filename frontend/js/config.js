/**
 * HRMS Frontend Configuration
 */
const CONFIG = {
  API_BASE_URL: 'http://localhost:8080/api',
  TOKEN_KEY: 'hrms_token',
  USER_KEY: 'hrms_user',
  AUTH_PAGES: ['login.html', 'signup.html', 'index.html'],

  ROLE_REDIRECT: {
    ADMIN: 'dashboard.html',
    HR: 'dashboard.html',
    MANAGER: 'dashboard.html',
    EMPLOYEE: 'dashboard.html'
  }
};
