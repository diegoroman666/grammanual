import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen, faHeadphones, faVolumeUp, faLanguage,
  faCheck, faTimes, faArrowRight, faArrowLeft, faRedo, faPause, faPlay,
} from '@fortawesome/free-solid-svg-icons';
import './PracticaLibre.css';

// Comprensión de lectura y audio: los dos formatos que el sistema de
// Módulos (Ruta de Aprendizaje) no cubre con preguntas de opción múltiple.
const exerciseData = [
  // ── Lectura (10) ──────────────────────────────────────────────────────────
  {
    id: 1,
    type: 'reading',
    title: 'Comprensión lectora',
    text: 'My name is Sarah. I am a teacher. Every morning, I wake up at 6 AM. I have breakfast at 7 AM and then I go to school. I teach English to students. After school, I usually go to the gym. In the evening, I like to read books or watch movies.',
    question: '¿Qué profesión tiene Sarah?',
    options: ['Maestra', 'Doctora', 'Abogada', 'Ingeniera'],
    correctAnswer: 'Maestra',
    explanation: 'El texto dice "I am a teacher" = Soy maestra.'
  },
  {
    id: 2,
    type: 'reading',
    title: 'Comprensión lectora',
    text: 'Last weekend, John went to the beach with his family. They swam in the ocean and played volleyball. The weather was perfect - sunny and warm. In the evening, they ate dinner at a restaurant near the beach. Everyone had a great time!',
    question: '¿Qué hicieron en la playa?',
    options: ['Nadaron y jugaron voleibol', 'Caminaron por la arena', 'Construyeron castillos', 'Surfear'],
    correctAnswer: 'Nadaron y jugaron voleibol',
    explanation: 'El texto dice "They swam in the ocean and played volleyball".'
  },
  {
    id: 3,
    type: 'reading',
    title: 'Comprensión lectora',
    text: 'Maria is a chef at a small Italian restaurant in the city center. She wakes up early every day to buy fresh vegetables at the market. Her specialty is homemade pasta with tomato sauce. Customers travel from far away just to taste her famous lasagna. She has worked there for eight years and loves creating new recipes.',
    question: '¿Cuál es la especialidad de Maria?',
    options: ['Pasta casera con salsa de tomate', 'Pizza napolitana', 'Ensaladas', 'Postres'],
    correctAnswer: 'Pasta casera con salsa de tomate',
    explanation: 'El texto dice "Her specialty is homemade pasta with tomato sauce".'
  },
  {
    id: 4,
    type: 'reading',
    title: 'Comprensión lectora',
    text: 'Tom is a college student studying engineering. He has classes every morning and spends his afternoons at the library working on projects. On weekends, he plays basketball with his friends to relax. He hopes to become a civil engineer and design bridges in the future.',
    question: '¿Qué quiere ser Tom en el futuro?',
    options: ['Ingeniero civil', 'Jugador de baloncesto', 'Bibliotecario', 'Profesor'],
    correctAnswer: 'Ingeniero civil',
    explanation: 'El texto dice "He hopes to become a civil engineer".'
  },
  {
    id: 5,
    type: 'reading',
    title: 'Comprensión lectora',
    text: "Emma moved to Canada two years ago to study French. At first, it was very difficult because she didn't understand the language well. Now she can have full conversations with her classmates. She still misses her family back home, but she calls them every Sunday to stay in touch.",
    question: '¿Con qué frecuencia llama Emma a su familia?',
    options: ['Cada domingo', 'Cada día', 'Una vez al mes', 'Nunca'],
    correctAnswer: 'Cada domingo',
    explanation: 'El texto dice "she calls them every Sunday".'
  },
  {
    id: 6,
    type: 'reading',
    title: 'Comprensión lectora',
    text: 'The manager sent an email to the whole team on Friday afternoon. The meeting originally planned for Monday morning was moved to Wednesday at 3 PM because several employees were traveling. Everyone was asked to confirm their attendance by replying to the email before the end of the day.',
    question: '¿A qué hora es la reunión reprogramada?',
    options: ['Miércoles a las 3 PM', 'Lunes por la mañana', 'Viernes por la tarde', 'Jueves a mediodía'],
    correctAnswer: 'Miércoles a las 3 PM',
    explanation: 'El texto dice "moved to Wednesday at 3 PM".'
  },
  {
    id: 7,
    type: 'reading',
    title: 'Comprensión lectora',
    text: 'David went to the doctor for his annual checkup. The nurse measured his height and weight before the doctor examined him. The doctor said his blood pressure was normal and recommended he exercise three times a week. David left the clinic feeling relieved and healthy.',
    question: '¿Qué le recomendó el doctor a David?',
    options: ['Hacer ejercicio tres veces por semana', 'Tomar más medicinas', 'Dormir menos', 'Comer menos verduras'],
    correctAnswer: 'Hacer ejercicio tres veces por semana',
    explanation: 'El texto dice "recommended he exercise three times a week".'
  },
  {
    id: 8,
    type: 'reading',
    title: 'Comprensión lectora',
    text: "Every Saturday morning, Laura goes to the supermarket to buy groceries for the week. She always makes a list first so she doesn't forget anything important. This week she bought fresh fruit, milk, bread, and chicken. She also bought some flowers because she likes to keep her kitchen colorful.",
    question: '¿Qué compró Laura además de comida?',
    options: ['Flores', 'Un libro', 'Ropa', 'Zapatos'],
    correctAnswer: 'Flores',
    explanation: 'El texto dice "she also bought some flowers".'
  },
  {
    id: 9,
    type: 'reading',
    title: 'Comprensión lectora',
    text: 'It rained heavily all weekend, so Peter decided to stay home instead of going hiking as planned. He spent Saturday reading a mystery novel and Sunday watching old movies with his cat. Even though his plans changed, he enjoyed the quiet, relaxing weekend at home.',
    question: '¿Qué hizo Peter el sábado?',
    options: ['Leyó una novela', 'Fue de excursión', 'Vio películas', 'Salió con amigos'],
    correctAnswer: 'Leyó una novela',
    explanation: 'El texto dice "He spent Saturday reading a mystery novel".'
  },
  {
    id: 10,
    type: 'reading',
    title: 'Comprensión lectora',
    text: "Anna is planning a surprise birthday party for her best friend Julia. She has invited fifteen guests and booked a small restaurant downtown. She ordered a chocolate cake because it's Julia's favorite. The party will start at 7 PM this Friday, and everyone must arrive early to hide before Julia walks in.",
    question: '¿Por qué eligió Anna un pastel de chocolate?',
    options: ['Porque es el favorito de Julia', 'Porque era el más barato', 'Porque el restaurante lo recomendó', 'Porque es fácil de hacer'],
    correctAnswer: 'Porque es el favorito de Julia',
    explanation: "El texto dice \"because it's Julia's favorite\"."
  },

  // ── Audio (10) ────────────────────────────────────────────────────────────
  {
    id: 11,
    type: 'audio',
    title: 'Ejercicio de audio',
    audioText: 'Hello, my name is Michael. I am a software developer. I work at a big tech company. Every day, I write code and test new applications. I love my job because it is very interesting.',
    question: '¿Qué tipo de trabajo tiene Michael?',
    options: ['Desarrollador de software', 'Diseñador gráfico', 'Marketing', 'Contador'],
    correctAnswer: 'Desarrollador de software',
    explanation: 'El audio dice "I am a software developer" = Soy desarrollador de software.'
  },
  {
    id: 12,
    type: 'audio',
    title: 'Ejercicio de audio',
    audioText: 'Good morning! Today is Monday, September 15th. The weather forecast says it will be sunny and warm today, around 25 degrees Celsius. Perfect weather for our outdoor activities!',
    question: '¿Qué día es según el audio?',
    options: ['Lunes', 'Martes', 'Miércoles', 'Domingo'],
    correctAnswer: 'Lunes',
    explanation: 'El audio dice "Today is Monday" = Hoy es lunes.'
  },
  {
    id: 13,
    type: 'audio',
    title: 'Ejercicio de audio',
    audioText: 'This is an automated message from SkyLine Airlines. Your flight number 482 to Chicago has been delayed by two hours due to bad weather. The new departure time is 6:45 PM at gate 14. We apologize for the inconvenience and thank you for your patience.',
    question: '¿Cuál es la nueva hora de salida del vuelo?',
    options: ['6:45 PM', '4:45 PM', '8:45 PM', '2:45 PM'],
    correctAnswer: '6:45 PM',
    explanation: 'El audio dice "The new departure time is 6:45 PM".'
  },
  {
    id: 14,
    type: 'audio',
    title: 'Ejercicio de audio',
    audioText: 'Excuse me, could you tell me how to get to the museum? Sure! Go straight down this street for two blocks, then turn left at the coffee shop. The museum will be on your right, right next to the park. It takes about ten minutes to walk there.',
    question: '¿Dónde está el museo?',
    options: ['A la derecha, junto al parque', 'A la izquierda del café', 'Detrás de la estación', 'Enfrente del hotel'],
    correctAnswer: 'A la derecha, junto al parque',
    explanation: 'El audio dice "The museum will be on your right, right next to the park".'
  },
  {
    id: 15,
    type: 'audio',
    title: 'Ejercicio de audio',
    audioText: "Hi, welcome to Green Garden restaurant. I would like to order a vegetable soup, a grilled chicken sandwich, and a glass of orange juice, please. Would you like anything for dessert? Yes, I'll have a slice of chocolate cake too.",
    question: '¿Qué pidió la persona para tomar?',
    options: ['Jugo de naranja', 'Café', 'Agua', 'Té helado'],
    correctAnswer: 'Jugo de naranja',
    explanation: 'El audio dice "a glass of orange juice".'
  },
  {
    id: 16,
    type: 'audio',
    title: 'Ejercicio de audio',
    audioText: "Every morning I wake up at 6 o'clock. First, I make my bed and brush my teeth. Then I have breakfast, usually eggs and toast, before going for a short run around the neighborhood. I leave for work at 8 o'clock.",
    question: '¿A qué hora sale la persona para el trabajo?',
    options: ['A las 8', 'A las 6', 'A las 7', 'A las 9'],
    correctAnswer: 'A las 8',
    explanation: "El audio dice \"I leave for work at 8 o'clock\"."
  },
  {
    id: 17,
    type: 'audio',
    title: 'Ejercicio de audio',
    audioText: 'Thank you for coming in today. Can you tell me about your previous experience? I worked as a marketing assistant for three years, where I managed social media campaigns and helped increase online sales by twenty percent.',
    question: '¿Qué logró la persona en su trabajo anterior?',
    options: ['Aumentar las ventas en línea un 20%', 'Contratar nuevos empleados', 'Abrir una nueva oficina', 'Reducir costos'],
    correctAnswer: 'Aumentar las ventas en línea un 20%',
    explanation: 'El audio dice "helped increase online sales by twenty percent".'
  },
  {
    id: 18,
    type: 'audio',
    title: 'Ejercicio de audio',
    audioText: 'Last weekend we went hiking in the mountains. The trail was longer than we expected, about twelve kilometers, but the view from the top was amazing. We saw a waterfall and even spotted some deer. We were tired but very happy when we got back to the car.',
    question: '¿Qué animales vieron durante la caminata?',
    options: ['Ciervos', 'Osos', 'Lobos', 'Águilas'],
    correctAnswer: 'Ciervos',
    explanation: 'El audio dice "we even spotted some deer".'
  },
  {
    id: 19,
    type: 'audio',
    title: 'Ejercicio de audio',
    audioText: 'Attention shoppers! Today only, all winter clothing is fifty percent off in the second floor. Shoes and accessories are thirty percent off. Do not miss this amazing sale, available only until the store closes at 9 PM tonight.',
    question: '¿Qué descuento tiene la ropa de invierno?',
    options: ['50%', '30%', '20%', '70%'],
    correctAnswer: '50%',
    explanation: 'El audio dice "all winter clothing is fifty percent off".'
  },
  {
    id: 20,
    type: 'audio',
    title: 'Ejercicio de audio',
    audioText: "Hey, do you have any plans for the weekend? Not really, why? I was thinking we could go to the new bowling alley downtown on Saturday afternoon. That sounds fun! What time should we meet? Let's say two o'clock at the entrance.",
    question: '¿A qué hora quedan en encontrarse?',
    options: ['A las dos', 'A la una', 'A las tres', 'A las cuatro'],
    correctAnswer: 'A las dos',
    explanation: "El audio dice \"Let's say two o'clock at the entrance\"."
  },
];

