const express = require('express')
const projectRoute = express.Router();
const {fetchProjects, fetchFeaturedProjects} = require('../controllers/projectController')

projectRoute.route('/').get(fetchProjects)
projectRoute.route('/feature').get(fetchFeaturedProjects)

module.exports = projectRoute