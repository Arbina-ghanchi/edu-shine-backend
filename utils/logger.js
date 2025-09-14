// utils/logger.js
const fs = require("fs");
const path = require("path");

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
  HTTP: "HTTP",
};

// Colors for console output
const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

class Logger {
  constructor() {
    this.logFile = path.join(
      logsDir,
      `app-${new Date().toISOString().split("T")[0]}.log`
    );
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  getColorForLevel(level) {
    switch (level) {
      case LOG_LEVELS.ERROR:
        return COLORS.red;
      case LOG_LEVELS.WARN:
        return COLORS.yellow;
      case LOG_LEVELS.INFO:
        return COLORS.green;
      case LOG_LEVELS.DEBUG:
        return COLORS.blue;
      case LOG_LEVELS.HTTP:
        return COLORS.magenta;
      default:
        return COLORS.white;
    }
  }

  writeToFile(level, message, data = null) {
    const logEntry = {
      timestamp: this.getTimestamp(),
      level,
      message,
      data: data || undefined,
    };

    const logString = JSON.stringify(logEntry) + "\n";

    fs.appendFile(this.logFile, logString, (err) => {
      if (err) {
        console.error("Failed to write to log file:", err);
      }
    });
  }

  log(level, message, data = null) {
    const timestamp = this.getTimestamp();
    const color = this.getColorForLevel(level);

    // File output
    this.writeToFile(level, message, data);
  }

  error(message, error = null) {
    this.log(LOG_LEVELS.ERROR, message, error);
  }

  warn(message, data = null) {
    this.log(LOG_LEVELS.WARN, message, data);
  }

  info(message, data = null) {
    this.log(LOG_LEVELS.INFO, message, data);
  }

  debug(message, data = null) {
    if (process.env.NODE_ENV === "development") {
      this.log(LOG_LEVELS.DEBUG, message, data);
    }
  }

  http(message, data = null) {
    this.log(LOG_LEVELS.HTTP, message, data);
  }
}

// Create a singleton instance
const logger = new Logger();
module.exports = logger;
