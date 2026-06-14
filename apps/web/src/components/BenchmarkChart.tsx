import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { EngineResult } from '../api/client';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  results: EngineResult[];
}

export default function BenchmarkChart({ results }: Props) {
  const ok = results
    .filter((r) => r.error == null)
    .sort((a, b) => (a.renderTimeMs ?? Infinity) - (b.renderTimeMs ?? Infinity));

  if (ok.length === 0) return null;

  const labels = ok.map((r) => r.engine);
  const data = {
    labels,
    datasets: [
      {
        label: 'Рендеринг (сред.), мс',
        data: ok.map((r) => r.renderTimeMs ?? 0),
        backgroundColor: '#5cae84',
        borderRadius: 4,
      },
      {
        label: 'Компиляция, мс',
        data: ok.map((r) => r.compileTimeMs ?? 0),
        backgroundColor: '#a9d8bd',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'миллисекунды' },
      },
    },
  };

  return (
    <div className="chart-wrap">
      <Bar data={data} options={options} />
    </div>
  );
}
