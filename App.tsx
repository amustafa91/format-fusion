import React, { useState, useCallback, useEffect } from 'react';
import yaml from 'js-yaml';
import { encodingForModel } from "js-tiktoken";
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { LanguageSelector } from './components/LanguageSelector';
import { CodeEditor } from './components/CodeEditor';
import { Header } from './components/Header';
import { TokenStats } from './components/TokenStats';
import { SwapIcon, AlertTriangleIcon } from './components/Icons';
import { Select } from './components/Select';
import { SeoContent } from './components/SeoContent';
import { LANGUAGE_OPTIONS, DATA_LANGUAGE_OPTIONS, CODE_LANGUAGE_OPTIONS } from './constants';
import type { LanguageOption } from './types';

const enc = encodingForModel("gpt-4o");
const countTokens = (text: string) => {
  try {
    return enc.encode(text).length;
  } catch (e) {
    console.error("Token counting error:", e);
    return 0;
  }
};



const parseToonValue = (val: string) => {
  const s = val.trim();
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s === 'null') return null;
  if (s && !isNaN(Number(s)) && s.trim() !== '' && !/\s/.test(s)) {
    return Number(s);
  }
  // Handle strings that were quoted
  if ((s.startsWith('"') && s.endsWith('"'))) {
    // Unescape quotes
    return s.slice(1, -1).replace(/\\"/g, '"');
  }
  return s;
};

// Parses a comma-separated list, respecting quotes.
const parseCommaSeparated = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '\\' && i + 1 < line.length && line[i + 1] === '"') {
      current += '"';
      i++; // Skip the quote
    } else if (char === '"') {
      inQuote = !inQuote;
    } else if (char === ',' && !inQuote) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  // We pass the raw values (including quotes) to parseToonValue
  return result.map(v => v.trim());
};


