import { API_BASE_URL } from '../config/api.js';
import { getToken } from './storage.js';

/*
  Generic fetch wrapper for API calls.
 - Adds Authorization header when token exists
 - Throws JS Error on network or non-2xx responses (with message from server when available)
 */
export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : (API_BASE_URL + endpoint);
  const token = getToken();

  const controller = new AbortController();
  const timeout = options.timeout || 10000; // ms
  const id = setTimeout(() => controller.abort(), timeout);

  const headers = Object.assign(
    { 'Content-Type': 'application/json' },
    options.headers || {}
  );

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = Object.assign(
    {
      method: 'GET',
      headers,
      signal: controller.signal,
    },
    options
  );

  if (opts.body && typeof opts.body !== 'string') {
    opts.body = JSON.stringify(opts.body);
  }

  try {
    const res = await fetch(url, opts);
    clearTimeout(id);

    // try parse json safely
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }

    if (!res.ok) {
      // If token-related error, clear local auth to force re-login
      if (res.status === 401 || res.status === 403) {
        // some servers return JSON { message }
        // but only clear if explicitly unauthorized
        // (caller may handle re-login)
      }
      const message = (data && (data.message || data.msg || data.status)) || res.statusText || 'Request failed';
      const err = new Error(message);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw err;
  }
}
