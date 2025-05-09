import React from 'react';
import logoBlue from '../../assets/logoBlue.png'; 
const Footer = () => {
  return (
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
  );
};

export default Footer;
