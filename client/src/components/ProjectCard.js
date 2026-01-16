import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

// Backend base URL (Render)
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  'https://portfolio-website-2jvr.onrender.com/api';

const ProjectCard = ({ project, index }) => {
  // Always use project.imageUrl now
  const imageUrl = project.imageUrl;

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      {/* Image */}
      <div className="project-image-wrapper">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={project.title}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x250?text=Project+Image';
            }}
          />
        ) : (
          <div className="image-placeholder">
            Project Image
          </div>
        )}
        <div className="image-overlay" />
      </div>

      {/* Content */}
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>

        {/* Tech Stack */}
        <div className="project-tech">
          {project.technologies.map((tech, i) => (
            <span key={i} className="tech-chip">{tech}</span>
          ))}
        </div>

        {/* Links */}
        <div className="project-links">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
            >
              <FaGithub /> Code
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn primary"
            >
              <FaExternalLinkAlt /> Live
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
