const express = require('express');
const router = express.Router();
const multer = require('multer');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'), false);
    }
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    // Add hasImage flag and imageUrl pointing to API route
    const projectsWithImageFlag = projects.map(project => {
      const projectObj = project.toObject();
      return {
        ...projectObj,
        hasImage: !!(projectObj.image && projectObj.image.data),
        imageUrl: (projectObj.image && projectObj.image.data)
          ? `${process.env.API_BASE_URL || 'https://portfolio-website-2jvr.onrender.com/api'}/projects/${projectObj._id}/image`
          : projectObj.imageUrl || null,
        image: undefined // remove raw image buffer
      };
    });

    res.json(projectsWithImageFlag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured projects
router.get('/featured', async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).sort({ createdAt: -1 });

    const projectsWithImageFlag = projects.map(project => {
      const projectObj = project.toObject();
      return {
        ...projectObj,
        hasImage: !!(projectObj.image && projectObj.image.data),
        imageUrl: (projectObj.image && projectObj.image.data)
          ? `${process.env.API_BASE_URL || 'https://portfolio-website-2jvr.onrender.com/api'}/projects/${projectObj._id}/image`
          : projectObj.imageUrl || null,
        image: undefined
      };
    });

    res.json(projectsWithImageFlag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new project
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const projectData = {
      title: req.body.title,
      description: req.body.description,
      technologies: req.body.technologies
        ? req.body.technologies.split(',').map(tech => tech.trim())
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
    const savedProject = await project.save();

    const { image, ...projectResponse } = savedProject.toObject();
    res.status(201).json({ 
      ...projectResponse, 
      hasImage: !!image,
      imageUrl: image ? `${process.env.API_BASE_URL || 'https://portfolio-website-2jvr.onrender.com/api'}/projects/${savedProject._id}/image` : null
    });
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get project image (public route)
router.get('/:id/image', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project || !project.image || !project.image.data) {
      return res.status(404).json({ message: 'Image not found' });
    }
      res.set('Access-Control-Allow-Origin', '*'); // or your frontend URL     
    res.set({
      'Content-Type': project.image.contentType,
      'Content-Length': project.image.data.length,
      'Cache-Control': 'public, max-age=86400'
    });

    res.end(project.image.data, 'binary');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update project
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      technologies: req.body.technologies
        ? req.body.technologies.split(',').map(tech => tech.trim())
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
    
    const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const { image, ...projectResponse } = project.toObject();
    res.json({ 
      ...projectResponse, 
      hasImage: !!image,
      imageUrl: image ? `${process.env.API_BASE_URL || 'https://portfolio-website-2jvr.onrender.com/api'}/projects/${project._id}/image` : null
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete project
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
