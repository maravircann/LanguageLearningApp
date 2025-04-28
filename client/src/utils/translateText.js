const translateText = async (text, targetLang) => {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text'
      }),
      headers: { 'Content-Type': 'application/json' }
    });
  
    const data = await response.json();
    return data.translatedText;
  };
  
  export default translateText;
  