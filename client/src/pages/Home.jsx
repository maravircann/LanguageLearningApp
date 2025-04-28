import React, { useEffect, useState } from 'react';
import LessonCard from '../components/Lessons/LessonCard';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 
import logo from '../assets/textLogo.png';

const Home = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token missing from localStorage.');
          return;
        }

        const response = await fetch('http://localhost:5000/api/lessons', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Lessons received from backend:', data);
        setLessons(data);
      } catch (error) {
        console.error('Eroare la încărcarea lecțiilor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);
  const handleProfileClick = () => {
    navigate('/profile');
  };

  if (loading) {
    return <div className="lesson-loading">Se încarcă lecțiile...</div>;
  }

  return (
    <div className="home-container">
      
      <nav className="navbar">
              <img src={logo} alt="Logo" className="logo" />
              <div className="nav-links">
                <button onClick={() => navigate('/profile')} className="profile-button">Profile</button>
              </div>
      </nav>
      {/*<h1>Let's keep learning!</h1>*/}

      <section>
        <h2>Your Lessons</h2>
        <div className="lesson-list">
          {lessons.length > 0 ? (
            lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))
          ) : (
            <p>Nu există lecții disponibile.</p>
          )}
        </div>
      </section>

      <section>
        <h2>Your Flashcard Tests</h2>
      </section>

    </div>
  );
};

export default Home;
