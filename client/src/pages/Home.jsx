import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const domainId = user?.domain_id;
  const userName = user?.name;

  const [domainName, setDomainName] = useState('');
  const [report, setReport] = useState(null);
  const [recentLessons, setRecentLessons] = useState([]);
const [recentTests, setRecentTests] = useState([]);


const [selectedTab, setSelectedTab] = useState("lessons");
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

      // Fetch user report
      const reportRes = await fetch(`http://localhost:5000/api/report/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });   

      if (!reportRes.ok) throw new Error('Failed fetching report');
        const reportData = await reportRes.json();
        setReport(reportData);

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
      setDomainName(domainData.name); 

    } catch (error) {
      console.error('Error fetching data in Home:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [location.state?.refreshReport]);

useEffect(() => {
  const storedLessons = JSON.parse(localStorage.getItem("recentLessons") || "[]");
  const storedTests = JSON.parse(localStorage.getItem("recentTests") || "[]");

  
  const filteredRecentLessons = storedLessons.filter(l => l.domain_id === domainId);
  const filteredRecentTests = storedTests.filter(t => t.domain_id === domainId);

  setRecentLessons(filteredRecentLessons);
  setRecentTests(filteredRecentTests);
}, [domainId]);


  
  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const filteredLessons = lessons.filter((lesson) => lesson.domain_id === domainId);
  const filteredTests = tests.filter((test) => test.domain_id === domainId);

  if (loading) {
    return <div className="lesson-loading">Lessons and Tests loading...</div>;
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
          Welcome, {userName}! Keep building your professional language skills
          in the field of {domainName}.
        </h2>

        {report && (
          <div className="progress-summary">
            <div className="progress-card">
              <h3>Total Progress</h3>
              <p>{report.progress_percent || 0}%</p>
              <div className="progress-bar-home">
                <div
                  className="filled"
                  style={{ width: `${report.progress_percent || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="progress-card">
              <h3>Lessons Completed</h3>
              <p>{report.lessons_completed || 0}</p>
            </div>

            <div className="progress-card">
              <h3>Flashcards Learned</h3>
              <p>{report.tests_completed || 0}</p>
            </div>
          </div>
        )}
        <div className="main-lessons-tests">
          <div className="tab-list">
            <button
              className={selectedTab === "lessons" ? "tab active" : "tab"}
              onClick={() => setSelectedTab("lessons")}
            >
              Recent Lessons
            </button>
            <button
              className={selectedTab === "flashcards" ? "tab active" : "tab"}
              onClick={() => setSelectedTab("flashcards")}
            >
              Recent Flashcards
            </button>
          </div>

          {selectedTab === "lessons" && (
            <section>
              <h2>Recent Lessons</h2>
              <div className="lesson-list">
                {recentLessons.length > 0 ? (
                  recentLessons
                    .slice(0, 3)
                    .map((lesson) => (
                      <LessonCard key={lesson.id} lesson={lesson} />
                    ))
                ) : (
                  <p>You didn't acces any lesson.</p>
                )}
              </div>
            </section>
          )}

          {selectedTab === "flashcards" && (
            <section>
              <h2>Recent Flashcards</h2>
              <div className="test-list">
                {recentTests.length > 0 ? (
                  recentTests
                    .slice(0, 3)
                    .map((test) => <TestCard key={test.id} test={test} />)
                ) : (
                  <p>You didn't acces any test.</p>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  </div>
);


};

export default Home;
