import React, { useEffect, useState } from 'react';
import translateText from '../../utils/translateText';

import './Flashcard.css';

const Flashcard = ({ word, flipped, handleFlip }) => {
  const [translatedWord, setTranslatedWord] = useState(word);

  useEffect(() => {
    const doTranslate = async () => {
      const lang = localStorage.getItem('language') || 'en';
      console.log('Language selected:', lang);
      console.log('Word to translate:', word);
  
      if (lang !== 'en') {
        try {
          const result = await translateText(word, lang);
          console.log('Translated result:', result);
          setTranslatedWord(result);
        } catch (error) {
          console.error('Translation error:', error);
        }
      } else {
        setTranslatedWord(word);
      }
    };
  
    doTranslate();
  }, [word]);
  

  return (
    <div className="flashcard-container" onClick={handleFlip}>
      <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
        <div className="front">
          <h2>{translatedWord}</h2> {/* Afișăm traducerea */}
        </div>
        <div className="back">
          <h2>{translatedWord}</h2> {/* Afișăm traducerea și pe spate */}
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
