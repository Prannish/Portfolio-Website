// client/src/components/Experience.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaCalendarAlt, FaCode } from 'react-icons/fa';
import { experiencesAPI } from '../utils/api'; // API helper

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await experiencesAPI.getAll();
      console.log('Experiences response:', response.data);
      setExperiences(response.data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading experiences...</div>;

  return (
    <div className="experience-page">
      <div className="container">
        {/* Page Header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>My Experience</h1>
          <p>Professional journey and work experience</p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="experience-timeline">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp._id}
              className="experience-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="experience-header">
                <div className="experience-title">
                  <h3>{exp.position}</h3>
                  <div className="company-info">
                    <FaBuilding className="icon" />
                    <h4>{exp.company}</h4>
                  </div>
                </div>
                <div className="experience-duration">
                  <FaCalendarAlt className="icon" />
                  <span>
                    {exp.startDate
                      ? new Date(exp.startDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })
                      : 'N/A'}{' '}
                    -{' '}
                    {exp.endDate
                      ? new Date(exp.endDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })
                      : 'Present'}
                  </span>
                </div>
              </div>

              {/* Description and Skills */}
              <div className="experience-content">
                <p className="experience-description">{exp.description}</p>
                {exp.skills && exp.skills.length > 0 && (
                  <div className="experience-skills">
                    <FaCode className="skills-icon" />
                    <div className="skills-list">
                      {exp.skills.split(',').map((skill, idx) => (
                        <span key={idx} className="skill-tag">
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

        {/* No Experience */}
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
