import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeadphones, faVolumeUp, faStop, faCheck, faTimes,
  faArrowRight, faArrowLeft, faRedo, faLock, faTrophy,
  faLanguage, faEye, faFileAlt, faPlay, faLightbulb,
  faStopwatch, faHourglassHalf, faBookOpen, faClock, faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { tests, TOTAL_QUESTIONS } from '../data/testAudioData';
import { translateText } from '../services/translateApi';
import './TestAudio.css';

const MAX_PLAYS = 3;         // El audio se puede escuchar como máximo 3 veces
const TIME_PER_EX = 6 * 60;  // 6 minutos por ejercicio (5 preguntas) → 1 hora por prueba (10 ejercicios)

// ─── Fuente del audio ─────────────────────────────────────────────────────────
// Cada ejercicio tiene un MP3 real pregenerado en /audio/<id>.mp3 (ver
// scripts/generate-audio.py). Se usa SIEMPRE que se pueda porque suena igual en
// todos los dispositivos.
//
// Antes esta sección dependía solo de la Web Speech API (speechSynthesis) y ahí
// estaba el fallo: en un navegador sin voces en inglés instaladas —habitual en
// Android, en Linux y en el WebView de la app— getVoices() devuelve una lista
// vacía y cada speak() acaba en "synthesis-failed". El alumno pulsaba
// «Escuchar», no oía nada y encima perdía una de sus 3 reproducciones.
//
// Ahora la síntesis del navegador queda solo como alternativa: se usa si el MP3
// no llega a cargar (red caída, archivo no desplegado) y únicamente si el
// dispositivo tiene voces de verdad.
const audioSrc = (exercise) => `${import.meta.env.BASE_URL}audio/${exercise.id}.mp3`;

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

// ─── Repaso guiado tras la prueba ──────────────────────────────────────────────
// Al terminar, la pantalla de resultados propone los temas fallados. Entrar en
// uno lleva a /teoria, lo que DESMONTA este componente y se llevaba por delante
// el puntaje: al volver aparecía otra vez la lista de pruebas y el alumno perdía
// la pantalla de resultados y el resto de sugerencias.
//
// Para evitarlo se guarda una foto del resultado en sessionStorage mientras dura
// el repaso. Vale para los dos modos (contrarreloj y tiempo libre) y sobrevive
// tanto al botón «Volver a los resultados» de Teoría como a la flecha atrás del
// navegador. Se borra en cuanto el alumno sale de los resultados a propósito
// (repetir prueba o elegir otra), para que nunca reaparezca un puntaje viejo.
const REVIEW_KEY = 'ta-review-session';

