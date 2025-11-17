import { query } from "../config/db.js";
import { error, success } from "../utils/responseHelper.js";

// Get all pending workers (availability = 'Offline')
export const getPendingWorkers = async (req, res) => {
  try {
    const [rows] = await query(
      "SELECT id, name, email, skill_category, location, availability FROM workers WHERE availability = 'Offline'"
    );
    res.json({ data: rows }); // wrap in data
  } catch (err) {
    console.error("getPendingWorkers error:", err);
    res.status(500).json(error(err.message));
  }
};

// Approve a worker (make them Available + log admin action)
export const approveWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const [worker] = await query("SELECT * FROM workers WHERE id = ?", [id]);
    if (!worker.length)
      return res.status(404).json(error("Worker not found"));

    await query("UPDATE workers SET availability = 'Available' WHERE id = ?", [id]);

    await query(
      "INSERT INTO admin_logs (admin_id, action_type, description) VALUES (?, ?, ?)",
      [adminId, "approve_worker", `Approved worker id=${id}`]
    );

    res.json(success("Worker approved successfully"));
  } catch (err) {
    console.error("approveWorker error:", err);
    res.status(500).json(error(err.message));
  }
};

// Get all service requests
export const getWorkRequests = async (req, res) => {
  try {
    const [rows] = await query(
      `SELECT r.id, r.user_id, r.category, r.description, r.location, r.status,
              r.assigned_worker_id, r.service_type_id, r.created_at,
              u.name AS user_name
       FROM service_requests r
       JOIN users u ON u.id = r.user_id`
    );
    res.json({ data: rows }); // wrap in data
  } catch (err) {
    console.error("getWorkRequests error:", err);
    res.status(500).json(error(err.message));
  }
};

// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id; // <-- req.user must exist
    if (!adminId) return res.status(401).json({ data: null, message: "Unauthorized" });

    const [rows] = await query(
      "SELECT id, name, email FROM users WHERE id = ? AND role='admin'",
      [adminId]
    );

    if (!rows.length) return res.status(404).json({ data: null, message: "Admin not found" });

    res.json({ data: rows[0] }); // must wrap in `data`
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update admin profile
export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { name, email, password } = req.body;

    const updates = [];
    const params = [];

    if (name) {
      updates.push("name = ?");
      params.push(name);
    }
    if (email) {
      updates.push("email = ?");
      params.push(email);
    }
    if (password) {
      const bcrypt = await import("bcrypt");
      const hash = await bcrypt.hash(password, 10);
      updates.push("password_hash = ?");
      params.push(hash);
    }

    if (!updates.length) return res.status(400).json({ error: "No updates provided" });

    params.push(adminId);

    const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ? AND role='admin'`;
    await query(sql, params);

    // Return updated profile
    const [rows] = await query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [adminId]
    );

    res.json({ data: rows[0], message: "Profile updated successfully" });
  } catch (err) {
    console.error("updateAdminProfile error:", err);
    res.status(500).json({ error: err.message });
  }
};
