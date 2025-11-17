import { createWorkerRequestCard } from "../../components/workerRequestCard.js";
import { ENDPOINTS } from "../../config/api.js";
import { apiFetch } from "../../utils/api-client.js";
import { currentUser, requireAuth } from "../../utils/auth.js";

// Require worker
requireAuth("worker");

// Get worker info
const worker = currentUser();
const workerId = worker.id;

const container = document.getElementById("recentRequests");

async function loadRecent() {
  try {
    // Use correct dynamic endpoint
    const res = await apiFetch(
      ENDPOINTS.REQUESTS.WORKER_REQUESTS(workerId)
    );

    // Backend returns array directly
    if (!Array.isArray(res) || res.length === 0) {
      container.innerHTML = "<p>No assigned work.</p>";
      return;
    }

    container.innerHTML = "";

    res.slice(0, 3).forEach(req => {
      container.appendChild(createWorkerRequestCard(req));
    });

  } catch (err) {
    container.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
  }
}

loadRecent();
