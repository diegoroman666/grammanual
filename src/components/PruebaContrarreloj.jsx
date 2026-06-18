import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar, faTrophy, faBolt, faCheck, faTimes,
  faArrowRight, faRedo, faBook, faHome, faPlay, faLock
} from '@fortawesome/free-solid-svg-icons';
import { modules, levelMeta, getStars, MAX_SCORE } from '../data/pruebaData';
import { saveTestResult, getModuleResult, isLevelUnlocked } from '../services/progressService';
import './PruebaContrarreloj.css';

// ─── Circular timer ───────────────────────────────────────────────────────────
const CircularTimer = ({ timeLeft, total, urgent }) => {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - timeLeft / total);
  return (
    <svg className={`circ-timer ${urgent ? 'urgent' : ''}`} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} className="circ-bg" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} className="circ-progress" strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
      <text x="50" y="57" className="circ-text" textAnchor="middle">{timeLeft}</text>
    </svg>
  );
};

// ─── Stars display ────────────────────────────────────────────────────────────
const Stars = ({ count, big }) => (
  <div className={`stars-row ${big ? 'big' : ''}`}>
    {[1,2,3].map(i => (
      <FontAwesomeIcon key={i} icon={faStar}
        className={i <= count ? 'star-on' : 'star-off'} />
    ))}
  </div>
);

