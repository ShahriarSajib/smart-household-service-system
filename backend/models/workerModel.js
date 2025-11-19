import { query } from "../config/db.js";

export const findWorkerByEmail = async (email) => {
  const [rows] = await query("SELECT * FROM workers WHERE email = ?", [email]);
  return rows[0];
};

export const findWorkerById = async (id) => {
  const [rows] = await query("SELECT * FROM workers WHERE id = ?", [id]);
  return rows[0];
};
