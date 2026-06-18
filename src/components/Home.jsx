import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap, faPencilAlt, faRoute, faBolt,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

const TIME_CARDS = [
  {
    path: '/pasado',
    emoji: '⏮',
    label: 'Pasado',
    desc: 'Past Simple, Continuous & Perfect',
    accent: 'card-accent-red',
  },
  {
    path: '/presente',
    emoji: '⏯',
    label: 'Presente',
    desc: 'Present Simple, Continuous & Perfect',
    accent: 'card-accent-green',
  },
  {
    path: '/futuro',
    emoji: '⏭',
    label: 'Futuro',
    desc: 'Future Simple, Going to & Will',
    accent: 'card-accent-blue',
  },
];

const FEATURE_CARDS = [
  {
    path: '/teoria',
    icon: faGraduationCap,
    label: 'Teoría',
    desc: 'Gramática explicada de forma clara y estructurada',
  },
  {
    path: '/ejercicios',
    icon: faPencilAlt,
    label: 'Ejercicios',
    desc: 'Practica con ejercicios interactivos y corrección automática',
  },
  {
    path: '/ruta',
    icon: faRoute,
    label: 'Ruta de Aprendizaje',
    desc: 'Sigue un camino estructurado de principiante a avanzado',
  },
  {
    path: '/prueba',
    icon: faBolt,
    label: 'Prueba Contrarreloj',
    desc: 'Pon a prueba tu velocidad y tu conocimiento bajo presión',
  },
];

export default function Home() {
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
          Aprende gramática en inglés de forma interactiva y divertida.{' '}
          <strong className="hero-strong">Tú eres el protagonista</strong>{' '}
          de tu propio aprendizaje.
        </p>
      </section>

      {/* ── Time travel section ── */}
      <section className="home-section">
        <h2 className="section-heading">¿A qué tiempo deseas viajar?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
          {TIME_CARDS.map(({ path, emoji, label, desc, accent }) => (
            <Link key={path} to={path} className={`time-card ${accent}`}>
              <span className="time-card-emoji">{emoji}</span>
              <h3 className="time-card-title">{label}</h3>
              <p className="time-card-desc">{desc}</p>
              <span className="time-card-arrow">
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Features section ── */}
      <section className="home-section">
        <h2 className="section-heading">Explora el contenido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {FEATURE_CARDS.map(({ path, icon, label, desc }) => (
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
