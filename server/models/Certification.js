const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: Date, required: true },
  url: { type: String },
  image: {
    data: Buffer,      // image binary
    contentType: String // image mime type
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certification', CertificationSchema);
