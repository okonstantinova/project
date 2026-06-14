import { Fragment, useEffect, useState } from 'react';
import {
  deleteResult,
  getResults,
  type BenchmarkRun,
} from '../api/client';
import ResultsView from '../components/ResultsView';

export default function ResultsPage() {
  const [runs, setRuns] = useState<BenchmarkRun[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    getResults()
      .then(setRuns)
      .catch(() => setError('Не удалось загрузить историю из базы данных.'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(id: string) {
    await deleteResult(id);
    setRuns((rs) => rs.filter((r) => r.id !== id));
  }

  function fastestEngine(run: BenchmarkRun): string {
    const ok = run.results.filter((r) => r.renderTimeMs != null);
    if (ok.length === 0) return '—';
    return ok.reduce((a, b) =>
      (a.renderTimeMs ?? Infinity) < (b.renderTimeMs ?? Infinity) ? a : b,
    ).engine;
  }

  if (loading) return <p>Загрузка…</p>;
  if (error) return <div className="alert error">{error}</div>;

  return (
    <div className="results-page">
      <h1>История прогонов</h1>
      <p className="lead">
        Все результаты сохранены во внешней базе данных (PostgreSQL). Нажмите на
        строку, чтобы раскрыть подробности.
      </p>

      {runs.length === 0 && (
        <div className="alert">Пока нет сохранённых прогонов. Запустите бенчмарк.</div>
      )}

      <table className="history-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Дата</th>
            <th>Движков</th>
            <th>Итераций</th>
            <th>Самый быстрый</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <Fragment key={run.id}>
              <tr
                className="clickable"
                onClick={() => setOpenId(openId === run.id ? null : run.id)}
              >
                <td>{run.name}</td>
                <td>{new Date(run.createdAt).toLocaleString('ru-RU')}</td>
                <td>{run.results.length}</td>
                <td>{run.iterations}</td>
                <td>{fastestEngine(run)}</td>
                <td>
                  <button
                    className="link danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(run.id);
                    }}
                  >
                    удалить
                  </button>
                </td>
              </tr>
              {openId === run.id && (
                <tr>
                  <td colSpan={6} className="detail-cell">
                    <ResultsView results={run.results} />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
