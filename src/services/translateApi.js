// src/services/translateApi.js
export const translateText = async (text) => {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|es`
    );
    const data = await response.json();
    return data.responseData.translatedText;
  } catch (error) {
    console.error("Error al traducir:", error);
    return text;
  }
};
