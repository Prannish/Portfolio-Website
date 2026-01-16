// server/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting (needed on platforms like Render)
app.set('trust proxy', 1);

// Helmet with full Content Security Policy for images, scripts, and styles
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": [
          "'self'",
          "https://portfolio-website-2jvr.onrender.com",
          "https://www.pranishranjit.com.np",
          "data:",
          "blob:"
        ],
        "script-src": [
          "'self'",
          "https://www.pranishranjit.com.np",
          "'unsafe-inline'"
        ],
        "style-src": [
          "'self'",
          "https://www.pranishranjit.com.np",
          "'unsafe-inline'"
        ]
      }
    }
  })
);

// Global CORS settings
app.use(cors({
  origin: [
    "https://www.pranishranjit.com.np",
    "https://pranishranjit.com.np",
    "https://portfolio-website-2jvr.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight requests for all routes
app.options('*', (req, res) => {
  res.sendStatus(200);
});

// Body parser for JSON
app.use(express.json());

// Rate limiter to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/experiences', require('./routes/experiences'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/certifications', require('./routes/certification'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
