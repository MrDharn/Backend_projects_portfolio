const express = require('express')
const profileRoute = express.Router();
const authenticationMiddleware = require('../middlewares/authMiddleware')
const getProfileDetails = require("../controllers/profileController")

profileRoute.route('/profile').get(authenticationMiddleware, getProfileDetails)

module.exports = profileRoute