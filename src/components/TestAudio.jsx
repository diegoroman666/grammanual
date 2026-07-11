import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeadphones, faVolumeUp, faStop, faCheck, faTimes,
  faArrowRight, faArrowLeft, faRedo, faLock, faTrophy,
  faLanguage, faEye, faFileAlt, faPlay, faLightbulb,
} from '@fortawesome/free-solid-svg-icons';
import { tests, TOTAL_QUESTIONS } from '../data/testAudioData';
import { translateText } from '../services/translateApi';
import './TestAudio.css';

const MAX_PLAYS = 2; // El audio se puede escuchar como máximo 2 veces

// ─── Selección de voz ─────────────────────────────────────────────────────────
// Intenta encontrar una voz real del dispositivo que coincida con la variante y
// el género del ejercicio. Si no la encuentra, rota entre las voces inglesas
// disponibles para que cada ejercicio suene distinto.
const FEMALE_HINTS = ['female', 'samantha', 'victoria', 'karen', 'moira', 'tessa', 'fiona', 'zira', 'susan', 'catherine'];
const MALE_HINTS   = ['male', 'daniel', 'alex', 'fred', 'thomas', 'oliver', 'david', 'george', 'james', 'lee'];

function pickVoice(voices, exercise, rotationIndex) {
  if (!voices || voices.length === 0) return null;
  const english = voices.filter(v => /^en(-|_)?/i.test(v.lang));
  const pool = english.length ? english : voices;

  // 1) coincidencia por variante (en-US/en-GB/en-AU) + género
  const wantLang = (exercise.voiceKind || 'en-US').toLowerCase().replace('_', '-');
  const genderHints = exercise.gender === 'male' ? MALE_HINTS : FEMALE_HINTS;

  const byLang = pool.filter(v => v.lang.toLowerCase().replace('_', '-').startsWith(wantLang));
  const langPool = byLang.length ? byLang : pool;

  const byGender = langPool.find(v => genderHints.some(h => v.name.toLowerCase().includes(h)));
  if (byGender) return byGender;
  if (byLang.length) return byLang[rotationIndex % byLang.length];

  // 2) fallback: rotar entre todas para dar variedad
  return pool[rotationIndex % pool.length];
}

