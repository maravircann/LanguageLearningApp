import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import TopNavbar from "../components/Shared/TopNavbar";
import Sidebar from "../components/Shared/Sidebar";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [report, setReport] = useState(null);
  const [domainName, setDomainName] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('language') || "");
  const location = useLocation(); 
  const navigate = useNavigate();
  useEffect(() => {
    const fetchReportAndDomain = async () => {
      try {
        const token = localStorage.getItem("token");

        
        const reportRes = await fetch(`http://localhost:5000/api/report/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reportData = await reportRes.json();
        setReport(reportData);

       
        const domainRes = await fetch(`http://localhost:5000/api/domains/${user.domain_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const domainData = await domainRes.json();
        setDomainName(domainData.name);
      } catch (error) {
        console.error("Eroare la profil:", error);
      }
    };

    fetchReportAndDomain();
  }, [user.id, user.domain_id, location.state?.refreshReport]); 

   const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    localStorage.setItem('language', lang);
  };
  
  if (!report) {
    return <div className="main-content">Loading profile data...</div>;
  }


  const totalTimeMinutes = report.total_time || 1; 
  const lessonsTime = (report.avg_lesson_time || 0) * report.lessons_completed;
  const flashcardsTime = (report.avg_test_time || 0) * report.tests_completed;
  const lessonsPercent = Math.round((lessonsTime / totalTimeMinutes) * 100);
  const flashcardsPercent = Math.round((flashcardsTime / totalTimeMinutes) * 100);
  const otherPercent = Math.max(0, 100 - lessonsPercent - flashcardsPercent);

  return (
    <div className="page">
      <TopNavbar />
      <div className="layout">
        <Sidebar  selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange} />

        <main className="main-content profile-page">
          <h2>Personal profile</h2>
          <p className="subtitle">View and manage your personal information and progress.</p>

          <div className="profile-grid">
            {/* CARD STÂNGA */}
            <div className="profile-summary">
              <div className="avatar-placeholder">
                <span className="avatar-initial">{user.name[0]}</span>
              </div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>

              <div className="progress-section">
                <span className="label">General level:</span>
                <span className="level">
                  {report.progress_percent < 40
                    ? " Beginner"
                    : report.progress_percent > 80
                    ? " Advanced"
                    : " Intermediate"}
                </span>
                <div className="progress-bar-home">
                  <div className="filled" style={{ width: `${report.progress_percent}%` }}></div>
                </div>
              </div>

              <div className="stats-grid">
                <div><strong>{report.lessons_completed}</strong><p>Lessons</p></div>
                <div><strong>{report.tests_completed}</strong><p>Flashcards</p></div>
                <div><strong>
                {user.created_at
                   ? Math.max(1, Math.floor((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24)))
                    : 0}
                </strong><p>Active days</p>
                </div>

                <div><strong>{report.total_time ? (report.total_time).toFixed(1) : 0}</strong><p>Total time (min)</p></div>
                <div><strong>{report.avg_lesson_time ? report.avg_lesson_time.toFixed(1) : 0}</strong><p>Avg lesson time (min)</p></div>
                <div><strong>{report.avg_test_time ? report.avg_test_time.toFixed(1) : 0}</strong><p>Avg flashcard time (min)</p></div>
                <div><strong><button onClick={() => navigate("/report")} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Generate report</button></strong></div>
              </div>
            </div>

            {/* CARD DREAPTA */}
            <div className="profile-info">
              <h3>Personal info</h3>
              <div className="info-pair"><strong>Full name:</strong><span>{user.name}</span></div>
              <div className="info-pair"><strong>Email:</strong><span>{user.email}</span></div>
              <div className="info-pair"><strong>Profesional domain:</strong><span>{domainName}</span></div>
              <div className="info-pair"><strong>Language you’re learning:</strong><span>{selectedLanguage}</span></div>
              <div className="info-pair">
              <strong>Member since:</strong>
              <span>{user.created_at &&
              new Date(user.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long"
              })
              }</span>
              </div>


              <div className="section-divider" />
              <h4>Your learning distribution</h4>
              <p className="subtext">Breakdown of your learning time</p>

              <div className="progress-breakdown">
                <p>Lessons <span>{lessonsPercent}%</span></p>
                <div className="bar"><div className="filled" style={{ width: `${lessonsPercent}%` }}></div></div>

                <p>Flashcards <span>{flashcardsPercent}%</span></p>
                <div className="bar"><div className="filled" style={{ width: `${flashcardsPercent}%` }}></div></div>

                {otherPercent > 0 && (
                  <>
                    <p>Other <span>{otherPercent}%</span></p>
                    <div className="bar"><div className="filled" style={{ width: `${otherPercent}%` }}></div></div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
