import { apiFetch } from "../../utils/api-client.js";
import { requireAuth } from "../../utils/auth.js";

requireAuth("admin");

const summary = document.getElementById("summary");

async function loadSummary() {
  summary.innerHTML = "<p>Loading...</p>";

  try {
    const pendingRes = await apiFetch("/api/admin/workers/pending");
    const requestsRes = await apiFetch("/api/admin/work-requests");

    const pendingWorkers = pendingRes.data || [];
    const workRequests = requestsRes.data || [];

    summary.innerHTML = `
      <div class="card" style="padding:15px; margin-bottom:1rem">
        <p>Pending Workers: <b>${pendingWorkers.length}</b></p>
      </div>
      <div class="card" style="padding:15px; margin-bottom:1rem">
        <p>Work Requests: <b>${workRequests.length}</b></p>
      </div>
    `;
  } catch (err) {
    summary.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

loadSummary();
