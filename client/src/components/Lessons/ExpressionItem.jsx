import React from 'react';
import './ExpressionItem.css';

const ExpressionItem = ({ expression }) => {

  const handlePlayAudio = async () => {
    const utterance = new SpeechSynthesisUtterance(expression);
    utterance.lang = 'en-US'; // Setezi limba după nevoie
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="expression-card" onClick={handlePlayAudio}>
      <p>{expression}</p>
    </div>
  );
};

export default ExpressionItem;