// ─── Module selector ──────────────────────────────────────────────────────────
const ModuleSelector = ({ onSelect }) => {
  const [level, setLevel] = useState('beginner');
  const levelModules = modules.filter(m => m.level === level);
  const meta = levelMeta[level];

  return (
    <div className="selector-container">
      <div className="selector-header">
        <h1><FontAwesomeIcon icon={faBolt} /> Pruebas Contrareloj</h1>
        <p>Pon a prueba tu conocimiento contra el tiempo</p>
      </div>

      <div className="level-tabs">
        {Object.entries(levelMeta).map(([key, m]) => {
          const unlocked = isLevelUnlocked(key);
          return (
            <button key={key}
              className={`level-tab ${level === key ? 'active' : ''} ${!unlocked ? 'locked' : ''}`}
              onClick={() => unlocked && setLevel(key)}
              style={level === key ? { borderColor: m.color, color: m.color } : {}}
            >
              {m.emoji} {m.label}
              {!unlocked && <FontAwesomeIcon icon={faLock} className="tab-lock" />}
            </button>
          );
        })}
      </div>

      <div className="module-selector-grid">
        {levelModules.map(mod => {
          const result = getModuleResult(mod.id);
          const stars = getStars(result?.bestScore || 0);
          return (
            <button key={mod.id} className="selector-card" onClick={() => onSelect(mod)}
                    style={{ '--lc': meta.color, '--lb': meta.bg }}>
              <span className="sel-emoji">{mod.emoji}</span>
              <span className="sel-title">{mod.title}</span>
              <span className="sel-desc">{mod.description}</span>
              <div className="sel-footer">
                {result ? (
                  <>
                    <span className="sel-score">{result.bestScore}/{MAX_SCORE}</span>
                    <Stars count={stars} />
                  </>
                ) : (
                  <span className="sel-new">Nuevo</span>
                )}
              </div>
              <div className="sel-play-overlay">
                <FontAwesomeIcon icon={faPlay} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const PHASES = { SELECT: 'select', COUNTDOWN: 'countdown', TEST: 'test', RESULT: 'result' };

const PruebaContrarreloj = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [phase, setPhase]   = useState(PHASES.SELECT);
  const [mod, setMod]       = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore]   = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);

  // Auto-start if launched from Ruta with a moduleId
  useEffect(() => {
    const id = location.state?.moduleId;
    if (id) {
      const found = modules.find(m => m.id === id);
      if (found) startModule(found);
    }
  }, []);

  const startModule = (selected) => {
    setMod(selected);
    setPhase(PHASES.COUNTDOWN);
    setCountdown(3);
    setQIndex(0);
    setScore(0);
    setCorrect(0);
    setChosen(null);
    setRevealed(false);
  };

  // Countdown effect
  useEffect(() => {
    if (phase !== PHASES.COUNTDOWN) return;
    if (countdown <= 0) { setPhase(PHASES.TEST); startQuestion(); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  const startQuestion = () => {
    setChosen(null);
    setRevealed(false);
    setTimeLeft(mod ? mod.timePerQuestion : 20);
  };

  // Question timer
  useEffect(() => {
    if (phase !== PHASES.TEST || revealed) return;
    if (timeLeft <= 0) { handleAnswer(null); return; }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [phase, timeLeft, revealed]);

  // Need to re-run startQuestion when mod is ready after countdown
  useEffect(() => {
    if (phase === PHASES.TEST && !revealed && chosen === null && timeLeft === 0) {
      if (mod) setTimeLeft(mod.timePerQuestion);
    }
  }, [phase, mod]);

  const handleAnswer = (option) => {
    clearTimeout(timerRef.current);
    setChosen(option);
    setRevealed(true);

    const q = mod.questions[qIndex];
    const isCorrect = option === q.answer;
    const timeBonus = isCorrect ? Math.round((timeLeft / mod.timePerQuestion) * 5) : 0;
    const pts = isCorrect ? 10 + timeBonus : 0;

    setScore(s => s + pts);
    if (isCorrect) setCorrect(c => c + 1);

    setTimeout(() => advance(pts), 1400);
  };

  const advance = (pts) => {
    const next = qIndex + 1;
    if (next >= mod.questions.length) {
      finishTest();
    } else {
      setQIndex(next);
      startQuestion();
    }
  };

  const finishTest = () => {
    setScore(prev => {
      const { isHighScore, prevBest } = saveTestResult(mod.id, prev);
      setResult({ score: prev, stars: getStars(prev), isHighScore, prevBest, correct });
      return prev;
    });
    setPhase(PHASES.RESULT);
  };

  // ── Render phases ──────────────────────────────────────────────────────────

  if (phase === PHASES.SELECT) return <ModuleSelector onSelect={startModule} />;

  if (phase === PHASES.COUNTDOWN) return (
    <div className="countdown-screen">
      <div className="countdown-ring">
        <span className="countdown-num">{countdown > 0 ? countdown : '¡Ya!'}</span>
      </div>
      <p className="countdown-mod">{mod?.emoji} {mod?.title}</p>
      <p className="countdown-hint">{mod?.questions.length} preguntas · {mod?.timePerQuestion}s por pregunta</p>
    </div>
  );

  if (phase === PHASES.TEST && mod) {
    const q = mod.questions[qIndex];
    const meta = levelMeta[mod.level];
    const urgent = timeLeft <= Math.round(mod.timePerQuestion * 0.3);

    return (
      <div className="test-screen">
        {/* Top bar */}
        <div className="test-topbar">
          <span className="test-mod-title">{mod.emoji} {mod.title}</span>
          <span className="test-score-disp"><FontAwesomeIcon icon={faBolt} /> {score} pts</span>
        </div>

        {/* Progress */}
        <div className="test-progress-bar">
          <div className="test-progress-fill"
               style={{ width: `${((qIndex) / mod.questions.length) * 100}%`, background: meta.color }} />
        </div>
        <div className="test-progress-text">{qIndex + 1} / {mod.questions.length}</div>

        {/* Timer + Question */}
        <div className="test-main">
          <CircularTimer timeLeft={timeLeft} total={mod.timePerQuestion} urgent={urgent} />
          <div className={`question-card ${revealed ? 'revealed' : ''}`}>
            <p className="question-text">{q.q}</p>
          </div>
        </div>

        {/* Options */}
        <div className="options-grid">
          {q.options.map((opt, i) => {
            let cls = 'opt-btn';
            if (revealed) {
              if (opt === q.answer) cls += ' opt-correct';
              else if (opt === chosen) cls += ' opt-wrong';
              else cls += ' opt-dim';
            } else if (chosen === opt) {
              cls += ' opt-selected';
            }
            return (
              <button key={i} className={cls} onClick={() => !revealed && handleAnswer(opt)} disabled={revealed}>
                <span className="opt-letter">{String.fromCharCode(65+i)}</span>
                <span className="opt-text">{opt}</span>
                {revealed && opt === q.answer && <FontAwesomeIcon icon={faCheck} className="opt-icon-ok" />}
                {revealed && opt === chosen && opt !== q.answer && <FontAwesomeIcon icon={faTimes} className="opt-icon-no" />}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {revealed && (
          <div className={`explanation-bar ${chosen === q.answer ? 'exp-ok' : 'exp-fail'}`}>
            {chosen === q.answer ? '✅ ' : '❌ '}{q.exp}
          </div>
        )}
      </div>
    );
  }

  if (phase === PHASES.RESULT && result) {
    const meta = levelMeta[mod.level];
    const pct = Math.round((result.score / MAX_SCORE) * 100);
    const medal = result.stars === 3 ? '🥇' : result.stars === 2 ? '🥈' : result.stars === 1 ? '🥉' : '📝';

    return (
      <div className="result-screen">
        <div className="result-card">
          <div className="result-medal">{medal}</div>
          <Stars count={result.stars} big />
          <h2 className="result-title">
            {result.stars === 3 ? '¡Perfecto!' : result.stars === 2 ? '¡Muy bien!' : result.stars === 1 ? '¡Aprobado!' : 'Sigue practicando'}
          </h2>

          <div className="result-stats">
            <div className="rstat"><span className="rstat-val" style={{ color: meta.color }}>{result.score}</span><span className="rstat-lab">Puntos</span></div>
            <div className="rstat"><span className="rstat-val">{result.correct}/{mod.questions.length}</span><span className="rstat-lab">Correctas</span></div>
            <div className="rstat"><span className="rstat-val">{pct}%</span><span className="rstat-lab">Precisión</span></div>
          </div>

          <div className="result-score-bar-bg">
            <div className="result-score-bar-fill" style={{ width: `${pct}%`, background: meta.color }} />
          </div>

          {result.isHighScore && result.prevBest > 0 && (
            <div className="result-highscore">
              🎉 ¡Nuevo récord! +{result.score - result.prevBest} pts sobre tu anterior mejor
            </div>
          )}
          {result.isHighScore && result.prevBest === 0 && (
            <div className="result-highscore">🎉 ¡Primera vez completado!</div>
          )}

          <div className="result-xp">
            <FontAwesomeIcon icon={faBolt} /> +{result.score} XP ganados
          </div>

          <div className="result-actions">
            <button className="res-btn res-retry" onClick={() => startModule(mod)}>
              <FontAwesomeIcon icon={faRedo} /> Repetir
            </button>
            <button className="res-btn res-theory" onClick={() => navigate('/teoria', { state: { tab: mod.teoriaTab } })}>
              <FontAwesomeIcon icon={faBook} /> Ver Teoría
            </button>
            <button className="res-btn res-ruta" onClick={() => navigate('/ruta')}>
              <FontAwesomeIcon icon={faHome} /> Ruta
            </button>
          </div>

          {/* Next module suggestion */}
          {(() => {
            const levelMods = modules.filter(m => m.level === mod.level);
            const idx = levelMods.findIndex(m => m.id === mod.id);
            const next = levelMods[idx + 1];
            if (!next) return null;
            return (
              <button className="next-mod-btn" onClick={() => startModule(next)}>
                Siguiente módulo: {next.emoji} {next.title} <FontAwesomeIcon icon={faArrowRight} />
              </button>
            );
          })()}
        </div>
      </div>
    );
  }

  return null;
};

export default PruebaContrarreloj;
