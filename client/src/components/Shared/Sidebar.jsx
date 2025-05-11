import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaThLarge, FaClipboardList, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css'; // stiluri separate (vezi mai jos)

const Sidebar = ({ selectedLanguage, onLanguageChange }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        
      </div>

      <nav className="sidebar-nav">
        <button onClick={() => navigate('/home')}><FaThLarge /> Dashboard</button>
        <button onClick={() => navigate('/lessons')}><FaBook /> Lessons</button>
        <button onClick={() => navigate('/flashcards')}><FaClipboardList /> Flashcards</button>
        <button onClick={() => navigate('/tests')}><FaClipboardList /> Tests</button>
        <button onClick={() => navigate('/profile')}><FaUser /> Profile</button>
      </nav>

      <div className="sidebar-language">
        <label htmlFor="language-select">Select a language to learn:</label>
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          <option value="en">English</option>
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
