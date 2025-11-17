import { createWorkerRequestCard } from "../../components/workerRequestCard.js";
import { ENDPOINTS } from "../../config/api.js";
import { apiFetch } from "../../utils/api-client.js";
import { requireAuth } from "../../utils/auth.js";

// Ensure only workers can access
const worker = requireAuth("worker");

// If redirected, stop execution
//if (!worker) return;

const container = document.getElementById("requestsContainer");

async function loadRequests() {
  container.innerHTML = "<p>Loading...</p>";

  try {
    // ✔ FIXED: use correct endpoint with worker.id
    const res = await apiFetch(
      ENDPOINTS.REQUESTS.WORKER_REQUESTS(worker.id)
    );

    // Backend returns array directly
    if (!Array.isArray(res) || res.length === 0) {
      container.innerHTML = "<p>No assigned requests.</p>";
      return;
    }

    container.innerHTML = "";

    res.forEach(req => {
      container.appendChild(
        createWorkerRequestCard(req, { fullActions: true })
      );
    });

  } catch (err) {
    container.innerHTML = `<p style="color:red">${err.message}</p>`;
  }
}

loadRequests();
