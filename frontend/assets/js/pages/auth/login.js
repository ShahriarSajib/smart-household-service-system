
import { apiFetch } from '../../utils/api-client.js';
import { ENDPOINTS } from '../../config/api.js';
import { applyLogin } from '../../utils/auth.js';
import { toast } from '../../utils/toast.js';
import { isEmail, minLength } from '../../utils/validation.js';

const form = document.getElementById('loginForm');
const msgEl = document.getElementById('loginMessage');

function showError(input, text) {
  const el = input.parentElement.querySelector('.form-error');
  if (el) { el.style.display = 'block'; el.textContent = text; }
  input.classList.add('error');
}

function clearErrors(form) {
  form.querySelectorAll('.form-error').forEach(e => { e.style.display = 'none'; e.textContent = ''; });
  form.querySelectorAll('.form-control').forEach(i => i.classList.remove('error'));
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors(form);
  msgEl.textContent = '';

  const email = form.email.value.trim();
  const password = form.password.value;

  // client validation
  if (!isEmail(email)) {
    showError(form.email, 'Please enter a valid email');
    return;
  }
  if (!minLength(password, 6)) {
    showError(form.password, 'Password must be at least 6 characters');
    return;
  }

  try {
    const data = await apiFetch(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: { email, password },
      timeout: 12000,
    });

    // backend returns token and user object
    const token = data.token || (data.data && data.data.token);
    const user = data.user || (data.data && data.data.user);

    if (!token || !user) {
      // sometimes backend returns { status: 'error', message: '...' }
      const errMsg = data.message || 'Login failed';
      toast.error(errMsg);
      msgEl.textContent = errMsg;
      return;
    }

    applyLogin(token, user);
    toast.success('Login successful');

    // redirect based on role
    const role = user.role || 'user';
    if (role === 'admin') location.href = '/pages/admin/dashboard.html';
    else if (role === 'worker') location.href = '/pages/worker/dashboard.html';
    else location.href = '/pages/user/dashboard.html';
  } catch (err) {
    toast.error(err.message || 'Login failed');
    msgEl.textContent = err.message || 'Login failed';
  }
});