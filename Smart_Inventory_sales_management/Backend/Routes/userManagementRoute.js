const express = require("express");
const userManagementRoute = express.Router();
const {
  getSingleUserProfile,
  getUsersProfile,
  deleteUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
//call authMiddleware
const authMiddleware = require("../Middlewares/authMiddleware");
const userManagementMiddleware = require("../Middlewares/userManagementMiddleware");

userManagementRoute.route("/").get(authMiddleware, userManagementMiddleware,getUsersProfile);
userManagementRoute.route("/:id").get(authMiddleware, userManagementMiddleware,getSingleUserProfile);
userManagementRoute.route("/:id").patch(authMiddleware, userManagementMiddleware,updateUserProfile);
userManagementRoute.route("/:id").delete(authMiddleware, userManagementMiddleware,deleteUserProfile);


module.exports = userManagementRoute