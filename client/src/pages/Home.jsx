import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonCard from '../components/Lessons/LessonCard';
import TestCard from '../components/Tests/TestCard';
import './Home.css'; 
import logoBlue from '../assets/logoBlue.png';
import Sidebar from '../components/Shared/Sidebar';
import TopNavbar from '../components/Shared/TopNavbar';
const Home = () => {
  const [lessons, setLessons] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('language') || 'en');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [domains, setDomains] = useState([]);
  const navigate = useNavigate();

  // Fetch domains
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/domains', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setDomains(data);
      } catch (err) {
        console.error('Error fetching domains:', err);
      }
    };

    fetchDomains();
  }, []);

  // Fetch lessons and tests
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

  const filteredLessons = selectedDomain
    ? lessons.filter((lesson) => lesson.domeniu_id === parseInt(selectedDomain))
    : lessons;

  const filteredTests = selectedDomain
    ? tests.filter((test) => test.domeniu_id === parseInt(selectedDomain))
    : tests;

  if (loading) {
    return <div className="lesson-loading">Se încarcă lecțiile și testele...</div>;
  }

return (
  <div className="page">
    <TopNavbar />

    <div className="layout">
      <Sidebar
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />

      <main className="main-content">
        <section>
          <h2>Your Lessons</h2>
          <div className="lesson-list">
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson) => (
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
            {filteredTests.length > 0 ? (
              filteredTests.map((test) => (
                <TestCard key={test.id} test={test} />
              ))
            ) : (
              <p>No tests available.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  </div>
);


};

export default Home;
