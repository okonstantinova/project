import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({ baseURL });

export interface EngineDefinition {
  engine: string;
  label: string;
  description: string;
  syntax: string;
  defaultTemplate: string;
}

export interface EnginesResponse {
  engines: EngineDefinition[];
  sampleData: unknown;
}

export interface EngineResult {
  id?: string;
  engine: string;
  compileTimeMs: number | null;
  renderTimeMs: number | null;
  totalTimeMs: number | null;
  outputSize: number | null;
  error: string | null;
}

export interface BenchmarkRun {
  id: string;
  name: string;
  iterations: number;
  data: unknown;
  createdAt: string;
  results: EngineResult[];
}

export interface RunRequest {
  name?: string;
  data: unknown;
  iterations: number;
  engines: { engine: string; template: string }[];
}

export const getEngines = () =>
  api.get<EnginesResponse>('/engines').then((r) => r.data);

export const runBenchmark = (body: RunRequest) =>
  api.post<BenchmarkRun>('/benchmark/run', body).then((r) => r.data);

export const getResults = () =>
  api.get<BenchmarkRun[]>('/results').then((r) => r.data);

export const getResult = (id: string) =>
  api.get<BenchmarkRun>(`/results/${id}`).then((r) => r.data);

export const deleteResult = (id: string) =>
  api.delete(`/results/${id}`).then(() => undefined);
