import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faInfoCircle, faMoon, faSun,
  faBars, faTimes, faGraduationCap, faRoute, faToolbox, faListOl, faHeadphones,
} from '@fortawesome/free-solid-svg-icons';
import './Layout.css';

const NAV_LINKS = [
  { path: '/',              icon: faHome,          label: 'Inicio'        },
  { path: '/como-aprender', icon: faListOl,        label: 'Cómo Aprender' },
  { path: '/teoria',        icon: faGraduationCap, label: 'Teoría'        },
  { path: '/herramientas',  icon: faToolbox,       label: 'Herramientas'  },
  { path: '/ruta',          icon: faRoute,         label: 'Módulos'       },
  { path: '/test-audio',    icon: faHeadphones,    label: 'Test Audio'    },
  { path: '/acerca',        icon: faInfoCircle,    label: 'Acerca'        },
];

const Layout = ({ children, theme, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  const isActive = (path) => {
    if (path === '/ruta') {
      return ['/ruta', '/prueba', '/practica-libre'].includes(location.pathname);
    }
    return location.pathname === path;
  };

  return (
    <div className={`app-wrapper ${theme}`}>

      {/* ── Animated background blobs ── */}
      <div className="bg-blobs" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* ── Navbar ── */}
      <nav className="navbar-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Brand */}
            <Link to="/" className="brand-link flex items-center gap-2 font-bold text-xl">
              <span className="text-2xl leading-none">📚</span>
              <span>GramManual</span>
            </Link>

            {/* Desktop nav */}
            <ul className="desktop-nav items-center gap-0.5 list-none m-0 p-0">
              {NAV_LINKS.map(({ path, icon, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={`nav-item flex items-center gap-1.5 px-2 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                      isActive(path) ? 'nav-active' : 'nav-inactive'
                    }`}
                  >
                    <FontAwesomeIcon icon={icon} style={{ fontSize: '0.7rem', opacity: 0.75 }} />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className="icon-btn" aria-label="Cambiar tema">
                <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
              </button>
              <button
                className="icon-btn mobile-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menú"
              >
                <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu-panel">
            {NAV_LINKS.map(({ path, icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`mobile-nav-item ${isActive(path) ? 'nav-active' : ''}`}
              >
                <FontAwesomeIcon icon={icon} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* ── Main content ── */}
      <main className="main-content">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="footer-glass">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center">
          <p className="footer-text">
            Desarrollado por Diego Roman IEI — Derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
