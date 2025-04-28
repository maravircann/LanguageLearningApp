import React from "react";
import { useNavigate } from "react-router-dom";
import './LessonCard.css';

const LessonCard =({ lesson })=> {
    const navigate = useNavigate();
    
    const handleStartLesson = () => {
        navigate(`/lessons/${lesson.id}`);
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
