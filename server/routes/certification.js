const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const Certification = require("../models/Certification");

/* API BASE URL */
const BASE_API_URL = process.env.API_BASE_URL
  ? `${process.env.API_BASE_URL}/api`
  : "https://portfolio-website-2jvr.onrender.com/api";

/* Multer config */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* GET all certifications (public) */
router.get("/", async (req, res) => {
  try {
    const certs = await Certification.find().sort({ issueDate: -1 });

    const formatted = certs.map((cert) => {
      const obj = cert.toObject();
      return {
        ...obj,
        hasImage: !!(obj.image && obj.image.data),
        imageUrl: obj.image
          ? `${BASE_API_URL}/certifications/${obj._id}/image`
          : null,
        image: undefined,
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch certifications" });
  }
});

/* POST new certification (admin) */
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, issuer, issueDate, url } = req.body;
    const newCert = new Certification({ title, issuer, issueDate, url });

    if (req.file) {
      newCert.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const saved = await newCert.save();
    const obj = saved.toObject();

    res.status(201).json({
      ...obj,
      hasImage: !!obj.image,
      imageUrl: obj.image
        ? `${BASE_API_URL}/certifications/${obj._id}/image`
        : null,
      image: undefined,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add certification" });
  }
});

/* GET certification image (public) */
router.get("/:id/image", async (req, res) => {
  try {
    const cert = await Certification.findById(req.params.id);
    if (!cert || !cert.image || !cert.image.data) {
      return res.status(404).send("No image found");
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Content-Type", cert.image.contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");

    res.end(cert.image.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch image");
  }
});

/* DELETE certification (admin) */
router.delete("/:id", auth, async (req, res) => {
  try {
    await Certification.findByIdAndDelete(req.params.id);
    res.json({ message: "Certification deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete certification" });
  }
});

module.exports = router;
