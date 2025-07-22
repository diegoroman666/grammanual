// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/main.css'; // Tu CSS actual (déjalo)

// Importa el CSS de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// Importa el JS de Bootstrap y Popper.js (opcional si solo usas el modal de forma simple)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);