import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeadphones, faVolumeUp, faStop, faCheck, faTimes,
  faArrowRight, faArrowLeft, faRedo, faLock, faTrophy,
  faLanguage, faEye, faFileAlt, faPlay, faLightbulb,
  faStopwatch, faHourglassHalf, faBookOpen, faClock,
} from '@fortawesome/free-solid-svg-icons';
import { tests, TOTAL_QUESTIONS } from '../data/testAudioData';
import { translateText } from '../services/translateApi';
import './TestAudio.css';

const MAX_PLAYS = 2;       // El audio se puede escuchar como máximo 2 veces
const TIME_PER_Q = 30;     // Segundos por pregunta en el modo cronometrado

// ─── Selección de voz ─────────────────────────────────────────────────────────
const FEMALE_HINTS = ['female', 'samantha', 'victoria', 'karen', 'moira', 'tessa', 'fiona', 'zira', 'susan', 'catherine'];
const MALE_HINTS   = ['male', 'daniel', 'alex', 'fred', 'thomas', 'oliver', 'david', 'george', 'james', 'lee'];

function pickVoice(voices, exercise, rotationIndex) {
  if (!voices || voices.length === 0) return null;
  const english = voices.filter(v => /^en(-|_)?/i.test(v.lang));
  const pool = english.length ? english : voices;
  const wantLang = (exercise.voiceKind || 'en-US').toLowerCase().replace('_', '-');
  const genderHints = exercise.gender === 'male' ? MALE_HINTS : FEMALE_HINTS;
  const byLang = pool.filter(v => v.lang.toLowerCase().replace('_', '-').startsWith(wantLang));
  const langPool = byLang.length ? byLang : pool;
  const byGender = langPool.find(v => genderHints.some(h => v.name.toLowerCase().includes(h)));
  if (byGender) return byGender;
  if (byLang.length) return byLang[rotationIndex % byLang.length];
  return pool[rotationIndex % pool.length];
}

// ─── Concepto → contenido teórico (pestaña de la sección Teoría) ────────────────
function conceptTheory(concept) {
  const c = (concept || '').toLowerCase();
  if (c.includes('frecuencia')) return { tab: 'adverbs', label: 'Adverbios de frecuencia' };
  if (c.includes('lugar'))      return { tab: 'place',   label: 'Complemento de lugar' };
  if (c.includes('la hora') || c.includes('rango de horas'))
    return { tab: 'time', label: 'Complemento de tiempo (la hora)' };
  if (c.includes('preposición de tiempo') || c.includes('preposiciones de tiempo') || c.includes('expresiones de tiempo') || c.includes('expresión de tiempo'))
    return { tab: 'time', label: 'Complemento de tiempo' };
  if (c.includes('preposicion') || c.includes('preposición'))
    return { tab: 'prepositions', label: 'Preposiciones' };
  if (c.includes('like to') || c.includes('gusto') || c.includes('verbo') || c.includes('tiempos verbales'))
    return { tab: 'irregular', label: 'Verbos' };
  if (c.includes('w question')) return { tab: 'wquestions', label: 'W Questions' };
  return { tab: null, label: 'Teoría general' };
}

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const bestKey = (id) => `ta-best-${id}`;

// ─── Distribución de la respuesta correcta ──────────────────────────────────────
// En los datos la respuesta correcta se lista primera (posición A) por comodidad.
// Aquí rotamos las opciones de forma DETERMINISTA (misma pregunta → siempre la
// misma posición, pero repartida entre A/B/C/D) para que la correcta no sea
// siempre la "A".
function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}
function rotateOptions(options, exId, qi) {
  const n = options.length;
  const k = (hashStr(exId) + qi) % n; // la correcta (índice 0) termina en la posición k
  return options.map((_, i) => options[(i - k + n) % n]);
}