const TestAudio = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [answers, setAnswers] = useState({});      // key: `${exId}-${qi}` -> option elegida
  const [plays, setPlays] = useState(0);           // reproducciones del ejercicio actual
  const [audioStatus, setAudioStatus] = useState('idle'); // idle | playing
  const [showTranscript, setShowTranscript] = useState(false);
  const [translation, setTranslation] = useState('');
  const [translating, setTranslating] = useState(false);
  const [finished, setFinished] = useState(false);
  const [voices, setVoices] = useState([]);

  const rotationRef = useRef(0);

  // Cargar voces del navegador (pueden llegar de forma asíncrona)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  const stopAudio = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setAudioStatus('idle');
  }, []);

  const exercise = selectedTest ? selectedTest.exercises[exerciseIndex] : null;

  // Reinicia el estado por-ejercicio
  const resetExerciseState = useCallback(() => {
    setPlays(0);
    setShowTranscript(false);
    setTranslation('');
    stopAudio();
  }, [stopAudio]);

  const startTest = (test) => {
    setSelectedTest(test);
    setExerciseIndex(0);
    setAnswers({});
    setFinished(false);
    resetExerciseState();
  };

  const backToList = () => {
    stopAudio();
    setSelectedTest(null);
    setFinished(false);
  };

  const playAudio = () => {
    if (!('speechSynthesis' in window) || !exercise) {
      alert('Tu navegador no soporta la lectura de audio.');
      return;
    }
    if (plays >= MAX_PLAYS) return;
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(exercise.audioText);
    const voice = pickVoice(voices, exercise, rotationRef.current + exerciseIndex);
    if (voice) { utter.voice = voice; utter.lang = voice.lang; }
    else utter.lang = 'en-US';
    utter.pitch = exercise.pitch ?? 1;
    utter.rate = exercise.rate ?? 0.9;
    utter.onend = () => setAudioStatus('idle');
    utter.onerror = () => setAudioStatus('idle');

    window.speechSynthesis.speak(utter);
    setAudioStatus('playing');
    setPlays(p => p + 1);
  };

  const handleAnswer = (qi, option) => {
    const key = `${exercise.id}-${qi}`;
    if (answers[key]) return; // ya respondida, no se puede cambiar (es un examen)
    setAnswers(prev => ({ ...prev, [key]: option }));
  };

  // ¿Se respondieron las 5 preguntas del ejercicio actual?
  const allAnswered = exercise
    ? exercise.questions.every((_, qi) => answers[`${exercise.id}-${qi}`])
    : false;

  const doTranslate = async () => {
    if (translation || translating) return;
    setTranslating(true);
    const res = await translateText(exercise.audioText, 'en|es');
    setTranslation(res);
    setTranslating(false);
  };

  const nextExercise = () => {
    if (exerciseIndex + 1 < selectedTest.exercises.length) {
      setExerciseIndex(i => i + 1);
      rotationRef.current += 1;
      resetExerciseState();
    } else {
      stopAudio();
      setFinished(true);
    }
  };

  const prevExercise = () => {
    if (exerciseIndex > 0) {
      setExerciseIndex(i => i - 1);
      resetExerciseState();
    }
  };

  // ── Puntaje ──
  const scoreFor = (test) => {
    let correct = 0, total = 0;
    test.exercises.forEach(ex => ex.questions.forEach((q, qi) => {
      total += 1;
      if (answers[`${ex.id}-${qi}`] === q.answer) correct += 1;
    }));
    return { correct, total };
  };

  // ════════════════════════════════════════════════════════════════════════
  // VISTA 1 · Selección de prueba
  // ════════════════════════════════════════════════════════════════════════
  if (!selectedTest) {
    return (
      <div className="ta-container">
        <div className="ta-header">
          <h1><FontAwesomeIcon icon={faHeadphones} /> Test Audio</h1>
          <p>
            Comprensión auditiva evaluada. Escucha cada audio (máximo <strong>{MAX_PLAYS} veces</strong>)
            y responde en inglés. El texto y la traducción solo se revelan al terminar las preguntas.
          </p>
          <div className="ta-header-stats">
            <span><FontAwesomeIcon icon={faFileAlt} /> {tests.length} pruebas</span>
            <span><FontAwesomeIcon icon={faVolumeUp} /> {tests.reduce((s, t) => s + t.exercises.length, 0)} audios</span>
            <span><FontAwesomeIcon icon={faCheck} /> {TOTAL_QUESTIONS} preguntas</span>
          </div>
        </div>

        <div className="ta-rules">
          <h3><FontAwesomeIcon icon={faLightbulb} /> Cómo funciona</h3>
          <ul>
            <li>Cada prueba tiene <strong>10 ejercicios de audio</strong> con <strong>5 preguntas</strong> cada uno.</li>
            <li>El audio se puede escuchar como <strong>máximo {MAX_PLAYS} veces</strong>: escucha con atención.</li>
            <li>Cada ejercicio usa una <strong>voz distinta</strong> (acentos y tonos variados).</li>
            <li>Las alternativas están en <strong>inglés</strong> e incluyen palabras <strong>mal escritas a propósito</strong>: identifica la forma correcta.</li>
            <li>No verás el <strong>texto en inglés ni la traducción</strong> hasta responder las 5 preguntas.</li>
            <li>Al responder verás una <strong>explicación teórica</strong> (adverbios de frecuencia, complementos de lugar, la hora, etc.).</li>
          </ul>
        </div>

        <div className="ta-tests-grid">
          {tests.map(test => (
            <button key={test.id} className="ta-test-card" onClick={() => startTest(test)}>
              <div className="ta-test-emoji">{test.emoji}</div>
              <div className="ta-test-body">
                <span className="ta-test-level">{test.level}</span>
                <h3>{test.title}</h3>
                <p>{test.description}</p>
                <div className="ta-test-meta">
                  <span>{test.exercises.length} audios</span>
                  <span>{test.exercises.length * 5} preguntas</span>
                </div>
              </div>
              <FontAwesomeIcon icon={faPlay} className="ta-test-arrow" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // VISTA 3 · Resultados de la prueba
  // ════════════════════════════════════════════════════════════════════════
  if (finished) {
    const { correct, total } = scoreFor(selectedTest);
    const pct = Math.round((correct / total) * 100);
    const passed = pct >= 60;
    return (
      <div className="ta-container">
        <div className={`ta-result-card ${passed ? 'pass' : 'fail'}`}>
          <FontAwesomeIcon icon={faTrophy} className="ta-result-trophy" />
          <h1>{passed ? '¡Prueba superada!' : 'Sigue practicando'}</h1>
          <div className="ta-result-score">{correct}<span>/{total}</span></div>
          <div className="ta-result-pct">{pct}% de aciertos</div>
          <div className="ta-result-bar"><div style={{ width: `${pct}%` }} /></div>
          <p className="ta-result-msg">
            {passed
              ? 'Buen oído. Revisa las explicaciones de los ejercicios para afinar los detalles.'
              : 'Vuelve a escuchar los audios y presta atención a los adverbios de frecuencia y complementos de lugar.'}
          </p>
          <div className="ta-result-actions">
            <button className="ta-btn ta-btn-primary" onClick={() => startTest(selectedTest)}>
              <FontAwesomeIcon icon={faRedo} /> Repetir prueba
            </button>
            <button className="ta-btn ta-btn-secondary" onClick={backToList}>
              <FontAwesomeIcon icon={faArrowLeft} /> Otras pruebas
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // VISTA 2 · Ejercicio de audio
  // ════════════════════════════════════════════════════════════════════════
  const playsLeft = MAX_PLAYS - plays;

  return (
    <div className="ta-container">
      {/* Barra superior */}
      <div className="ta-exercise-top">
        <button className="ta-back" onClick={backToList}>
          <FontAwesomeIcon icon={faArrowLeft} /> Salir
        </button>
        <span className="ta-test-tag">{selectedTest.emoji} {selectedTest.title}</span>
        <span className="ta-progress-tag">Audio {exerciseIndex + 1} / {selectedTest.exercises.length}</span>
      </div>

      <div className="ta-progress-bar">
        <div style={{ width: `${((exerciseIndex) / selectedTest.exercises.length) * 100}%` }} />
      </div>

      {/* Reproductor */}
      <div className="ta-player-card">
        <div className="ta-player-icon"><FontAwesomeIcon icon={faHeadphones} /></div>
        <div className="ta-player-info">
          <h2>Ejercicio de audio {exerciseIndex + 1}</h2>
          <p>Escucha con atención y responde las 5 preguntas. No se muestra el texto todavía.</p>
        </div>
        <div className="ta-player-controls">
          {audioStatus === 'playing' ? (
            <button className="ta-play-btn stop" onClick={stopAudio}>
              <FontAwesomeIcon icon={faStop} /> Detener
            </button>
          ) : (
            <button className="ta-play-btn" onClick={playAudio} disabled={plays >= MAX_PLAYS}>
              <FontAwesomeIcon icon={faVolumeUp} /> Escuchar
            </button>
          )}
          <span className={`ta-plays ${plays >= MAX_PLAYS ? 'used' : ''}`}>
            {plays >= MAX_PLAYS
              ? <><FontAwesomeIcon icon={faLock} /> Sin reproducciones</>
              : <>Te quedan {playsLeft} de {MAX_PLAYS}</>}
          </span>
        </div>
      </div>

      {/* Preguntas */}
      <div className="ta-questions">
        {exercise.questions.map((q, qi) => {
          const key = `${exercise.id}-${qi}`;
          const chosen = answers[key];
          const answered = Boolean(chosen);
          const isCorrect = chosen === q.answer;
          return (
            <div key={key} className={`ta-question ${answered ? (isCorrect ? 'ok' : 'ko') : ''}`}>
              <div className="ta-q-head">
                <span className="ta-q-num">{qi + 1}</span>
                <h3>{q.q}</h3>
              </div>

              <div className="ta-options">
                {q.options.map((opt, oi) => {
                  const selected = chosen === opt;
                  const correctOpt = answered && opt === q.answer;
                  const wrongPick = answered && selected && opt !== q.answer;
                  return (
                    <button
                      key={oi}
                      className={`ta-option ${selected ? 'selected' : ''} ${correctOpt ? 'correct' : ''} ${wrongPick ? 'incorrect' : ''}`}
                      onClick={() => handleAnswer(qi, opt)}
                      disabled={answered}
                    >
                      <span className="ta-option-letter">{String.fromCharCode(65 + oi)}</span>
                      <span className="ta-option-text">{opt}</span>
                      {correctOpt && <FontAwesomeIcon icon={faCheck} className="ta-opt-icon ok" />}
                      {wrongPick && <FontAwesomeIcon icon={faTimes} className="ta-opt-icon ko" />}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className={`ta-explain ${isCorrect ? 'ok' : 'ko'}`}>
                  <div className="ta-explain-head">
                    <FontAwesomeIcon icon={isCorrect ? faCheck : faTimes} />
                    {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                    <span className="ta-concept">{q.concept}</span>
                  </div>
                  {!isCorrect && (
                    <p className="ta-correct-answer">
                      Respuesta correcta: <strong>{q.answer}</strong>
                    </p>
                  )}
                  <p className="ta-explain-text">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Transcripción + traducción (solo al responder las 5) */}
      <div className="ta-transcript-zone">
        {!allAnswered ? (
          <div className="ta-transcript-locked">
            <FontAwesomeIcon icon={faLock} />
            <span>Responde las 5 preguntas para revelar el texto en inglés y la traducción.</span>
          </div>
        ) : !showTranscript ? (
          <button className="ta-reveal-btn" onClick={() => setShowTranscript(true)}>
            <FontAwesomeIcon icon={faEye} /> Ver texto en inglés y traducción
          </button>
        ) : (
          <div className="ta-transcript">
            <h4><FontAwesomeIcon icon={faFileAlt} /> Texto en inglés</h4>
            <p className="ta-transcript-en">{exercise.audioText}</p>
            <div className="ta-transcript-actions">
              <button className="ta-translate-btn" onClick={doTranslate} disabled={translating || Boolean(translation)}>
                <FontAwesomeIcon icon={faLanguage} /> {translating ? 'Traduciendo…' : 'Traducir'}
              </button>
            </div>
            <div className="ta-transcript-es">
              <strong>Traducción:</strong> {translation || exercise.translation}
            </div>
          </div>
        )}
      </div>

      {/* Navegación entre ejercicios */}
      <div className="ta-nav">
        <button className="ta-btn ta-btn-secondary" onClick={prevExercise} disabled={exerciseIndex === 0}>
          <FontAwesomeIcon icon={faArrowLeft} /> Anterior
        </button>
        <button className="ta-btn ta-btn-primary" onClick={nextExercise} disabled={!allAnswered}>
          {exerciseIndex + 1 < selectedTest.exercises.length
            ? <>Siguiente audio <FontAwesomeIcon icon={faArrowRight} /></>
            : <>Finalizar prueba <FontAwesomeIcon icon={faTrophy} /></>}
        </button>
      </div>
      {!allAnswered && (
        <p className="ta-nav-hint">Debes responder las 5 preguntas para continuar.</p>
      )}
    </div>
  );
};

export default TestAudio;
