import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import ProjectCard from "../components/ProjectCard";
import api, { projectsAPI } from "../utils/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get("/resume/download", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Download failed. Please try again.");
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    if (filter === "featured") return project.featured;
    return project.technologies.some((tech) =>
      tech.toLowerCase().includes(filter.toLowerCase()),
    );
  });

  const filters = ["all", "featured"];

  if (loading) {
    return <div className="projects-loading">Loading projects...</div>;
  }

  return (
    <div className="projects-page">
      <div className="container">
        <motion.div
          className="projects-header-glass"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>My Projects</h1>

          <button onClick={handleDownload} className="resume-download-btn">
            <FaDownload />
            <span>Download Resume</span>
          </button>
        </motion.div>

        <motion.div
          className="projects-filter-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filters.map((option) => (
            <button
              key={option}
              className={`filter-chip ${filter === option ? "active" : ""}`}
              onClick={() => setFilter(option)}
            >
              {option.toUpperCase()}
            </button>
          ))}
        </motion.div>

        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project._id || index}
              project={project}
              index={index}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="projects-empty-state">
            No projects match this filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
