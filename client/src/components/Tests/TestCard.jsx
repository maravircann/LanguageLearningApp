import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TestCard.css'; 

const TestCard = ({ test }) => {
  const navigate = useNavigate();

  const handleStartTest = () => {
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
