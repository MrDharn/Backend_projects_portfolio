const mongoose = require("mongoose");

const downloadLogSchema = new mongoose.Schema(
  {
    fileName: String,
    ipHash: String,
    userAgent: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("DownloadLog", downloadLogSchema);
