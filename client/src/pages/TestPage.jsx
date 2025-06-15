import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Flashcard from '../components/Tests/Flashcard';
import './TestPage.css';
import { useNavigate } from "react-router-dom";

const TestPage = () => {
  const { id } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();
  useEffect(() => {
    setStartTime(Date.now()); 

    
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/tests/${id}/flashcards`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setFlashcards(data);
      } catch (error) {
        console.error('Error loading flashcards:', error);
      }
    };

    fetchFlashcards();
  }, [id]);

  const handleFlip = () => {
    setFlipped(true);
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (currentIndex + 1 < flashcards.length) {
      setCurrentIndex((prev) => prev + 1);
      setFlipped(false);
    } else {
      setShowResult(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setScore(0);
    setFlipped(false);
    setShowResult(false);
    setStartTime(Date.now()); 
  };

 const handleFinishTest = async () => {
  try {
    const token = localStorage.getItem("token");
    const endTime = Date.now();
    const timeSpentInMinutes = Math.max(1, Math.floor((endTime - startTime) / 60000));
    const mistakes = flashcards.length - score;

    const res = await fetch(`http://localhost:5000/api/tests/${id}/complete`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        test_id: id,              
        new_test_time: timeSpentInMinutes, 
        new_mistakes: mistakes,    
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert(errorData.message || "Failed to complete test.");
      return;
    }

    navigate("/flashcards", { state: { refreshReport: true } }); 
  } catch (error) {
    console.error("Error finishing test:", error);
    alert("A apărut o eroare la finalizarea testului.");
  }
};



  if (flashcards.length === 0) {
    return <div className="loading">Loading flashcards...</div>;
  }

  if (showResult) {
    return (
      <div className="result-container">
        <h2>Test completed!</h2>
        <p>You answered correctly {score} out of {flashcards.length} flashcards!</p>
        <button className="finish-button" onClick={handleFinishTest}>Finish Test</button>
        <button className="retry-button" onClick={handleRetry}>Retry</button>
        
      </div>
    );
  }

  return (
    <div className="test-page">
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{
            width: `${((currentIndex + (flipped ? 1 : 0)) / flashcards.length) * 100}%`,
          }}
        />
      </div>

      <Flashcard
        word={flashcards[currentIndex].word}
        flipped={flipped}
        handleFlip={handleFlip}
      />

      {!flipped ? (
        <button className="show-answer-button" onClick={handleFlip}>Show Answer</button>
      ) : (
        <div className="answer-buttons">
          <button className="correct-button" onClick={() => handleAnswer(true)}>I got it right</button>
          <button className="wrong-button" onClick={() => handleAnswer(false)}>I got it wrong</button>
        </div>
      )}

      <div className="progress">
        Flashcard {currentIndex + 1} / {flashcards.length}
      </div>

      <div className="test-controls">
        <button className="finish-button" onClick={handleFinishTest}>Finish Test</button>
        <button className="retry-button" onClick={handleRetry}>Retry</button>
      </div>
    </div>
  );
};

export default TestPage;
