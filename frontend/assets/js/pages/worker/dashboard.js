import { apiFetch } from "../../utils/api-client.js";
import { ENDPOINTS } from "../../config/api.js";
import { requireAuth } from "../../utils/auth.js";
import { createWorkerRequestCard } from "../../components/workerRequestCard.js";

requireAuth("worker");

const container = document.getElementById("recentRequests");

async function loadRecent() {
  try {
    const res = await apiFetch(ENDPOINTS.REQUESTS.WORKER);

    if (!res.data.length) {
      container.innerHTML = "<p>No assigned work.</p>";
      return;
    }

    container.innerHTML = "";
    res.data.slice(0, 3).forEach(req => {
      container.appendChild(createWorkerRequestCard(req));
    });
  } catch (err) {
    container.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

loadRecent();
