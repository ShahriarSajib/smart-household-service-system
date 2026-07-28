import { skeletonCard, emptyState } from "../../components/skeletonCard.js";
import { ENDPOINTS } from "../../config/api.js";
import { apiFetch } from "../../utils/api-client.js";
import { currentUser, requireAuth } from "../../utils/auth.js";

requireAuth("worker"); // ensures only worker can enter

// Get worker info
const worker = currentUser();

const summary = document.getElementById("summary");
const list = document.getElementById("ratingsContainer");

async function loadRatings() {
  summary.innerHTML = "";
  summary.appendChild(skeletonCard('summary', 1));
  list.innerHTML = "";
  list.appendChild(skeletonCard('rating', 3));

  try {
    const res = await apiFetch(
      ENDPOINTS.RATINGS.GET_WORKER_RATINGS(worker.id)
    );

    const workerSummary = res.worker;
    const ratings = res.ratings || [];

    summary.innerHTML = `
      <div class="card" style="padding:15px">
        <h3>${workerSummary.name}</h3>
        <p>⭐ Rating: <b>${workerSummary.rating?.toFixed(1) || "0.0"}</b></p>
        <p>Total Reviews: ${workerSummary.rating_count}</p>
      </div>
    `;

    if (!ratings.length) {
      list.appendChild(emptyState('rating'));
      return;
    }

    list.innerHTML = "";

    ratings.forEach(r => {
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
    summary.innerHTML = `<p style="color:red">${err.message}</p>`;
    list.innerHTML = "";
  }
}

loadRatings();
