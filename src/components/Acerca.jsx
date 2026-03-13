import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faBook, faLaptop, faLanguage, faStar } from '@fortawesome/free-solid-svg-icons';
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
        <div className="feature-card">
          <FontAwesomeIcon icon={faBook} className="feature-icon" />
          <h3>Gramática Completa</h3>
          <p>Aprende todos los tiempos verbales: Pasado, Presente y Futuro con sus conjugaciones.</p>
        </div>

        <div className="feature-card">
          <FontAwesomeIcon icon={faLaptop} className="feature-icon" />
          <h3>Ejercicios Interactivos</h3>
          <p>Practica con ejercicios de completar oraciones, identificar ideas y comprensión auditiva.</p>
        </div>

        <div className="feature-card">
          <FontAwesomeIcon icon={faLanguage} className="feature-icon" />
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
          <li>🎧 Ejercicios de audio - Practica listening</li>
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
        <Link to="/ejercicios" className="btn btn-success">
          Ir a Ejercicios
        </Link>
      </div>
    </div>
  );
};

export default Acerca;

