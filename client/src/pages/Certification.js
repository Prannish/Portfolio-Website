// client/src/components/Certifications.js
import React, { useEffect, useState } from 'react';
import { certificationsAPI } from '../utils/api'; // API helper

const Certifications = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const res = await certificationsAPI.getAll();
        console.log('Certifications response:', res.data);
        setCerts(res.data || []);
      } catch (error) {
        console.error('Failed to fetch certifications:', error);
        setCerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  if (loading) {
    return (
      <div className="certifications-page">
        <h1>My Certifications</h1>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
          Loading certifications…
        </p>
      </div>
    );
  }

  return (
    <div className="certifications-page">
      <h1>My Certifications</h1>

      {certs.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
          No certifications available.
        </p>
      ) : (
        <div className="certs-grid">
          {certs.map((cert) => (
            <div key={cert._id} className="cert-card">
              {/* Image Wrapper */}
              {cert.image && cert.image.data && (
                <div className="cert-image-wrapper">
                 <img
  src={`${process.env.REACT_APP_API_URL || 'https://portfolio-website-2jvr.onrender.com/api'}/certifications/${cert._id}/image`}
  alt={cert.title}
  className="cert-image"
  loading="lazy"
  onError={(e) => { e.currentTarget.style.display = 'none'; }}
/>

                </div>
              )}

              {/* Title */}
              <h3>{cert.title}</h3>

              {/* Issuer */}
              {cert.issuer && <p>{cert.issuer}</p>}

              {/* Issue Date */}
              {cert.issueDate && (
                <p>
                  {new Date(cert.issueDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                  })}
                </p>
              )}

              {/* External Link */}
              {cert.url && (
                <a href={cert.url} target="_blank" rel="noopener noreferrer">
                  View Certificate
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certifications;
