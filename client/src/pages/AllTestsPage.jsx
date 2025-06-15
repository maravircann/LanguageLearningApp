import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TestCard from "../components/Tests/TestCard";
import Sidebar from "../components/Shared/Sidebar";
import TopNavbar from "../components/Shared/TopNavbar";
import "./AllTestsPage.css";

const AllTestsPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testTab, setTestTab] = useState("all"); 
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const domainId = user?.domain_id;
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('language') || 'en');
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/tests", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch tests");

        const data = await response.json();
        setTests(data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const filteredTests = tests.filter((test) => test.domain_id === domainId);

  const displayedTests = filteredTests.filter((test) => {
    if (testTab === "completed") return test.completed === true;
    if (testTab === "incomplete") return test.completed === false;
    return true;
  });

  return (
    <div className="page">
      <TopNavbar />
      <div className="layout">
        <Sidebar
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />
        <main className="main-content">
          <h2 className="section-title">All flashcards</h2>

          {/* Tablist pentru filtrare */}
          <div className="lesson-tablist">
            <button
              className={testTab === "all" ? "active" : ""}
              onClick={() => setTestTab("all")}
            >
              All flashcards
            </button>
            <button
              className={testTab === "completed" ? "active" : ""}
              onClick={() => setTestTab("completed")}
            >
              Completed
            </button>
            <button
              className={testTab === "incomplete" ? "active" : ""}
              onClick={() => setTestTab("incomplete")}
            >
              Incomplete
            </button>
          </div>

          {/* Testele filtrate afișate în grid */}
          {loading ? (
            <p>Flashcards loading...</p>
          ) : (
            <div className="lesson-grid">
              {displayedTests.length > 0 ? (
                displayedTests.map((test) => (
                  <TestCard key={test.id} test={test} />
                ))
              ) : (
                <p>There are no flashcards available for this category...</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllTestsPage;
