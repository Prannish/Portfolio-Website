import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaBuilding, FaCalendarAlt, FaCode } from 'react-icons/fa';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await axios.get('/api/experiences');
      setExperiences(response.data);
    } catch (error) {
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading experiences...</div>;

  return (
    <div className="experience-page">
      <div className="container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>My Experience</h1>
          <p>Professional journey and work experience</p>
        </motion.div>

        <div className="experience-timeline">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience._id}
              className="experience-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="experience-header">
                <div className="experience-title">
                  <h3>{experience.position}</h3>
                  <div className="company-info">
                    <FaBuilding className="icon" />
                    <h4>{experience.company}</h4>
                  </div>
                </div>
                <div className="experience-duration">
                  <FaCalendarAlt className="icon" />
                  <span>
                    {new Date(experience.startDate).toLocaleDateString('en-US', {year: 'numeric', month: 'short'})} - {new Date(experience.endDate).toLocaleDateString('en-US', {year: 'numeric', month: 'short'})}
                  </span>
                </div>
              </div>
              
              <div className="experience-content">
                <p className="experience-description">{experience.description}</p>
                
                {experience.skills && (
                  <div className="experience-skills">
                    <FaCode className="skills-icon" />
                    <div className="skills-list">
                      {experience.skills.split(',').map((skill, skillIndex) => (
                        <span key={skillIndex} className="skill-tag">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {experiences.length === 0 && (
          <motion.div 
            className="no-experience"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p>No experience added yet.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Experience;