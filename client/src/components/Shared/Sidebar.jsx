import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaThLarge, FaClipboardList, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css'; 
import { useLocation } from 'react-router-dom';

const Sidebar = ({ selectedLanguage, onLanguageChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
  
  const preservedRecents = {};

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("recentLessons_") || key.startsWith("recentTests_")) {
      preservedRecents[key] = localStorage.getItem(key);
    }
  });

  
  localStorage.clear();


  Object.entries(preservedRecents).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });


  navigate('/');
};


  return (
    <aside className="sidebar">
      

     <nav className="sidebar-nav">
  <button
    className={`sidebar-btn ${isActive('/home') ? 'active' : ''}`}
    onClick={() => navigate('/home')}
  >
    <FaThLarge /> Dashboard
  </button>

  <button
    className={`sidebar-btn ${isActive('/lessons') ? 'active' : ''}`}
    onClick={() => navigate('/lessons')}
  >
    <FaBook /> Lessons
  </button>

  <button
    className={`sidebar-btn ${isActive('/flashcards') ? 'active' : ''}`}
    onClick={() => navigate('/flashcards')}
  >
    <FaClipboardList /> Flashcards
  </button>


  <button
    className={`sidebar-btn ${isActive('/profile') ? 'active' : ''}`}
    onClick={() => navigate('/profile')}
  >
    <FaUser /> Profile
  </button>
</nav>


      <div className="sidebar-language">
        <label htmlFor="language-select">Select a language to learn:</label>
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          <option value="" disabled hidden> Select a language </option>

          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="es">Spanish</option>
        </select>
      </div>

      <button onClick={handleLogout} className="sidebar-logout">
        <FaSignOutAlt /> Log out
      </button>
    </aside>
  );
};

export default Sidebar;
