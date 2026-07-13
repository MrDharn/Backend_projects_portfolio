// utils/logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json, colorize, printf } = format;

// Console layout for clean local debugging
const devFormat = printf(({ level, message, timestamp, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `[${timestamp}] ${level}: ${message} ${metaStr}`;
});

// 1. Audit Logger Configuration (Ledger, lifecycle, and compliance events)
const auditLogger = createLogger({
    level: 'info',
    format: combine(timestamp(), json()),
    transports: [
        new transports.File({ filename: 'logs/audit.log' })
    ]
});

// 2. Fraud Logger Configuration (Security anomalies, failed auth, threat patterns)
const fraudLogger = createLogger({
    level: 'warn', // Only captures warn and error levels
    format: combine(timestamp(), json()),
    transports: [
        new transports.File({ filename: 'logs/fraud.log' })
    ]
});

// If we are developing locally, stream both to the console with colors
if (process.env.NODE_ENV !== 'production') {
    const consoleTransport = new transports.Console({
        format: combine(colorize(), devFormat)
    });
    auditLogger.add(consoleTransport);
    fraudLogger.add(consoleTransport);
}

module.exports = { auditLogger, fraudLogger };