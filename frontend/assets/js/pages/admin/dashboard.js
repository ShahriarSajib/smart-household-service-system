import { apiFetch } from "../../utils/api-client.js";
import { requireAuth } from "../../utils/auth.js";

requireAuth("admin");

const summary = document.getElementById("summary");

async function loadSummary() {
  summary.innerHTML = "<p>Loading...</p>";

  try {
    const pending = await apiFetch("/api/admin/workers/pending");

    summary.innerHTML = `
      <div class="card" style="padding:15px">
        <p>Pending Workers: <b>${pending.data.length}</b></p>
      </div>
    `;
  } catch (err) {
    summary.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

loadSummary();
