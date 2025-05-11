import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoBlue from '../../assets/logoBlue.png'; 

const TopNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
            <img src={logoBlue} alt="Logo" className="logo" />
            <div className="nav-links">
              <a href="#home">Dashboard</a>
              <a href="#domains">Lessons</a>
              <a href="#about">Flashcards</a>
            </div>
          </nav>
  );
};

export default TopNavbar;
