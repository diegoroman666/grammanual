import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeatherAlt, faBookOpen, faHeadphones, faSpellCheck, faRandom, faVolumeUp, faLanguage, faCheck, faTimes, faArrowRight, faRedo, faGraduationCap, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import EjerciciosTeoricos from './EjerciciosTeoricos.jsx';
import './Ejercicios.css';

// Exercise data
const exerciseData = [
  // Type 1: Complete sentence with conjugated verb
  {
    id: 1,
    type: 'complete',
    title: 'Completar oración',
    formula: 'Sujeto + Verbo conjugado',
    question: 'She ___ to the store every day.',
    correctAnswer: 'goes',
    options: ['goes', 'go', 'going', 'went'],
    explanation: 'Usamos "goes" porque es la tercera persona singular en presente simple. "She goes" = Ella va.',
    time: 'Presente'
  },
  {
    id: 2,
    type: 'complete',
    title: 'Completar oración',
    formula: 'Sujeto + Verbo conjugado',
    question: 'Yesterday, they ___ a beautiful movie.',
    correctAnswer: 'watched',
    options: ['watched', 'watch', 'watching', 'watches'],
    explanation: 'Usamos "watched" porque indica pasado (yesterday). "They watched" = Ellos vieron.',
    time: 'Pasado'
  },
  {
    id: 3,
    type: 'complete',
    title: 'Completar oración',
    formula: 'Sujeto + will + Verbo base',
    question: 'I ___ the guitar tomorrow.',
    correctAnswer: 'play',
    options: ['play', 'playing', 'played', 'will play'],
    explanation: 'Usamos "will play" para acciones futuras. "I will play" = Yo tocaré.',
    time: 'Futuro'
  },
  // Type 2: Reading comprehension
  {
    id: 4,
    type: 'reading',
    title: 'Comprensión lectora',
    text: 'My name is Sarah. I am a teacher. Every morning, I wake up at 6 AM. I have breakfast at 7 AM and then I go to school. I teach English to students. After school, I usually go to the gym. In the evening, I like to read books or watch movies.',
    question: '¿Qué profesión tiene Sarah?',
    options: ['Maestra', 'Doctora', 'Abogada', 'Ingeniera'],
    correctAnswer: 'Maestra',
    explanation: 'El texto dice "I am a teacher" = Soy maestra.'
  },
  {
    id: 5,
    type: 'reading',
    title: 'Comprensión lectora',
    text: 'Last weekend, John went to the beach with his family. They swam in the ocean and played volleyball. The weather was perfect - sunny and warm. In the evening, they ate dinner at a restaurant near the beach. Everyone had a great time!',
    question: '¿Qué hicieron en la playa?',
    options: ['Nadaron y jugaron voleibol', 'Caminaron por la arena', 'Construyeroncastillos', 'surfear'],
    correctAnswer: 'Nadaron y jugaron voleibol',
    explanation: 'El texto dice "They swam in the ocean and played volleyball".'
  },
  // Type 3: Audio comprehension
  {
    id: 6,
    type: 'audio',
    title: 'Ejercicio de audio',
    audioText: 'Hello, my name is Michael. I am a software developer. I work at a big tech company. Every day, I write code and test new applications. I love my job because it is very interesting.',
    question: '¿Qué tipo de trabajo tiene Michael?',
    options: ['Desarrollador de software', 'Diseñador gráfico', 'Marketing', 'Contador'],
    correctAnswer: 'Desarrollador de software',
    explanation: 'El audio dice "I am a software developer" = Soy desarrollador de software.'
  },
  {
    id: 7,
    type: 'audio',
    title: 'Ejercicio de audio',
    audioText: 'Good morning! Today is Monday, September 15th. The weather forecast says it will be sunny and warm today, around 25 degrees Celsius. Perfect weather for our outdoor activities!',
    question: '¿Qué día es según el audio?',
    options: ['Lunes', 'Martes', 'Miércoles', 'Domingo'],
    correctAnswer: 'Lunes',
    explanation: 'El audio dice "Today is Monday" = Hoy es lunes.'
  },
  // Type 4: Past vs Present
  {
    id: 8,
    type: 'slash',
    title: 'Pasado vs Presente',
    question: 'Choose the correct option:',
    sentence: 'Yesterday she ___ to the market. / Every day she ___ to the market.',
    correctAnswer: 'went / goes',
    options: ['went / goes', 'go / went', 'goes / went', 'went / going'],
    explanation: 'Usamos "went" para pasado (yesterday) y "goes" para presente (every day).'
  },
  {
    id: 9,
    type: 'slash',
    title: 'Pasado vs Presente',
    question: 'Choose the correct option:',
    sentence: 'Last year they ___ in Paris. / Now they ___ in London.',
    correctAnswer: 'lived / live',
    options: ['lived / live', 'live / lived', 'living / lives', 'lived / lives'],
    explanation: '"Lived" es pasado, "live" es presente.'
  },
  {
    id: 10,
    type: 'slash',
    title: 'Pasado vs Presente',
    question: 'Choose the correct option:',
    sentence: 'She ___ English last summer. / She ___ English every summer.',
    correctAnswer: 'studied / studies',
    options: ['studied / studies', 'studies / studied', 'study / studied', 'studied / study'],
    explanation: '"Studied" = pasado, "studies" = presente (3ra persona).'
  },
  // Type 5: Singular vs Plural
  {
    id: 11,
    type: 'singular',
    title: 'Singular vs Plural',
    question: 'Choose the correct auxiliary:',
    sentence: '___ is eating. / ___ are eating.',
    correctAnswer: 'She / They',
    options: ['She / They', 'They / She', 'He / They', 'We / It'],
    explanation: '"She is" (singular), "They are" (plural).'
  },
  {
    id: 12,
    type: 'singular',
    title: 'Singular vs Plural',
    question: 'Choose the correct auxiliary:',
    sentence: 'The cat ___ on the bed. / The cats ___ on the floor.',
    correctAnswer: 'is / are',
    options: ['is / are', 'are / is', 'am / are', 'are / am'],
    explanation: 'Singular: "is", Plural: "are".'
  },
  {
    id: 13,
    type: 'singular',
    title: 'Singular vs Plural',
    question: 'Complete with subject + auxiliary:',
    sentence: '___ ___ working on the project. / ___ ___ working on the projects.',
    correctAnswer: 'He is / They are',
    options: ['He is / They are', 'They is / He are', 'It is / They are', 'He are / They is'],
    explanation: '"He is" (singular), "They are" (plural).'
  }
];