const TestAudio = () => {
  const navigate = useNavigate();

  const [selectedTest, setSelectedTest] = useState(null);
  const [mode, setMode] = useState(null);          // null | 'timed' | 'free'
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [answers, setAnswers] = useState({});      // key `${exId}-${qi}` -> option ('__timeout__' si se agotó el tiempo)
  const [plays, setPlays] = useState(0);
  const [audioStatus, setAudioStatus] = useState('idle');
  const [showTranscript, setShowTranscript] = useState(false);
  const [translation, setTranslation] = useState('');
  const [translating, setTranslating] = useState(false);
  const [finished, setFinished] = useState(false);
  const [voices, setVoices] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [elapsed, setElapsed] = useState(0);

  const rotationRef = useRef(0);

  const exercise = selectedTest ? selectedTest.exercises[exerciseIndex] : null;
  // Primera pregunta sin responder del ejercicio actual (objetivo del cronómetro)
  const targetQi = exercise
    ? exercise.questions.findIndex((_, qi) => !answers[`${exercise.id}-${qi}`])
    : -1;

  // Cargar voces del navegador
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

  // Cronómetro ascendente (modo tiempo libre)
  useEffect(() => {
    if (mode !== 'free' || !selectedTest || finished) return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [mode, selectedTest, finished]);

  // Reinicia el contador de 30 s cada vez que cambia la pregunta objetivo
  useEffect(() => {
    if (mode === 'timed' && exercise && targetQi !== -1) setTimeLeft(TIME_PER_Q);
  }, [mode, exercise?.id, targetQi]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cuenta regresiva de 30 s por pregunta
  useEffect(() => {
    if (mode !== 'timed' || !exercise || targetQi === -1 || finished) return;
    if (timeLeft <= 0) {
      const key = `${exercise.id}-${targetQi}`;
      setAnswers(prev => (prev[key] ? prev : { ...prev, [key]: '__timeout__' }));
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [mode, exercise, targetQi, timeLeft, finished]);

  const resetExerciseState = useCallback(() => {
    setPlays(0);
    setShowTranscript(false);
    setTranslation('');
    stopAudio();
  }, [stopAudio]);

  const openTest = (test) => {
    setSelectedTest(test);
    setMode(null);
    setExerciseIndex(0);
    setAnswers({});
    setFinished(false);
    setElapsed(0);
    setTimeLeft(TIME_PER_Q);
    resetExerciseState();
  };

  const startWithMode = (m) => {
    setMode(m);
    setExerciseIndex(0);
    setAnswers({});
    setFinished(false);
    setElapsed(0);
    setTimeLeft(TIME_PER_Q);
    rotationRef.current = 0;
    resetExerciseState();
  };

  const backToList = () => {
    stopAudio();
    setSelectedTest(null);
    setMode(null);
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
    if (answers[key]) return; // no se puede cambiar una respuesta (es examen)
    setAnswers(prev => ({ ...prev, [key]: option }));
  };

  const allAnswered = exercise ? targetQi === -1 : false;

  const doTranslate = async () => {
    if (translation || translating) return;
    setTranslating(true);
    const res = await translateText(exercise.audioText, 'en|es');
    setTranslation(res);
    setTranslating(false);
  };

  const finishTest = useCallback(() => {
    stopAudio();
    if (mode === 'free') {
      const prev = Number(localStorage.getItem(bestKey(selectedTest.id))) || 0;
      if (!prev || elapsed < prev) localStorage.setItem(bestKey(selectedTest.id), String(elapsed));
    }
    setFinished(true);
  }, [mode, elapsed, selectedTest, stopAudio]);

  const nextExercise = () => {
    if (exerciseIndex + 1 < selectedTest.exercises.length) {
      setExerciseIndex(i => i + 1);
      rotationRef.current += 1;
      setTimeLeft(TIME_PER_Q);
      resetExerciseState();
    } else {
      finishTest();
    }
  };

  const scoreFor = (test) => {
    let correct = 0, total = 0;
    test.exercises.forEach(ex => ex.questions.forEach((q, qi) => {
      total += 1;
      if (answers[`${ex.id}-${qi}`] === q.answer) correct += 1;
    }));
    return { correct, total };
  };

  const goTheory = (tab) => {
    stopAudio();
    navigate('/teoria', tab ? { state: { tab } } : undefined);
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
            <li>Antes de empezar eliges modo: <strong>30 s por pregunta</strong> o <strong>tiempo libre con cronómetro</strong>.</li>
            <li>Cada ejercicio usa una <strong>voz distinta</strong> (acentos y tonos variados).</li>
            <li>Las alternativas están en <strong>inglés</strong> e incluyen palabras <strong>mal escritas a propósito</strong>.</li>
            <li>No verás el <strong>texto ni la traducción</strong> hasta responder las 5 preguntas, y <strong>no se puede retroceder</strong> a un audio anterior.</li>
            <li>Al terminar, cada tema te enlaza al <strong>contenido teórico</strong> para saber más.</li>
          </ul>
        </div>

        <div className="ta-tests-grid">
          {tests.map(test => (
            <button key={test.id} className="ta-test-card" onClick={() => openTest(test)}>
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
  // VISTA 2 · Selección de modo (antes de comenzar)
  // ════════════════════════════════════════════════════════════════════════
  if (!mode) {
    const best = Number(localStorage.getItem(bestKey(selectedTest.id))) || 0;
    return (
      <div className="ta-container">
        <div className="ta-exercise-top">
          <button className="ta-back" onClick={backToList}>
            <FontAwesomeIcon icon={faArrowLeft} /> Volver
          </button>
          <span className="ta-test-tag">{selectedTest.emoji} {selectedTest.title}</span>
          <span />
        </div>

        <div className="ta-mode-intro">
          <h2>Elige cómo quieres rendir la prueba</h2>
          <p>Ambos modos tienen los mismos 10 audios y 50 preguntas. Elige antes de comenzar.</p>
        </div>

        <div className="ta-modes-grid">
          <button className="ta-mode-card timed" onClick={() => startWithMode('timed')}>
            <FontAwesomeIcon icon={faHourglassHalf} className="ta-mode-icon" />
            <h3>Contra el tiempo</h3>
            <div className="ta-mode-big">30 s <span>por pregunta</span></div>
            <p>Dispones de 30 segundos para cada pregunta. Si se agota el tiempo, la pregunta se marca como incorrecta. Ideal para ganar velocidad y reflejos.</p>
            <span className="ta-mode-go">Empezar <FontAwesomeIcon icon={faArrowRight} /></span>
          </button>

          <button className="ta-mode-card free" onClick={() => startWithMode('free')}>
            <FontAwesomeIcon icon={faStopwatch} className="ta-mode-icon" />
            <h3>Tiempo libre</h3>
            <div className="ta-mode-big">Cronómetro</div>
            <p>Sin límite por pregunta: un cronómetro mide tu tiempo total. La idea es que en cada intento lo repitas en <strong>menos tiempo</strong> y desarrolles tu habilidad.</p>
            {best > 0
              ? <span className="ta-mode-best"><FontAwesomeIcon icon={faTrophy} /> Tu mejor tiempo: {fmt(best)}</span>
              : <span className="ta-mode-go">Empezar <FontAwesomeIcon icon={faArrowRight} /></span>}
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // VISTA 4 · Resultados
  // ════════════════════════════════════════════════════════════════════════
  if (finished) {
    const { correct, total } = scoreFor(selectedTest);
    const pct = Math.round((correct / total) * 100);
    const passed = pct >= 60;

    // Temas fallados (únicos) con su enlace teórico
    const wrongConcepts = [];
    const seen = new Set();
    selectedTest.exercises.forEach(ex => ex.questions.forEach((q, qi) => {
      if (answers[`${ex.id}-${qi}`] !== q.answer && !seen.has(q.concept)) {
        seen.add(q.concept);
        wrongConcepts.push(q.concept);
      }
    }));

    const best = mode === 'free' ? (Number(localStorage.getItem(bestKey(selectedTest.id))) || 0) : 0;
    const isRecord = mode === 'free' && best > 0 && elapsed <= best;

    return (
      <div className="ta-container">
        <div className={`ta-result-card ${passed ? 'pass' : 'fail'}`}>
          <FontAwesomeIcon icon={faTrophy} className="ta-result-trophy" />
          <h1>{passed ? '¡Prueba superada!' : 'Sigue practicando'}</h1>
          <div className="ta-result-score">{correct}<span>/{total}</span></div>
          <div className="ta-result-pct">{pct}% de aciertos</div>
          <div className="ta-result-bar"><div style={{ width: `${pct}%` }} /></div>

          {mode === 'free' && (
            <div className="ta-result-time">
              <FontAwesomeIcon icon={faStopwatch} /> Tiempo total: <strong>{fmt(elapsed)}</strong>
              {isRecord
                ? <span className="ta-record"><FontAwesomeIcon icon={faTrophy} /> ¡Nuevo récord!</span>
                : best > 0 && <span className="ta-best-ref">Mejor: {fmt(best)}</span>}
            </div>
          )}
          {mode === 'timed' && (
            <div className="ta-result-time">
              <FontAwesomeIcon icon={faHourglassHalf} /> Modo contra el tiempo (30 s por pregunta)
            </div>
          )}

          <p className="ta-result-msg">
            {passed
              ? 'Buen oído. Repite en menos tiempo o en modo contra reloj para afinar tus reflejos.'
              : 'Vuelve a intentarlo. Revisa abajo los temas donde fallaste antes de repetir.'}
          </p>
        </div>

        {/* Recomendaciones teóricas */}
        <div className="ta-review">
          <h3><FontAwesomeIcon icon={faBookOpen} /> Para saber más sobre lo que fallaste</h3>
          {wrongConcepts.length === 0 ? (
            <p className="ta-review-perfect"><FontAwesomeIcon icon={faCheck} /> ¡Sin errores! Dominaste todos los temas de esta prueba.</p>
          ) : (
            <>
              <p className="ta-review-intro">Toca cada tema para ir directo al contenido teórico correspondiente:</p>
              <div className="ta-review-list">
                {wrongConcepts.map((concept, i) => {
                  const th = conceptTheory(concept);
                  return (
                    <button key={i} className="ta-review-item" onClick={() => goTheory(th.tab)}>
                      <div>
                        <span className="ta-review-concept">{concept}</span>
                        <span className="ta-review-target">Ver: {th.label}</span>
                      </div>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="ta-result-actions">
          <button className="ta-btn ta-btn-primary" onClick={() => openTest(selectedTest)}>
            <FontAwesomeIcon icon={faRedo} /> Repetir prueba
          </button>
          <button className="ta-btn ta-btn-secondary" onClick={backToList}>
            <FontAwesomeIcon icon={faArrowLeft} /> Otras pruebas
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // VISTA 3 · Ejercicio de audio
  // ════════════════════════════════════════════════════════════════════════
  const playsLeft = MAX_PLAYS - plays;
  const timerPct = (timeLeft / TIME_PER_Q) * 100;
  const timerLow = timeLeft <= 10;

  return (
    <div className="ta-container">
      <div className="ta-exercise-top">
        <button className="ta-back" onClick={backToList}>
          <FontAwesomeIcon icon={faArrowLeft} /> Salir
        </button>
        <span className="ta-test-tag">{selectedTest.emoji} {selectedTest.title}</span>
        <span className="ta-progress-tag">Audio {exerciseIndex + 1} / {selectedTest.exercises.length}</span>
      </div>

      <div className="ta-progress-bar">
        <div style={{ width: `${(exerciseIndex / selectedTest.exercises.length) * 100}%` }} />
      </div>

      {/* Estado de modo / cronómetro */}
      {mode === 'free' && (
        <div className="ta-timer-strip free">
          <FontAwesomeIcon icon={faStopwatch} /> Tiempo: <strong>{fmt(elapsed)}</strong>
          <span className="ta-timer-note">Modo tiempo libre — intenta bajar tu marca</span>
        </div>
      )}
      {mode === 'timed' && targetQi !== -1 && (
        <div className={`ta-timer-strip timed ${timerLow ? 'low' : ''}`}>
          <FontAwesomeIcon icon={faClock} />
          <span>Pregunta {targetQi + 1}: <strong>{timeLeft}s</strong></span>
          <div className="ta-timer-bar"><div style={{ width: `${timerPct}%` }} /></div>
        </div>
      )}

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
          const timedOut = chosen === '__timeout__';
          const isCorrect = chosen === q.answer;
          return (
            <div key={key} className={`ta-question ${answered ? (isCorrect ? 'ok' : 'ko') : ''} ${mode === 'timed' && qi === targetQi ? 'active' : ''}`}>
              <div className="ta-q-head">
                <span className="ta-q-num">{qi + 1}</span>
                <h3>{q.q}</h3>
              </div>

              <div className="ta-options">
                {rotateOptions(q.options, exercise.id, qi).map((opt, oi) => {
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
                    {isCorrect ? '¡Correcto!' : (timedOut ? 'Se acabó el tiempo' : 'Incorrecto')}
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

      {/* Navegación: solo avanzar (no se puede retroceder) */}
      <div className="ta-nav single">
        <button className="ta-btn ta-btn-primary" onClick={nextExercise} disabled={!allAnswered}>
          {exerciseIndex + 1 < selectedTest.exercises.length
            ? <>Siguiente audio <FontAwesomeIcon icon={faArrowRight} /></>
            : <>Finalizar prueba <FontAwesomeIcon icon={faTrophy} /></>}
        </button>
      </div>
      {!allAnswered && (
        <p className="ta-nav-hint">Debes responder las 5 preguntas para continuar. No es posible volver a un audio anterior.</p>
      )}
    </div>
  );
};

export default TestAudio;
