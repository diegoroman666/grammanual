// src/services/translateApi.js
export const translateText = async (text, langpair = 'en|es') => {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`
    );
    const data = await response.json();
    return data.responseData.translatedText;
  } catch (error) {
    console.error("Error al traducir:", error);
    return text;
  }
};
