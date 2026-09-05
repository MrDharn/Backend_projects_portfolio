const path = require('path');
const downloadModel = require('../models/downloadModel');

const downloadResume = async (req, res) => {
  try {
    await downloadModel.create({
      fileName: 'Daniel_resume.pdf',
      userAgent: req.get('User-Agent')
    });

    // Resolves path relative to this controller file:
    const file = path.join(__dirname, '..', 'uploads', 'Daniel_resume.pdf');

    res.download(file, 'Daniel_resume.pdf', (err) => {
      if (err) {
        console.error('File download error:', err);
        if (!res.headersSent) {
          return res.status(404).json({
            status: 'failed',
            message: 'Resume file not found on server'
          });
        }
      }
    });
  } catch (e) {
    res.status(500).json({
      status: 'failed',
      message: e.message || 'Server Error'
    });
  }
};

module.exports = downloadResume;