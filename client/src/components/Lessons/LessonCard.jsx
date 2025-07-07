import React from "react";
import { useNavigate } from "react-router-dom";
import './LessonCard.css';

const LessonCard =({ lesson })=> {
    const navigate = useNavigate();
    
    const handleStartLesson = () => {
    const recentLessons = JSON.parse(localStorage.getItem("recentLessons") || "[]");
    const updated = [lesson, ...recentLessons.filter((l) => l.id !== lesson.id)];
    localStorage.setItem("recentLessons", JSON.stringify(updated.slice(0, 10)));
    navigate(`/lesson/${lesson.id}`);
    }

    return (
        <div className="lesson-card">
          <h2>{lesson.title}</h2>
          <p>{lesson.description}</p>
          <button onClick={handleStartLesson}>Start Lesson</button>
        </div>
      );
};

export default LessonCard;
