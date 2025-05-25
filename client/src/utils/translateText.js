export const translateText = async (text, targetLang) => {
  try {
    const response = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: targetLang,
        format: "text",
      }),
    });

    if (!response.ok) throw new Error("Translation failed");

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return "Translation error";
  }
};


