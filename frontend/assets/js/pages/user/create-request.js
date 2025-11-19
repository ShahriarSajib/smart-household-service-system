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

// Image upload
const fileInput = document.getElementById("imageInput");
const previewImg = document.getElementById("previewImg");
let base64Image = null;

// Require login
const user = getUser();
if (!user) window.location.href = "/pages/auth/login.html";

// Populate categories
CATEGORIES.forEach(cat => {
  const opt = document.createElement("option");
  opt.value = cat;
  opt.textContent = cat;
  categorySelect.appendChild(opt);
});

// File → Base64
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    base64Image = reader.result;   // FULL base64 string
    previewImg.src = base64Image;
    previewImg.style.display = "block";
  };
  reader.readAsDataURL(file);
});

// Clear selection
clearSelectionBtn.addEventListener("click", () => {
  selectedWorkerInput.value = "";
  clearSelectionBtn.style.display = "none";
  Array.from(nearbyList.children).forEach(card => (card.style.border = "none"));
  toast.info("Selection cleared");
});

// GPS
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
    () => {
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
    const workers = await apiFetch(url);

    const filtered = workers.filter(
      w =>
        w.skill_category?.toLowerCase() === category.toLowerCase() &&
        w.availability === "Available"
    );

    if (!filtered.length) {
      nearbyList.innerHTML = "<p>No workers available nearby.</p>";
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
    toast.error(err.message);
  } finally {
    findNearbyBtn.disabled = false;
    findNearbyBtn.textContent = "Find Nearby Workers";
  }
});

// FORM SUBMIT
form.addEventListener("submit", async e => {
  e.preventDefault();

  const payload = {
    category: categorySelect.value,
    description: form.description.value.trim(),
    location: locationInput.value.trim(),
    latitude: latitudeInput.value.trim(),
    longitude: longitudeInput.value.trim(),
    problem_pic: base64Image || null  // include base64 string
  };

  if (selectedWorkerInput.value)
    payload.selected_worker_id = selectedWorkerInput.value;

  try {
    await apiFetch(ENDPOINTS.REQUESTS.CREATE, {
      method: "POST",
      body: payload
    });

    toast.success("Request created successfully");

    setTimeout(() => {
      window.location.href = "/pages/user/my-requests.html";
    }, 900);
  } catch (err) {
    msg.textContent = err.message;
    toast.error(err.message);
  }
});
