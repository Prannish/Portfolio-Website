// client/src/components/Certifications.js
import React, { useEffect, useState } from 'react';
import { certificationsAPI } from '../utils/api';

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

              {/* ✅ IMAGE */}
              {cert.hasImage && (
                <div className="cert-image-wrapper">
                  <img
                    src={cert.imageUrl}
                    alt={cert.title}
                    className="cert-image"
                    loading="lazy"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <h3>{cert.title}</h3>

              {cert.issuer && <p>{cert.issuer}</p>}

              {cert.issueDate && (
                <p>
                  {new Date(cert.issueDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                  })}
                </p>
              )}

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
