const path = require('path')
const downloadModel = require('../models/downloadModel')
const asyncHandler = require('../utils/asyncHandler')

const downloadResume = asyncHandler(async(req, res)=>{
    await downloadModel.create({});
    const file = path.join(process.cwd(), 'src','uploads','Daniel_resume.pdf')

    res.download(file);
});

module.exports = downloadResume