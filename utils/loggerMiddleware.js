// middleware/loggingMiddleware.js
const logger = require("../utils/logger");

const loggingMiddleware = (req, res, next) => {
  const start = Date.now();

  try {
    // Log incoming request
    logger.http("Incoming Request", {
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get("User-Agent") || "Unknown",
      // headers: Object.keys(req.headers || {}).length ? req.headers : undefined,
      query: Object.keys(req.query || {}).length ? req.query : undefined,
      params: Object.keys(req.params || {}).length ? req.params : undefined,
      body: Object.keys(req.body || {}).length ? req.body : undefined,
    });
  } catch (err) {
    logger.error("LoggingMiddleware - Failed to log request", {
      error: err.message,
    });
  }

  // Capture response finish
  res.on("finish", () => {
    const duration = Date.now() - start;
    try {
      logger.http("Response Sent", {
        method: req.method,
        url: req.originalUrl || req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        contentLength: res.get("Content-Length") || "0",
      });
    } catch (err) {
      logger.error("LoggingMiddleware - Failed to log response", {
        error: err.message,
      });
    }
  });

  // Capture response error
  res.on("error", (err) => {
    logger.error("Response Error", {
      method: req.method,
      url: req.originalUrl || req.url,
      error: err.message,
    });
  });

  next();
};

module.exports = loggingMiddleware;
