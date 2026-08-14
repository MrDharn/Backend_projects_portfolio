const projectModel = require('../models/projectModel')

const getProjects = async()=>{
    return await projectModel.find({}).sort({order: 1})
}

const getFeaturedProjects = async()=>{
    return await projectModel.find({featured: true}).sort({order: 1})
}

const createProject = async(req, res)=> {
    return await projectModel.create(data);
}

const updateProject = async(id, data)=>{
    return await projectModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    })
}

const deleteProject = async(id)=>{
    return await projectModel.findByIdAndDelete(id)
}

const incrementDownloadCount = async(id)=>{
    return await projectModel.findByIdAndUpdate(id, {$inc: {downloadCount: 1}}, {new: true})
}


module.exports = {getProjects, getFeaturedProjects, deleteProject, incrementDownloadCount, updateProject, createProject}