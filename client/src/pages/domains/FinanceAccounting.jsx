import React from 'react';
import Navbar from '../../components/Shared/Navbar.jsx';
import Footer from '../../components/Shared/Footer.jsx';
import { useNavigate } from 'react-router-dom';


const FinanceAccountingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-left">
          
          <h1>Finance & Accounting</h1>
          <p className="tagline">
           Speak the language of finance to deliver clear reports, analyses, and client communication.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-register" onClick={() => navigate('/register')}>Start Learning</button>
            <button className="btn btn-signin" onClick={() => navigate('/#domains')}>Back to Domains</button>
          </div>
        </div>
        <div className="hero-right">
          <img
            src="/images/medicine-hero.png" // imagine ilustrativă simbolică
            alt="Medical Illustration"
            className="hero-image"
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="description">
        <h2>Why learn language for Finance & Accounting?</h2>
        <p>
            At LangLearn, we know that professionals in finance and accounting rely on clarity, precision, and consistency. Our Finance & Accounting module equips you with key vocabulary for financial reporting, audits, investment discussions, and regulatory compliance. From boardroom meetings to client communications, you’ll speak the language of business with confidence. </p>
        <div className="feature-cards">
          <div className="feature-card">
            
            <h3>Present Financial Reports</h3>
            <p>Use proper terminology when summarizing budgets, revenues, and expenses.</p>
          </div>

          <div className="feature-card">
            
            <h3>Understand Audits and Compliance</h3>
            <p>Learn to discuss regulations, risk, and internal control procedures.</p>
          </div>

          <div className="feature-card">
            
            <h3>Communicate with Clients</h3>
            <p>Explain investment options, account details, and statements effectively.

</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to start?</h2>
        <p className="cta-subtitle">
          Create a free account and enhance your professional vocabulary in finance and accounting.
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

export default FinanceAccountingPage;
