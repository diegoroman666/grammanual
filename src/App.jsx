import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Acerca from './components/Acerca.jsx';
import ComoAprender from './components/ComoAprender.jsx';
import Teoria from './components/Teoria.jsx';
import Herramientas from './components/Herramientas.jsx';
import RutaAprendizaje from './components/RutaAprendizaje.jsx';
import PruebaContrarreloj from './components/PruebaContrarreloj.jsx';
import PracticaLibre from './components/PracticaLibre.jsx';
import Layout from './components/Layout.jsx';

// Import CSS
import './styles/main.css';
import './components/Layout.css';
import './components/Acerca.css';
import './components/ComoAprender.css';
import './components/PracticaLibre.css';
import './components/Teoria.css';
import './components/Herramientas.css';
import './components/RutaAprendizaje.css';
import './components/PruebaContrarreloj.css';

function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('grammanual-theme', newTheme);
  };

  // Load saved theme preference and apply to document
  useEffect(() => {
    const savedTheme = localStorage.getItem('grammanual-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <Router>
      <Layout theme={theme} toggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/como-aprender" element={<ComoAprender />} />
          <Route path="/acerca" element={<Acerca />} />
          <Route path="/teoria" element={<Teoria />} />
          <Route path="/herramientas" element={<Herramientas />} />
          <Route path="/ruta" element={<RutaAprendizaje />} />
          <Route path="/prueba" element={<PruebaContrarreloj />} />
          <Route path="/practica-libre" element={<PracticaLibre />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

