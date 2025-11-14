import { query } from "../config/db.js";

// tokens table is used for email verification, password resets, etc.
export const saveToken = async ({ user_id = null, worker_id = null, token, type, expires_at }) => {
  const [res] = await query(
    "INSERT INTO tokens (user_id, worker_id, token, type, expires_at) VALUES (?, ?, ?, ?, ?)",
    [user_id, worker_id, token, type, expires_at]
  );
  return res.insertId;
};

export const findToken = async (token) => {
  const [rows] = await query("SELECT * FROM tokens WHERE token = ?", [token]);
  return rows[0];
};

export const deleteTokenById = async (id) => {
  await query("DELETE FROM tokens WHERE id = ?", [id]);
};
