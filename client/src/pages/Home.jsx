import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonCard from '../components/Lessons/LessonCard';
import TestCard from '../components/Tests/TestCard';
import './Home.css'; 

import Sidebar from '../components/Shared/Sidebar';
import TopNavbar from '../components/Shared/TopNavbar';
const Home = () => {
  const [lessons, setLessons] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('language') || 'en');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const domainId = user?.domain_id;
  const userName = user?.name;

  const [domainName, setDomainName] = useState('');
  

  // Fetch lessons and tests
  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      if (!token || !user) {
        console.error('Token or user info missing from localStorage.');
        return;
      }

      // Fetch lessons
      const lessonsRes = await fetch('http://localhost:5000/api/lessons', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Fetch tests
      const testsRes = await fetch('http://localhost:5000/api/tests', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Fetch domain name
      const domainRes = await fetch(`http://localhost:5000/api/domains/${user.domain_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!lessonsRes.ok || !testsRes.ok || !domainRes.ok) {
        throw new Error('Failed fetching lessons, tests, or domain');
      }

      const lessonsData = await lessonsRes.json();
      const testsData = await testsRes.json();
      const domainData = await domainRes.json();

      setLessons(lessonsData);
      setTests(testsData);
      setDomainName(domainData.name); // 👈 setează numele domeniului

    } catch (error) {
      console.error('Error fetching data in Home:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


 
  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const filteredLessons = lessons.filter((lesson) => lesson.domain_id === domainId);
  const filteredTests = tests.filter((test) => test.domain_id === domainId);

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
        <h2 className="welcome-message">
        Welcome, {userName}! Keep building your professional language skills in the field of {domainName}.
      </h2>

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
