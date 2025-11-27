
import type { LanguageOption } from './types';

export const DATA_LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'xml', label: 'XML' },
  { value: 'toon', label: 'TOON' },
];

export const CODE_LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
];


export const LANGUAGE_OPTIONS: LanguageOption[] = [
  ...DATA_LANGUAGE_OPTIONS,
  ...CODE_LANGUAGE_OPTIONS,
];
