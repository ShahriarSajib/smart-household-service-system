import { ENDPOINTS } from "../../config/api.js";
import { CATEGORIES } from "../../config/categories.js";
import { apiFetch } from "../../utils/api-client.js";
import { toast } from "../../utils/toast.js";
import { isRequired, minLength } from "../../utils/validation.js";

const form = document.getElementById("requestForm");
const gpsBtn = document.getElementById("gpsBtn");
const msg = document.getElementById("message");
const categorySelect = document.getElementById("categorySelect");

// Populate categories from config file
CATEGORIES.forEach(cat => {
  const option = document.createElement("option");
  option.value = cat;
  option.textContent = cat;
  categorySelect.appendChild(option);
});

// GPS button
gpsBtn.addEventListener("click", () => {
  if (!navigator.geolocation) return toast.error("Geolocation not supported");

  gpsBtn.disabled = true;
  gpsBtn.textContent = "Locating...";

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      form.elements["latitude"].value = pos.coords.latitude;
      form.elements["longitude"].value = pos.coords.longitude;
      gpsBtn.textContent = "Use GPS";
      gpsBtn.disabled = false;
      toast.success("Location filled");
    },
    () => {
      gpsBtn.textContent = "Use GPS";
      gpsBtn.disabled = false;
      toast.error("Unable to get location");
    },
    { timeout: 10000 }
  );
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";

  const category = form.elements["category"].value;
  const description = form.elements["description"].value.trim();
  const locationText = form.elements["location"].value.trim();
  const latitude = form.elements["latitude"].value.trim() || null;
  const longitude = form.elements["longitude"].value.trim() || null;

  if (!isRequired(category)) return toast.error("Select category");
  if (!minLength(description, 5)) return toast.error("Add more details");
  if (!isRequired(locationText)) return toast.error("Location required");

  try {
    const payload = { category, description, location: locationText, latitude, longitude };

    await apiFetch(ENDPOINTS.REQUESTS.CREATE, {
      method: "POST",
      body: payload,
    });

    toast.success("Request created!");

    setTimeout(
      () => (window.location.href = "/pages/user/my-requests.html"),
      1200
    );
  } catch (err) {
    msg.textContent = err.message;
    toast.error(err.message);
  }
});
