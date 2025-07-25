import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopNavbar from "../components/Shared/TopNavbar";
import Sidebar from "../components/Shared/Sidebar";
import "./LessonPage.css";
import { translateText } from "../utils/translateText";

const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [lessonWords, setLessonWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const [startTime, setStartTime] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("language") || "");
  const [lessonTitle, setLessonTitle] = useState(""); // 🟢 Titlul lecției

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    localStorage.setItem("language", lang);

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("translation_")) {
        localStorage.removeItem(key);
      }
    });
  };

  const handleFinishLesson = async () => {
    try {
      const token = localStorage.getItem("token");
      const endTime = Date.now();
      const timeSpentInMinutes = Math.max(1, Math.floor((endTime - startTime) / 60000));

      const resLesson = await fetch(`http://localhost:5000/api/lessons/${id}/complete`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          new_lesson_time: timeSpentInMinutes,
        }),
      });

      if (!resLesson.ok) {
        const errorData = await resLesson.json();
        alert(errorData.message || "Failed to complete the lesson.");
        return;
      }

      navigate("/lessons", { state: { refreshReport: true } });
    } catch (error) {
      console.error("Error finishing lesson:", error);
      alert("A apărut o eroare la finalizarea lecției.");
    }
  };

  const TranslationRenderer = ({ word, selectedLanguage }) => {
    const [translated, setTranslated] = useState("...");

    useEffect(() => {
      const cacheKey = `translation_${word}_${selectedLanguage}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        setTranslated(cached);
        return;
      }

      const fetchTranslation = async () => {
        const result = await translateText(word, selectedLanguage);
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
          onClick={() => speakWord(translated, selectedLanguage)}
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

        // 🟢 Fetch titlul lecției
        const lessonRes = await fetch(`http://localhost:5000/api/lessons/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        let lessonTitleFetched = `Lesson ${id}`;
        if (lessonRes.ok) {
          const lessonData = await lessonRes.json();
          lessonTitleFetched = lessonData.title;
          setLessonTitle(lessonTitleFetched);
        }

        const response = await fetch(`http://localhost:5000/api/words?lesson_id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch words");

        const data = await response.json();

        const filtered = data
          .filter((word) => word.domain_id === user.domain_id)
          .slice(0, 10);

        setLessonWords(filtered);

        // 🟢 Salvăm în recents cu titlul real
        if (filtered.length > 0) {
          const currentLesson = {
            id: parseInt(id),
            domain_id: user.domain_id,
            title: lessonTitleFetched,
          };

          const key = `recentLessons_${user.id}`;
          let recent = JSON.parse(localStorage.getItem(key)) || [];

          recent = recent.filter((lesson) => lesson.id !== currentLesson.id);
          recent.unshift(currentLesson);
          if (recent.length > 10) {
            recent = recent.slice(0, 10);
          }

          localStorage.setItem(key, JSON.stringify(recent));
        }
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
          <h2>{lessonTitle || `Lesson ${id}`}</h2>

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
            <p>Lesson loading...</p>
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
                      <TranslationRenderer
                        word={word.word}
                        selectedLanguage={selectedLanguage}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <button className="finish-lesson-btn" onClick={handleFinishLesson}>
        Finish Lesson
      </button>
    </div>
  );
};

export default LessonPage;
