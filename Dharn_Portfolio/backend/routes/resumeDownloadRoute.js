const express = require('express')
const resumeRoute = express.Router();

const downloadResume  = require('../controllers/resumeController')

resumeRoute.route('/').get(downloadResume)

module.exports = resumeRoute