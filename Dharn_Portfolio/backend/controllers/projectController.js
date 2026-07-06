const asyncHandler = require('../utils/asyncHandler')
const {successResponse} = require('../utils/apiResponse')
const {getProjects, getFeaturedProjects} = require('../services/projectService')

cons
const fetchProjects = asyncHandler(async(req, res)=>{
    const projects = await getProjects();
    successResponse(res, projects, "projects retrieved successfully")
})

const fetchFeaturedProjects = asyncHandler(async(req, res)=>{
    const projects = await getFeaturedProjects();

    successResponse(res, projects, "Featured projects are fetched")
})

module.exports = {fetchProjects,fetchFeaturedProjects}