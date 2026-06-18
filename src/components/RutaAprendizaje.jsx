import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock, faStar, faTrophy, faBook, faBolt,
  faChartLine, faGraduationCap, faPlay, faRedo
} from '@fortawesome/free-solid-svg-icons';
import { modules, levelMeta, getStars, MAX_SCORE } from '../data/pruebaData';
import { getProgress, isLevelUnlocked, clearProgress } from '../services/progressService';
import './RutaAprendizaje.css';

// ─── Star display ─────────────────────────────────────────────────────────────
const Stars = ({ count }) => (
  <span className="stars-display">
    {[1,2,3].map(i => (
      <FontAwesomeIcon key={i} icon={faStar} className={i <= count ? 'star-filled' : 'star-empty'} />
    ))}
  </span>
);

// ─── Module card ──────────────────────────────────────────────────────────────
const ModuleCard = ({ mod, result, locked, onStart, onTheory }) => {
  const stars = getStars(result?.bestScore || 0);
  const pct = result ? Math.round((result.bestScore / MAX_SCORE) * 100) : 0;

  return (
    <div className={`module-card ${locked ? 'locked' : ''} ${result ? 'done' : ''}`}>
      <div className="module-order">{mod.level[0].toUpperCase()}{mod.order}</div>
      <div className="module-emoji">{mod.emoji}</div>
      <div className="module-info">
        <div className="module-title">{mod.title}</div>
        <div className="module-desc">{mod.description}</div>
        {!locked && result && (
          <div className="module-score-row">
            <Stars count={stars} />
            <span className="module-score-val">{result.bestScore}/{MAX_SCORE}</span>
            <div className="module-bar-bg">
              <div className="module-bar-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
        {!locked && !result && (
          <span className="module-status-tag">Sin intentar</span>
        )}
      </div>

      {locked ? (
        <div className="module-lock">
          <FontAwesomeIcon icon={faLock} />
        </div>
      ) : (
        <div className="module-actions">
          <button className="mod-btn mod-btn-theory" onClick={() => onTheory(mod)}>
            <FontAwesomeIcon icon={faBook} /> Teoría
          </button>
          <button className="mod-btn mod-btn-play" onClick={() => onStart(mod)}>
            <FontAwesomeIcon icon={faPlay} /> {result ? 'Repetir' : 'Iniciar'}
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Learning curve chart ─────────────────────────────────────────────────────
const LearningCurve = ({ progress }) => {
  const attempted = modules.filter(m => progress.tests?.[m.id]);
  if (attempted.length === 0) return (
    <div className="curve-empty">
      <FontAwesomeIcon icon={faChartLine} />
      <p>Completa tu primera prueba para ver tu curva de aprendizaje.</p>
    </div>
  );

  return (
    <div className="curve-chart">
      {attempted.map(m => {
        const score = progress.tests[m.id]?.bestScore || 0;
        const pct = (score / MAX_SCORE) * 100;
        const meta = levelMeta[m.level];
        return (
          <div key={m.id} className="curve-bar-wrap">
            <div className="curve-bar-bg">
              <div
                className="curve-bar-fill"
                style={{ height: `${pct}%`, background: meta.color }}
                title={`${m.title}: ${score}/${MAX_SCORE}`}
              />
            </div>
            <span className="curve-label">{m.emoji}</span>
            <span className="curve-score">{score}</span>
          </div>
        );
      })}
      <div className="curve-axis">
        <span>120</span><span>80</span><span>40</span><span>0</span>
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const RutaAprendizaje = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(getProgress());

  const refresh = () => setProgress(getProgress());

  const handleStart = (mod) => navigate('/prueba', { state: { moduleId: mod.id } });

  const handleTheory = (mod) => navigate('/teoria', { state: { tab: mod.teoriaTab } });

  const completedCount = Object.keys(progress.tests || {}).length;
  const totalModules = modules.length;

  return (
    <div className="ruta-container">
      {/* Header */}
      <div className="ruta-header">
        <div className="ruta-header-left">
          <h1><FontAwesomeIcon icon={faGraduationCap} /> Ruta de Aprendizaje</h1>
          <p>Sigue el orden recomendado y construye tu inglés paso a paso</p>
        </div>
        <div className="ruta-stats">
          <div className="stat-box">
            <FontAwesomeIcon icon={faBolt} className="stat-icon xp" />
            <span className="stat-value">{progress.totalXP || 0}</span>
            <span className="stat-label">XP Total</span>
          </div>
          <div className="stat-box">
            <FontAwesomeIcon icon={faTrophy} className="stat-icon trophy" />
            <span className="stat-value">{completedCount}/{totalModules}</span>
            <span className="stat-label">Módulos</span>
          </div>
        </div>
      </div>

      {/* Level sections */}
      {Object.entries(levelMeta).map(([levelKey, meta]) => {
        const levelModules = modules.filter(m => m.level === levelKey);
        const unlocked = isLevelUnlocked(levelKey);
        const levelCompleted = levelModules.filter(m => getStars(progress.tests?.[m.id]?.bestScore || 0) >= 1).length;

        return (
          <div key={levelKey} className={`level-section ${!unlocked ? 'level-locked' : ''}`}
               style={{ '--level-color': meta.color, '--level-bg': meta.bg, '--level-border': meta.border }}>

            <div className="level-header">
              <div className="level-header-left">
                <span className="level-emoji">{meta.emoji}</span>
                <div>
                  <span className="level-label">Nivel</span>
                  <span className="level-name">{meta.label}</span>
                </div>
              </div>
              <div className="level-progress-info">
                {unlocked ? (
                  <>
                    <div className="level-prog-bar-bg">
                      <div className="level-prog-bar-fill"
                           style={{ width: `${(levelCompleted / levelModules.length) * 100}%` }} />
                    </div>
                    <span className="level-prog-text">{levelCompleted}/{levelModules.length} superados</span>
                  </>
                ) : (
                  <span className="level-lock-hint">
                    <FontAwesomeIcon icon={faLock} />
                    {levelKey === 'intermediate' ? 'Completa 3 módulos Principiante' : 'Completa 3 módulos Intermedio'}
                  </span>
                )}
              </div>
            </div>

            <div className="modules-grid">
              {levelModules.map(mod => (
                <ModuleCard
                  key={mod.id}
                  mod={mod}
                  result={progress.tests?.[mod.id] || null}
                  locked={!unlocked}
                  onStart={handleStart}
                  onTheory={handleTheory}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Learning curve */}
      <div className="curve-section">
        <div className="curve-header">
          <FontAwesomeIcon icon={faChartLine} />
          <h2>Mi Curva de Aprendizaje</h2>
          {completedCount > 0 && (
            <button className="reset-btn" onClick={() => { if(window.confirm('¿Borrar todo el progreso?')) { clearProgress(); refresh(); } }}>
              <FontAwesomeIcon icon={faRedo} /> Reiniciar
            </button>
          )}
        </div>
        <div className="curve-legend">
          {Object.entries(levelMeta).map(([k, m]) => (
            <span key={k} className="curve-legend-item">
              <span className="curve-legend-dot" style={{ background: m.color }} />
              {m.label}
            </span>
          ))}
        </div>
        <LearningCurve progress={progress} />
      </div>
    </div>
  );
};

export default RutaAprendizaje;
