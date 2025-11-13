import { query } from "../config/db.js";

export const addRatingToDB = async (rating) => {
  await query(
    "INSERT INTO ratings (request_id, rater_id, ratee_id, score, comment) VALUES (?, ?, ?, ?, ?)",
    [rating.request_id, rating.rater_id, rating.ratee_id, rating.score, rating.comment || null]
  );
};
