const getGithubRepos = require('../services/githubService')

const fetchGithubRepos = async(req, res)=>{
    try{
        const repos = await getGithubRepos()
        if(!repos) return res.status(404).json({
            status:"failed",
            message: "repo is not found"
        })

        res.status(200).json({
            status:"success",
            message: "Repos Fetched successfully",
            data: repos
        })
    }catch(e){  
        res.status(500).json({
            status: "failed",
            message: e.message || "Server Error"
        })
    }
}

module.exports = fetchGithubRepos