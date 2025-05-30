import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoBlue from '../../assets/logoBlue.png'; 
import './Navbar.css'; 
const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
            <img src={logoBlue} alt="Logo" className="logo" />
            <div className="nav-links-left">
              <a href="#home">Home</a>
              <a href="#domains">Domains</a>
              <a href="#about">About us</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="nav-links-right">
              <button onClick={() => navigate('/login')} className="nav-btn">Log in</button>
              <button onClick={() => navigate('/register')} className="nav-btn nav-register">Register</button>
            </div>
          </nav>
  );
};

export default Navbar;
