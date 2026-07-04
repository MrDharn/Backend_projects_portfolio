const mongoose = require("mongoose");
const visitorSchema = new mongoose.Schema(
  {
    ipHash: String,

    browser: String,

    os: String,

    page: String,

    visitedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Visitor", visitorSchema);
