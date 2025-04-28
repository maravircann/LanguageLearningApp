import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import workspace from '../assets/workspace.png';
import announcement from '../assets/megaphone.png';
import logo from '../assets/textLogo.png';


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
        <div className="hero-content">
        {/*<img src={announcement} alt="Announcement" className="illustration left-illustration" />*/}
          <h1>Welcome to <span className="brand">LangLearn</span></h1>
          <p className="tagline">An intuitive platform to learn job-specific language fast and effectively.</p>
        </div> 

        {/* Butoane centrale */}
        <div className="cta-buttons">
          <button className="btn btn-signin" onClick={() => navigate('/login')}>Log in</button>
          <button className="btn btn-register" onClick={() => navigate('/register')}>Register</button>
        </div>

        {/* Imagine decorativă dreapta */}
        {/*<img src={workspace} alt="Workspace Illustration" className="illustration right-illustration" />*/}
      </section>
    </div>
  );
};

export default HomePage;
