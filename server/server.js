const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const auth = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);

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
          "blob:",
        ],
        "script-src": [
          "'self'",
          "https://www.pranishranjit.com.np",
          "'unsafe-inline'",
        ],
        "style-src": [
          "'self'",
          "https://www.pranishranjit.com.np",
          "'unsafe-inline'",
        ],
      },
    },

    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  cors({
    origin: [
      "https://www.pranishranjit.com.np",
      "https://pranishranjit.com.np",
      "https://portfolio-website-2jvr.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.options("*", (req, res) => {
  res.sendStatus(200);
});

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/skills", require("./routes/skills"));
app.use("/api/experiences", require("./routes/experiences"));
app.use("/api/resume", require("./routes/resume"));
app.use("/api/certifications", require("./routes/certification"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "alive" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Portfolio API is running!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
