const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    github: {
      type: String,
      trim: true,
    },
    demo: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 1,
    },
    // Adding a download URL to your existing Project model
    resumeUrl: {
      type: String,
      trim: true,
    },

    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Project", projectSchema);
