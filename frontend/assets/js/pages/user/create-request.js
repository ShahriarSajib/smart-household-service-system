import { ENDPOINTS } from "../../config/api.js";
import { apiFetch } from "../../utils/api-client.js";
import { requireAuth } from "../../utils/auth.js";
import { toast } from "../../utils/toast.js";
import { isRequired, minLength } from "../../utils/validation.js";

requireAuth("user");

const form = document.getElementById("requestForm");
const gpsBtn = document.getElementById("gpsBtn");
const msg = document.getElementById("message");

let lat = null, lng = null;

// GPS
gpsBtn.addEventListener("click", () => {
  if (!navigator.geolocation) return toast.error("GPS not supported");

  gpsBtn.disabled = true;
  gpsBtn.textContent = "Getting location...";

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
      toast.success("GPS location added");
      gpsBtn.textContent = "Use GPS";
      gpsBtn.disabled = false;
    },
    () => {
      toast.error("Failed to get location");
      gpsBtn.textContent = "Use GPS";
      gpsBtn.disabled = false;
    }
  );
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";

  const category = form.category.value.trim();
  const description = form.description.value.trim();
  const location = form.location.value.trim();

  if (!isRequired(category)) return toast.error("Select category");
  if (!minLength(description, 5)) return toast.error("Add more details");
  if (!isRequired(location)) return toast.error("Location required");

  try {
    const payload = {
      category,
      description,
      location,
      latitude: lat,
      longitude: lng
    };

    const res = await apiFetch(ENDPOINTS.REQUESTS.CREATE, {
      method: "POST",
      body: payload
    });

    toast.success("Request created!");
    setTimeout(() => location.href = "/pages/user/my-requests.html", 1200);
  } catch (err) {
    msg.textContent = err.message;
    toast.error(err.message);
  }
});
