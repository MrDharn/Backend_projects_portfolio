const {countUnreadMessages, getUnreadMessages} = require("../services/contactService")

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

        res.status(200).json({
            status: "success",
            data: {
                metrics: {
                    unreadMessages: unreadCount,
                    totalVisitors,
                    totalDownloads
                },
                pendingMessages: {
                    unreadMessages,
                }
            }
        })
    }catch(e){
        res.status(500).json({
            status: "Failed",
            message: e.message || "Server Error"
        })
    }
}

module.exports = getAdmingDashboardData