// src/services/translateApi.js
export async function translateText(text, targetLang = "es") {
  if (!text || text.trim() === "") return "";

  // Aquí podrías llamar a tu API real (Gemini, Google Translate, DeepL, etc.)
  // Ejemplo básico simulado:
  try {
    const response = await fetch("https://api-free-translate.vercel.app/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        target: targetLang
      }),
    });

    if (!response.ok) {
      console.warn("Fallo traducción, devolviendo texto original.");
      return text;
    }

    const result = await response.json();
    return result?.translatedText || text;
  } catch (err) {
    console.error("Error en translateText:", err);
    return text;
  }
}
