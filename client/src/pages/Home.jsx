import React from 'react';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Bine ai revenit!</h1>

      {/* Domeniu selectabil */}
      {/* <SpinnerDomain /> */}

      {/* Lecții disponibile */}
      <section>
        <h2>Lecțiile tale</h2>
        {/* <LessonCard /> pentru fiecare lecție */}
      </section>

      {/* Teste disponibile */}
      <section>
        <h2>Teste Flashcard</h2>
        {/* <FlashcardPreview /> sau un buton care te duce la test */}
      </section>

      {/* Scurt rezumat sau acces către raport */}
      <section>
        <h2>Progresul tău</h2>
        {/* <ReportStats /> sau link către /report */}
      </section>
    </div>
  );
};

export default Home;
