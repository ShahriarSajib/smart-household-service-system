import { createWorkerRequestCard } from "../../components/workerRequestCard.js";
import { ENDPOINTS } from "../../config/api.js";
import { apiFetch } from "../../utils/api-client.js";
import { requireAuth } from "../../utils/auth.js";
import { getUser } from "../../utils/storage.js";

// redirect if not worker
requireAuth("worker");

// now safely get worker info
const worker = getUser();
const workerId = worker.id;

const container = document.getElementById("requestsContainer");

async function loadRequests() {
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await apiFetch(ENDPOINTS.REQUESTS.WORKER_REQUESTS(workerId));

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
