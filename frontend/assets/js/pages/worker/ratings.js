import { apiFetch } from "../../utils/api-client.js";
import { ENDPOINTS } from "../../config/api.js";
import { requireAuth } from "../../utils/auth.js";

requireAuth("worker");

const summary = document.getElementById("summary");
const list = document.getElementById("ratingsContainer");

async function loadRatings() {
  try {
    const res = await apiFetch(ENDPOINTS.WORKERS.RATINGS);

    const worker = res.data.worker;

    summary.innerHTML = `
      <div class="card" style="padding:15px">
        <h3>${worker.name}</h3>
        <p>⭐ Rating: <b>${worker.rating.toFixed(1)}</b></p>
        <p>Total Reviews: ${worker.rating_count}</p>
      </div>
    `;

    if (!res.data.ratings.length) {
      list.innerHTML = "<p>No ratings yet.</p>";
      return;
    }

    res.data.ratings.forEach(r => {
      const div = document.createElement("div");
      div.className = "card";
      div.style.padding = "15px";
      div.style.marginBottom = "10px";

      div.innerHTML = `
        <p>⭐ ${r.score}</p>
        <p>${r.comment || "No comment"}</p>
        <div style="font-size:13px;color:var(--muted)">
          by ${r.rater_name} (${new Date(r.created_at).toLocaleString()})
        </div>
      `;

      list.append(div);
    });

  } catch (err) {
    summary.innerHTML = `<p>${err.message}</p>`;
  }
}

loadRatings();
