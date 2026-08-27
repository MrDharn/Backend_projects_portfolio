const path = require('path')
const downloadModel = require('../models/downloadModel')

const downloadResume = async(req, res)=>{
    try{
        await downloadModel.create({
            fileName: 'Daniel_resume.pdf',
            userAgent: req.get('User-Agent')
        });
        const file = path.join(process.cwd(), 'src','uploads','Daniel_resume.pdf')
        
        res.download(file);

    }catch(e){
        res.status(500).json({
            status: 'failed',
            message: "Server Error" || e.message
        })
    }
};

module.exports = downloadResume