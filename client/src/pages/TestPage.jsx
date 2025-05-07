import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Flashcard from '../components/Tests/Flashcard';
import './TestPage.css'; // dacă vrei să adaugi puțin stil

const TestPage = () => {
  const { id } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

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

  if (flashcards.length === 0) {
    return <div className="loading">Loading flashcards...</div>;
  }

  if (showResult) {
    return (
      <div className="result-container">
        <h2>Test completed!</h2>
        <p>You answered correctly {score} out of {flashcards.length} flashcards!</p>
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
    </div>
  );
};

export default TestPage;
