const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Simple login (in production, use proper user management)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Check credentials (replace with your actual credentials)
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign(
      { username }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;