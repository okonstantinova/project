import { useEffect, useMemo, useState } from 'react';
import {
  getEngines,
  runBenchmark,
  type BenchmarkRun,
  type EngineDefinition,
} from '../api/client';
import ResultsView from '../components/ResultsView';

export default function BenchmarkPage() {
  const [engines, setEngines] = useState<EngineDefinition[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [templates, setTemplates] = useState<Record<string, string>>({});
  const [jsonText, setJsonText] = useState('{}');
  const [iterations, setIterations] = useState(1000);
  const [name, setName] = useState('Сравнение шаблонизаторов');

  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<BenchmarkRun | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEngines()
      .then((data) => {
        setEngines(data.engines);
        const tpls: Record<string, string> = {};
        data.engines.forEach((e) => (tpls[e.engine] = e.defaultTemplate));
        setTemplates(tpls);
        setSelected(new Set(data.engines.slice(0, 3).map((e) => e.engine)));
        setJsonText(JSON.stringify(data.sampleData, null, 2));
      })
      .catch(() => setError('Не удалось загрузить список движков. Запущен ли backend?'));
  }, []);

  const selectedEngines = useMemo(
    () => engines.filter((e) => selected.has(e.engine)),
    [engines, selected],
  );

  function toggle(engine: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(engine) ? next.delete(engine) : next.add(engine);
      return next;
    });
  }

  async function handleRun() {
    setError(null);
    setResult(null);

    let data: unknown;
    try {
      data = JSON.parse(jsonText);
    } catch {
      setError('JSON-данные некорректны.');
      return;
    }
    if (selected.size === 0) {
      setError('Выберите хотя бы один шаблонизатор.');
      return;
    }

    setRunning(true);
    try {
      const run = await runBenchmark({
        name,
        data,
        iterations,
        engines: selectedEngines.map((e) => ({
          engine: e.engine,
          template: templates[e.engine],
        })),
      });
      setResult(run);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Ошибка при запуске бенчмарка.');
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="benchmark">
      <h1>Песочница бенчмарка</h1>
      <p className="lead">
        Введите данные, выберите шаблонизаторы, отредактируйте при необходимости
        шаблоны и запустите замер. Время измеряется на сервере (среднее по N
        итераций).
      </p>

      <section className="card">
        <div className="row">
          <label className="field">
            <span>Название прогона</span>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="field small">
            <span>Итераций</span>
            <input
              type="number"
              min={1}
              max={100000}
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
            />
          </label>
        </div>

        <label className="field">
          <span>Данные (JSON)</span>
          <textarea
            className="code data-input"
            rows={8}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />
        </label>
      </section>

      <section className="card">
        <h2>Выбор шаблонизаторов</h2>
        <div className="engine-grid">
          {engines.map((e) => (
            <label
              key={e.engine}
              className={`engine-card ${selected.has(e.engine) ? 'on' : ''}`}
            >
              <input
                type="checkbox"
                checked={selected.has(e.engine)}
                onChange={() => toggle(e.engine)}
              />
              <div>
                <strong>{e.label}</strong>
                <p>{e.description}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {selectedEngines.length > 0 && (
        <section className="card">
          <h2>Шаблоны выбранных движков</h2>
          <p className="hint">
            У каждого движка свой синтаксис, поэтому шаблоны редактируются по
            отдельности. По умолчанию заданы эквивалентные шаблоны.
          </p>
          {selectedEngines.map((e) => (
            <label key={e.engine} className="field">
              <span>
                {e.label} <em className="syntax">({e.syntax})</em>
              </span>
              <textarea
                className="code"
                rows={5}
                value={templates[e.engine] ?? ''}
                onChange={(ev) =>
                  setTemplates((t) => ({ ...t, [e.engine]: ev.target.value }))
                }
              />
            </label>
          ))}
        </section>
      )}

      <div className="actions">
        <button className="primary" onClick={handleRun} disabled={running}>
          {running ? 'Выполняется…' : 'Запустить бенчмарк'}
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      {result && (
        <section className="card result-block">
          <h2>Результаты</h2>
          <p className="meta">
            «{result.name}» · {result.iterations} итераций · сохранено в базе
            (id: {result.id.slice(0, 8)}…)
          </p>
          <ResultsView results={result.results} />
        </section>
      )}
    </div>
  );
}
