// utils/logger.js
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, json, colorize, printf } = format;
const Transport = require("winston-transport");

// Imported Models
const AuditLogModel = require("../Models/AuditLog");
const FraudLogModel = require("../Models/FraudLog"); // Fixed: Added missing import

// Console layout for clean local debugging
const devFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
  return `[${timestamp}] ${level}: ${message} ${metaStr}`;
});

// Custom Winston Transport for Audit Logs
class MongoAuditTransport extends Transport {
  constructor(opts) {
    super(opts);
  }

  async log(info, callback) {
    try {
      // Fixed: Using AuditLogModel instead of Web Audio API's AudioBuffer
      const logEntry = new AuditLogModel({
        userId: info.userId || null,
        action: info.message,
        ip_address: info.ipAddress || "unknown",
        deviceInfo: info.deviceInfo || "unknown",
      });

      await logEntry.save();
    } catch (e) {
      console.error("Failed to save audit log to DB:", e);
    }

    callback();
  }
}

// Custom Winston Transport for Fraud Logs
class MongoFraudTransport extends Transport {
  constructor(opts) {
    super(opts);
  }

  async log(info, callback) {
    try {
      const fraudEntry = new FraudLogModel({
        userId: info.userId || null,
        transactionId: info.transactionId || null,
        reason: info.message,
        status: info.status || "INVESTIGATING",
      });

      await fraudEntry.save();
    } catch (e) {
      console.error("Failed to save fraud log to DB:", e);
    }

    callback();
  }
}

// 1. Audit Logger Configuration
const auditLogger = createLogger({
  level: "info",
  format: combine(timestamp(), json()),
  transports: [
    new transports.File({ filename: "logs/audit.log" }),
    new MongoAuditTransport(),
  ],
});

// 2. Fraud Logger Configuration
const fraudLogger = createLogger({
  level: "warn",
  format: combine(timestamp(), json()),
  transports: [
    new transports.File({ filename: "logs/fraud.log" }),
    new MongoFraudTransport(), // Fixed: Added MongoFraudTransport here
  ],
});

// Stream both to console during local development
if (process.env.NODE_ENV !== "production") {
  const consoleTransport = new transports.Console({
    format: combine(colorize(), devFormat),
  });
  auditLogger.add(consoleTransport);
  fraudLogger.add(consoleTransport);
}

module.exports = { auditLogger, fraudLogger };