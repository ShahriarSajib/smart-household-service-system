import { createRequestCard } from '../../components/requestCard.js';
import { skeletonCard } from '../../components/skeletonCard.js';
import { ENDPOINTS } from '../../config/api.js';
import { apiFetch } from '../../utils/api-client.js';
import { currentUser, requireAuth } from '../../utils/auth.js';

requireAuth('user');

const user = currentUser();
const userId = user.id;

const recentContainer = document.getElementById("recentRequests");

async function loadRecent() {
  recentContainer.innerHTML = '';
  recentContainer.appendChild(skeletonCard('request', 3));

  try {
    const res = await apiFetch(
      ENDPOINTS.REQUESTS.USER_REQUESTS(userId)
    );

    if (!Array.isArray(res) || res.length === 0) {
      recentContainer.innerHTML = "<p>No recent requests found.</p>";
      return;
    }

    recentContainer.innerHTML = "";

    res.slice(0, 3).forEach(req => {
      recentContainer.appendChild(createRequestCard(req));
    });

  } catch (err) {
    recentContainer.innerHTML = `<p>Error loading requests: ${err.message}</p>`;
  }
}

loadRecent();
