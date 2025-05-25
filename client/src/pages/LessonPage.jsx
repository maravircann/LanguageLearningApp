import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Adăugat useNavigate
import TopNavbar from "../components/Shared/TopNavbar";
import Sidebar from "../components/Shared/Sidebar";
import "./LessonPage.css";
import { translateText } from "../utils/translateText";

const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Adăugat
  const user = JSON.parse(localStorage.getItem("user"));
  const selectedLanguage = localStorage.getItem("language") || "en";
  const [lessonWords, setLessonWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const [startTime, setStartTime] = useState(null); 

  useEffect(() => {
    setStartTime(Date.now()); 
  }, []);

  const handleLanguageChange = (lang) => {
    localStorage.setItem("language", lang);
    window.location.reload();
  };

  const handleFinishLesson = async () => {
  try {
    const token = localStorage.getItem("token");

    const endTime = Date.now();
      const timeSpentInMs = endTime - startTime;
      const timeSpentInMinutes = Math.floor(timeSpentInMs / 60000); 

    // Marchează lecția ca finalizată
    const resLesson = await fetch(`http://localhost:5000/api/lessons/${id}/complete`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!resLesson.ok) throw new Error("Failed to mark lesson as completed");

    // 🔥 Modificare aici: trimitem user_id în URL
    const resReport = await fetch(`http://localhost:5000/api/report/lesson/${user.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ new_lesson_time: timeSpentInMinutes }), // exemplu timp (în minute)
    });

    if (!resReport.ok) throw new Error("Failed to update report");

    navigate("/lessons");
  } catch (error) {
    console.error("Error finishing lesson:", error);
    alert("A apărut o eroare la finalizarea lecției.");
  }
};


  const TranslationRenderer = ({ word }) => {
    const [translated, setTranslated] = useState("...");

    useEffect(() => {
      const cacheKey = `translation_${word}_${selectedLanguage}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        setTranslated(cached);
        return;
      }

      const fetchTranslation = async () => {
        const result = await translateText(word, "en", selectedLanguage);
        localStorage.setItem(cacheKey, result);
        setTranslated(result);
      };

      fetchTranslation();
    }, [word, selectedLanguage]);

    const speakWord = (text, langCode) => {
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find((voice) =>
        voice.lang.startsWith(langCode)
      );

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    };

    return (
      <div className="vocab-line">
        <p>
          Translation: <em>{translated}</em>
        </p>
        <button
          className="speak-btn"
          onClick={() => speakWord(word, selectedLanguage)}
          title="Listen"
        >
          🔊
        </button>
      </div>
    );
  };

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/words?lesson_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch words");

        const data = await response.json();

        const filtered = data
          .filter((word) => word.domain_id === user.domain_id)
          .slice(0, 10);

        setLessonWords(filtered);
      } catch (error) {
        console.error("Error loading words:", error);
      } finally {
        setLoading(false);
      }
    };

    window.speechSynthesis.onvoiceschanged = () => {};

    fetchWords();
  }, [id, user.domain_id]);

  return (
    <div className="page">
      <TopNavbar />
      <div className="layout">
        <Sidebar
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />

        <main className="main-content">
          <h2>Lecția #{id}</h2>

          <div className="lesson-tablist">
            <button
              className={activeTab === "content" ? "active" : ""}
              onClick={() => setActiveTab("content")}
            >
              Content
            </button>
            <button
              className={activeTab === "vocabulary" ? "active" : ""}
              onClick={() => setActiveTab("vocabulary")}
            >
              Vocabulary
            </button>
          </div>

          {loading ? (
            <p>Se încarcă lecția...</p>
          ) : (
            <>
              {activeTab === "content" && (
                <div className="word-list">
                  {lessonWords.map((word) => (
                    <div key={word.id} className="word-item">
                      <strong>{word.word}</strong>
                      <p>{word.explanation || "Fără explicație momentan."}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "vocabulary" && (
                <div className="word-list">
                  {lessonWords.map((word) => (
                    <div key={word.id} className="word-item">
                      <strong>{word.word}</strong>
                      <TranslationRenderer word={word.word} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* 🔥 Buton Finish Lesson poziționat în dreapta jos */}
      <button
        className="finish-lesson-btn"
        onClick={handleFinishLesson}
      >
        Finish Lesson
      </button>
    </div>
  );
};

export default LessonPage;
