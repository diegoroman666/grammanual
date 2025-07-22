import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Pasado from './components/Pasado.jsx';
import Presente from './components/Presente.jsx';
import Futuro from './components/Futuro.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pasado" element={<Pasado />} />
        <Route path="/presente" element={<Presente />} />
        <Route path="/futuro" element={<Futuro />} />
      </Routes>
    </Router>
  );
}

export default App;
