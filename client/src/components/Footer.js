import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Let's Connect</h3>
            <div className="social-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
              <a href="mailto:your.email@example.com">
                <FaEnvelope />
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <p>
              Made using React & Node.js
            </p>
            <p>&copy; 2024 Pranish Ranjit. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;