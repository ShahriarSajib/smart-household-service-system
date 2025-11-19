import { apiFetch } from "../../utils/api-client.js";
import { ENDPOINTS } from "../../config/api.js";
import { getUser, saveUser } from "../../utils/storage.js";
import renderNavbarInto from "../../components/navbar.js";
import { toast } from "../../utils/toast.js";
import { requireAuth } from "../../utils/auth.js";

requireAuth("worker");
renderNavbarInto("navbar-dynamic");

const worker = getUser();

const form = document.getElementById("workerProfileForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const skillInput = document.getElementById("skill_category");
const picInput = document.getElementById("profilePic");
const submitBtn = document.getElementById("submitBtn");

// LOAD PROFILE
async function loadProfile() {
  try {
    const res = await apiFetch(ENDPOINTS.WORKERS.GET_PROFILE(worker.id));

    nameInput.value = res.data.name;
    emailInput.value = res.data.email;
    skillInput.value = res.skill_category || "";

     if (res.data.profilePic) {
      profileImg.src = res.data.profilePic;
    } else {
      profileImg.src = "/assets/img/default-avatar.png"; // fallback avatar
    }
  } catch (err) {
    toast.error("Failed to load profile");
  }
}

loadProfile();

// UPDATE PROFILE
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.textContent = "Updating...";

  const formData = new FormData();
  formData.append("name", nameInput.value);
  formData.append("email", emailInput.value);
  formData.append("skill_category", skillInput.value);

  if (picInput.files.length > 0) {
    formData.append("profilePic", picInput.files[0]);
  }

  try {
    const res = await fetch(
      `http://localhost:5000/api${ENDPOINTS.WORKERS.UPDATE_PROFILE(worker.id)}`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("fixmate_token"),
        },
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    // UPDATE LOCAL USER
    worker.name = nameInput.value;
    worker.email = emailInput.value;
    saveUser(worker);

    toast.success("Profile updated!");
    loadProfile(); // reload new picture

  } catch (err) {
    toast.error(err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Update Profile";
  }
});
