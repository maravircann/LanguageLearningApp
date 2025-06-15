import React from 'react';
import Navbar from '../../components/Shared/Navbar.jsx';
import Footer from '../../components/Shared/Footer.jsx';
import { useNavigate } from 'react-router-dom';


const ConstructionArchitecturePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-left">
          
          <h1>Construction & Architecture</h1>
          <p className="tagline">
            Master technical vocabulary to manage projects and communicate effectively on site.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-register" onClick={() => navigate('/register')}>Start Learning</button>
            <button className="btn btn-signin" onClick={() => navigate('/#domains')}>Back to Domains</button>
          </div>
        </div>
        <div className="hero-right">
          <img
            src="/images/medicine-hero.png" 
            alt="Medical Illustration"
            className="hero-image"
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="description">
        <h2>Why learn language for Construction & Architecture?</h2>
        <p>
            At LangLearn, we support professionals who shape the built environment. Our Construction & Architecture module covers essential terminology for design plans, site coordination, safety standards, and architectural presentations. Whether you're working with contractors or stakeholders, you'll express your ideas clearly and professionally on any project.</p>
        <div className="feature-cards">
          <div className="feature-card">
            
            <h3>Describe Structural Plans</h3>
            <p>Learn how to explain layouts, materials, and safety procedures with clarity.</p>
          </div>

          <div className="feature-card">
            
            <h3>Understand Building Codes</h3>
            <p>Read and apply local and international standards in construction projects.</p>
          </div>

          <div className="feature-card">
            
            <h3>Coordinate with Site Teams</h3>
            <p>Use precise terminology in site meetings and contractor coordination.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to start?</h2>
        <p className="cta-subtitle">
          Create a free account and start building your language skills for the construction industry.
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

export default ConstructionArchitecturePage;
