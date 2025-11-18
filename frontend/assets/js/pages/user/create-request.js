import { createNearbyWorkerCard } from "../../components/workerCard.js";
import { ENDPOINTS } from "../../config/api.js";
import { CATEGORIES } from "../../config/categories.js";
import { apiFetch } from "../../utils/api-client.js";
import { getUser } from "../../utils/storage.js";
import { toast } from "../../utils/toast.js";

// DOM
const form = document.getElementById("requestForm");
const gpsBtn = document.getElementById("gpsBtn");
const findNearbyBtn = document.getElementById("findNearbyBtn");
const msg = document.getElementById("message");
const categorySelect = document.getElementById("categorySelect");
const nearbyArea = document.getElementById("nearbyArea");
const nearbyList = document.getElementById("nearbyList");
const selectedWorkerInput = document.getElementById("selectedWorkerId");
const clearSelectionBtn = document.getElementById("clearSelection");
const latitudeInput = document.getElementById("latitudeInput");
const longitudeInput = document.getElementById("longitudeInput");
const locationInput = document.getElementById("locationInput");

// Require login
const user = getUser();
if (!user) window.location.href = "/pages/auth/login.html";

// Populate category dropdown
CATEGORIES.forEach(cat => {
  const option = document.createElement("option");
  option.value = cat;
  option.textContent = cat;
  categorySelect.appendChild(option);
});

// Clear selection
clearSelectionBtn.addEventListener("click", () => {
  selectedWorkerInput.value = "";
  clearSelectionBtn.style.display = "none";
  Array.from(nearbyList.children).forEach(card => (card.style.border = "none"));
  toast.info("Selection cleared");
});

// GPS button
gpsBtn.addEventListener("click", () => {
  if (!navigator.geolocation) return toast.error("Geolocation not supported");

  gpsBtn.disabled = true;
  gpsBtn.textContent = "Locating...";

  navigator.geolocation.getCurrentPosition(
    pos => {
      latitudeInput.value = pos.coords.latitude;
      longitudeInput.value = pos.coords.longitude;
      gpsBtn.textContent = "Use GPS";
      gpsBtn.disabled = false;
    },
    err => {
      gpsBtn.textContent = "Use GPS";
      gpsBtn.disabled = false;
      toast.error("Unable to fetch location");
    }
  );
});

// Find nearby workers
findNearbyBtn.addEventListener("click", async () => {
  msg.textContent = "";
  nearbyList.innerHTML = "";
  nearbyArea.style.display = "none";
  selectedWorkerInput.value = "";
  clearSelectionBtn.style.display = "none";

  const lat = latitudeInput.value.trim();
  const lng = longitudeInput.value.trim();
  const category = categorySelect.value.trim();

  if (!lat || !lng) return toast.error("Latitude/Longitude required");
  if (!category) return toast.error("Select category first");

  findNearbyBtn.disabled = true;
  findNearbyBtn.textContent = "Searching...";

  try {
    const url = `${ENDPOINTS.WORKERS.GET_NEARBY}?lat=${lat}&lng=${lng}&radius=5`;
    const workers = await apiFetch(url, { method: "GET" });

    // Filter both by category & availability
    const filtered = workers.filter(
      w =>
        w.skill_category?.toLowerCase() === category.toLowerCase() &&
        w.availability === "Available"
    );

    if (!filtered.length) {
      nearbyList.innerHTML = "<p>No available workers in this category nearby.</p>";
      nearbyArea.style.display = "block";
      return;
    }

    filtered.forEach(worker => {
      const card = createNearbyWorkerCard(worker, (selectedWorker, clickedCard) => {
        Array.from(nearbyList.children).forEach(c => (c.style.border = "none"));
        clickedCard.style.border = "2px solid var(--primary)";
        selectedWorkerInput.value = selectedWorker.id;
        clearSelectionBtn.style.display = "inline-block";
      });

      nearbyList.appendChild(card);
    });

    nearbyArea.style.display = "block";
  } catch (err) {
    msg.textContent = err.message || "Failed to load workers";
    toast.error(err.message);
  } finally {
    findNearbyBtn.disabled = false;
    findNearbyBtn.textContent = "Find Nearby Workers";
  }
});

// Submit
form.addEventListener("submit", async e => {
  e.preventDefault();

  const payload = {
    category: categorySelect.value,
    description: form.description.value.trim(),
    location: locationInput.value.trim(),
    latitude: latitudeInput.value.trim(),
    longitude: longitudeInput.value.trim(),
  };

  if (selectedWorkerInput.value)
    payload.selected_worker_id = selectedWorkerInput.value;

  try {
    await apiFetch(ENDPOINTS.REQUESTS.CREATE, { method: "POST", body: payload });
    toast.success("Request created");

    setTimeout(() => {
      window.location.href = "/pages/user/my-requests.html";
    }, 900);
  } catch (err) {
    msg.textContent = err.message;
    toast.error(err.message);
  }
});
