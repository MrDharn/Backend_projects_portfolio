const express = require('express')
const githubRoute = express.Router();

const fetchGithubRepos = require('../controllers/githubController')

githubRoute.route('/').get(fetchGithubRepos)

module.exports = githubRoute