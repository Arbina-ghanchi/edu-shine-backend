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

// Enhanced colors for better console output
const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",

  // Background colors
  bgRed: "\x1b[41m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgGreen: "\x1b[42m",
  bgMagenta: "\x1b[45m",

  // Text colors
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
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
    return new Date().toLocaleString(); // More readable format
  }

  getColorForLevel(level) {
    switch (level) {
      case LOG_LEVELS.ERROR:
        return { bg: COLORS.bgRed, text: COLORS.white, label: "🔴 ERROR" };
      case LOG_LEVELS.WARN:
        return { bg: COLORS.bgYellow, text: COLORS.white, label: "🟡 WARN" };
      case LOG_LEVELS.INFO:
        return { bg: COLORS.bgBlue, text: COLORS.white, label: "🔵 INFO" };
      case LOG_LEVELS.DEBUG:
        return { bg: COLORS.bgMagenta, text: COLORS.white, label: "🟣 DEBUG" };
      case LOG_LEVELS.HTTP:
        return { bg: COLORS.bgGreen, text: COLORS.white, label: "🌐 HTTP" };
      default:
        return { bg: "", text: COLORS.white, label: level };
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

  formatConsoleOutput(level, message, data = null) {
    const timestamp = this.getTimestamp();
    const colors = this.getColorForLevel(level);

    // Format the level badge
    const levelBadge = `${colors.bg}${colors.text}${COLORS.bright} ${colors.label} ${COLORS.reset}`;

    // Format timestamp
    const timeFormatted = `${COLORS.dim}${timestamp}${COLORS.reset}`;

    // Format message
    const messageFormatted = `${COLORS.bright}${message}${COLORS.reset}`;

    // Main log line
    console.log(`${levelBadge} ${timeFormatted} - ${messageFormatted}`);

    // Additional data if present
    if (data) {
      const dataColor = level === LOG_LEVELS.ERROR ? COLORS.red : COLORS.cyan;
      console.log(`${COLORS.dim}↳ Data:${COLORS.reset}`);
      console.log(
        `${dataColor}${JSON.stringify(data, null, 2)}${COLORS.reset}`
      );
    }
  }

  log(level, message, data = null) {
    // Console output
    this.formatConsoleOutput(level, message, data);

    // File output
    this.writeToFile(level, message, data);
  }

  error(message, error = null) {
    const errorData = error
      ? {
          message: error.message,
          stack: error.stack,
          ...(error.code && { code: error.code }),
        }
      : null;
    this.log(LOG_LEVELS.ERROR, message, errorData);
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
