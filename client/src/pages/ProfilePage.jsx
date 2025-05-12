import React, { useEffect, useState } from "react";
import TopNavbar from "../components/Shared/TopNavbar";
import Sidebar from "../components/Shared/Sidebar";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [report, setReport] = useState(null);
  const [domainName, setDomainName] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const selectedLanguage = localStorage.getItem("language") || "Engleză";

  useEffect(() => {
    const fetchReportAndDomain = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch raport
        const reportRes = await fetch(`http://localhost:5000/api/report/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reportData = await reportRes.json();
        setReport(reportData);

        // Fetch domeniu
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
  }, [user.id, user.domain_id]);

  if (!report) {
    return <div className="main-content">Loading profile data...</div>;
  }

  // Calcule distribuție activitate (din total_time)
  const lessonsPercent = Math.round((report.avg_lesson_time * report.lessons_completed) / report.total_time * 100) || 0;
  const testsPercent = Math.round((report.avg_test_time * report.tests_completed) / report.total_time * 100) || 0;
  const flashcardsPercent = 100 - lessonsPercent - testsPercent;

  return (
    <div className="page">
      <TopNavbar />
      <div className="layout">
        <Sidebar selectedLanguage={selectedLanguage} />

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
                <span className="level">Intermediate</span>
                <div className="progress-bar-home">
                  <div className="filled" style={{ width: `${report.progress_percent}%` }}></div>
                </div>
              </div>

              <div className="stats-grid">
                <div><strong>{report.lessons_completed}</strong><p>Lessons</p></div>
                <div><strong>{report.lessons_completed * 12}</strong><p>Flashcards</p></div>
                <div><strong>32</strong><p>Active days</p></div>
              </div>
            </div>

            {/* CARD DREAPTA */}
            <div className="profile-info">
              <h3>Personal info</h3>
              <div className="info-pair"><strong>Full name:</strong><span>{user.name}</span></div>
              <div className="info-pair"><strong>Email:</strong><span>{user.email}</span></div>
              <div className="info-pair"><strong>Profesional domain:</strong><span>{domainName}</span></div>
              <div className="info-pair"><strong>Language you’re learning:</strong><span>{selectedLanguage}</span></div>
              <div className="info-pair"><strong>Member since:</strong><span>january 2024</span></div>

              <div className="section-divider" />
              <h4>Your learning distribution</h4>
              <p className="subtext">Breakdown of your learning time</p>

              <div className="progress-breakdown">
                <p>Lessons <span>{lessonsPercent}%</span></p>
                <div className="bar"><div className="filled" style={{ width: `${lessonsPercent}%` }}></div></div>

                <p>Flashcards <span>{flashcardsPercent}%</span></p>
                <div className="bar"><div className="filled" style={{ width: `${flashcardsPercent}%` }}></div></div>

                
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
