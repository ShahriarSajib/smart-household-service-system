import { ENDPOINTS } from "../config/api.js";
import { apiFetch } from "../utils/api-client.js";
import { toast } from "../utils/toast.js";

export function createRequestCard(request, opts = {}) {
  const card = document.createElement("div");
  card.className = "card";
  card.style.marginBottom = "14px";
  card.style.padding = "14px";

  const statusLower = request.status.toLowerCase();

  card.innerHTML = `
    <h3 style="margin:0">${request.category}</h3>
    <p>${request.description}</p>

    <p style="color:var(--muted);margin:4px 0">
      Status: <b>${request.status}</b>
    </p>

    <p style="font-size:13px;color:var(--muted)">
      Location: ${request.location}
    </p>

    ${
      request.worker_name
        ? `
        <p style="font-size:13px;color:var(--muted);margin-top:6px">
          Assigned Worker: <b>${request.worker_name}</b><br>
          Phone: ${request.worker_phone || "Not provided"}
        </p>
      `
        : `
        <p style="font-size:13px;color:var(--muted);margin-top:6px">
          No worker assigned
        </p>
      `
    }

    <div class="actions" style="margin-top:10px"></div>
  `;

  const actions = card.querySelector(".actions");

  // Cancel button
  if (opts.showCancel && statusLower !== "completed" && statusLower !== "cancelled") {
    const btn = document.createElement("button");
    btn.className = "btn btn-danger";
    btn.textContent = "Cancel";

    btn.onclick = (e) => {
      e.stopPropagation();
      cancelRequest(request.id, card);
    };

    actions.appendChild(btn);
  }

  // RATING BUTTON (ONLY IF COMPLETED)
  if (statusLower === "completed" && request.assigned_worker_id) {
    const rateBtn = document.createElement("button");

    // Check if already rated
    if (request.user_has_rated) {
      rateBtn.className = "btn btn-secondary";
      rateBtn.textContent = "Worker Rated";
      rateBtn.disabled = true;
    } else {
      rateBtn.className = "btn btn-primary";
      rateBtn.textContent = "Rate Worker";

      rateBtn.onclick = () => openRatingModal(request, rateBtn);
    }

    actions.appendChild(rateBtn);
  }

  return card;
}

/* --------------------- CANCEL REQUEST --------------------- */

async function cancelRequest(id, card) {
  if (!confirm("Cancel this request?")) return;

  try {
    await apiFetch(ENDPOINTS.REQUESTS.CANCEL(id), {
      method: "PUT"
    });

    toast.success("Cancelled");
    card.remove();
  } catch (err) {
    toast.error(err.message || "Cancel failed");
  }
}

/* --------------------- RATING MODAL --------------------- */

function openRatingModal(request, btn) {
  const score = prompt("Rate the worker (1-5):");

  if (!score) return;

  const rating = Number(score);

  if (rating < 1 || rating > 5) {
    toast.error("Rating must be between 1 and 5");
    return;
  }

  const comment = prompt("Optional comment:") || "";

  submitRating(request, rating, comment, btn);
}

/* --------------------- SUBMIT RATING --------------------- */

async function submitRating(request, rating, comment, btn) {
  try {
    const payload = {
      request_id: request.id,
      rater_id: request.user_id,
      ratee_id: request.assigned_worker_id,
      score: rating,
      comment,
    };

    await apiFetch(ENDPOINTS.RATINGS.ADD, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    toast.success("Rating submitted successfully!");

    // Update button after rating
    if (btn) {
      btn.className = "btn btn-secondary";
      btn.textContent = "Worker Rated";
      btn.disabled = true;
    }

  } catch (err) {
    toast.error(err.message || "Failed to submit rating");
  }
}