const parseToon = (text: string): any => {
  const lines = text.split('\n').map(line => ({
    indent: line.search(/\S|$/),
    content: line.trim(),
  })).filter(line => line.content && !line.content.startsWith('#'));

  if (lines.length === 0) return null;

  let index = 0;

  const parseRecursively = (currentIndent: number): [any, number] => {
    if (index >= lines.length || lines[index].indent < currentIndent) {
      return [null, index];
    }

    const firstLine = lines[index];
    const isList = firstLine.content.startsWith('-');

    if (isList) {
      const list = [];
      while (index < lines.length && lines[index].indent === currentIndent && lines[index].content.startsWith('-')) {
        const lineContent = lines[index].content.substring(1).trim();
        index++;

        let itemValue;
        const hasNestedBlock = index < lines.length && lines[index].indent > currentIndent;

        if (hasNestedBlock) {
          const [nestedValue, newIndex] = parseRecursively(lines[index].indent);
          index = newIndex;

          if (lineContent) {
            const separatorIndex = lineContent.indexOf(':');
            if (separatorIndex !== -1) {
              const key = lineContent.substring(0, separatorIndex).trim();
              const valueStr = lineContent.substring(separatorIndex + 1).trim();
              const value = parseToonValue(valueStr);
              if (typeof nestedValue === 'object' && nestedValue !== null && !Array.isArray(nestedValue)) {
                itemValue = { [key]: value, ...nestedValue };
              } else {
                itemValue = nestedValue;
              }
            } else {
              itemValue = nestedValue;
            }
          } else {
            itemValue = nestedValue;
          }

        } else {
          itemValue = parseToonValue(lineContent);
        }
        list.push(itemValue);
      }
      return [list, index];
    }

    const obj: { [key: string]: any } = {};
    while (index < lines.length && lines[index].indent === currentIndent) {
      const lineContent = lines[index].content;

      const tableHeaderRegex = /^([\w-]+)\[(\d+)\]\{([\w,]+)\}:$/;
      const tableMatch = lineContent.match(tableHeaderRegex);

      if (tableMatch) {
        const key = tableMatch[1];
        const count = parseInt(tableMatch[2], 10);
        const headers = tableMatch[3].split(',');
        const list = [];

        index++; // consume header line

        const expectedIndent = lines[index]?.indent;
        if (expectedIndent !== undefined && expectedIndent > currentIndent) {
          let rowsAdded = 0;
          while (index < lines.length && lines[index].indent === expectedIndent && rowsAdded < count) {
            const rowContent = lines[index].content;
            const values = parseCommaSeparated(rowContent);
            const itemObj: { [key: string]: any } = {};
            headers.forEach((header, i) => {
              itemObj[header] = parseToonValue(values[i] || '');
            });
            list.push(itemObj);
            rowsAdded++;
            index++;
          }
        }
        obj[key] = list;
        continue;
      }

      const separatorIndex = lineContent.indexOf(':');
      if (separatorIndex === -1) {
        if (lineContent.startsWith('-')) {
          return [obj, index];
        }
        break;
      }

      const key = lineContent.substring(0, separatorIndex).trim();
      const valueStr = lineContent.substring(separatorIndex + 1).trim();

      const simpleListRegex = /^([\w-]+)\[(\d+)\]$/;
      const simpleListMatch = key.match(simpleListRegex);

      if (simpleListMatch) {
        const listKey = simpleListMatch[1];
        const count = parseInt(simpleListMatch[2], 10);
        const values = parseCommaSeparated(valueStr).map(v => parseToonValue(v));
        if (count !== values.length) {
          console.warn(`TOON Parse Warning: List count mismatch for key "${listKey}". Expected ${count}, found ${values.length}.`);
        }
        obj[listKey] = values;
        index++;
        continue;
      }

      index++;

      if (valueStr.startsWith('[') && valueStr.endsWith(']')) {
        const listContent = valueStr.slice(1, -1);
        const values = parseCommaSeparated(listContent);
        obj[key] = values.map(v => parseToonValue(v));
      } else if (valueStr === '' && index < lines.length && lines[index].indent > currentIndent) {
        const [nestedValue, newIndex] = parseRecursively(lines[index].indent);
        obj[key] = nestedValue;
        index = newIndex;
      } else {
        obj[key] = parseToonValue(valueStr);
      }
    }
    return [obj, index];
  };

  const [result, _] = parseRecursively(0);
  return result;
};


