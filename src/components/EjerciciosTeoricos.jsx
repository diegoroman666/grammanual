import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap, faListUl, faClock, faQuestion, faLink,
  faSitemap, faCodeBranch, faExchangeAlt, faCogs,
  faCheck, faTimes, faArrowRight, faRedo, faBookOpen
} from '@fortawesome/free-solid-svg-icons';

// ─── Exercise data ────────────────────────────────────────────────────────────

const theoreticalExerciseData = [
  // Verbos irregulares
  {
    id: 1, type: 'verb-irr', title: 'Verbos irregulares',
    question: '¿Cuál es el pasado simple de "go"?',
    correctAnswer: 'went',
    options: ['goed', 'went', 'gone', 'goes'],
    explanation: '"Go" es irregular. Pasado simple: "went". Participio: "gone".',
  },
  {
    id: 2, type: 'verb-irr', title: 'Verbos irregulares',
    question: '¿Cuál es el participio pasado de "write"?',
    correctAnswer: 'written',
    options: ['wrote', 'writed', 'written', 'writting'],
    explanation: '"Write" → "wrote" (pasado simple) → "written" (participio pasado).',
  },
  {
    id: 3, type: 'verb-irr', title: 'Verbos irregulares',
    question: '¿Cuál es el pasado simple de "eat"?',
    correctAnswer: 'ate',
    options: ['eated', 'eaten', 'ate', 'eats'],
    explanation: '"Eat" es irregular. Pasado simple: "ate". Participio: "eaten".',
  },
  {
    id: 4, type: 'verb-irr', title: 'Verbos irregulares',
    question: '¿Cuál es el participio pasado de "break"?',
    correctAnswer: 'broken',
    options: ['broke', 'breaked', 'broken', 'breaking'],
    explanation: '"Break" → "broke" (pasado) → "broken" (participio).',
  },
  {
    id: 5, type: 'verb-irr', title: 'Verbos irregulares',
    question: '¿Cuál es el pasado simple de "teach"?',
    correctAnswer: 'taught',
    options: ['teached', 'thought', 'taught', 'tought'],
    explanation: '"Teach" → "taught". Ojo: "thought" es el pasado de "think".',
  },
  // Verbos regulares
  {
    id: 6, type: 'verb-reg', title: 'Verbos regulares',
    question: '¿Cuál es el pasado simple de "study"?',
    correctAnswer: 'studied',
    options: ['studyed', 'studied', 'studyied', 'studies'],
    explanation: 'Verbos en -y precedida de consonante: se cambia -y por -ied → "studied".',
  },
  {
    id: 7, type: 'verb-reg', title: 'Verbos regulares',
    question: '¿Cuál es el pasado simple de "travel"?',
    correctAnswer: 'traveled',
    options: ['travelied', 'traveld', 'traveled', 'travels'],
    explanation: '"Travel" es regular. Se agrega -ed → "traveled".',
  },
  {
    id: 8, type: 'verb-reg', title: 'Verbos regulares',
    sentence: 'She ___ for the exam all weekend. (study)',
    question: '¿Cuál es la forma correcta del verbo?',
    correctAnswer: 'studied',
    options: ['study', 'studyed', 'studied', 'studys'],
    explanation: 'Pasado de verbos terminados en consonante + y: se cambia la -y por -ied.',
  },
  // Adverbios de frecuencia
  {
    id: 9, type: 'adverb', title: 'Adverbios de frecuencia',
    question: '¿Qué adverbio representa el 0% de frecuencia?',
    correctAnswer: 'Never',
    options: ['Always', 'Sometimes', 'Rarely', 'Never'],
    explanation: '"Never" = nunca (0%). "Always" = siempre (100%).',
  },
  {
    id: 10, type: 'adverb', title: 'Adverbios de frecuencia',
    question: '¿Cuál es la posición correcta de los adverbios de frecuencia?',
    correctAnswer: 'Antes del verbo principal',
    options: [
      'Al final de la oración',
      'Antes del sujeto',
      'Antes del verbo principal',
      'Después del objeto directo',
    ],
    explanation: 'Van ANTES del verbo principal. Con "to be" van DESPUÉS: "She is always late".',
  },
  {
    id: 11, type: 'adverb', title: 'Adverbios de frecuencia',
    question: '¿Cuál de estas oraciones es correcta?',
    correctAnswer: 'She always arrives on time.',
    options: [
      'Always she arrives on time.',
      'She always arrives on time.',
      'She arrives always on time.',
      'She arrives on always time.',
    ],
    explanation: '"Always" va antes del verbo principal "arrives": She always arrives.',
  },
  // W Questions
  {
    id: 12, type: 'wquestion', title: 'W Questions',
    sentence: '___ do you live? — I live in Madrid.',
    question: '¿Qué palabra interrogativa completa la pregunta?',
    correctAnswer: 'Where',
    options: ['When', 'What', 'Where', 'Who'],
    explanation: '"Where" pregunta sobre lugares. La respuesta "in Madrid" indica lugar.',
  },
  {
    id: 13, type: 'wquestion', title: 'W Questions',
    sentence: '___ did you arrive? — I arrived at 8 AM.',
    question: '¿Qué palabra interrogativa completa la pregunta?',
    correctAnswer: 'When',
    options: ['Where', 'When', 'Why', 'Which'],
    explanation: '"When" pregunta sobre tiempo. La respuesta "at 8 AM" indica una hora.',
  },
  {
    id: 14, type: 'wquestion', title: 'W Questions',
    sentence: '___ many students are in the class?',
    question: '¿Qué palabra interrogativa completa la pregunta?',
    correctAnswer: 'How',
    options: ['What', 'How', 'Which', 'Who'],
    explanation: '"How many" pregunta cantidades de cosas contables.',
  },
  {
    id: 15, type: 'wquestion', title: 'W Questions',
    question: '¿Cuál es la diferencia entre "How much" y "How many"?',
    correctAnswer: '"How much" es para sustantivos incontables; "How many" para contables',
    options: [
      '"How much" es informal; "How many" es formal',
      '"How much" es para sustantivos incontables; "How many" para contables',
      '"How much" es para personas; "How many" para cosas',
      'Son sinónimos, se usan indistintamente',
    ],
    explanation: 'How much: water, money, time (incontables). How many: students, books, cars (contables).',
  },
  // Conectores
  {
    id: 16, type: 'connector', title: 'Conectores',
    sentence: 'She studied hard, ___ she passed the exam.',
    question: '¿Qué conector expresa el resultado?',
    correctAnswer: 'so',
    options: ['but', 'so', 'although', 'however'],
    explanation: '"So" indica resultado o consecuencia. Estudió duro → como resultado pasó.',
  },
  {
    id: 17, type: 'connector', title: 'Conectores',
    sentence: 'I like coffee, ___ my brother prefers tea.',
    question: '¿Qué conector expresa contraste?',
    correctAnswer: 'but',
    options: ['and', 'so', 'but', 'because'],
    explanation: '"But" introduce un contraste entre dos ideas opuestas.',
  },
  {
    id: 18, type: 'connector', title: 'Conectores',
    sentence: 'He was tired. ___, he kept working until midnight.',
    question: '¿Qué conector formal expresa contraste?',
    correctAnswer: 'Nevertheless',
    options: ['Therefore', 'Nevertheless', 'Furthermore', 'Consequently'],
    explanation: '"Nevertheless" (sin embargo) expresa contraste formal. "Therefore" indica resultado.',
  },
  {
    id: 19, type: 'connector', title: 'Conectores',
    sentence: 'The project was delayed ___ the lack of funding.',
    question: '¿Qué conector de causa es correcto aquí?',
    correctAnswer: 'due to',
    options: ['because', 'due to', 'so', 'however'],
    explanation: '"Due to" va seguido de un sustantivo o frase nominal. "Because" va seguido de una cláusula.',
  },
  // Preposiciones
  {
    id: 20, type: 'preposition', title: 'Preposiciones',
    sentence: 'We have class ___ Monday.',
    question: '¿Qué preposición es correcta?',
    correctAnswer: 'on',
    options: ['in', 'at', 'on', 'by'],
    explanation: '"On" se usa con días de la semana: on Monday, on Friday, on weekends.',
  },
  {
    id: 21, type: 'preposition', title: 'Preposiciones',
    sentence: 'She was born ___ 1995.',
    question: '¿Qué preposición es correcta?',
    correctAnswer: 'in',
    options: ['on', 'at', 'in', 'by'],
    explanation: '"In" se usa con años, meses y estaciones: in 1995, in March, in summer.',
  },
  {
    id: 22, type: 'preposition', title: 'Preposiciones',
    sentence: 'The meeting starts ___ 9 AM.',
    question: '¿Qué preposición es correcta?',
    correctAnswer: 'at',
    options: ['in', 'on', 'at', 'for'],
    explanation: '"At" se usa con horas específicas: at 9 AM, at noon, at midnight.',
  },
  {
    id: 23, type: 'preposition', title: 'Preposiciones',
    sentence: 'The book is ___ the table.',
    question: '¿Qué preposición de lugar es correcta?',
    correctAnswer: 'on',
    options: ['in', 'on', 'at', 'by'],
    explanation: '"On" indica que algo está sobre una superficie: on the table, on the floor.',
  },
  // Condicionales
  {
    id: 24, type: 'conditional', title: 'Condicionales',
    sentence: 'If it rains, we ___ stay at home.',
    question: '¿Qué forma verbal completa el Condicional 1?',
    correctAnswer: 'will',
    options: ['would', 'will', 'did', 'had'],
    explanation: 'Condicional 1: If + presente simple → WILL + verbo base. Situaciones posibles.',
  },
  {
    id: 25, type: 'conditional', title: 'Condicionales',
    sentence: 'If I ___ a car, I would drive to work.',
    question: '¿Qué forma verbal completa el Condicional 2?',
    correctAnswer: 'had',
    options: ['have', 'had', 'has', 'will have'],
    explanation: 'Condicional 2: If + pasado simple → would + verbo base. Situaciones hipotéticas.',
  },
  {
    id: 26, type: 'conditional', title: 'Condicionales',
    question: '¿Qué tipo de condicional expresa verdades generales y hechos científicos?',
    correctAnswer: 'Zero Conditional',
    options: ['First Conditional', 'Zero Conditional', 'Second Conditional', 'Third Conditional'],
    explanation: 'Zero Conditional: If + presente → presente. Ej: "If you heat water, it boils."',
  },
  {
    id: 27, type: 'conditional', title: 'Condicionales',
    sentence: 'If she had studied more, she ___ passed the exam.',
    question: '¿Qué forma verbal completa el Condicional 3?',
    correctAnswer: 'would have',
    options: ['would', 'would have', 'will have', 'had'],
    explanation: 'Condicional 3: If + past perfect → WOULD HAVE + participio. Situaciones pasadas irreales.',
  },
  // Voz pasiva
  {
    id: 28, type: 'passive', title: 'Voz pasiva',
    question: '¿Cuál es la forma pasiva de "The teacher corrects the tests"?',
    correctAnswer: 'The tests are corrected by the teacher.',
    options: [
      'The tests corrected by the teacher.',
      'The tests are correcting by the teacher.',
      'The tests are corrected by the teacher.',
      'The tests were corrected by the teacher.',
    ],
    explanation: 'Pasiva presente: Object + am/is/are + past participle (+ by + agent).',
  },
  {
    id: 29, type: 'passive', title: 'Voz pasiva',
    question: '¿Cuál es la forma pasiva de "They built the bridge in 1990"?',
    correctAnswer: 'The bridge was built in 1990.',
    options: [
      'The bridge is built in 1990.',
      'The bridge were built in 1990.',
      'The bridge was build in 1990.',
      'The bridge was built in 1990.',
    ],
    explanation: 'Pasiva pasado: Object + was/were + past participle. "Build" → participio "built".',
  },
  {
    id: 30, type: 'passive', title: 'Voz pasiva',
    question: '¿Cómo se forma la voz pasiva en presente perfecto?',
    correctAnswer: 'has/have been + past participle',
    options: [
      'is/are + past participle',
      'was/were + past participle',
      'has/have been + past participle',
      'will be + past participle',
    ],
    explanation: 'Presente perfecto pasivo: has/have been + participio. Ej: "It has been done."',
  },
  // Verbos modales
  {
    id: 31, type: 'modal', title: 'Verbos modales',
    sentence: 'You ___ wear a seatbelt. It\'s the law.',
    question: '¿Qué modal expresa obligación fuerte?',
    correctAnswer: 'must',
    options: ['should', 'could', 'must', 'might'],
    explanation: '"Must" expresa obligación fuerte o regla. "Should" es recomendación más suave.',
  },
  {
    id: 32, type: 'modal', title: 'Verbos modales',
    sentence: 'It ___ rain later, but I\'m not sure.',
    question: '¿Qué modal expresa posibilidad baja/incierta?',
    correctAnswer: 'might',
    options: ['must', 'will', 'might', 'should'],
    explanation: '"Might" indica posibilidad débil (~30–40%). "May" es algo más probable (~50%).',
  },
  {
    id: 33, type: 'modal', title: 'Verbos modales',
    question: '¿Cuál es el equivalente pasado de "must" para obligación?',
    correctAnswer: 'had to',
    options: ['musted', 'could', 'had to', 'was must'],
    explanation: '"Must" no tiene forma de pasado para obligación. Se usa "had to": "I had to leave early."',
  },
];

