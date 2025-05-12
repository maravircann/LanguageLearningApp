import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LessonCard from "../components/Lessons/LessonCard";
import Sidebar from "../components/Shared/Sidebar";
import TopNavbar from "../components/Shared/TopNavbar";
import "./AllLessonsPage.css";

const AllLessonsPage = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lessonTab, setLessonTab] = useState("all"); // all, completed, incomplete
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const domainId = user?.domain_id;
  const selectedLanguage = localStorage.getItem("language") || "en";

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/lessons", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch lessons");

        const data = await response.json();
        setLessons(data);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const handleLanguageChange = (lang) => {
    localStorage.setItem("language", lang);
  };

  const filteredLessons = lessons.filter(
    (lesson) => lesson.domain_id === domainId
  );

  const displayedLessons = filteredLessons.filter((lesson) => {
    if (lessonTab === "completed") return lesson.completed === true;
    if (lessonTab === "incomplete") return lesson.completed === false;
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
          <h2 className="section-title">All lessons</h2>

          {/* Tablist pentru filtrare */}
          <div className="lesson-tablist">
            <button
              className={lessonTab === "all" ? "active" : ""}
              onClick={() => setLessonTab("all")}
            >
              All lessons
            </button>
            <button
              className={lessonTab === "completed" ? "active" : ""}
              onClick={() => setLessonTab("completed")}
            >
              Completed
            </button>
            <button
              className={lessonTab === "incomplete" ? "active" : ""}
              onClick={() => setLessonTab("incomplete")}
            >
              Incomplete
            </button>
          </div>

          {/* Lecțiile filtrate afișate în grid */}
          {loading ? (
            <p>Lessons loading...</p>
          ) : (
            <div className="lesson-grid">
              {displayedLessons.length > 0 ? (
                displayedLessons.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))
              ) : (
                <p>There are no lessons available for this category...</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllLessonsPage;
