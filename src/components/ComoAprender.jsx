import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faListOl, faLightbulb, faBook, faPlay, faLock, faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { modules, levelMeta } from '../data/pruebaData';
import { isLevelUnlocked, getModuleResult } from '../services/progressService';
import './ComoAprender.css';

const STAGE_TEXT = {
  beginner: 'Construye las bases: cómo se arma una oración, cómo se conjuga y cómo se pregunta. Sin esto, cualquier regla avanzada se vuelve memorización sin sentido.',
  intermediate: 'Añade precisión: preposiciones, modales y conectores te permiten matizar ideas y sonar natural, pero exigen ya dominar la base anterior.',
  expert: 'Piensa en inglés: condicionales y voz pasiva combinan varias reglas a la vez. Es el salto de "hablar correctamente" a "pensar en el idioma".',
};

const ComoAprender = () => {
  const navigate = useNavigate();

  const goTeoria = (mod) => navigate('/teoria', { state: { tab: mod.teoriaTab } });
  const goPractice = (mod) => navigate('/prueba', { state: { moduleId: mod.id } });

  return (
    <div className="comoaprender-container">
      <div className="comoaprender-header">
        <h1><FontAwesomeIcon icon={faListOl} /> Cómo Aprender Inglés en Orden</h1>
        <p>El mapa de ruta pedagógico: qué aprender primero y por qué, paso a paso</p>
      </div>

      <div className="comoaprender-intro">
        <FontAwesomeIcon icon={faLightbulb} className="comoaprender-intro-icon" />
        <p>
          El inglés se construye en capas: cada regla nueva se apoya en la anterior.
          Por eso no conviene saltar al azar entre temas — este mapa te explica el
          <strong> porqué</strong> de cada paso, en el orden en que conviene aprenderlo.
        </p>
      </div>

      {Object.entries(levelMeta).map(([levelKey, meta]) => {
        const levelModules = modules.filter(m => m.level === levelKey);
        const unlocked = isLevelUnlocked(levelKey);

        return (
          <div key={levelKey} className="stage-section"
               style={{ '--stage-color': meta.color, '--stage-bg': meta.bg, '--stage-border': meta.border }}>
            <div className="stage-header">
              <span className="stage-emoji">{meta.emoji}</span>
              <div>
                <h2 className="stage-title">{meta.label}</h2>
                <p className="stage-text">{STAGE_TEXT[levelKey]}</p>
              </div>
            </div>

            <div className="stage-timeline">
              {levelModules.map((mod, idx) => {
                const result = getModuleResult(mod.id);
                return (
                  <div key={mod.id} className="stage-step">
                    <div className="stage-step-marker">
                      <span className="stage-step-num">{idx + 1}</span>
                      {idx < levelModules.length - 1 && <span className="stage-step-line" />}
                    </div>
                    <div className="stage-step-body">
                      <div className="stage-step-heading">
                        <span className="stage-step-emoji">{mod.emoji}</span>
                        <span className="stage-step-title">{mod.title}</span>
                        {result && <FontAwesomeIcon icon={faCheckCircle} className="stage-step-done" title="Ya superado" />}
                      </div>
                      <p className="stage-step-desc">{mod.description}</p>
                      <div className="stage-step-why">
                        <FontAwesomeIcon icon={faLightbulb} /> <strong>Por qué ahora:</strong> {mod.why}
                      </div>
                      <div className="stage-step-actions">
                        <button className="stage-btn stage-btn-theory" onClick={() => goTeoria(mod)}>
                          <FontAwesomeIcon icon={faBook} /> Ver teoría
                        </button>
                        {unlocked ? (
                          <button className="stage-btn stage-btn-play" onClick={() => goPractice(mod)}>
                            <FontAwesomeIcon icon={faPlay} /> Practicar
                          </button>
                        ) : (
                          <span className="stage-btn stage-btn-locked">
                            <FontAwesomeIcon icon={faLock} /> Completa el nivel anterior
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ComoAprender;