// ─── Filter config ────────────────────────────────────────────────────────────

const filters = [
  { id: 'all',         label: 'Todos',               icon: faBookOpen },
  { id: 'verb-irr',   label: 'Verbos irregulares',   icon: faListUl },
  { id: 'verb-reg',   label: 'Verbos regulares',     icon: faListUl },
  { id: 'adverb',     label: 'Adverbios',            icon: faClock },
  { id: 'wquestion',  label: 'W Questions',          icon: faQuestion },
  { id: 'connector',  label: 'Conectores',           icon: faLink },
  { id: 'preposition',label: 'Preposiciones',        icon: faSitemap },
  { id: 'conditional',label: 'Condicionales',        icon: faCodeBranch },
  { id: 'passive',    label: 'Voz pasiva',           icon: faExchangeAlt },
  { id: 'modal',      label: 'Verbos modales',       icon: faCogs },
];

// ─── Component ────────────────────────────────────────────────────────────────

const EjerciciosTeoricos = () => {
  const [filter, setFilter]           = useState('all');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer]   = useState(null);
  const [showResult, setShowResult]   = useState(false);
  const [isCorrect, setIsCorrect]     = useState(false);

  const filteredExercises = filter === 'all'
    ? theoreticalExerciseData
    : theoreticalExerciseData.filter(e => e.type === filter);

  const exercise = filteredExercises[currentExercise] || filteredExercises[0];

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentExercise(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setIsCorrect(answer === exercise.correctAnswer);
    setShowResult(true);
  };

  const handleNext = () => {
    const next = currentExercise + 1 < filteredExercises.length ? currentExercise + 1 : 0;
    setCurrentExercise(next);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const currentIndex = filteredExercises.indexOf(exercise);

  return (
    <div>
      {/* Filter buttons */}
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

      {/* Progress */}
      <div className="exercise-info">
        <span className="exercise-type">
          <FontAwesomeIcon icon={faGraduationCap} />
          {exercise.title}
        </span>
        <span className="exercise-progress">
          Ejercicio {currentIndex + 1} de {filteredExercises.length}
        </span>
      </div>

      {/* Card */}
      <div className="exercise-card">
        <div className="exercise-question">
          <h3>{exercise.question}</h3>

          {exercise.sentence && (
            <div className="sentence-highlight">
              <p>{exercise.sentence}</p>
            </div>
          )}
        </div>

        {/* Options */}
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
                  <strong> Explicación:</strong> {exercise.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="exercise-actions">
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

export default EjerciciosTeoricos;
