const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    ipHash: {
      type: String,
      required: true,
      index: true, // Speeds up queries when searching by IP
    },
    browser: {
      type: String,
      trim: true,
    },
    os: {
      type: String,
      trim: true,
    },
    page: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Handled automatically: createdAt & updatedAt
  }
);

module.exports = mongoose.model("Visitor", visitorSchema);