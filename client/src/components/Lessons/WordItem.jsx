import React from 'react';
import './WordItem.css';

const WordItem = ({ word }) => {

  const handlePlayAudio = async () => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US'; // sau altă limbă dacă dorești
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="word-card" onClick={handlePlayAudio}>
      <p>{word}</p>
    </div>
  );
};

export default WordItem;
