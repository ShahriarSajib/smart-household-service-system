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
