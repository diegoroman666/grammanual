  // src/services/geminiApi.js
  import { GoogleGenerativeAI } from "@google/generative-ai";

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Asegúrate de configurar esto en .env.local

  // Accede a tu API Key como variable de entorno (Vite requiere VITE_ prefijo)
  // const genAI = new GoogleGenerativeAI(API_KEY); // Anteriormente
  let model;

  try {
    if (!API_KEY) {
      throw new Error("VITE_GEMINI_API_KEY no está definida. Por favor, configura tu clave API de Gemini.");
    }
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Reemplaza 'gemini-pro' por 'gemini-1.5-flash' o 'gemini-1.5-pro' si 'gemini-pro' sigue dando error.
    // 'gemini-1.5-flash' es más rápido y económico para estas tareas.
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    // Opcional: Para el modelo gemini-pro (legacy), la versión anterior era:
    // model = genAI.getGenerativeModel({ model: "gemini-pro"});

  } catch (error) {
    console.error("Error al inicializar la API de Gemini:", error);
    // Puedes manejar este error de forma más elegante en la UI si lo necesitas.
  }


  const generateGrammarFeedback = async (sentence, originalFormula, originalType) => {
    if (!model) {
      return {
        correct: false,
        feedback: "Error de configuración de la API.",
        explanation: "La API de Gemini no se pudo inicializar. Verifica tu clave API y la conexión.",
        suggestion: ""
      };
    }

    const prompt = `Eres un experto en gramática inglesa. Evalúa la siguiente oración en inglés: "${sentence}".
    La oración debe seguir la siguiente estructura gramatical para el tiempo pasado: "${originalFormula}".
    El tipo de oración esperado es: "${originalType}".
    
    Dame un feedback profesional, conciso y de élite sobre si la oración es CORRECTA o INCORRECTA, explicando el porqué en no más de 3-4 líneas.
    Si es incorrecta, sugiere una corrección.
    Si es correcta, confirma que lo es y explica brevemente por qué.
    Asegúrate de enfocarte en la concordancia sujeto-verbo, el uso de auxiliares y la forma del verbo para el tiempo pasado.
    Tu respuesta debe tener el siguiente formato JSON (solo el JSON, sin texto adicional antes ni después del bloque de código, es fundamental):
    \`\`\`json
    {
      "correct": boolean,
      "feedback": "string",
      "explanation": "string",
      "suggestion": "string"
    }
    \`\`\`
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text(); // Obtiene la respuesta como texto

      // Intentar parsear el JSON dentro del texto
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      let parsedData;
      if (jsonMatch && jsonMatch[1]) {
          parsedData = JSON.parse(jsonMatch[1]);
      } else {
          // Si no hay bloque de código, intenta parsear directamente si es JSON plano
          parsedData = JSON.parse(text);
      }
      
      return parsedData;

    } catch (error) {
      console.error("Error al obtener feedback de Gemini:", error);
      // Añadimos un mensaje más descriptivo para el usuario
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
        suggestion: ""
      };
    }
  };

  export { generateGrammarFeedback };