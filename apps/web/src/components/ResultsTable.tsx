import type { EngineResult } from '../api/client';

interface Props {
  results: EngineResult[];
}

export default function ResultsTable({ results }: Props) {
  const ok = results.filter((r) => r.error == null);
  const failed = results.filter((r) => r.error != null);
  const sorted = [...ok].sort(
    (a, b) => (a.renderTimeMs ?? Infinity) - (b.renderTimeMs ?? Infinity),
  );
  const fastest = sorted[0]?.renderTimeMs ?? null;

  return (
    <table className="results-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Шаблонизатор</th>
          <th>Компиляция, мс</th>
          <th>Рендеринг, мс</th>
          <th>Относительно</th>
          <th>Размер вывода</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((r, i) => (
          <tr key={r.engine} className={i === 0 ? 'winner' : ''}>
            <td>{i + 1}</td>
            <td>
              {r.engine}
              {i === 0 && <span className="badge">самый быстрый</span>}
            </td>
            <td>{fmt(r.compileTimeMs)}</td>
            <td>{fmt(r.renderTimeMs)}</td>
            <td>
              {fastest && r.renderTimeMs
                ? `×${(r.renderTimeMs / fastest).toFixed(2)}`
                : '—'}
            </td>
            <td>{r.outputSize != null ? `${r.outputSize} Б` : '—'}</td>
          </tr>
        ))}
        {failed.map((r) => (
          <tr key={r.engine} className="failed">
            <td>—</td>
            <td>{r.engine}</td>
            <td colSpan={4} className="error-cell">
              Ошибка: {r.error}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function fmt(v: number | null): string {
  return v == null ? '—' : v.toFixed(4);
}
