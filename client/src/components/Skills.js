import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';

const Skills = () => {
  const [skills, setSkills] = useState({});
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get('/api/skills');
      setSkills(response.data);
    } catch (error) {
      // Fallback data if API fails
      setSkills({
        frontend: [
          { name: 'React', proficiency: 90 },
          { name: 'JavaScript', proficiency: 85 },
          { name: 'HTML/CSS', proficiency: 95 },
          { name: 'TypeScript', proficiency: 80 }
        ],
        backend: [
          { name: 'Node.js', proficiency: 85 },
          { name: 'Express', proficiency: 80 },
          { name: 'Python', proficiency: 75 }
        ],
        database: [
          { name: 'MongoDB', proficiency: 80 },
          { name: 'MySQL', proficiency: 75 }
        ],
        tools: [
          { name: 'Git', proficiency: 85 },
          { name: 'Docker', proficiency: 70 },
          { name: 'AWS', proficiency: 65 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  if (loading) return <div className="loading">Loading skills...</div>;

  return (
    <section className="skills" ref={ref}>
      <div className="container">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Skills & Technologies
        </motion.h2>
        
        <motion.div 
          className="skills-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {Object.entries(skills).map(([category, skillList]) => (
            <motion.div key={category} className="skill-category" variants={itemVariants}>
              <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
              <div className="skill-list">
                {skillList.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div className="skill-info">
                      <span>{skill.name}</span>
                      <span>{skill.proficiency}%</span>
                    </div>
                    <div className="skill-bar">
                      <motion.div 
                        className="skill-progress"
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.proficiency}%` } : {}}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;