import { apiFetch } from '../../utils/api-client.js';
import { ENDPOINTS } from '../../config/api.js';
import { toast } from '../../utils/toast.js';
import { isEmail, minLength, isRequired } from '../../utils/validation.js';

const form = document.getElementById('registerWorkerForm');
const geoBtn = document.getElementById('geoBtn');
const msg = document.getElementById('registerWorkerMessage');

function showError(input, text) {
  const el = input.parentElement.querySelector('.form-error');
  if (el) { el.style.display = 'block'; el.textContent = text; }
  input.classList.add('error');
}
function clearErrors(form) {
  form.querySelectorAll('.form-error').forEach(e => { e.style.display = 'none'; e.textContent = ''; });
  form.querySelectorAll('.form-control').forEach(i => i.classList.remove('error'));
}

// geolocation helper
geoBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    toast.error('Geolocation not supported by browser');
    return;
  }
  geoBtn.disabled = true;
  geoBtn.textContent = 'Locating...';
  navigator.geolocation.getCurrentPosition((pos) => {
    form.latitude.value = pos.coords.latitude;
    form.longitude.value = pos.coords.longitude;
    geoBtn.textContent = 'Use GPS';
    geoBtn.disabled = false;
    toast.success('Location filled');
  }, (err) => {
    geoBtn.textContent = 'Use GPS';
    geoBtn.disabled = false;
    toast.error('Unable to get location');
  }, { timeout: 10000 });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors(form);
  msg.textContent = '';

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const skill_category = form.skill_category.value.trim();
  const location = form.location.value.trim();
  const latitude = form.latitude.value.trim() || null;
  const longitude = form.longitude.value.trim() || null;

  if (!isRequired(name)) { showError(form.name, 'Name is required'); return; }
  if (!isEmail(email)) { showError(form.email, 'Invalid email'); return; }
  if (!minLength(password, 6)) { showError(form.password, 'Password must be at least 6 chars'); return; }
  if (!isRequired(skill_category)) { showError(form.skill_category, 'Skill category required'); return; }

  try {
    const payload = { name, email, password, skill_category, location, latitude, longitude };
    const res = await apiFetch(ENDPOINTS.AUTH.REGISTER_WORKER, {
      method: 'POST',
      body: payload,
      timeout: 15000,
    });

    const message = (res && (res.message || res.msg)) || 'Worker registered successfully. Verify email and wait admin approval.';
    toast.success(message);
    msg.textContent = message;
    setTimeout(() => location.href = '/pages/auth/login.html', 1600);
  } catch (err) {
    toast.error(err.message || 'Registration failed');
    msg.textContent = err.message || 'Registration failed';
  }
});