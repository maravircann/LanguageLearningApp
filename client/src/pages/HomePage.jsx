import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import folders from '../assets/foldersImg.png';
import logo from '../assets/textLogo.png';
import peopleImg from '../assets/peopleImg.png';
import communication from '../assets/communication.png';
import report from '../assets/report.png';
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      {/* Navbar simplă */}
      <nav className="navbar">
        <img src={logo} alt="Logo" className="logo" />
        <div className="nav-links">
          <a href="#about">About us</a>
          <a href="#contact">Contact</a>
          <button onClick={() => navigate('/login')} className="nav-btn">Log in</button>
          <button onClick={() => navigate('/register')} className="nav-btn nav-register">Register</button>
        </div>
      </nav>

      {/* Hero section */}
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

        <img src={peopleImg} alt="People" className="hero-image" />

        </div>
          
      </section>
      <section className="description"> 
        <h2><span className="question">Why choose us?</span></h2>
        
        <section className="about-us" id="about">
        <div className="about-bubble">
        <p>
          At <strong>LangLearn</strong>, we believe language learning should be purposeful and personalized. Our platform was born out of a need to bridge communication gaps in professional environments — whether you're a doctor, engineer, or business manager. We combine domain-specific vocabulary, real-life scenarios, and smart feedback to help users gain practical fluency fast. Our team of educators, linguists, and developers is dedicated to making language acquisition engaging, accessible, and career-focused.
        </p>
        </div>
        </section>

        <div className="features">
  
  <div className="feature row">
    <div className="feature-text">
      <h3>Industry-Specific Content</h3>
      <p>No generic phrases — learn vocabulary and expressions tailored to your profession.</p>
    </div>
    <div className="feature-image-container">
      <img src={folders} alt="Folders" className="feature-image" />
    </div>
  </div>


  <div className="feature row-reverse">
    <div className="feature-text">
      <h3>Real-World Application</h3>
      <p>Study terms you’ll actually use at work, in meetings, or in international collaboration.</p>
    </div>
    <div className="feature-image-container">
      <img src={communication} alt="Communication" className="feature-image" />
    </div>
  </div>


  <div className="feature row">
    <div className="feature-text">
      <h3>Progress You Can Measure</h3>
      <p>Track your performance in real time and receive smart feedback to improve faster.</p>
    </div>
    <div className="feature-image-container">
      <img src={report} alt="Report" className="feature-image" />
    </div>
  </div>
</div>

        
      </section>
    </div>
  );
};

export default HomePage;
