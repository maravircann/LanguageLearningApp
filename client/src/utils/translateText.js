export const translateText = async (text, targetLang) => {
  const token = localStorage.getItem("token");
  console.log("🔍 Traducere:", text, "→", targetLang);
  console.log("🔐 Token:", token);

  try {
    const response = await fetch("http://localhost:5000/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text, targetLang }),
    });

    if (!response.ok) {
      console.warn("❗ Response not OK:", response.status);
      throw new Error("Translation failed");
    }

    const data = await response.json();
    console.log("✅ Traducere reușită:", data.translatedText);
    return data.translatedText;
  } catch (error) {
    console.error("❌ Eroare la traducere:", error);
    return "Translation error";
  }
};
