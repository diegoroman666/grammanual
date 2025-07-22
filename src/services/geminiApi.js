// src/services/geminiApi.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let model;

try {
  if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY no está definida. Por favor, configura tu clave API de Gemini.");
  }
  const genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

} catch (error) {
  console.error("Error al inicializar la API de Gemini:", error);
}

const generateGrammarFeedback = async (sentence, originalFormula, originalType) => {
  if (!model) {
    return {
      correct: false,
      feedback: "Error de configuración de la API.",
      explanation: "La API de Gemini no se pudo inicializar. Verifica tu clave API y la conexión.",
      suggestion: "",
      explanation_en: "", // Añadimos campo para la traducción al inglés
      suggestion_en: ""   // Añadimos campo para la traducción al inglés
    };
  }

  const prompt = `Eres un experto en gramática inglesa y siempre respondes en español.
Evalúa la siguiente oración en inglés: "${sentence}".
La oración debe seguir la siguiente estructura gramatical para el tiempo pasado: "${originalFormula}".
El tipo de oración esperado es: "${originalType}".
  
Dame un feedback profesional, conciso y de élite sobre si la oración es CORRECTA o INCORRECTA, explicando el porqué en no más de 3-4 líneas.
Si es incorrecta, sugiere una corrección.
Además, proporciona una traducción de tu explicación y sugerencia al inglés.
Tu respuesta debe tener el siguiente formato JSON (solo el JSON, sin texto adicional antes ni después del bloque de código, es fundamental):
\`\`\`json
{
  "correct": boolean,
  "feedback": "string", // Feedback corto en español
  "explanation": "string", // Explicación detallada en español
  "suggestion": "string", // Sugerencia en español
  "explanation_en": "string", // Explicación detallada en inglés
  "suggestion_en": "string" // Sugerencia en inglés
}
\`\`\`
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    let parsedData;
    if (jsonMatch && jsonMatch[1]) {
        parsedData = JSON.parse(jsonMatch[1]);
    } else {
        parsedData = JSON.parse(text);
    }
    
    return parsedData;

  } catch (error) {
    console.error("Error al obtener feedback de Gemini:", error);
    let errorMessage = "Hubo un problema al procesar tu solicitud.";
    if (error.message.includes("400") || error.message.includes("403")) {
        errorMessage = "Error de autenticación o solicitud inválida. Revisa tu clave API.";
    } else if (error.message.includes("429")) {
        errorMessage = "Demasiadas solicitudes. Inténtalo de nuevo más tarde.";
    } else if (error.message.includes("500") || error.message.includes("503")) {
        errorMessage = "Problema con el servidor de Gemini. Inténtalo de nuevo más tarde.";
    }
    
    return {
      correct: false,
      feedback: "Error en el servicio de gramática.",
      explanation: `${errorMessage} Detalles: ${error.message}`,
      suggestion: "",
      explanation_en: "",
      suggestion_en: ""
    };
  }
};

export { generateGrammarFeedback };