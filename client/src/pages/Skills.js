import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaCode, FaStar } from 'react-icons/fa';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get('/api/skills');
      console.log('Skills response:', response.data);
      setSkills(response.data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading skills...</div>;

  return (
    <div className="skills-page">
      <div className="container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaCode className="header-icon" />
          <h1>My Skills</h1>
          <p>Technologies and tools I use to bring ideas to life</p>
        </motion.div>

        <motion.div 
          
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                className="skill-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="skill-content">
                  <FaStar className="skill-icon" />
                  <span className="skill-name">{skill}</span>
                </div>
                <div className="skill-glow"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {skills.length === 0 && (
          <motion.div 
            className="no-skills"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <FaCode className="empty-icon" />
            <p>No skills found. Add some projects to see skills here.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Skills;