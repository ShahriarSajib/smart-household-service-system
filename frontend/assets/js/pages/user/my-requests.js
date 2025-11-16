import { createRequestCard } from "../../components/requestCard.js";
import { ENDPOINTS } from "../../config/api.js";
import { apiFetch } from "../../utils/api-client.js";
import { requireAuth } from "../../utils/auth.js";

requireAuth("user");

const container = document.getElementById("requestsContainer");

async function loadRequests() {
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await apiFetch(ENDPOINTS.REQUESTS.USER);

    if (!res.data || res.data.length === 0) {
      container.innerHTML = "<p>No requests yet.</p>";
      return;
    }

    container.innerHTML = "";

    res.data.forEach(req => {
      container.appendChild(createRequestCard(req, { showCancel: true }));
    });

  } catch (err) {
    container.innerHTML = `<p style="color:red">${err.message}</p>`;
  }
}

loadRequests();
