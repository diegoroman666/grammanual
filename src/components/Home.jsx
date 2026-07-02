import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap, faToolbox, faRoute, faFire, faBolt,
  faArrowRight, faPlay, faListOl,
} from '@fortawesome/free-solid-svg-icons';
import { getProgress } from '../services/progressService';

const PILLAR_CARDS = [
  {
    path: '/teoria',
    icon: faGraduationCap,
    label: 'Teoría',
    desc: 'Consulta las reglas gramaticales explicadas de forma clara y estructurada',
  },
  {
    path: '/herramientas',
    icon: faToolbox,
    label: 'Herramientas',
    desc: 'Fórmulas de pasado, presente y futuro, editables y exportables a Excel/PDF',
  },
  {
    path: '/ruta',
    icon: faRoute,
    label: 'Módulos',
    desc: 'Tu curso: supera módulos de principiante a experto y ponte a prueba cuando quieras',
  },
];

export default function Home() {
  const [progress, setProgress] = useState(null);

  useEffect(() => { setProgress(getProgress()); }, []);

  const started = progress && progress.totalXP > 0;

  return (
    <div className="home-page">

      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="hero-badge">English Grammar</div>
        <h1 className="hero-title">
          Bienvenido a{' '}
          <span className="hero-gradient">GramManual</span>
        </h1>
        <p className="hero-desc">
          Un curso progresivo de gramática en inglés, de principiante a experto.{' '}
          <strong className="hero-strong">Un poco cada día</strong>{' '}
          construye el hábito que te lleva a dominarlo.
        </p>
        <Link to="/como-aprender" className="hero-roadmap-link">
          <FontAwesomeIcon icon={faListOl} /> ¿Por dónde empiezo? Mira el mapa de aprendizaje
        </Link>
      </section>

      {/* ── Course status / CTA ── */}
      {progress && (
        <section className="home-section">
          <div className="home-status">
            {started && (
              <div className="home-status-stats">
                <div className="stat-box">
                  <FontAwesomeIcon icon={faFire} className="stat-icon streak" />
                  <span className="stat-value">{progress.streak?.current || 0}</span>
                  <span className="stat-label">Racha diaria</span>
                </div>
                <div className="stat-box">
                  <FontAwesomeIcon icon={faBolt} className="stat-icon xp" />
                  <span className="stat-value">{progress.totalXP}</span>
                  <span className="stat-label">XP Total</span>
                </div>
              </div>
            )}
            <h3 className="home-status-title">
              {started ? '¡Sigue así!' : 'Empieza tu curso hoy'}
            </h3>
            <p className="home-status-desc">
              {started
                ? 'Continúa tu ruta de aprendizaje y mantén viva tu racha.'
                : 'La Ruta de Aprendizaje te guía módulo a módulo, del nivel principiante al experto.'}
            </p>
            <Link to="/ruta" className="home-status-cta">
              {started ? 'Continuar mi curso' : 'Comenzar el curso'} <FontAwesomeIcon icon={started ? faArrowRight : faPlay} />
            </Link>
          </div>
        </section>
      )}

      {/* ── Pillars section ── */}
      <section className="home-section">
        <h2 className="section-heading">Tu curso en 3 pilares</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {PILLAR_CARDS.map(({ path, icon, label, desc }) => (
            <Link key={path} to={path} className="feature-card">
              <div className="feature-icon-wrap">
                <FontAwesomeIcon icon={icon} className="feature-icon" />
              </div>
              <div className="feature-body">
                <h3 className="feature-title">{label}</h3>
                <p className="feature-desc">{desc}</p>
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="feature-arrow" />
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
