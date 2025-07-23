import React from 'react';
import Navbar from '../../components/Shared/Navbar.jsx';
import Footer from '../../components/Shared/Footer.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import medicine from '../../assets/medicine_domain.png';
import './Domains.css'

const MedicinePage = () => {
  const navigate = useNavigate();
 useEffect(() => {
  requestAnimationFrame(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });
}, []);
  return (
    <div className="homepage-domain">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-domain">
        <div className="hero-left-domain">
          
          <h1>Medicine</h1>
          <p className="tagline">
            Master medical vocabulary to communicate accurately in clinical and healthcare settings.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-register" onClick={() => navigate('/register')}>Start Learning</button>
            <button className="btn btn-signin" onClick={() => navigate('/#domains')}>Back to Domains</button>
          </div>
        </div>
        <div className="hero-right-domain">
          <img
            src={medicine} 
            alt="Medical Illustration"
            className="hero-image-domain"
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="description">
        <h2>Why learn language for Medicine?</h2>
        <p>
            At LangLearn, we recognize the critical importance of precise language in healthcare. Our Medicine module helps medical professionals navigate clinical terminology, patient communication, and healthcare documentation. Whether you're discussing diagnoses, presenting a case, or collaborating with international colleagues, you’ll gain confidence in using medical English accurately and empathetically.
        </p>
        <div className="feature-cards">
          <div className="feature-card">
            
            <h3>Effective Patient Communication</h3>
            <p>Learn how to explain symptoms, diagnoses, and treatments clearly.</p>
          </div>

          <div className="feature-card">
            
            <h3>Understand Medical Literature</h3>
            <p>Read and interpret research papers, case reports, and clinical guidelines.</p>
          </div>

          <div className="feature-card">
            
            <h3>Collaborate with Healthcare Teams</h3>
            <p>Use appropriate terminology in meetings and documentation.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to start?</h2>
        <p className="cta-subtitle">
          Create a free account and begin your journey in mastering medical English.
        </p>
        <div className="cta-buttons">
          <button className="cta-button" onClick={() => navigate('/register')}>Register for Free</button>
          <button className="btn btn-signin" onClick={() => navigate('/login')}>Login</button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MedicinePage;
