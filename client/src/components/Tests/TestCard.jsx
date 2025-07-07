import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TestCard.css'; 

const TestCard = ({ test }) => {
  const navigate = useNavigate();

   const handleStartTest = () => {
    const recentTests = JSON.parse(localStorage.getItem("recentTests") || "[]");
    const updated = [test, ...recentTests.filter((t) => t.id !== test.id)];
    localStorage.setItem("recentTests", JSON.stringify(updated.slice(0, 10)));
    navigate(`/test/${test.id}`);
  };

  return (
    <div className="test-card">
      <h2>{test.title}</h2>
      <p>{test.description}</p>
      <button onClick={handleStartTest}>Start Test</button>
    </div>
  );
};

export default TestCard;
