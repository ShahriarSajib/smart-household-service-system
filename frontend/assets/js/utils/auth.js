// frontend/assets/js/utils/auth.js
import { clearAuth, getUser, saveToken, saveUser } from './storage.js';

/*
 Call after successful login
 @param {string} token
 @param {object} user - { id, name, email, role }
 */
export function applyLogin(token, user) {
  saveToken(token);
  saveUser(user);
}

 //Logout locally

export function logoutLocal() {
  clearAuth();
}

 //Return current user object or null
export function currentUser() {
  return getUser();
}

export function requireAuth(role = null) {
  const user = getUser();
  if (!user) {
    window.location.href = "/pages/auth/login.html";
    return;
  }
  if (role && user.role !== role) {
    window.location.href = "/pages/auth/login.html";
    return;
  }
}
