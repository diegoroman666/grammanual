import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-container">
      <h1>Bienvenido al mundo de GramManual</h1>
      <p>
        Aquí verás todas las fórmulas necesarias para aprender gramática en inglés de forma interactiva,
        en donde <strong>tú eres el protagonista</strong>.
      </p>
      <h2>¿A qué tiempo deseas viajar?</h2>
      <div className="buttons">
        <Link to="/pasado"><button>Pasado</button></Link>
        <Link to="/presente"><button>Presente</button></Link>
        <Link to="/futuro"><button>Futuro</button></Link>
      </div>
    </div>
  );
}
