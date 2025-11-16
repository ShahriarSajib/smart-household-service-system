import { createPendingWorkerCard } from "../../components/workerPendingCard.js";
import { apiFetch } from "../../utils/api-client.js";
import { requireAuth } from "../../utils/auth.js";

requireAuth("admin");

const container = document.getElementById("pendingWorkers");

async function loadPending() {
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await apiFetch("/api/admin/workers/pending");

    if (!res.data.length) {
      container.innerHTML = "<p>No pending workers.</p>";
      return;
    }

    container.innerHTML = "";
    res.data.forEach(worker => {
      container.appendChild(createPendingWorkerCard(worker));
    });

  } catch (err) {
    container.innerHTML = `<p>${err.message}</p>`;
  }
}

loadPending();
