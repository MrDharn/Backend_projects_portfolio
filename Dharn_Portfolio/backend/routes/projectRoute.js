const express = require("express");
const projectRoute = express.Router();
const {
  fetchProjects,
  fetchFeaturedProjects,
  addProject,
  removeProject,
  editProject,
  trackProjectDownload,
} = require("../controllers/projectController");

const adminAuth = require("../middlewares/AdminAuth");

projectRoute.route("/").get(fetchProjects);
projectRoute.route("/feature").get(fetchFeaturedProjects);
projectRoute.route("/:id/download").get(trackProjectDownload);

//FOR ADMIN

projectRoute.route("/project").post(adminAuth, addProject);

projectRoute.route("/project/:id").patch(adminAuth, editProject);

projectRoute.route("/project/:id").delete(adminAuth, removeProject);
module.exports = projectRoute;
