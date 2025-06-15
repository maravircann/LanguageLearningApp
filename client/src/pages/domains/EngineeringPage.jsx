import React from 'react';
import Navbar from '../../components/Shared/Navbar.jsx';
import Footer from '../../components/Shared/Footer.jsx';
import { useNavigate } from 'react-router-dom';


const EngineeringPage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-left">
          
          <h1>Engineering</h1>
          <p className="tagline">
            Communicate clearly in technical discussions, reports, and project management.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-register" onClick={() => navigate('/register')}>Start Learning</button>
            <button className="btn btn-signin" onClick={() => navigate('/#domains')}>Back to Domains</button>
          </div>
        </div>
        <div className="hero-right">
          {/* image */}
          <img
            src="/images/medicine-hero.png" 
            alt="Medical Illustration"
            className="hero-image"
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="description">
        <h2>Why learn language for Engineering?</h2>
        <p>At LangLearn, we understand that engineers operate in highly technical and collaborative environments. Our Engineering module focuses on core terminology across civil, mechanical, and electrical disciplines. Whether you're reading blueprints, writing project reports, or joining global calls, you'll build confidence in using precise and practical language that drives innovation forward.</p>
        <div className="feature-cards">
          <div className="feature-card">
            
            <h3>Explain Technical Concepts</h3>
            <p>Describe systems, processes, and designs in a simple yet precise way.</p>
          </div>

          <div className="feature-card">
            
            <h3>Write Technical Documentation</h3>
            <p>Learn the correct vocabulary for manuals, instructions, and schematics.</p>
          </div>

          <div className="feature-card">
            
            <h3>Collaborate in International Projects</h3>
            <p>Use accurate terminology when working with global teams.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to start?</h2>
        <p className="cta-subtitle">
          Create a free account and improve your communication in engineering contexts.


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

export default EngineeringPage;
