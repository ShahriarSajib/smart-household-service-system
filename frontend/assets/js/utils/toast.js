
function getToastContainer() {
  let c = document.getElementById('toast-container');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toast-container';
    c.style.cssText = 'position:fixed;top:18px;right:18px;z-index:99999;display:flex;flex-direction:column;gap:10px;max-width:380px';
    document.body.appendChild(c);
  }
  return c;
}

export function showToast(message = '', type = 'info', duration = 3500) {
  const container = getToastContainer();
  const el = document.createElement('div');
  el.className = `fm-toast fm-toast-${type}`;
  el.style.cssText = `
    background: rgba(15,23,42,0.95);
    color: #f1f5f9;
    border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
    padding: 12px 14px;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(2,6,23,0.6);
    display:flex;align-items:center;gap:10px;font-size:14px;
  `;
  el.innerHTML = `<strong style="min-width:20px;text-align:center">${type==='success'?'✓':type==='error'?'✕':type==='warning'?'⚠':'ℹ'}</strong><div style="flex:1">${message}</div><button aria-label="close" style="background:none;border:none;color:#cbd5e1;cursor:pointer;font-size:16px">×</button>`;
  container.appendChild(el);

  el.querySelector('button').addEventListener('click', () => el.remove());
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 400);
  }, duration);
}

export const toast = {
  success: (m, d) => showToast(m, 'success', d),
  error: (m, d) => showToast(m, 'error', d),
  warning: (m, d) => showToast(m, 'warning', d),
  info: (m, d) => showToast(m, 'info', d),
};
