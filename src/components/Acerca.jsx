import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faBook, faRoute, faLanguage, faStar } from '@fortawesome/free-solid-svg-icons';
import './Acerca.css';

const Acerca = () => {
  return (
    <div className="acerca-container">
      <div className="acerca-header">
        <h1>📚 GramManual</h1>
        <p className="version">Versión 2.0</p>
      </div>

      <div className="acerca-section">
        <h2>
          <FontAwesomeIcon icon={faGraduationCap} />
          ¿Qué es GramManual?
        </h2>
        <p>
          GramManual es una aplicación web interactiva diseñada para aprender 
          gramática inglesa de manera fácil y efectiva. Entiende que 
          <strong> tú eres el protagonista</strong> de tu aprendizaje.
        </p>
      </div>

      <div className="acerca-features">
        <div className="acerca-feature-card">
          <FontAwesomeIcon icon={faBook} className="acerca-feature-icon" />
          <h3>Gramática Completa</h3>
          <p>Aprende todos los tiempos verbales: Pasado, Presente y Futuro con sus conjugaciones.</p>
        </div>

        <div className="acerca-feature-card">
          <FontAwesomeIcon icon={faRoute} className="acerca-feature-icon" />
          <h3>Módulos por Niveles</h3>
          <p>Supera módulos de Principiante a Experto y desbloquea el siguiente nivel sin perder acceso a los anteriores.</p>
        </div>

        <div className="acerca-feature-card">
          <FontAwesomeIcon icon={faLanguage} className="acerca-feature-icon" />
          <h3>Traducción Automática</h3>
          <p>Traduce ejemplos y frases instantáneamente con nuestro asistente de IA.</p>
        </div>
      </div>

      <div className="acerca-section">
        <h2>
          <FontAwesomeIcon icon={faStar} />
          Características
        </h2>
        <ul className="features-list">
          <li>📱 Diseño mobile-first - Optimizado para celular</li>
          <li>🌙 Tema claro/oscuro - Elige tu preferencia</li>
          <li>📊 Vista por tiempo o conjugación - Como prefieras</li>
          <li>📥 Exporta a Excel y PDF - Lleva la gramática contigo</li>
          <li>✏️ Edita ejemplos y traducciones - Personaliza tu aprendizaje</li>
          <li>🎧 Práctica libre de lectura y audio - Sin bloqueos ni límites</li>
          <li>🔥 Racha diaria - Mantén vivo tu hábito de estudio</li>
        </ul>
      </div>

      <div className="acerca-section">
        <h2>Equipo de Desarrollo</h2>
        <p>
          Esta aplicación fue desarrollada con ❤️ por <strong>Diego Roman IEI</strong>
        </p>
        <p className="copyright">
          © {new Date().getFullYear()} Todos los derechos reservados
        </p>
      </div>

      <div className="acerca-actions">
        <Link to="/" className="btn btn-primary">
          Volver al Inicio
        </Link>
        <Link to="/ruta" className="btn btn-success">
          Ir a Módulos
        </Link>
      </div>
    </div>
  );
};

export default Acerca;