const stringifyToon = (data: any, options: { indent: string, delimiter: string } = { indent: '  ', delimiter: ',' }): string => {
  const { indent, delimiter } = options;

  const stringifyPrimitiveForTable = (value: any) => {
    if (value === null) return 'null';
    if (value === undefined) return '';
    if (typeof value === 'string') {
      // Quote if it contains the delimiter, quote, or leading/trailing space.
      if (value.includes(delimiter) || value.includes('"') || value.trim() !== value) {
        return `"${value.replace(/"/g, '\\"')}"`;
      }
      return value;
    }
    return String(value);
  }

  const recurse = (value: any, level: number): string => {
    const currentIndent = indent.repeat(level);

    if (value === null) return 'null';
    if (typeof value !== 'object') {
      if (typeof value === 'string') {
        const ambiguousValues = ['true', 'false', 'null'];
        if (value.includes(delimiter) || value.includes('#') || ambiguousValues.includes(value.toLowerCase()) || (value && !isNaN(Number(value)) && !/\s/.test(value))) {
          return `"${value.replace(/"/g, '\\"')}"`;
        }
        return value;
      }
      return String(value);
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';

      const isSimplePrimitiveList = value.every(item => item === null || typeof item !== 'object');
      if (isSimplePrimitiveList) {
        const flowItems = value.map(item => {
          if (typeof item === 'string') return `"${item.replace(/"/g, '\\"')}"`;
          if (item === null) return 'null';
          return String(item);
        });
        const flowStr = `[${flowItems.join(', ')}]`;
        if (flowStr.length < 80) { // Use flow style for short lists
          return flowStr;
        }
      }

      const isListOfObjects = value.every(item => typeof item === 'object' && item !== null && !Array.isArray(item));
      if (isListOfObjects) {
        return value.map(item => {
          const itemStr = recurse(item, level + 1);
          if (!itemStr.trim()) {
            return `${currentIndent}-`;
          }
          const [firstLine, ...restLines] = itemStr.split('\n');
          const formattedFirstLine = `${currentIndent}- ${firstLine.trimStart()}`;
          return [formattedFirstLine, ...restLines].join('\n');
        }).join('\n\n');
      }

      // Fallback to block style for complex or long lists of primitives
      return value.map(item => {
        const itemStr = recurse(item, level + 1);
        if (itemStr.includes('\n')) {
          const [firstLine, ...restLines] = itemStr.split('\n');
          const formattedFirstLine = `${currentIndent}- ${firstLine.trimStart()}`;
          return [formattedFirstLine, ...restLines].join('\n');
        } else {
          return `${currentIndent}- ${itemStr.trimStart()}`;
        }
      }).join('\n');
    }

    return Object.entries(value).map(([key, val]) => {
      if (val === undefined) return '';

      if (Array.isArray(val)) {
        const isSimplePrimitiveList = val.length > 0 && val.every(item => item === null || typeof item !== 'object');

        if (isSimplePrimitiveList) {
          const allSimpleValues = val.every(v => v === null || !String(v).includes('\n'));
          if (allSimpleValues) {
            const compactValues = val.map(stringifyPrimitiveForTable).join(delimiter);
            return `${currentIndent}${key}[${val.length}]${delimiter}${compactValues}`;
          }
        }

        const isUniformListOfSimpleObjects = val.length > 0 &&
          val.every(item => typeof item === 'object' && item !== null && !Array.isArray(item)) &&
          (() => {
            if (val.length === 0) return false;
            const firstKeys = Object.keys(val[0]).sort();
            if (firstKeys.length === 0) return false;

            const allKeysMatch = val.every(item => JSON.stringify(Object.keys(item).sort()) === JSON.stringify(firstKeys));
            if (!allKeysMatch) return false;

            const allValuesPrimitive = val.every(item => Object.values(item).every(v => v === null || typeof v !== 'object'));
            return allValuesPrimitive;
          })();

        if (isUniformListOfSimpleObjects) {
          const headers = Object.keys(val[0]);
          const headerLine = `${currentIndent}${key}[${val.length}]{${headers.join(delimiter)}}${delimiter}`;
          const dataLines = val.map(item => {
            const rowValues = headers.map(h => stringifyPrimitiveForTable((item as any)[h]));
            return `${currentIndent}${indent}${rowValues.join(delimiter)}`;
          }).join('\n');
          return `${headerLine}\n${dataLines}`;
        }
      }

      const valStr = recurse(val, level + 1);

      const isNested = (typeof val === 'object' && val !== null && valStr.trim() !== '' && !valStr.startsWith('['));

      if (isNested) {
        return `${currentIndent}${key}${delimiter}\n${valStr}`;
      } else {
        return `${currentIndent}${key}${delimiter}${valStr}`;
      }
    }).filter(Boolean).join('\n');
  };

  return recurse(data, 0);
};