const filters = [
  { id: 'all',     label: 'Todos',  icon: faBookOpen },
  { id: 'reading', label: 'Lectura', icon: faBookOpen },
  { id: 'audio',   label: 'Audio',   icon: faHeadphones },
];

const PracticaLibre = () => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [translation, setTranslation] = useState('');
  const [audioStatus, setAudioStatus] = useState('idle'); // idle | playing | paused
  const [filter, setFilter] = useState('all');

  const exercise = exerciseData[currentExercise];
  const filteredExercises = filter === 'all'
    ? exerciseData
    : exerciseData.filter(e => e.type === filter);

  const currentFilteredIndex = filteredExercises.findIndex(e => e.id === exercise.id);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    const firstIndex = newFilter === 'all'
      ? 0
      : exerciseData.findIndex(e => e.type === newFilter);
    setCurrentExercise(firstIndex !== -1 ? firstIndex : 0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTranslation('');
    stopAudio();
  };

  const handleAnswer = (answer) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    const correct = answer === exercise.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleNext = () => {
    const nextIndex = currentFilteredIndex + 1;
    if (nextIndex < filteredExercises.length) {
      const nextExercise = filteredExercises[nextIndex];
      const actualIndex = exerciseData.findIndex(e => e.id === nextExercise.id);
      setCurrentExercise(actualIndex);
    } else {
      const firstIndex = filter === 'all'
        ? 0
        : exerciseData.findIndex(e => e.type === filter);
      setCurrentExercise(firstIndex !== -1 ? firstIndex : 0);
    }
    setSelectedAnswer(null);
    setShowResult(false);
    setTranslation('');
    stopAudio();
  };

  const handlePrev = () => {
    const prevIndex = currentFilteredIndex - 1;
    if (prevIndex < 0) return;
    const prevExercise = filteredExercises[prevIndex];
    const actualIndex = exerciseData.findIndex(e => e.id === prevExercise.id);
    setCurrentExercise(actualIndex);
    setSelectedAnswer(null);
    setShowResult(false);
    setTranslation('');
    stopAudio();
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setTranslation('');
    stopAudio();
  };

  const playAudio = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.onend = () => setAudioStatus('idle');
    window.speechSynthesis.speak(utterance);
    setAudioStatus('playing');
  };

  const pauseAudio = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.pause();
    setAudioStatus('paused');
  };

  const resumeAudio = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.resume();
    setAudioStatus('playing');
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setAudioStatus('idle');
  };

  const translateText = async (text) => {
    try {
      const response = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=en|es');
      const data = await response.json();
      setTranslation(data.responseData.translatedText);
    } catch {
      setTranslation('Error al traducir');
    }
  };

  const getTypeIcon = (type) => (type === 'audio' ? faHeadphones : faBookOpen);

  return (
    <div className="practica-libre-container">
      <div className="practica-libre-header">
        <h1>
          <FontAwesomeIcon icon={faBookOpen} />
          Práctica Libre
        </h1>
        <p>Comprensión de lectura y audio — complementa tus Módulos sin bloqueos ni límites</p>
      </div>

      <div className="filter-buttons">
        {filters.map(f => (
          <button
            key={f.id}
            className={`filter-btn ${filter === f.id ? 'active' : ''}`}
            onClick={() => handleFilterChange(f.id)}
          >
            <FontAwesomeIcon icon={f.icon} /> {f.label}
          </button>
        ))}
      </div>

      <div className="exercise-info">
        <span className="exercise-type">
          <FontAwesomeIcon icon={getTypeIcon(exercise.type)} />
          {exercise.title}
        </span>
        <span className="exercise-progress">
          Ejercicio {currentFilteredIndex + 1} de {filteredExercises.length}
        </span>
      </div>

      <div className="exercise-card">
        <div className="exercise-question">
          <h3>{exercise.question}</h3>

          {exercise.type === 'reading' && (
            <div className="reading-text">
              <div className="text-box">
                <h4>Texto en inglés:</h4>
                <p>{exercise.text}</p>
                <div className="text-actions">
                  {audioStatus === 'playing' ? (
                    <button className="audio-btn" onClick={pauseAudio}>
                      <FontAwesomeIcon icon={faPause} /> Pausar
                    </button>
                  ) : (
                    <button
                      className="audio-btn"
                      onClick={() => (audioStatus === 'paused' ? resumeAudio() : playAudio(exercise.text))}
                    >
                      <FontAwesomeIcon icon={audioStatus === 'paused' ? faPlay : faVolumeUp} />
                      {audioStatus === 'paused' ? 'Reanudar' : 'Escuchar'}
                    </button>
                  )}
                  <button
                    className="restart-btn"
                    onClick={() => playAudio(exercise.text)}
                    disabled={audioStatus === 'idle'}
                  >
                    <FontAwesomeIcon icon={faRedo} /> Reiniciar
                  </button>
                  <button
                    className="translate-btn"
                    onClick={() => translateText(exercise.text)}
                  >
                    <FontAwesomeIcon icon={faLanguage} /> Traducir
                  </button>
                </div>
                {translation && (
                  <div className="translation">
                    <strong>Traducción:</strong> {translation}
                  </div>
                )}
              </div>
            </div>
          )}

          {exercise.type === 'audio' && (
            <div className="audio-section">
              <div className="audio-section-controls">
                {audioStatus === 'playing' ? (
                  <button className="play-btn" onClick={pauseAudio}>
                    <FontAwesomeIcon icon={faPause} /> Pausar
                  </button>
                ) : (
                  <button
                    className="play-btn"
                    onClick={() => (audioStatus === 'paused' ? resumeAudio() : playAudio(exercise.audioText))}
                  >
                    <FontAwesomeIcon icon={audioStatus === 'paused' ? faPlay : faVolumeUp} />
                    {audioStatus === 'paused' ? 'Reanudar' : 'Escuchar conversación'}
                  </button>
                )}
                <button
                  className="restart-btn"
                  onClick={() => playAudio(exercise.audioText)}
                  disabled={audioStatus === 'idle'}
                >
                  <FontAwesomeIcon icon={faRedo} /> Reiniciar
                </button>
              </div>
              <p className="audio-hint">
                <FontAwesomeIcon icon={faHeadphones} />
                Escucha atentamente y responde la pregunta
              </p>
            </div>
          )}
        </div>

        <div className="exercise-options">
          {exercise.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn
                ${selectedAnswer === option ? 'selected' : ''}
                ${showResult && option === exercise.correctAnswer ? 'correct' : ''}
                ${showResult && selectedAnswer === option && !isCorrect ? 'incorrect' : ''}
              `}
              onClick={() => handleAnswer(option)}
              disabled={showResult}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
              {showResult && option === exercise.correctAnswer && (
                <FontAwesomeIcon icon={faCheck} className="icon-correct" />
              )}
              {showResult && selectedAnswer === option && option !== exercise.correctAnswer && (
                <FontAwesomeIcon icon={faTimes} className="icon-incorrect" />
              )}
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`exercise-result ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="result-header">
              <FontAwesomeIcon icon={isCorrect ? faCheck : faTimes} />
              {isCorrect ? '¡Correcto!' : 'Incorrecto'}
            </div>
            {!isCorrect && (
              <div className="correct-answer">
                <p>La respuesta correcta era:</p>
                <strong>{exercise.correctAnswer}</strong>
              </div>
            )}
            {exercise.explanation && (
              <div className="explanation">
                <p>
                  <FontAwesomeIcon icon={faBookOpen} />
                  <strong> Explicación:</strong> {exercise.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="exercise-actions">
          <button
            className="btn btn-secondary"
            onClick={handlePrev}
            disabled={currentFilteredIndex === 0}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Anterior
          </button>
          {showResult && (
            <button className="btn btn-primary" onClick={handleNext}>
              Siguiente <FontAwesomeIcon icon={faArrowRight} />
            </button>
          )}
          <button className="btn btn-secondary" onClick={handleRetry}>
            <FontAwesomeIcon icon={faRedo} /> Intentar de nuevo
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticaLibre;
