// routes/certification.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const Certification = require('../models/Certification');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all certifications
router.get('/', async (req, res) => {
  try {
    const certs = await Certification.find().sort({ issueDate: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch certifications' });
  }
});

// POST new certification (admin only)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, issuer, issueDate, url } = req.body;
    const newCert = new Certification({ title, issuer, issueDate, url });

    if (req.file) {
      newCert.image.data = req.file.buffer;
      newCert.image.contentType = req.file.mimetype;
    }

    await newCert.save();
    res.status(201).json(newCert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add certification' });
  }
});

// GET certification image (public)
router.get('/:id/image', async (req, res) => {
  try {
    const cert = await Certification.findById(req.params.id);
    if (!cert || !cert.image || !cert.image.data)
      return res.status(404).send('No image found');

    // ✅ Add CORS headers here for this route
    res.setHeader('Access-Control-Allow-Origin', '*'); // allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Set content type and cache
    res.setHeader('Content-Type', cert.image.contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day cache

    res.send(cert.image.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch image');
  }
});

// DELETE certification
router.delete('/:id', auth, async (req, res) => {
  try {
    await Certification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certification deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete certification' });
  }
});

module.exports = router;
