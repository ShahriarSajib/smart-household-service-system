import { getUser, clearAuth } from '../utils/storage.js';
import { API_BASE_URL } from '../config/api.js';
import { toast } from '../utils/toast.js';
import { apiFetch } from '../utils/api-client.js';
import { ENDPOINTS } from '../config/api.js';

const createLink = (href, text, cls = '') => {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = text;
  if (cls) a.className = cls;
  return a;
};

 //Render navbar into a target element id (default 'navbar-dynamic' or #navbar)
export function renderNavbarInto(targetId = 'navbar-dynamic') {
  const container = document.getElementById(targetId) || document.getElementById('navbar') || document.body;
  if (!container) return;

  const user = getUser();

  // build markup
  const nav = document.createElement('nav');
  nav.className = 'navbar card';
  nav.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:0.6rem 1rem;position:sticky;top:0;z-index:999;background:var(--bg-secondary);backdrop-filter:blur(6px)';

  const brand = document.createElement('div');
  brand.innerHTML = `<a href="/" style="display:flex;align-items:center;gap:8px;text-decoration:none"><span style="font-size:20px">🔧</span><strong style="color:var(--primary)">&nbsp;FixMate</strong></a>`;

  const right = document.createElement('div');
  right.style.display = 'flex';
  right.style.gap = '12px';
  right.style.alignItems = 'center';

  // common links
  right.appendChild(createLink('/#services', 'Services'));
  right.appendChild(createLink('/#how-it-works', 'How it works'));

  if (!user) {
    right.appendChild(createLink('/pages/auth/login.html', 'Login', 'btn-secondary'));
    right.appendChild(createLink('/pages/auth/register-user.html', 'Sign up', 'btn-primary'));
  } else {
    // role-based
    if (user.role === 'user') {
      right.appendChild(createLink('/pages/user/dashboard.html', 'Dashboard'));
      right.appendChild(createLink('/pages/user/my-requests.html', 'My requests'));
    } else if (user.role === 'worker') {
      right.appendChild(createLink('/pages/worker/dashboard.html', 'Dashboard'));
      right.appendChild(createLink('/pages/worker/my-jobs.html', 'My jobs'));
    } else if (user.role === 'admin') {
      right.appendChild(createLink('/pages/admin/dashboard.html', 'Admin'));
      right.appendChild(createLink('/pages/admin/pending-workers.html', 'Pending'));
    }

    const profile = document.createElement('div');
    profile.textContent = user.name || user.email || 'You';
    profile.style.marginLeft = '8px';
    profile.style.fontSize = '14px';
    profile.style.color = 'var(--text-secondary)';
    right.appendChild(profile);

    const logout = document.createElement('button');
    logout.className = 'btn btn-secondary';
    logout.textContent = 'Logout';
    logout.addEventListener('click', async () => {
      try {
        // call backend logout (blacklist) then clear local
        try {
          const token = localStorage.getItem('fixmate_token');
          if (token) {
            await fetch(API_BASE_URL + ENDPOINTS.AUTH.LOGOUT, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
            });
          }
        } catch (e) {
          // ignore server error, still clear local auth
        }
        clearAuth();
        toast.success('Logged out');
        setTimeout(() => location.href = '/pages/auth/login.html', 300);
      } catch (err) {
        toast.error('Logout failed');
      }
    });
    right.appendChild(logout);
  }

  nav.appendChild(brand);
  nav.appendChild(right);

  // insert / replace existing element
  container.innerHTML = '';
  container.appendChild(nav);
}

export default renderNavbarInto;
