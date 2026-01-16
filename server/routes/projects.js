const express = require('express');
const router = express.Router();
const multer = require('multer');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

/* ==========================
   API BASE URL (IMPORTANT)
========================== */
const BASE_API_URL =
  process.env.API_BASE_URL
    ? `${process.env.API_BASE_URL}/api`
    : 'https://portfolio-website-2jvr.onrender.com/api';

/* ==========================
   Multer config
========================== */
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'), false);
    }
  }
});

/* ==========================
   GET all projects
========================== */
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    const projectsWithImageFlag = projects.map(project => {
      const obj = project.toObject();
      return {
        ...obj,
        hasImage: !!(obj.image && obj.image.data),
        imageUrl: obj.image
          ? `${BASE_API_URL}/projects/${obj._id}/image`
          : obj.imageUrl || null,
        image: undefined
      };
    });

    res.json(projectsWithImageFlag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ==========================
   GET featured projects
========================== */
router.get('/featured', async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).sort({ createdAt: -1 });

    const projectsWithImageFlag = projects.map(project => {
      const obj = project.toObject();
      return {
        ...obj,
        hasImage: !!(obj.image && obj.image.data),
        imageUrl: obj.image
          ? `${BASE_API_URL}/projects/${obj._id}/image`
          : obj.imageUrl || null,
        image: undefined
      };
    });

    res.json(projectsWithImageFlag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ==========================
   CREATE project (admin)
========================== */
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const projectData = {
      title: req.body.title,
      description: req.body.description,
      technologies: req.body.technologies
        ? req.body.technologies.split(',').map(t => t.trim())
        : [],
      githubUrl: req.body.githubUrl,
      liveUrl: req.body.liveUrl,
      featured: req.body.featured === 'true'
    };

    if (req.file) {
      projectData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      };
    }

    const project = new Project(projectData);
    const saved = await project.save();

    const obj = saved.toObject();
    res.status(201).json({
      ...obj,
      hasImage: !!obj.image,
      imageUrl: obj.image
        ? `${BASE_API_URL}/projects/${obj._id}/image`
        : null,
      image: undefined
    });
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

/* ==========================
   GET project image (public)
========================== */
router.get('/:id/image', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project || !project.image || !project.image.data) {
      return res.status(404).send('No image found');
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', project.image.contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');

    res.end(project.image.data);
  } catch (err) {
    console.error('Failed to fetch project image:', err);
    res.status(500).send('Failed to fetch project image');
  }
});

/* ==========================
   GET project by ID
========================== */
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const obj = project.toObject();
    res.json({
      ...obj,
      hasImage: !!(obj.image && obj.image.data),
      imageUrl: obj.image
        ? `${BASE_API_URL}/projects/${obj._id}/image`
        : null,
      image: undefined
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ==========================
   UPDATE project
========================== */
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      technologies: req.body.technologies
        ? req.body.technologies.split(',').map(t => t.trim())
        : [],
      githubUrl: req.body.githubUrl,
      liveUrl: req.body.liveUrl,
      featured: req.body.featured === 'true'
    };

    if (req.file) {
      updateData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      };
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const obj = project.toObject();
    res.json({
      ...obj,
      hasImage: !!obj.image,
      imageUrl: obj.image
        ? `${BASE_API_URL}/projects/${obj._id}/image`
        : null,
      image: undefined
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* ==========================
   DELETE project
========================== */
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
