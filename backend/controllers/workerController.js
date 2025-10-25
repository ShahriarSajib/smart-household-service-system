import { query } from "../config/db.js";

// ✅ Get worker profile
export const getWorkerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const [worker] = await query("SELECT * FROM workers WHERE id = ?", [id]);

    if (!worker.length)
      return res.status(404).json({ message: "Worker not found" });

    res.json(worker[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update worker availability
export const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { availability } = req.body;

    if (!["Available", "Busy", "Offline"].includes(availability))
      return res.status(400).json({ message: "Invalid availability status" });

    await query("UPDATE workers SET availability = ? WHERE id = ?", [
      availability,
      id,
    ]);

    res.json({ message: `Worker status updated to ${availability}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get assigned service requests
export const getWorkerRequests = async (req, res) => {
  try {
    const { id } = req.params;

    const [requests] = await query(
      `SELECT sr.*, u.name AS user_name, u.email AS user_email
       FROM service_requests sr
       JOIN users u ON sr.user_id = u.id
       WHERE sr.assigned_worker_id = ?
       ORDER BY sr.created_at DESC`,
      [id]
    );

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get worker ratings
export const getWorkerRatings = async (req, res) => {
  try {
    const { id } = req.params;
    const [ratings] = await query(
      `SELECT r.score, r.comment, r.created_at, u.name AS rated_by
       FROM ratings r
       JOIN users u ON r.rater_id = u.id
       WHERE r.ratee_id = ?
       ORDER BY r.created_at DESC`,
      [id]
    );

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