const generateCodeForLanguage = (lang: string, data: any, rootName = 'Root'): string => {
  const definitions = new Map<string, string>();
  const names = new Map<string, string>();

  const toPascalCase = (s: string) => s.replace(/[-_](\w)/g, (_, c) => c.toUpperCase()).replace(/^\w/, (c) => c.toUpperCase());
  const toSnakeCase = (s: string) => s.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '');
  const toCamelCase = (s: string) => s.replace(/[-_](\w)/g, (_, c) => c.toUpperCase()).replace(/^\w/, c => c.toLowerCase());

  const langConfig: Record<string, any> = {
    typescript: { property: toCamelCase, type: toPascalCase, types: { string: 'string', number: 'number', boolean: 'boolean', any: 'any' }, array: (t: string) => `${t}[]` },
    python: { property: toSnakeCase, type: toPascalCase, types: { string: 'str', number: 'int', boolean: 'bool', any: 'Any' }, array: (t: string) => `List[${t}]`, float: 'float' },
    go: { property: toPascalCase, type: toPascalCase, types: { string: 'string', number: 'int64', boolean: 'bool', any: 'interface{}' }, array: (t: string) => `[]${t}`, float: 'float64' },
    rust: { property: toSnakeCase, type: toPascalCase, types: { string: 'String', number: 'i64', boolean: 'bool', any: 'Option<serde_json::Value>' }, array: (t: string) => `Vec<${t}>`, float: 'f64' },
    java: { property: toCamelCase, type: toPascalCase, types: { string: 'String', number: 'int', boolean: 'boolean', any: 'Object' }, array: (t: string) => `ArrayList<${t}>`, float: 'double' },
    csharp: { property: toPascalCase, type: toPascalCase, types: { string: 'string', number: 'int', boolean: 'bool', any: 'object' }, array: (t: string) => `List<${t}>`, float: 'double' },
  };

  const cfg = langConfig[lang];

  function getType(value: any, keyName: string): string {
    if (value === null) return cfg.types.any;
    if (Array.isArray(value)) {
      return value.length > 0 ? cfg.array(getType(value[0], keyName)) : cfg.array(cfg.types.any);
    }
    if (typeof value === 'object') {
      const signature = JSON.stringify(Object.keys(value).sort());
      const name = cfg.type(keyName.endsWith('s') ? keyName.slice(0, -1) : keyName);
      if (!names.has(signature)) {
        names.set(signature, name);
        generateDefinition(value, name, signature);
      }
      return names.get(signature)!;
    }
    if (typeof value === 'number' && !Number.isInteger(value)) {
      return cfg.float || cfg.types.number;
    }
    return cfg.types[typeof value] || cfg.types.any;
  }

  function generateDefinition(obj: any, name: string, signature: string) {
    if (definitions.has(signature)) return;

    const fields = Object.entries(obj)
      .map(([key, value]) => {
        const propName = cfg.property(key);
        const typeName = getType(value, key);
        switch (lang) {
          case 'typescript': return `  ${propName}: ${typeName};`;
          case 'python': return `    ${propName}: ${typeName}`;
          case 'go': return `\t${propName} ${typeName} \`json:"${key}"\``;
          case 'rust': return `    ${propName}: ${typeName},`;
          case 'java': return `    public ${typeName} ${propName};`;
          case 'csharp': return `    public ${typeName} ${propName} { get; set; }`;
          default: return '';
        }
      }).join('\n');

    let definition = '';
    switch (lang) {
      case 'typescript': definition = `interface ${name} {\n${fields}\n}`; break;
      case 'python':
        if (fields.trim() === '') {
          definition = `@dataclass\nclass ${name}:\n    pass`;
        } else {
          definition = `@dataclass\nclass ${name}:\n${fields}`;
        }
        break;
      case 'go': definition = `type ${name} struct {\n${fields}\n}`; break;
      case 'rust': definition = `#[derive(Serialize, Deserialize)]\nstruct ${name} {\n${fields}\n}`; break;
      case 'java': definition = `public class ${name} {\n${fields}\n}`; break;
      case 'csharp': definition = `public class ${name}\n{\n${fields}\n}`; break;
    }
    definitions.set(signature, definition);
  }

  getType(data, rootName);

  let preamble = '';
  switch (lang) {
    case 'python': preamble = 'from dataclasses import dataclass\nfrom typing import Any, List\n\n'; break;
    case 'rust': preamble = 'use serde::{Serialize, Deserialize};\n\n'; break;
    case 'java': preamble = 'import java.util.ArrayList;\n\n'; break;
    case 'csharp': preamble = 'using System.Collections.Generic;\n\n'; break;
  }

  return preamble + Array.from(definitions.values()).reverse().join('\n\n');
};

