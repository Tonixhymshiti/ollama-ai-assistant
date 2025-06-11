export const DEFAULT_BASE_URL = 'http://localhost:11434';
export const DEFAULT_MODEL = 'llama3.2:1b';

export const OLLAMA_BASE_URL =
  (import.meta.env.VITE_OLLAMA_BASE_URL as string) || DEFAULT_BASE_URL;
export const LLM_MODEL =
  (import.meta.env.VITE_LLM_MODEL as string) || DEFAULT_MODEL;
