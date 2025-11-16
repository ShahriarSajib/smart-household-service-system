import { ENDPOINTS } from "../../config/api.js";
import { apiFetch } from "../../utils/api-client.js";
//import { requireAuth } from "../../utils/auth.js";
import { toast } from "../../utils/toast.js";
import { isRequired, minLength } from "../../utils/validation.js";

//requireAuth("user");

const form = document.getElementById("requestForm");
const gpsBtn = document.getElementById("gpsBtn");
const msg = document.getElementById("message");

// GPS (same method as register-worker)
gpsBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    toast.error("Geolocation not supported by browser");
    return;
  }

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

  const category = form.elements["category"].value.trim();
  const description = form.elements["description"].value.trim();
  const locationText = form.elements["location"].value.trim();
  const latitude = form.elements["latitude"].value.trim() || null;
  const longitude = form.elements["longitude"].value.trim() || null;

  if (!isRequired(category)) return toast.error("Select category");
  if (!minLength(description, 5)) return toast.error("Add more details");
  if (!isRequired(locationText)) return toast.error("Location required");

  try {
    const payload = {
      category,
      description,
      location: locationText,
      latitude,
      longitude,
    };

    const res = await apiFetch(ENDPOINTS.REQUESTS.CREATE, {
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
