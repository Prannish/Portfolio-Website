import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaDownload } from 'react-icons/fa';

// Import images from src/assets (or wherever you store them inside src)
import bgDesktop from '../assets/images/pp.jpeg';
import bgMobile from '../assets/images/mobdp.png';
import { resumeAPI } from '../utils/api';

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

 const handleDownload = async () => {
  try {
    const response = await resumeAPI.download();
    const url = window.URL.createObjectURL(response.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    alert('Download failed. Please try again.');
  }
};

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${isMobile ? bgMobile : bgDesktop})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <motion.div
        className="hero-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', padding: '0 2rem' }}
      >
        <motion.div className="hero-content" variants={itemVariants}>
          <motion.h1 variants={itemVariants}>
            Hi, I'm <br />
            <span className="highlight">Pranish Ranjit</span>
          </motion.h1>
          <motion.h2 variants={itemVariants}>
            Full Stack Developer
          </motion.h2>
          <motion.p variants={itemVariants}>
            As a Bachelor’s in Computer Applications (BCA) student, I am actively engaged in the dynamic and ever evolving field of technology. I have built web applications using the MERN stack, with strong hands on experience in React for developing modern, responsive user interfaces. Additionally, I have learned Spring Boot, enabling me to design and develop robust backend services and scalable application architectures. Driven by continuous improvement and practical problem solving, I am committed to delivering efficient and innovative digital solutions.
          </motion.p>

          <motion.div className="hero-buttons" variants={itemVariants}>
            <Link to="/contact" className="btn btn-primary">
              Get In Touch
            </Link>
            <button onClick={handleDownload} className="btn btn-secondary">
              <FaDownload /> Resume
            </button>
          </motion.div>
        </motion.div>

        {/* Optional hero image or additional visuals */}
        <motion.div className="hero-image" variants={itemVariants}></motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