const parseInput = (lang: LanguageOption, code: string) => {
  switch (lang.value) {
    case 'json': return JSON.parse(code);
    case 'yaml': return yaml.load(code);
    case 'xml':
      const parser = new XMLParser();
      const parsedXml = parser.parse(code);
      const rootKey = Object.keys(parsedXml)[0];
      return rootKey ? parsedXml[rootKey] : {};
    case 'toon': return parseToon(code);

    default: throw new Error('Unsupported source language');
  }
};

const stringifyOutput = (lang: LanguageOption, data: any, options?: { indent: string, delimiter: string }) => {
  switch (lang.value) {
    case 'json': return JSON.stringify(data, null, 2);
    case 'yaml': return yaml.dump(data);
    case 'xml':
      const builder = new XMLBuilder({ format: true, indentBy: '  ' });
      return builder.build({ root: data });
    case 'toon': return stringifyToon(data, options);

    case 'typescript':
    case 'python':
    case 'go':
    case 'rust':
    case 'java':
    case 'csharp':
      return generateCodeForLanguage(lang.value, data);
    default: throw new Error('Unsupported target language');
  }
};

const App: React.FC = () => {
  const [sourceLang, setSourceLang] = useState<LanguageOption>(LANGUAGE_OPTIONS[0]); // JSON
  const [targetLang, setTargetLang] = useState<LanguageOption>(LANGUAGE_OPTIONS.find(l => l.value === 'toon')!); // TOON
  const [inputCode, setInputCode] = useState<string>(`{
  "company": {
    "name": "Acme Corporation",
    "location": {
      "street": "123 Example Avenue",
      "city": "Demoville",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "departments": [
      {
        "id": "D001",
        "name": "Engineering",
        "employees": [
          {
            "employeeId": "E101",
            "firstName": "Jane",
            "lastName": "Developer",
            "position": "Software Engineer",
            "skills": ["Java", "Python", "Cloud Computing"],
            "projects": [
              {"projectId": "P1", "name": "Sample Project"},
              {"projectId": "P2", "name": "Demo Application"}
            ]
          }
        ]
      }
    ]
  }
}`);
  const [outputCode, setOutputCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInputValid, setIsInputValid] = useState<boolean>(true);
  const [sourceTokens, setSourceTokens] = useState<number>(0);
  const [targetTokens, setTargetTokens] = useState<number>(0);
  const [toonDelimiter, setToonDelimiter] = useState<string>('\t');
  const [toonIndent, setToonIndent] = useState<string>('  ');

  useEffect(() => {
    setSourceTokens(countTokens(inputCode));
  }, [inputCode]);

  useEffect(() => {
    setTargetTokens(countTokens(outputCode));
  }, [outputCode]);

  const isTargetCode = CODE_LANGUAGE_OPTIONS.some(l => l.value === targetLang.value);

  const handleConvert = useCallback(() => {
    if (!inputCode.trim()) {
      setOutputCode('');
      setError(null);
      return;
    }
    if (!isInputValid) {
      setError(`Cannot convert. The source code has invalid ${sourceLang.label} syntax.`);
      return;
    }
    setError(null);
    setOutputCode('');
    setIsLoading(true);

    setTimeout(() => {
      try {
        const parsedInput = parseInput(sourceLang, inputCode);
        const output = stringifyOutput(targetLang, parsedInput, { indent: toonIndent, delimiter: toonDelimiter });
        setOutputCode(output);
      } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Conversion failed. Please check your input syntax. Details: ${message}`);
      } finally {
        setIsLoading(false);
      }
    }, 200);
  }, [inputCode, sourceLang, targetLang, isInputValid, toonDelimiter, toonIndent]);

  useEffect(() => {
    if (!inputCode.trim()) {
      setIsInputValid(true);
      setOutputCode('');
      setError(null);
      return;
    }
    try {
      parseInput(sourceLang, inputCode);
      setIsInputValid(true);
    } catch (e) {
      setIsInputValid(false);
    }
  }, [inputCode, sourceLang]);

  const handleFormatCode = () => {
    if (!isInputValid || !inputCode.trim()) return;
    try {
      const parsed = parseInput(sourceLang, inputCode);
      const formatted = stringifyOutput(sourceLang, parsed);
      setInputCode(formatted);
      setError(null);
    } catch (err) {
      console.error("Formatting failed:", err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Formatting failed. Details: ${message}`);
    }
  };

  const handleSwapLanguages = useCallback(() => {
    if (isTargetCode) return;
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputCode(outputCode);
    setOutputCode(inputCode);
  }, [sourceLang, targetLang, inputCode, outputCode, isTargetCode]);

  // Convert on mount and when dependencies change (debounced)
  useEffect(() => {
    handleConvert();
  }, [handleConvert]);

  return (
    <div className="min-h-screen bg-primary font-sans flex flex-col">
      <Header />
      <div className="flex-grow w-full max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_minmax(700px,_4fr)_1fr] gap-6 p-4 md:p-6 lg:p-8">

        <aside className="hidden lg:flex">
          <div className="hidden w-full h-full bg-secondary rounded-lg flex items-center justify-center text-slate-500 font-semibold text-sm">Ad Placeholder</div>
        </aside>

        <main className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
            <LanguageSelector label="From" selected={sourceLang} onChange={setSourceLang} options={DATA_LANGUAGE_OPTIONS} />
            <button
              onClick={handleSwapLanguages}
              className="p-2 rounded-full bg-secondary hover:bg-accent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-secondary"
              aria-label="Swap languages"
              disabled={isTargetCode}
              title={isTargetCode ? "Cannot use a programming language as a source" : "Swap languages"}
            >
              <SwapIcon className="w-6 h-6" />
            </button>
            <LanguageSelector label="To" selected={targetLang} onChange={setTargetLang} options={LANGUAGE_OPTIONS} />
          </div>

          {targetLang.value === 'toon' && (
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <Select
                label="Indentation"
                value={toonIndent}
                onChange={(e) => setToonIndent(e.target.value)}
                options={[
                  { value: '  ', label: '2 Spaces' },
                  { value: '    ', label: '4 Spaces' },
                ]}
                className="w-40"
              />
              <Select
                label="Delimiter"
                value={toonDelimiter}
                onChange={(e) => setToonDelimiter(e.target.value)}
                options={[
                  { value: '\t', label: 'Tab' },
                  { value: ',', label: 'Comma (,)' },
                  { value: ';', label: 'Semicolon (;)' },
                  { value: '|', label: 'Pipe (|)' },
                ]}
                className="w-40"
              />
            </div>
          )}

          <TokenStats
            sourceTokens={sourceTokens}
            targetTokens={targetTokens}
            sourceLabel={sourceLang.label}
            targetLabel={targetLang.label}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
            <CodeEditor
              label="Source Code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              language={sourceLang.value}
              isValid={isInputValid}
              onFormat={handleFormatCode}
            />
            <CodeEditor
              label="Converted Code"
              value={outputCode}
              readOnly
              language={targetLang.value}
            />
          </div>

          <div className="text-center">
            <button
              onClick={handleConvert}
              disabled={isLoading || !isInputValid || !inputCode.trim()}
              className="bg-accent text-primary font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-violet-400 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? 'Loading...' : 'Convert'}
            </button>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative max-w-4xl mx-auto flex items-center" role="alert">
              <AlertTriangleIcon className="w-6 h-6 mr-3 flex-shrink-0" />
              <div>
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
          )}
          <SeoContent />
        </main>

        <aside className="hidden lg:flex">
          <div className="hidden w-full h-full bg-secondary rounded-lg flex items-center justify-center text-slate-500 font-semibold text-sm">Ad Placeholder</div>
        </aside>
      </div>
    </div>
  );
};

export default App;
