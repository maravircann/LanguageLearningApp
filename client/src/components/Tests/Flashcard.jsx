import React, { useEffect, useState } from "react";
import { translateText } from "../../utils/translateText"; // asigură-te că calea e corectă
import "./Flashcard.css";

const Flashcard = ({ word, flipped, handleFlip }) => {
  const [translatedWord, setTranslatedWord] = useState(word);

  useEffect(() => {
    const doTranslate = async () => {
      const lang = localStorage.getItem("language") || "en";
      const cacheKey = `translation_${word}_${lang}`;

      // dacă limba e engleză, nu traducem
      if (lang === "en") {
        setTranslatedWord(word);
        return;
      }

      // verificăm dacă avem traducerea în cache
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setTranslatedWord(cached);
        return;
      }

      try {
        const result = await translateText(word, lang);
        localStorage.setItem(cacheKey, result);
        setTranslatedWord(result);
      } catch (error) {
        console.error("Translation error:", error);
        setTranslatedWord("Translation failed");
      }
    };

    doTranslate();
  }, [word]);

  return (
    <div className="flashcard-container" onClick={handleFlip}>
      <div className={`flashcard ${flipped ? "flipped" : ""}`}>
        <div className="front">
          <h2>{translatedWord}</h2>
        </div>
        <div className="back">
          <h2>{translatedWord}</h2>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
