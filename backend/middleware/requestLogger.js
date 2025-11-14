import logger from '../utils/logger.js';

const requestLogger = (req, res, next) => {
  // Log after response is sent to capture status code
  res.on('finish', () => {
    logger.info({
      message: 'Incoming API Request',
      method: req.method,
      route: req.originalUrl,
      status: res.statusCode,
      body: req.body,
      query: req.query
    });
  });
  next();
};

export default requestLogger;
