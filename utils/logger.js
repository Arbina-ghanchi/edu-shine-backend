const fs = require("fs");
const path = require("path");
const { Writable } = require("stream");

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// -------- Log Levels --------
const LOG_LEVELS = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
  HTTP: "HTTP",
};

// -------- Colors (for console only) --------
const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

// -------- Daily Rotating File Stream --------
class RotatingFileStream extends Writable {
  constructor(baseName) {
    super({ objectMode: true });
    this.baseName = baseName;
    this.currentDate = this._getDateString();
    this.stream = this._createStream();
  }

  _getDateString() {
    return new Date().toISOString().split("T")[0];
  }

  _createStream() {
    const filePath = path.join(
      logsDir,
      `${this.baseName}-${this.currentDate}.log`
    );
    return fs.createWriteStream(filePath, { flags: "a" });
  }

  _rotateIfNeeded() {
    const today = this._getDateString();
    if (today !== this.currentDate) {
      this.stream.end();
      this.currentDate = today;
      this.stream = this._createStream();
    }
  }

  _write(logEntry, _, callback) {
    this._rotateIfNeeded();
    this.stream.write(JSON.stringify(logEntry) + "\n", callback);
  }
}

// -------- Logger Class --------
class Logger {
  constructor() {
    this.fileStream = new RotatingFileStream("app");
  }

  getTimestamp() {
    return new Date().toISOString(); // strict ISO for files
  }

  getColorForLevel(level) {
    switch (level) {
      case LOG_LEVELS.ERROR:
        return { color: COLORS.red, label: "🔴 ERROR" };
      case LOG_LEVELS.WARN:
        return { color: COLORS.yellow, label: "🟡 WARN" };
      case LOG_LEVELS.INFO:
        return { color: COLORS.blue, label: "🔵 INFO" };
      case LOG_LEVELS.DEBUG:
        return { color: COLORS.magenta, label: "🟣 DEBUG" };
      case LOG_LEVELS.HTTP:
        return { color: COLORS.green, label: "🌐 HTTP" };
      default:
        return { color: COLORS.white, label: level };
    }
  }

  log(level, message, data = null) {
    const timestamp = this.getTimestamp();
    const logEntry = { timestamp, level, message, data };

    // ---- File Output (JSON) ----
    this.fileStream.write(logEntry);

    // ---- Console Output (pretty) ----
    const { color, label } = this.getColorForLevel(level);
    const baseLine = `${COLORS.dim}${timestamp}${COLORS.reset} ${color}${label}${COLORS.reset} - ${COLORS.bright}${message}${COLORS.reset}`;
    console.log(baseLine);

    if (data) {
      const dataColor = level === LOG_LEVELS.ERROR ? COLORS.red : COLORS.cyan;
      console.log(
        `${COLORS.dim}↳ Data:${COLORS.reset} ${dataColor}${JSON.stringify(
          data,
          null,
          2
        )}${COLORS.reset}`
      );
    }
  }

  error(message, error = null) {
    const errorData = error
      ? { message: error.message, stack: error.stack, code: error.code }
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
    if (process.env.NODE_ENV !== "production") {
      this.log(LOG_LEVELS.DEBUG, message, data);
    }
  }

  http(message, data = null) {
    this.log(LOG_LEVELS.HTTP, message, data);
  }
}

// Singleton instance
module.exports = new Logger();
