import './HomePage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoBlue from '../assets/logoBlue.png';
import peopleGray from '../assets/peopleGray.png';
import Navbar from '../components/Shared/Navbar';

const HomePage = () => {
  const navigate = useNavigate();

  const handleExplore = (domain) => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 100);
    navigate(`/domains/${domain}`);
  };

  // Form state pentru contact
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert('Failed to send message.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="homepage" id="home">
      <Navbar />

      <section className="hero">
        <div className="hero-left">
          <h1>Welcome to <span className="brand">LangLearn</span></h1>
          <p className="tagline">An intuitive platform to learn job-specific language fast and effectively.</p>
          <div className="cta-buttons">
            <button className="btn btn-signin" onClick={() => navigate('/login')}>Log in</button>
            <button className="btn btn-register" onClick={() => navigate('/register')}>Register</button>
          </div>
        </div>
        <div className="hero-right">
          <img src={peopleGray} alt="People" className="hero-image" />
        </div>
      </section>

      <section className="description">
        <h2><span className="question">Why choose us?</span></h2>
        <section className="about-us" id="about">
          <div className="about-bubble">
            <p>
              At <strong>LangLearn</strong>, we believe language learning should be purposeful and personalized.
              Our platform was born out of a need to bridge communication gaps in professional environments —
              whether you're a doctor, engineer, or business manager. We combine domain-specific vocabulary,
              real-life scenarios, and smart feedback to help users gain practical fluency fast.
            </p>
          </div>
        </section>

        <div className="feature-cards">
          <div className="feature-card">
            <h3>Industry-Specific Content</h3>
            <p>No generic phrases — learn vocabulary and expressions tailored to your profession.</p>
          </div>
          <div className="feature-card">
            <h3>Real-World Application</h3>
            <p>Study terms you’ll actually use at work, in meetings, or in international collaboration.</p>
          </div>
          <div className="feature-card">
            <h3>Progress You Can Measure</h3>
            <p>Track your performance in real time and receive smart feedback to improve faster.</p>
          </div>
        </div>
      </section>

      <section className="domains-section" id="domains">
        <h2 className="domains-title">Available domains</h2>
        <p className="domains-subtitle">Learn vocabulary specific to your professional field</p>

        <div className="domain-grid">
          <div className="domain-card">
            <div className="domain-icon">.</div>
            <h3>Engineering</h3>
            <button className="domain-button" onClick={() => handleExplore('engineering')}>Explore</button>
          </div>
          <div className="domain-card">
            <div className="domain-icon">.</div>
            <h3>Medicine</h3>
            <button className="domain-button" onClick={() => handleExplore('medicine')}>Explore</button>
          </div>
          <div className="domain-card">
            <div className="domain-icon">.</div>
            <h3>Finance & Accounting</h3>
            <button className="domain-button" onClick={() => handleExplore('finance&accounting')}>Explore</button>
          </div>
          <div className="domain-card">
            <div className="domain-icon">.</div>
            <h3>Construction & Architecture</h3>
            <button className="domain-button" onClick={() => handleExplore('constructions&architecture')}>Explore</button>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-subtitle">
          Have questions, suggestions, or feedback? We'd love to hear from you!
        </p>

        <div className="contact-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit" className="cta-button">Send Message</button>
          </form>

          <div className="contact-info">
            <p><strong>Email:</strong> support@langlearn.com</p>
            <p><strong>Phone:</strong> +40 123 456 789</p>
            <p><strong>Location:</strong> Bucharest, Romania</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2 className="cta-title">Ready to learn?</h2>
        <p className="cta-subtitle">
          Create a free account and start learning the foreign language you need for your career
        </p>
        <button className="cta-button" onClick={() => navigate('/register')}>
          Free registration →
        </button>
      </section>

      <footer className="footer">
        <div className="footer-left">
          <img src={logoBlue} alt="Logo" className="logo" />
        </div>
        <div className="footer-links">
          <a href="#">Terms and conditions</a>
          <a href="#">Privacy policy</a>
          <a href="#">Contact</a>
        </div>
        <div className="footer-right">
          <p>© 2025 LangLearn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
