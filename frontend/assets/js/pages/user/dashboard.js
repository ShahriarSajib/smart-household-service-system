import { createRequestCard } from '../../components/requestCard.js';
import { ENDPOINTS } from '../../config/api.js';
import { apiFetch } from '../../utils/api-client.js';
import { requireAuth } from '../../utils/auth.js';

requireAuth('user');

const recentContainer = document.getElementById("recentRequests");

async function loadRecent() {
  try {
    const res = await apiFetch(ENDPOINTS.REQUESTS.USER, { method: "GET" });

    if (!res.data || res.data.length === 0) {
      recentContainer.innerHTML = "<p>No recent requests found.</p>";
      return;
    }

    recentContainer.innerHTML = "";
    res.data.slice(0, 3).forEach(req => {
      recentContainer.appendChild(createRequestCard(req));
    });
  } catch (err) {
    recentContainer.innerHTML = `<p>Error loading requests: ${err.message}</p>`;
  }
}

loadRecent();
