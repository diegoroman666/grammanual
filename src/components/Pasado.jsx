// src/pages/Pasado.jsx (COMPLETO DE INICIO A FIN)

import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal'; 
import { generateGrammarFeedback } from '../services/geminiApi';

const Pasado = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [inputValues, setInputValues] = useState({});
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [feedbackData, setFeedbackData] = useState(null); 
  const [showEnglishTranslation, setShowEnglishTranslation] = useState(false); 
  const [currentRowIndex, setCurrentRowIndex] = useState(null); 

  useEffect(() => {
    fetch('/estructura.xlsx')
      .then((res) => res.arrayBuffer())
      .then((ab) => {
        const wb = XLSX.read(ab, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

        const headers = jsonData[0];
        const rows = jsonData.slice(1).map((row) => {
          const obj = {};
          headers.forEach((header, i) => {
            obj[header?.toLowerCase()] = row[i];
          });
          return obj;
        });

        const filtrado = rows.filter((r) =>
          r['tiempo']?.toLowerCase()?.trim() === 'pasado'
        );

        setData(filtrado);
        setOriginalData(JSON.parse(JSON.stringify(filtrado)));

        const initialInputValues = {};
        filtrado.forEach((row, index) => {
          initialInputValues[index] = row['ejemplo'] || '';
        });
        setInputValues(initialInputValues);
      });
  }, []);

  const handleInputChange = (index, newValue) => {
    setInputValues(prevValues => ({
      ...prevValues,
      [index]: newValue
    }));
  };

  const handleRestart = (index) => {
    setInputValues(prevValues => ({
      ...prevValues,
      [index]: originalData[index]['ejemplo']
    }));
  };

  const handleCheck = async (index) => {
    setCurrentRowIndex(index);
    const sentenceToCheck = inputValues[index];
    const originalFormula = data[index]['formula'];
    const originalType = data[index]['tipo de oracion'];

    if (!sentenceToCheck.trim()) {
      setModalTitle('Advertencia');
      setFeedbackData({
        correct: false,
        feedback: "¡Ojo!",
        explanation: "Por favor, ingresa una oración para comprobar.",
        suggestion: "", 
        explanation_en: "",
        suggestion_en: ""
      });
      setShowEnglishTranslation(false);
      setModalVisible(true);
      return; 
    }

    setModalTitle('Comprobando...');
    setFeedbackData(null); 
    setShowEnglishTranslation(false); 
    setModalVisible(true); 

    try {
      const feedback = await generateGrammarFeedback(sentenceToCheck, originalFormula, originalType);
      
      let icon = '';
      if (feedback.correct) {
        icon = '✔️';
      } else {
        icon = '❌';
      }

      setModalTitle(`${icon} ${feedback.feedback}`);
      setFeedbackData(feedback);
      
    } catch (error) {
      console.error("Error al obtener feedback:", error);
      setModalTitle('Error');
      setFeedbackData({
        correct: false,
        feedback: "Error en el servicio de gramática.",
        explanation: `Ocurrió un error al verificar la gramática. Detalles: ${error.message}. Asegúrate de que tu clave API de Gemini esté configurada correctamente y de tener conexión a internet.`,
        suggestion: "",
        explanation_en: "",
        suggestion_en: ""
      });
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalTitle('');
    setFeedbackData(null);
    setShowEnglishTranslation(false);
    setCurrentRowIndex(null);
  };

  const handleCopySuggestion = () => {
    if (feedbackData && (feedbackData.suggestion || feedbackData.suggestion_en) && currentRowIndex !== null) {
      const textToCopy = showEnglishTranslation ? feedbackData.suggestion_en : feedbackData.suggestion;
      
      if (textToCopy) {
        // Asignamos directamente el texto, ya que el prompt de Gemini
        // se ha ajustado para que la 'suggestion' solo contenga la oración limpia.
        const cleanText = textToCopy.trim(); 

        setInputValues(prevValues => ({
          ...prevValues,
          [currentRowIndex]: cleanText 
        }));
        
        closeModal(); 
      }
    }
  };

  const renderModalContent = () => {
    if (!feedbackData) {
      return (
        <div className="d-flex flex-column align-items-center justify-content-center py-4">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-center text-muted">Analizando tu oración con IA. Por favor, espera...</p>
        </div>
      );
    }

    const explanation = showEnglishTranslation ? feedbackData.explanation_en : feedbackData.explanation;
    const suggestion = showEnglishTranslation ? feedbackData.suggestion_en : feedbackData.suggestion;
    
    const textColorClass = feedbackData.correct ? 'text-success' : 'text-danger';

    // Determinar el prefijo para la sugerencia:
    // "Oración de ejemplo:" si es correcta, "Sugerencia:" si es incorrecta.
    const suggestionPrefix = feedbackData.correct ? 'Oración de ejemplo: ' : 'Sugerencia: ';

    return (
      <div className={`text-center ${textColorClass}`}>
        {feedbackData.correct ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-check-circle-fill mx-auto mb-3" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-x-circle-fill mx-auto mb-3" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708"/>
          </svg>
        )}
        
        <p className="fw-semibold mb-2">{explanation}</p>
        
        {/* La sugerencia solo se muestra y es clicable si hay contenido en 'suggestion' */}
        {suggestion && suggestion.trim() !== '' && ( 
          <p className="mt-2 text-primary">
            {suggestionPrefix} <span
              className="suggestion-text-copyable" 
              title="Click para llevar esta oración a la casilla para comprobar." 
              onClick={handleCopySuggestion} 
            >
              {suggestion}
            </span>
          </p>
        )}
        
        {(feedbackData.explanation_en || feedbackData.suggestion_en) && (
          <button
            onClick={() => setShowEnglishTranslation(prev => !prev)}
            className="btn btn-outline-secondary mt-3 btn-sm"
          >
            {showEnglishTranslation ? 'Ver en Español' : 'Traducir al Inglés'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="container mt-4"> 
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Tabla del Tiempo Pasado</h2> 
        <Link to="/" className="btn btn-primary">
          Volver al Home
        </Link>
      </div>
      
      <table className="table table-bordered w-100">
        <thead>
          <tr className="table-secondary">
            <th className="p-2">Tiempo</th>
            <th className="p-2">Conjugación</th>
            <th className="p-2">Tipo de oración</th>
            <th className="p-2">Fórmula</th>
            <th className="p-2">Ejemplo</th>
            <th className="p-2">Acciones</th>
            <th className="p-2">Traducción</th>
            <th className="p-2">Traducción alternativa</th>
          </tr>
        </thead>
        <tbody>
          {data.map((fila, i) => (
            <tr key={i}>
              <td className="p-2">{fila['tiempo']}</td>
              <td className="p-2">{fila['conjugacion']}</td>
              <td className="p-2">{fila['tipo de oracion']}</td>
              <td className="p-2">{fila['formula']}</td>
              <td className="p-2">
                <input
                  type="text"
                  value={inputValues[i]}
                  onChange={(e) => handleInputChange(i, e.target.value)}
                  className="form-control"
                  placeholder="Escribe tu ejemplo aquí..."
                />
              </td>
              <td className="p-2">
                <div className="d-grid gap-2">
                  <button
                    onClick={() => handleCheck(i)}
                    className="btn btn-success"
                  >
                    Comprobar
                  </button>
                  <button
                    onClick={() => handleRestart(i)}
                    className="btn btn-danger"
                  >
                    Reiniciar
                  </button>
                </div>
              </td>
              <td className="p-2">{fila['traduccion']}</td>
              <td className="p-2">{fila['traduccion alternativa']}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal visible={modalVisible} onClose={closeModal} title={modalTitle}>
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default Pasado;