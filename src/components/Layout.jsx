import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook, faInfoCircle, faMoon, faSun, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Layout.css';

const Layout = ({ children, theme, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className={`app-wrapper ${theme}`}>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">📚</span>
            <span className="brand-text">GramManual</span>
          </Link>

          <ul className="navbar-menu desktop-menu">
            <li>
              <Link to="/" className={`nav-link ${isActive('/')}`}>
                <FontAwesomeIcon icon={faHome} />
                <span>Inicio</span>
              </Link>
            </li>
            <li>
              <Link to="/ejercicios" className={`nav-link ${isActive('/ejercicios')}`}>
                <FontAwesomeIcon icon={faBook} />
                <span>Ejercicios</span>
              </Link>
            </li>
            <li>
              <Link to="/acerca" className={`nav-link ${isActive('/acerca')}`}>
                <FontAwesomeIcon icon={faInfoCircle} />
                <span>Acerca de</span>
              </Link>
            </li>
          </ul>

          <div className="navbar-actions">
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              aria-label="Cambiar tema"
            >
              <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
            </button>
            
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú"
            >
              <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="navbar-menu">
            <li>
              <Link to="/" className={`nav-link ${isActive('/')}`}>
                <FontAwesomeIcon icon={faHome} />
                <span>Inicio</span>
              </Link>
            </li>
            <li>
              <Link to="/ejercicios" className={`nav-link ${isActive('/ejercicios')}`}>
                <FontAwesomeIcon icon={faBook} />
                <span>Ejercicios</span>
              </Link>
            </li>
            <li>
              <Link to="/acerca" className={`nav-link ${isActive('/acerca')}`}>
                <FontAwesomeIcon icon={faInfoCircle} />
                <span>Acerca de</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <p>Desarrollado por Diego Roman IEI - Derechos reservados</p>
      </footer>
    </div>
  );
};

export default Layout;

