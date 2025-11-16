import { apiFetch } from "../../utils/api-client.js";
import { ENDPOINTS } from "../../config/api.js";
import { requireAuth } from "../../utils/auth.js";
import { createWorkerRequestCard } from "../../components/workerRequestCard.js";

requireAuth("worker");

const container = document.getElementById("requestsContainer");

async function loadRequests() {
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await apiFetch(ENDPOINTS.REQUESTS.WORKER);

    if (!res.data.length) {
      container.innerHTML = "<p>No assigned requests.</p>";
      return;
    }

    container.innerHTML = "";

    res.data.forEach(req => {
      container.appendChild(createWorkerRequestCard(req, { fullActions: true }));
    });

  } catch (err) {
    container.innerHTML = `<p>${err.message}</p>`;
  }
}

loadRequests();
