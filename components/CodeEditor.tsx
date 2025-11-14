import React, { useState, useId } from 'react';
import { CopyIcon, CheckIcon, SparklesIcon } from './Icons';

interface CodeEditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  language?: string;
  isValid?: boolean;
  onFormat?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ label, value, language, isValid = true, onFormat, ...props }) => {
  const [copied, setCopied] = useState(false);
  const id = useId();

  const handleCopy = () => {
    if (typeof value === 'string' && value.length > 0) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const borderColorClass = !value ? 'border-slate-600' : isValid ? 'border-green-500/50' : 'border-red-500/50';

  return (
    <div className={`bg-secondary rounded-lg shadow-lg flex flex-col h-full min-h-[400px] border ${borderColorClass} transition-colors duration-300`}>
      <div className="flex justify-between items-center p-3 border-b border-slate-600">
        <label htmlFor={id} className="text-sm font-semibold uppercase tracking-wider text-slate-300">{label}</label>
        <div className="flex items-center gap-4">
          {language && <span className="text-xs bg-slate-700 text-accent font-mono px-2 py-1 rounded">{language}</span>}
          {onFormat && (
            <button onClick={onFormat} className="text-slate-400 hover:text-white transition-colors" aria-label="Format code" title="Format Code">
              <SparklesIcon className="w-5 h-5" />
            </button>
          )}
          <button onClick={handleCopy} className="text-slate-400 hover:text-white transition-colors" aria-label="Copy code">
            {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <div className="relative flex-grow">
        <textarea
          id={id}
          className="w-full h-full p-4 bg-transparent text-light font-mono resize-none focus:outline-none placeholder-slate-500"
          placeholder={props.readOnly ? 'Output will appear here...' : `Enter ${label} here...`}
          {...props}
          value={value}
        />
      </div>
    </div>
  );
};