const Ejercicios = () => {
  const [section, setSection] = useState('interactive');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [translation, setTranslation] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
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
    setIsSpeaking(false);
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
    setIsSpeaking(false);
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setTranslation('');
    setIsSpeaking(false);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
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

  const getTypeIcon = (type) => {
    switch(type) {
      case 'complete': return faFeatherAlt;
      case 'reading': return faBookOpen;
      case 'audio': return faHeadphones;
      case 'slash': return faRandom;
      case 'singular': return faSpellCheck;
      default: return faBookOpen;
    }
  };

  return (
    <div className="ejercicios-container">
      <div className="ejercicios-header">
        <h1>
          <FontAwesomeIcon icon={faBookOpen} />
          Ejercicios de Gramática
        </h1>
        <p>Elige una modalidad de práctica</p>
      </div>

      {/* Section toggle */}
      <div className="section-toggle">
        <button
          className={`section-btn ${section === 'interactive' ? 'active' : ''}`}
          onClick={() => setSection('interactive')}
        >
          <FontAwesomeIcon icon={faPuzzlePiece} />
          Ejercicios interactivos
        </button>
        <button
          className={`section-btn ${section === 'teoria' ? 'active' : ''}`}
          onClick={() => setSection('teoria')}
        >
          <FontAwesomeIcon icon={faGraduationCap} />
          Ejercicios teóricos
        </button>
      </div>

      {section === 'teoria' && <EjerciciosTeoricos />}

      {section === 'interactive' && (
      <>
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          Todos
        </button>
        <button
          className={`filter-btn ${filter === 'complete' ? 'active' : ''}`}
          onClick={() => handleFilterChange('complete')}
        >
          <FontAwesomeIcon icon={faFeatherAlt} /> Completar
        </button>
        <button
          className={`filter-btn ${filter === 'reading' ? 'active' : ''}`}
          onClick={() => handleFilterChange('reading')}
        >
          <FontAwesomeIcon icon={faBookOpen} /> Lectura
        </button>
        <button
          className={`filter-btn ${filter === 'audio' ? 'active' : ''}`}
          onClick={() => handleFilterChange('audio')}
        >
          <FontAwesomeIcon icon={faHeadphones} /> Audio
        </button>
        <button
          className={`filter-btn ${filter === 'slash' ? 'active' : ''}`}
          onClick={() => handleFilterChange('slash')}
        >
          <FontAwesomeIcon icon={faRandom} /> Pasado/Presente
        </button>
        <button
          className={`filter-btn ${filter === 'singular' ? 'active' : ''}`}
          onClick={() => handleFilterChange('singular')}
        >
          <FontAwesomeIcon icon={faSpellCheck} /> Singular/Plural
        </button>
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
          
          {/* Sentence for complete/slash/singular types */}
          {(exercise.type === 'complete' || exercise.type === 'slash' || exercise.type === 'singular') && (
            <div className="sentence-blank">
              {exercise.type === 'complete' && (
                <>
                  <p className="formula-text">{exercise.formula}</p>
                  <p className="time-info">{exercise.time}</p>
                  <p className="sentence-text">{exercise.question}</p>
                </>
              )}
              {exercise.type === 'slash' && (
                <div className="sentence-highlight">
                  <p>{exercise.sentence}</p>
                </div>
              )}
              {exercise.type === 'singular' && (
                <div className="sentence-highlight">
                  <p>{exercise.sentence}</p>
                </div>
              )}
            </div>
          )}

          {/* Reading text */}
          {exercise.type === 'reading' && (
            <div className="reading-text">
              <div className="text-box">
                <h4>Texto en inglés:</h4>
                <p>{exercise.text}</p>
                <div className="text-actions">
                  <button 
                    className="audio-btn" 
                    onClick={() => speakText(exercise.text)}
                    disabled={isSpeaking}
                  >
                    <FontAwesomeIcon icon={faVolumeUp} />
                    {isSpeaking ? 'Reproduciendo...' : 'Escuchar'}
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

          {/* Audio exercise */}
          {exercise.type === 'audio' && (
            <div className="audio-section">
              <button 
                className="play-btn" 
                onClick={() => speakText(exercise.audioText)}
                disabled={isSpeaking}
              >
                <FontAwesomeIcon icon={faVolumeUp} />
                {isSpeaking ? 'Reproduciendo...' : 'Escuchar conversación'}
              </button>
              <p className="audio-hint">
                <FontAwesomeIcon icon={faHeadphones} />
                Escucha atentamente y responde la pregunta
              </p>
            </div>
          )}
        </div>

        {/* Answer options */}
        <div className="exercise-options">
          {exercise.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${selectedAnswer === option ? 'selected' : ''} ${
                showResult && option === exercise.correctAnswer ? 'correct' : ''
              } ${showResult && selectedAnswer === option && !isCorrect ? 'incorrect' : ''}`}
              onClick={() => handleAnswer(option)}
              disabled={showResult}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">
                {exercise.type === 'slash' || exercise.type === 'singular' 
                  ? option.split(' / ').join('  |  ') 
                  : option}
              </span>
              {showResult && option === exercise.correctAnswer && (
                <FontAwesomeIcon icon={faCheck} className="icon-correct" />
              )}
              {showResult && selectedAnswer === option && option !== exercise.correctAnswer && (
                <FontAwesomeIcon icon={faTimes} className="icon-incorrect" />
              )}
            </button>
          ))}
        </div>

        {/* Result */}
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
                  <strong>Explicación:</strong> {exercise.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="exercise-actions">
          {showResult && (
            <button className="btn btn-primary" onClick={handleNext}>
              Siguiente ejercicio
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          )}
          <button className="btn btn-secondary" onClick={handleRetry}>
            <FontAwesomeIcon icon={faRedo} />
            Intentar de nuevo
          </button>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default Ejercicios;

