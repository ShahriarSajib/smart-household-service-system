export function isEmail(v) {
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function isRequired(v) {
  return v !== null && v !== undefined && String(v).trim() !== '';
}

export function minLength(v, n=6) {
  return String(v || '').length >= n;
}
