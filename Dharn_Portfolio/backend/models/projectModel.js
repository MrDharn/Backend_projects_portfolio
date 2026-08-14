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
      default: "",
    },
    demo: {
      type: String,
      trim: true,
      default: "",
    },
    featured: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 1,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);