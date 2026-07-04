const asyncHandler = require('../utils/asyncHandler')
const {successResponse} = require("../utils/apiResponse")
const getGithubRepos = require('../services/githubService')

const fetchGithubRepos = asyncHandler(async(req, res)=>{
    const repos = await getGithubRepos()

    successResponse(res, repos)
})

module.exports = fetchGithubRepos