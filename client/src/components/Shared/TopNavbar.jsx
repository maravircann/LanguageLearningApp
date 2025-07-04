import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoBlue from '../../assets/logoBlue.png'; 
import './TopNavbar.css'; 
const TopNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="top-navbar">
            <img src={logoBlue} alt="Logo" className="logo" />
            <div className="nav-links">
              <a href="/home">Dashboard</a>
              <a href="/lessons">Lessons</a>
              <a href="/flashcards">Flashcards</a>
            </div>
            <div className="navbar-right">
              <button className="profile-btn" onClick={() => navigate('/profile', { state: { refreshReport: true } })}>
                Profile
              </button>
            </div>
    </nav>
    
  );
};

export default TopNavbar;
