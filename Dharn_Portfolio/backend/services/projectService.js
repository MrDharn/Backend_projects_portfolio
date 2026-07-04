const projectModel = require('../models/projectModel')

const getProjects = async()=>{
    return await projectModel.find({}).sort({order: 1})
}

const getFeaturedProjects = async()=>{
    return await projectModel.find({featured: true}).sort({order: 1})
}

module.exports = {getProjects, getFeaturedProjects}