import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  // Log to error.log
  logger.error({
    message: err.message || "Server Error",
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
    body: req.body,
    query: req.query,
  });

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
