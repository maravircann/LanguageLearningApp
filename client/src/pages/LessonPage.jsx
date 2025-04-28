import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import WordItem from '../components/Lessons/WordItem';
import ExpressionItem from '../components/Lessons/ExpressionItem';
import './LessonPage.css'; // Poți crea apoi un fișier pentru stilizare

const LessonPage = () => {
  const { lessonId } = useParams(); // Luăm id-ul lecției din URL
  const [words, setWords] = useState([]);
  const [expressions, setExpressions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessonContent = async () => {
      try {
        const token = localStorage.getItem('token');

        const wordRes = await fetch(`http://localhost:5000/api/words/lesson/${lessonId}`, {
          headers: { Authorization: token },
        });
        const expressionRes = await fetch(`http://localhost:5000/api/expressions/lesson/${lessonId}`, {
          headers: { Authorization: token },
        });

        const wordsData = await wordRes.json();
        const expressionsData = await expressionRes.json();

        setWords(wordsData);
        setExpressions(expressionsData);
      } catch (error) {
        console.error('Error loading lesson content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonContent();
  }, [lessonId]);

  if (loading) {
    return <div className="lesson-loading">Loading lesson...</div>;
  }

  return (
    <div className="lesson-page">
      <h1>Lesson {lessonId}</h1>

      <section className="words-section">
        <h2>Words</h2>
        {words.length > 0 ? (
          words.map((word) => <WordItem key={word.id} word={word.word} />)
        ) : (
          <p>No words available.</p>
        )}
      </section>

      <section className="expressions-section">
        <h2>Expressions</h2>
        {expressions.length > 0 ? (
          expressions.map((expr) => <ExpressionItem key={expr.id} expression={expr.expression} />)
        ) : (
          <p>No expressions available.</p>
        )}
      </section>
    </div>
  );
};

export default LessonPage;
