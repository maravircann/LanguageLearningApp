import OpenAI from "openai";



const translateText = async (req, res) => {
  const { text, targetLang } = req.body;
  console.log(" Cerere de traducere:", text, "→", targetLang);

  const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

  try {
    const prompt = `Translate the following text to ${targetLang}:\n\n"${text}"`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const translated = response.choices[0].message.content.trim();
    res.json({ translatedText: translated });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Translation failed" });
  }
};
export default {
  translateText,
};