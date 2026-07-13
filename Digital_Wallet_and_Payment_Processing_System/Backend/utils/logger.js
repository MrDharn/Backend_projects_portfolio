// utils/logger.js
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, json, colorize, printf } = format;
const Transport = require("winston-transport");
const AuditLogModel = require("../Models/AuditLog");
// Console layout for clean local debugging
const devFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
  return `[${timestamp}] ${level}: ${message} ${metaStr}`;
});

//Define custom winston transport
class MongoAuditTransport extends Transport {
  constructor(opts) {
    super(opts);
  }
  async log(info, callback) {
    setTimeout(() => this.emit("logged", info));
    try {
      const logEntry = new AudioBuffer({
        userId: info.userId || null,
        action: info.message, 
        ip_address: info.ipAddress || "unknown",
        deviceInfo: info.deviceInfo || "unknown",
      });
  
      await logEntry.save()
    } catch (e) {
      console.error("Failed to save audit", e);
    }
  
    callback();
  }
}


class MongoFraudTransport extends Transport{
    constructor(opts){
        super(opts)
    }

    async log(info, callback){
        setTimeout(()=> this.emit('logged', info))

        try{
            const fraudEntry = new FraudLogModel({
                userId: info.userId || null,
                transactionId: info.transactionId || null,
                reason: info.message, // The log message string explains the fraud issue
                status: info.status || 'INVESTIGATING' // Defaults to investigating
            });

            await fraudEntry.save();

        }catch(e){
            console.error("This is error from Fraud Log", e)
        }

        callback();
    }
}

const auditLogger = createLogger({
  level: "info",
  format: combine(timestamp(), json()),
  transports: [
    new transports.File({ filename: "logs/audit.log" }),

    //Automatically add to database
    new MongoAuditTransport(),
  ],
});

// 2. Fraud Logger Configuration (Security anomalies, failed auth, threat patterns)
const fraudLogger = createLogger({
  level: "warn", // Only captures warn and error levels
  format: combine(timestamp(), json()),
  transports: [new transports.File({ filename: "logs/fraud.log" })],
});

// If we are developing locally, stream both to the console with colors
if (process.env.NODE_ENV !== "production") {
  const consoleTransport = new transports.Console({
    format: combine(colorize(), devFormat),
  });
  auditLogger.add(consoleTransport);
  fraudLogger.add(consoleTransport);
}

module.exports = { auditLogger, fraudLogger };
