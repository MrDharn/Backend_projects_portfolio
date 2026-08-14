const {getProjects, getFeaturedProjects, createProject, deleteProject, updateProject, incrementDownloadCount} = require('../services/projectService')

const fetchProjects = async(req, res)=> {
    try{
        const projects = await getProjects();
        res.status(200).json({
            status: "success",
            message: "projects fetched",
            data: projects
        })
    }catch(e){
        res.status(500).json({
            status: "failed",
            message: e.message || "Server Error"
        })
    }
}

const fetchFeaturedProjects = async(req, res)=> {
    try{
        const featuredProjects = await getFeaturedProjects()
        if(featuredProjects.length === 0){
            return res.status(404).json({
                status: "failed",
                message: "featured projects Not Found",
            })
        }

        res.status(200).json({
            status: "success",
            message: "featured projects fetched",
            featuredProjects
        })
    }catch(e){
        res.status(500).json({
            status: "failed",
            message: e.message || "Server Error"
        })
    }
}

//ADD PROJECT

const addProject = async(req, res)=>{
    try{
        const project = await createProject(req.body)
    }catch(e){
        res.status(500).json({
            status: "failed",
            message: e.message || "Validation Error"
        })
    }
}

const removeProject = async(req, res)=>{
    try{
        const deletedProject = await deleteProject(req.params.id)
        if(!deletedProject){
            return res.status(404).json({
                status: "failed",
                message: "No Project as Such"
            })
        }

        res.status(200).json({
            status: "success",
            message: "Project Deleted",
        })
    }catch(e){
        res.status(500).json({
            status: "failed",
            message: e.message || "Server Error"
        })
    }
}

const editProject = async(req, res)=>{
    try{    
        const project = await updateProject(req.params.id, req.body)

        if(!project) return res.status(404).json({
            status: "failed",
            message: "Such project does not exist"
        })

        return res.status(200).json({
            status: "success",
            message: "Project updated successfull",
            data: project
        })
    }catch(e){
        res.status(500).json({
            status: "failed",
            message: e.message || "Server error"
        })
    }
}

const trackProjectDownload = async(req, res)=>{
    try{    
        const project = await incrementDownloadCount(req.params.id)
        if(!project) return res.status(404).json({
            status: "failed",
            message: "Project Not Found"
        })

        res.status(200).json({
            status: "Success",
            message: "Download count updated",
            downloadCount: project.downloadCount
        })
    }catch(e){
        res.status(500).json({
            status: "failed",
            message: e.message || "Server error"
        })  
      }
}

module.exports = {fetchProjects, fetchFeaturedProjects, addProject, removeProject, editProject, trackProjectDownload}