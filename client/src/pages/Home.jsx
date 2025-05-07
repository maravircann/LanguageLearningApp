import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonCard from '../components/Lessons/LessonCard';
import TestCard from '../components/Tests/TestCard';
import './Home.css'; 
import logo from '../assets/textLogo.png';


const Home = () => {
  const [lessons, setLessons] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('language') || 'en');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessonsAndTests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token missing from localStorage.');
          return;
        }

        const lessonsRes = await fetch('http://localhost:5000/api/lessons', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const testsRes = await fetch('http://localhost:5000/api/tests', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!lessonsRes.ok || !testsRes.ok) {
          throw new Error('Failed fetching lessons or tests');
        }

        const lessonsData = await lessonsRes.json();
        const testsData = await testsRes.json();

        setLessons(lessonsData);
        setTests(testsData);
      } catch (error) {
        console.error('Error fetching lessons and tests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonsAndTests();
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    localStorage.setItem('language', lang);
  };

  if (loading) {
    return <div className="lesson-loading">Se încarcă lecțiile și testele...</div>;
  }

  return (
    <div className="home-container">
      
      <nav className="navbar">
        <img src={logo} alt="Logo" className="logo" />
        <div className="navbar-links">
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="language-selector"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="es">Español</option>
            <option value="ro">Română</option>
          </select>

          <button onClick={handleProfileClick} className="profile-button">Profile</button>
        </div>
      </nav>

      <section>
        <h2>Your Lessons</h2>
        <div className="lesson-list">
          {lessons.length > 0 ? (
            lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))
          ) : (
            <p>No lessons available.</p>
          )}
        </div>
      </section>

      <section>
        <h2>Your Flashcard Tests</h2>
        <div className="test-list">
          {tests.length > 0 ? (
            tests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))
          ) : (
            <p>No tests available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
