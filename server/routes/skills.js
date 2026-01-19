const express = require("express");
const router = express.Router();
const Skill = require("../models/Skill");
const Project = require("../models/Project");
const auth = require("../middleware/auth");

// Get all skills (from both manual skills and project technologies)
router.get("/", async (req, res) => {
  try {
    // Get manual skills
    const manualSkills = await Skill.find().sort({ name: 1 });

    // Get skills from projects
    const projects = await Project.find();
    const projectSkills = [];
    projects.forEach((project) => {
      project.technologies.forEach((tech) => {
        if (!projectSkills.includes(tech)) {
          projectSkills.push(tech);
        }
      });
    });

    // Combine and deduplicate
    const allSkills = [...manualSkills.map((s) => s.name), ...projectSkills];
    const uniqueSkills = [...new Set(allSkills)].sort();

    res.json(uniqueSkills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new skill (protected)
router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Skill name is required" });
    }

    const skill = new Skill({ name: name.trim() });
    await skill.save();

    res.status(201).json(skill);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Skill already exists" });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

// Delete skill (protected)
router.delete("/:name", auth, async (req, res) => {
  try {
    const { name } = req.params;
    await Skill.findOneAndDelete({ name });
    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
