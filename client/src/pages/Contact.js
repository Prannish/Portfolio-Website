import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane,
  FaLinkedin, FaTwitter, FaGithub
} from 'react-icons/fa';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Get In Touch</h1>
          <p>Give feedback or ask questions</p>
        </motion.div>

        <div className="contact-content">
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 style={{ color: '#00d4ff' }}>Contact Information</h2>

            <div className="contact-item">
              <FaEnvelope />
              <div>
                <h3>Email</h3>
                <p>pranish492@gmail.com</p>
              </div>
            </div>

            <div className="contact-item">
              <FaPhone />
              <div>
                <h3>Phone</h3>
                <p>+977 9861599807</p>
              </div>
            </div>

            <div className="contact-item">
              <FaMapMarkerAlt />
              <div>
                <h3>Location</h3>
                <p>Kathmandu, Nepal</p>
              </div>
            </div>

            <div className="contact-item">
              <FaLinkedin />
              <div>
                <h3>LinkedIn</h3>
                <p>
                  <a href="https://www.linkedin.com/in/pranish-ranjit" target="_blank" rel="noopener noreferrer">
                    linkedin.com/in/pranish-ranjit
                  </a>
                </p>
              </div>
            </div>

            <div className="contact-item">
              <FaTwitter />
              <div>
                <h3>Twitter</h3>
                <p>
                  <a href="https://twitter.com/PranishRanjit" target="_blank" rel="noopener noreferrer">
                    @PranishRanjit
                  </a>
                </p>
              </div>
            </div>

            <div className="contact-item">
              <FaGithub />
              <div>
                <h3>GitHub</h3>
                <p>
                  <a href="https://github.com/prannish" target="_blank" rel="noopener noreferrer">
                    github.com/prannish
                  </a>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="contact-form-container"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 style={{ color: '#00d4ff' }}>Send a Message</h2>
            <br />

            {success ? (
              <div className="success-message">
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out. I'll get back to you soon.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setSuccess(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : (
                    <>
                      <FaPaperPlane /> Send Message
                    </>
                  )}
                </button>
              </form>
              
            )}
            
  {/* Quote below the form */}
  <br></br>
  <br></br>

  <div className="contact-quote">
    <p>The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack in will.</p>
  </div>
          </motion.div>
        </div>
      </div>
      <br />
    </div>
  );
};

export default Contact;
