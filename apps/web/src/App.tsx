import { NavLink, Route, Routes } from 'react-router-dom';
import BenchmarkPage from './pages/BenchmarkPage';
import ResultsPage from './pages/ResultsPage';

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">TemplPulse</div>
        <nav>
          <NavLink to="/" end>
            Бенчмарк
          </NavLink>
          <NavLink to="/results">Результаты</NavLink>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<BenchmarkPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </main>

      <footer className="footer">
        Песочница для сравнения производительности JS-шаблонизаторов · учебный
        проект
      </footer>
    </div>
  );
}
