const {countUnreadMessages, getUnreadMessages} = require("../services/contactService")
const {incrementDownloadCount} = require('../services/projectService')
const path = require('path');
const projectModel = require("../models/projectModel")
const visitorModel = require("../models/visitorModel")

//Admin Dashboard

const getAdminDashboardData = async(req, res)=> {
    try{
        const [unreadCount, unreadMessages, totalVisitors, downloadAgg] = await Promise.all([
            countUnreadMessages(),
            getUnreadMessages(),
            visitorModel.countDocuments(),
            projectModel.aggregate([
                {$group: {_id: null, totalDownloads: {$sum: "$downloadCount"}}}
            ])
        ])

        const totalDownloads = downloadAgg[0]?.totalDownloads || 0

        return res.status(200).json({
            status: "success",
            data: {
                metrics: {
                    unreadMessages: unreadCount,
                    totalVisitors,
                    totalDownloads
                },
                pendingMessages: unreadMessages
            }
        })
    }catch(e){
        res.status(500).json({
            status: "Failed",
            message: e.message || "Server Error"
        })
    }
}


//Track number of Downloads

const downloadProjectAsset = async(req, res)=> {
    try{
        const project = await incrementDownloadCount(req.params.id);
        if(!project){
            return res.status(404).json({status: "failed", message: "project not Found"})
        }

        const filePath = path.join(process.cwd(), 'uploads', 'resume.pdf')
        res.download(filePath)
    }catch(e){
        res.status(500).json({
            status: "failed",
            message: e.message || "Server Error"
        })
    }
}
module.exports = {getAdminDashboardData, downloadProjectAsset}