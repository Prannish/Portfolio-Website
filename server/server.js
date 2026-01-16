const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting
app.set('trust proxy', 1);
app.use(helmet(
     contentSecurityPolicy: false, // Disable default CSP
));

// Content Security Policy to allow images from backend and inline data
app.use((req, res, next) => {
 res.setHeader(
  "Content-Security-Policy",
  "default-src 'self'; " +
  "img-src 'self' https://portfolio-website-2jvr.onrender.com data: blob:; " + // ✅ add blob: for images
  "script-src 'self' https://www.pranishranjit.com.np 'unsafe-inline'; " +
  "style-src 'self' https://www.pranishranjit.com.np 'unsafe-inline';"
);

  next();
});

app.use(cors({
  origin: [
    "https://www.pranishranjit.com.np",
    "https://pranishranjit.com.np"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/experiences', require('./routes/experiences'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/certifications', require('./routes/certification'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'alive' });
});


app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});