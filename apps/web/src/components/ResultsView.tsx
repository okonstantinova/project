import type { EngineResult } from '../api/client';
import BenchmarkChart from './BenchmarkChart';
import ResultsTable from './ResultsTable';

interface Props {
  results: EngineResult[];
}

export default function ResultsView({ results }: Props) {
  return (
    <div className="results-view">
      <BenchmarkChart results={results} />
      <ResultsTable results={results} />
    </div>
  );
}