const loadReview = () => {
  try {
    const raw = sessionStorage.getItem(REVIEW_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveReview = (data) => {
  try {
    sessionStorage.setItem(REVIEW_KEY, JSON.stringify(data));
  } catch {
    // Modo privado o almacenamiento lleno: el repaso seguirá funcionando con el
    // botón «Volver a los resultados», solo se pierde al recargar la página.
  }
};

const clearReview = () => {
  try {
    sessionStorage.removeItem(REVIEW_KEY);
  } catch {
    /* nada que limpiar */
  }
};

// Trocea un texto en oraciones (para encolar utterances cortas y fiables).
// Si alguna oración fuese muy larga, la parte además por comas.
function splitSentences(text) {
  const sentences = (text.match(/[^.!?]+[.!?]*/g) || [text])
    .map(s => s.trim())
    .filter(Boolean);
  const out = [];
  sentences.forEach(s => {
    if (s.length <= 160) { out.push(s); return; }
    // oración larga: partir por comas manteniendo trozos manejables
    let buf = '';
    s.split(',').forEach(part => {
      const piece = part.trim();
      if (!piece) return;
      if ((buf + ' ' + piece).trim().length > 160 && buf) { out.push(buf.trim()); buf = piece; }
      else buf = (buf ? buf + ', ' : '') + piece;
    });
    if (buf.trim()) out.push(buf.trim());
  });
  return out.length ? out : [text];
}

// ─── Barajado aleatorio de las opciones ─────────────────────────────────────────
// En los datos la respuesta correcta se lista primera (posición A) por comodidad.
// Aquí barajamos TODAS las opciones (Fisher–Yates) con una semilla determinista
// por pregunta: el orden se ve aleatorio y la correcta cae en cualquier posición,
// pero es estable entre renders (no salta mientras el alumno responde).
function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}
// PRNG determinista (mulberry32)
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffleOptions(options, exId, qi) {
  const rand = mulberry32(hashStr(`${exId}-${qi}`));
  const arr = options.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const TestAudio = () => {
  const navigate = useNavigate();

  // Si el alumno estaba repasando los temas fallados, se recupera su resultado
  // para devolverlo a la pantalla del puntaje en vez de a la lista de pruebas.
  const restored = useRef(loadReview()).current;
  const restoredTest = restored ? tests.find(t => t.id === restored.testId) : null;

  const [selectedTest, setSelectedTest] = useState(restoredTest || null);
  const [mode, setMode] = useState(restoredTest ? restored.mode : null);  // null | 'timed' | 'free'
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [answers, setAnswers] = useState(restoredTest ? restored.answers : {});  // key `${exId}-${qi}` -> option ('__timeout__' si se agotó el tiempo)
  const [plays, setPlays] = useState(0);
  const [audioStatus, setAudioStatus] = useState('idle');  // idle | loading | playing | error
  const [audioError, setAudioError] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const [translation, setTranslation] = useState('');
  const [translating, setTranslating] = useState(false);
  const [finished, setFinished] = useState(Boolean(restoredTest));
  const [voices, setVoices] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_EX);
  const [elapsed, setElapsed] = useState(restoredTest ? restored.elapsed : 0);
  // Temas que el alumno ya abrió desde las sugerencias de repaso.
  const [reviewed, setReviewed] = useState(restoredTest ? (restored.reviewed || []) : []);

  const rotationRef = useRef(0);
  const keepAliveRef = useRef(null);
  const audioElRef = useRef(null);   // <audio> del MP3 del ejercicio actual
  const startingRef = useRef(false); // evita dobles clics mientras arranca
  const attemptRef = useRef(null);   // intento de reproducción en curso

  const exercise = selectedTest ? selectedTest.exercises[exerciseIndex] : null;
  // Primera pregunta sin responder del ejercicio actual (objetivo del cronómetro)
  const targetQi = exercise
    ? exercise.questions.findIndex((_, qi) => !answers[`${exercise.id}-${qi}`])
    : -1;

  // Cargar voces del navegador (solo se usan como alternativa al MP3)
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

  // Al salir de la sección: cortar cualquier audio y limpiar temporizadores.
  useEffect(() => () => {
    if (keepAliveRef.current) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
    const el = audioElRef.current;
    if (el) el.pause();
  }, []);

  const stopAudio = useCallback(() => {
    if (keepAliveRef.current) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const el = audioElRef.current;
    if (el) { el.pause(); el.currentTime = 0; }
    startingRef.current = false;
    setAudioStatus('idle');
  }, []);

  // Cronómetro ascendente (modo tiempo libre)
  useEffect(() => {
    if (mode !== 'free' || !selectedTest || finished) return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [mode, selectedTest, finished]);

  // Reinicia el contador de 6 min al cambiar de ejercicio (modo contrarreloj)
  useEffect(() => {
    if (mode === 'timed' && exercise) setTimeLeft(TIME_PER_EX);
  }, [mode, exercise?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Contrarreloj: el tiempo SIGUE CORRIENDO. Cada ejercicio dura 6 min; al
  // agotarse, se avanza automáticamente al siguiente (reloj global de 1 hora).
  useEffect(() => {
    if (mode !== 'timed' || !exercise || finished) return;
    if (timeLeft <= 0) {
      // Marca como incorrectas las preguntas sin responder de este ejercicio…
      setAnswers(prev => {
        const next = { ...prev };
        exercise.questions.forEach((_, qi) => {
          const key = `${exercise.id}-${qi}`;
          if (!next[key]) next[key] = '__timeout__';
        });
        return next;
      });
      // …y avanza automáticamente (o finaliza si era el último).
      if (exerciseIndex + 1 < selectedTest.exercises.length) {
        setExerciseIndex(i => i + 1);
        rotationRef.current += 1;
        setTimeLeft(TIME_PER_EX);
        setPlays(0);
        setShowTranscript(false);
        setTranslation('');
        stopAudio();
      } else {
        stopAudio();
        setFinished(true);
      }
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [mode, exercise, timeLeft, finished, exerciseIndex, selectedTest, stopAudio]);

  const resetExerciseState = useCallback(() => {
    setPlays(0);
    setShowTranscript(false);
    setTranslation('');
    setAudioError('');
    stopAudio();
  }, [stopAudio]);

  const openTest = (test) => {
    clearReview();          // empieza una prueba nueva: el repaso anterior ya no vale
    setReviewed([]);
    setSelectedTest(test);
    setMode(null);
    setExerciseIndex(0);
    setAnswers({});
    setFinished(false);
    setElapsed(0);
    setTimeLeft(TIME_PER_EX);
    resetExerciseState();
  };

  const startWithMode = (m) => {
    clearReview();
    setReviewed([]);
    setMode(m);
    setExerciseIndex(0);
    setAnswers({});
    setFinished(false);
    setElapsed(0);
    setTimeLeft(TIME_PER_EX);
    rotationRef.current = 0;
    resetExerciseState();
  };

  const backToList = () => {
    clearReview();
    setReviewed([]);
    stopAudio();
    setSelectedTest(null);
    setMode(null);
    setFinished(false);
  };

  // Devuelve la reproducción gastada y avisa. Solo actúa una vez por intento:
  // el mismo fallo puede llegar por dos vías (promesa rechazada y evento error)
  // y el alumno no debe recuperar dos reproducciones por un único clic.
  const failAttempt = useCallback((attempt, message) => {
    if (!attempt || attempt.settled) return;
    attempt.settled = true;
    startingRef.current = false;
    setPlays(p => Math.max(0, p - 1));
    setAudioStatus('error');
    setAudioError(message);
  }, []);

  // ── Alternativa: leer el texto con la voz del navegador ─────────────────────
  // Solo se llega aquí si el MP3 no se pudo reproducir. Devuelve true si al
  // menos consiguió arrancar la síntesis.
  const speakWithBrowser = useCallback((attempt) => {
    const synth = window.speechSynthesis;
    if (!('speechSynthesis' in window) || !synth || !exercise) return false;

    // Sin voces instaladas la síntesis falla en silencio: mejor no intentarlo y
    // avisar al alumno en vez de gastarle una reproducción muda.
    const available = synth.getVoices();
    const voicePool = available && available.length ? available : voices;
    if (!voicePool || voicePool.length === 0) return false;
    if (available && available.length && voices.length === 0) setVoices(available);

    if (keepAliveRef.current) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
    synth.cancel();

    const voice = pickVoice(voicePool, exercise, rotationRef.current + exerciseIndex);

    // Se trocea el texto en oraciones y se encolan varias utterances cortas.
    // Esto evita el bug de Chrome/Android que corta los audios largos (~>15 s)
    // y es mucho más fiable en celular que un único enunciado largo.
    const chunks = splitSentences(exercise.audioText);
    let remaining = chunks.length;
    let failed = 0;
    const onChunkDone = (errored) => {
      if (errored) failed += 1;
      remaining -= 1;
      if (remaining <= 0) {
        if (keepAliveRef.current) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
        // Si TODOS los fragmentos fallaron, no sonó nada: se devuelve la
        // reproducción en vez de dar por buena una escucha que no existió.
        if (failed === chunks.length) {
          failAttempt(attempt, 'No se pudo reproducir el audio en este dispositivo. Revisa tu conexión y vuelve a intentarlo: no se te ha descontado esta reproducción.');
        } else {
          setAudioStatus('idle');
        }
      }
    };

    // IMPORTANTE: speak() se llama de forma SÍNCRONA dentro del gesto del clic
    // (requisito de iOS/Safari). Nada de setTimeout antes de hablar.
    chunks.forEach(chunk => {
      const u = new SpeechSynthesisUtterance(chunk);
      if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = 'en-US';
      u.pitch = exercise.pitch ?? 1;
      u.rate = exercise.rate ?? 0.9;
      u.volume = 1;
      u.onend = () => onChunkDone(false);
      u.onerror = () => onChunkDone(true);
      synth.speak(u);
    });

    // Empujón suave para motores que se detienen entre enunciados (Chrome desktop).
    // resume() sin pause() no provoca cortes audibles.
    keepAliveRef.current = setInterval(() => {
      if (!synth.speaking && !synth.pending) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; return; }
      synth.resume();
    }, 5000);

    return true;
  }, [exercise, exerciseIndex, voices, failAttempt]);

  // Pasa de la pista MP3 a la voz del navegador. Si el dispositivo tampoco
  // tiene voces, devuelve la reproducción y muestra el motivo.
  const fallbackToSpeech = useCallback((attempt, reason) => {
    if (!attempt || attempt.settled) return;
    startingRef.current = false;
    if (speakWithBrowser(attempt)) setAudioStatus('playing');
    else failAttempt(attempt, reason);
  }, [speakWithBrowser, failAttempt]);

  // ── Reproducir el ejercicio ─────────────────────────────────────────────────
  // Primero el MP3 del sitio (suena igual en cualquier dispositivo); si no se
  // puede, la voz del navegador; y si tampoco, un aviso claro SIN descontar la
  // reproducción. Nunca se queda en silencio sin explicación.
  const playAudio = () => {
    if (!exercise || plays >= MAX_PLAYS || startingRef.current) return;

    startingRef.current = true;
    setAudioError('');
    setAudioStatus('loading');
    // Se cuenta la reproducción al empezar; si resulta que no sonó nada, se
    // devuelve (failAttempt) para no penalizar un fallo técnico.
    setPlays(p => p + 1);
    const attempt = { settled: false };
    attemptRef.current = attempt;

    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    const el = audioElRef.current;
    if (!el) {
      fallbackToSpeech(attempt, 'No se pudo cargar el audio de este ejercicio.');
      return;
    }

    el.currentTime = 0;
    // play() se lanza de forma SÍNCRONA dentro del clic: es lo que exigen
    // iOS/Safari y las políticas de autoplay de Chrome.
    const started = el.play();
    if (started && typeof started.catch === 'function') {
      started
        .then(() => { attempt.settled = true; startingRef.current = false; })
        .catch(() => fallbackToSpeech(attempt, 'No se pudo reproducir el audio. Comprueba el volumen del dispositivo y vuelve a intentarlo: no se te ha descontado esta reproducción.'));
    } else {
      startingRef.current = false;
    }
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
      setTimeLeft(TIME_PER_EX);
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

  // Abre un tema de repaso en Teoría SIN perder la pantalla de resultados: antes
  // de salir se guarda el puntaje y qué temas lleva vistos, y se le pasa a
  // Teoría de dónde viene para que muestre el botón «Volver a los resultados».
  const goTheory = (tab, concept) => {
    stopAudio();
    const alreadySeen = reviewed.includes(concept) ? reviewed : [...reviewed, concept];
    setReviewed(alreadySeen);
    saveReview({
      testId: selectedTest.id,
      mode,
      answers,
      elapsed,
      reviewed: alreadySeen,
    });
    navigate('/teoria', {
      state: {
        ...(tab ? { tab } : {}),
        backTo: '/test-audio',
        backLabel: 'Volver a los resultados de la prueba',
      },
    });
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
            <li>Antes de empezar eliges modo: <strong>6 min por ejercicio</strong> (1 h por prueba) o <strong>tiempo libre con cronómetro</strong>.</li>
            <li>Cada ejercicio usa una <strong>voz distinta</strong> (acentos y tonos variados).</li>
            <li>El audio es un <strong>archivo grabado</strong> del propio sitio: suena igual en el móvil y en el PC, aunque tu navegador no tenga voces instaladas. Si alguna vez fallara, <strong>no se te descuenta</strong> la reproducción.</li>
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
            <div className="ta-mode-big">6 min <span>por ejercicio</span></div>
            <p>El reloj no se detiene: 6 minutos por audio y <strong>1 hora por prueba</strong>. Si se cumplen los 6 min, avanza solo al siguiente audio (lo sin responder queda incorrecto) y te avisa en el último minuto. Puedes terminar en menos de una hora.</p>
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
              <FontAwesomeIcon icon={faHourglassHalf} /> Modo contra el tiempo (6 min por ejercicio · 1 h por prueba)
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
              <p className="ta-review-intro">
                Entra en cada tema para ver la teoría y vuelve aquí con el botón
                «Volver a los resultados»: tu puntaje y esta lista te esperan para
                que sigas con el siguiente.
              </p>
              <div className="ta-review-list">
                {wrongConcepts.map((concept, i) => {
                  const th = conceptTheory(concept);
                  const seen = reviewed.includes(concept);
                  return (
                    <button
                      key={i}
                      className={`ta-review-item ${seen ? 'seen' : ''}`}
                      onClick={() => goTheory(th.tab, concept)}
                    >
                      <div>
                        <span className="ta-review-concept">{concept}</span>
                        <span className="ta-review-target">Ver: {th.label}</span>
                      </div>
                      {seen
                        ? <span className="ta-review-seen"><FontAwesomeIcon icon={faCheck} /> Revisado</span>
                        : <FontAwesomeIcon icon={faArrowRight} />}
                    </button>
                  );
                })}
              </div>
              {reviewed.length > 0 && (
                <p className="ta-review-progress">
                  Llevas <strong>{reviewed.filter(c => wrongConcepts.includes(c)).length}</strong> de{' '}
                  <strong>{wrongConcepts.length}</strong> temas revisados.
                </p>
              )}
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
  const timerPct = (timeLeft / TIME_PER_EX) * 100;
  const timerLow = timeLeft <= 60; // último minuto del ejercicio
  const globalRemaining = (selectedTest.exercises.length - exerciseIndex - 1) * TIME_PER_EX + timeLeft;

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
      {mode === 'timed' && (
        <div className={`ta-timer-strip timed ${timerLow ? 'low' : ''}`}>
          <FontAwesomeIcon icon={timerLow ? faExclamationTriangle : faClock} />
          <span>Ejercicio {exerciseIndex + 1}: <strong>{fmt(timeLeft)}</strong></span>
          <div className="ta-timer-bar"><div style={{ width: `${timerPct}%` }} /></div>
          <span className="ta-timer-note">
            {timerLow
              ? '¡Último minuto! Al acabar pasa al siguiente audio'
              : `Total prueba: ${fmt(globalRemaining)}`}
          </span>
        </div>
      )}

      {/* Reproductor */}
      <div className="ta-player-card">
        {/* El MP3 del ejercicio, servido por el propio sitio. Es la fuente
            principal: no depende de que el dispositivo tenga voces instaladas. */}
        <audio
          ref={audioElRef}
          key={exercise.id}
          src={audioSrc(exercise)}
          preload="auto"
          onPlaying={() => { startingRef.current = false; setAudioStatus('playing'); setAudioError(''); }}
          onEnded={() => setAudioStatus('idle')}
          onError={() => {
            // El archivo no cargó (404, red caída, formato no soportado). Si el
            // alumno no había pulsado nada todavía no se le molesta: el fallo se
            // gestiona cuando pulse «Escuchar».
            if (audioStatus !== 'loading' && audioStatus !== 'playing') return;
            fallbackToSpeech(
              attemptRef.current,
              'No se pudo cargar el audio de este ejercicio. Revisa tu conexión y vuelve a intentarlo: no se te ha descontado esta reproducción.',
            );
          }}
        />
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
            <button className="ta-play-btn" onClick={playAudio} disabled={plays >= MAX_PLAYS || audioStatus === 'loading'}>
              <FontAwesomeIcon icon={faVolumeUp} /> {audioStatus === 'loading' ? 'Cargando…' : 'Escuchar'}
            </button>
          )}
          <span className={`ta-plays ${plays >= MAX_PLAYS ? 'used' : ''}`}>
            {plays >= MAX_PLAYS
              ? <><FontAwesomeIcon icon={faLock} /> Sin reproducciones</>
              : <>Te quedan {playsLeft} de {MAX_PLAYS}</>}
          </span>
        </div>
      </div>

      {audioError && (
        <div className="ta-audio-error" role="alert">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>{audioError}</span>
        </div>
      )}

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
                {shuffleOptions(q.options, exercise.id, qi).map((opt, oi) => {
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
