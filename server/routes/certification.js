const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth'); // admin auth middleware
const Certification = require('../models/Certification');

// Use multer memory storage to get buffer
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

    const newCert = new Certification({
      title,
      issuer,
      issueDate,
      url
    });

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

// DELETE certification (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Certification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certification deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete certification' });
  }
});

// GET certificate image
router.get('/:id/image', async (req, res) => {
  try {
    const cert = await Certification.findById(req.params.id);
    if (!cert || !cert.image || !cert.image.data) return res.status(404).send('No image found');

    res.set('Content-Type', cert.image.contentType);
    res.send(cert.image.data);
  } catch (err) {
    res.status(500).send('Failed to fetch image');
  }
});

module.exports = router;
