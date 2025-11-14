// Placeholders for service related DB helpers
import { query } from "../config/db.js";

export const createServiceRequest = async (payload) => {
  const [result] = await query(
    `INSERT INTO service_requests 
      (user_id, category, description, location, latitude, longitude, status, assigned_worker_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.user_id,
      payload.category,
      payload.description,
      payload.location,
      payload.latitude,
      payload.longitude,
      payload.status,
      payload.assigned_worker_id,
    ]
  );
  return result.insertId;
};
