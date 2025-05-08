import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import logoBlue from '../assets/logoBlue.png';
import peopleGray from '../assets/peopleGray.png';
const HomePage = () => {
const navigate = useNavigate();

  return (
    <div className="homepage" id="home">
      {/* Navbar simplă */}
      <nav className="navbar">
        <img src={logoBlue} alt="Logo" className="logo" />
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#domains">Domains</a>
          <a href="#about">About us</a>
          <a href="#contact">Contact</a>
          <button onClick={() => navigate('/login')} className="nav-btn">Log in</button>
          <button onClick={() => navigate('/register')} className="nav-btn nav-register">Register</button>
        </div>
      </nav>

     
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
          At <strong>LangLearn</strong>, we believe language learning should be purposeful and personalized. Our platform was born out of a need to bridge communication gaps in professional environments — whether you're a doctor, engineer, or business manager. We combine domain-specific vocabulary, real-life scenarios, and smart feedback to help users gain practical fluency fast.
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
      <button className="domain-button">Explore</button>
    </div>

    <div className="domain-card">
      <div className="domain-icon">.</div>
      <h3>Medicine</h3>
      <button className="domain-button">Explore</button>
    </div>

    <div className="domain-card">
      <div className="domain-icon">.</div>
      <h3>Law</h3>
      <button className="domain-button">Explore</button>
    </div>

    <div className="domain-card">
      <div className="domain-icon">.</div>
      <h3>Business & Management</h3>
      <button className="domain-button">Explore</button>
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
