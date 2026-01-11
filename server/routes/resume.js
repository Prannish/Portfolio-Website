const express = require('express');
const router = express.Router();
const multer = require('multer');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload resume
router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Delete existing resume
    await Resume.deleteMany({});

    // Save new resume
    const resume = new Resume({
      filename: req.file.filename || 'resume.pdf',
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      data: req.file.buffer
    });

    await resume.save();
    res.status(201).json({ message: 'Resume uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload resume' });
  }
});

// Get resume info
router.get('/info', async (req, res) => {
  try {
    const resume = await Resume.findOne().sort({ uploadedAt: -1 }).select('-data');
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get resume info' });
  }
});

// Download resume
router.get('/download', async (req, res) => {
  try {
    const resume = await Resume.findOne().sort({ uploadedAt: -1 });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.set({
      'Content-Type': resume.mimetype,
      'Content-Disposition': `attachment; filename="${resume.originalName}"`
    });
    res.send(resume.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to download resume' });
  }
});

// Delete resume
router.delete('/', auth, async (req, res) => {
  try {
    await Resume.deleteMany({});
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete resume' });
  }
});

module.exports = router;