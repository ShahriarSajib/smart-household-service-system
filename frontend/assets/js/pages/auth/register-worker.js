import { apiFetch } from '../../utils/api-client.js';
import { ENDPOINTS } from '../../config/api.js';
import { toast } from '../../utils/toast.js';
import { isEmail, minLength, isRequired } from '../../utils/validation.js';

const form = document.getElementById('registerWorkerForm');
const geoBtn = document.getElementById('geoBtn');
const msg = document.getElementById('registerWorkerMessage');
const resendBtn = document.getElementById('resendVerifyBtn');

function showError(input, text) {
  const el = input.parentElement.querySelector('.form-error');
  if (el) { el.style.display = 'block'; el.textContent = text; }
  input.classList.add('error');
}
function clearErrors(form) {
  form.querySelectorAll('.form-error').forEach(e => { e.style.display = 'none'; e.textContent = ''; });
  form.querySelectorAll('.form-control').forEach(i => i.classList.remove('error'));
}

// GEO
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

// FORM SUBMIT
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors(form);
  msg.textContent = '';
  resendBtn.style.display = 'none';

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

    const message =
      (res && (res.message || res.msg)) ||
      'Worker registered successfully. A verification email has been sent.';

    toast.success(message);
    msg.textContent = message;

    // SHOW RESEND EMAIL BUTTON
    resendBtn.style.display = 'inline-block';
    resendBtn.dataset.email = email;

  } catch (err) {
    toast.error(err.message || 'Registration failed');
    msg.textContent = err.message || 'Registration failed';
  }
});

// RESEND VERIFICATION EMAIL
resendBtn.addEventListener('click', async () => {
  const email = resendBtn.dataset.email;
  if (!email) return toast.error("Email not found");

  try {
    const res = await apiFetch(ENDPOINTS.AUTH.RESEND_VERIFICATION, {
      method: "POST",
      body: { email }
    });

    toast.success("Verification email sent again!");
  } catch (err) {
    toast.error(err.message || "Failed to resend email");
  }
});
