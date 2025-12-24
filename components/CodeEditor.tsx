import React, { useState, useId } from 'react';
import { CopyIcon, CheckIcon, SparklesIcon } from './Icons';

interface CodeEditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  language?: string;
  isValid?: boolean;
  onFormat?: () => void;
}

import React, { useState, useId, useRef } from 'react';
import { CopyIcon, CheckIcon, SparklesIcon, UploadIcon, TrashIcon } from './Icons';

interface CodeEditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  language?: string;
  isValid?: boolean;
  onFormat?: () => void;
  onClear?: () => void;
  onFileUpload?: (content: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  label,
  value,
  language,
  isValid = true,
  onFormat,
  onClear,
  onFileUpload,
  ...props
}) => {
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const id = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    if (typeof value === 'string' && value.length > 0) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      readFile(file);
    }
    // Reset value so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (onFileUpload) onFileUpload(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (onFileUpload && !props.readOnly) {
      const file = e.dataTransfer.files?.[0];
      if (file) readFile(file);
    }
  };

  const borderColorClass = !value ? 'border-white/10' : isValid ? 'border-green-500/30' : 'border-red-500/30';
  const dragClass = isDragOver && !props.readOnly ? 'bg-white/10 border-accent scale-[1.02] ring-2 ring-accent' : '';
  const showEmptyState = !value && !props.readOnly && onFileUpload;

  return (
    <div
      className={`
        backdrop-blur-xl bg-white/5 shadow-xl rounded-2xl flex flex-col h-full min-h-[500px] border transition-all duration-300 
        ${borderColorClass} ${dragClass}
      `}
      onDragOver={(e) => { e.preventDefault(); !props.readOnly && setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <label htmlFor={id} className="text-sm font-bold uppercase tracking-wider text-slate-300">{label}</label>
          {language && <span className="text-[10px] bg-white/10 text-accent font-mono px-2 py-0.5 rounded-full border border-white/5 uppercase">{language}</span>}
        </div>

        <div className="flex items-center gap-2">
          {onFileUpload && !props.readOnly && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json,.txt,.xml,.yaml,.yml,.js,.ts,.py,.go,.java,.cs"
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-accent hover:text-white text-slate-300 transition-all text-xs font-semibold"
                aria-label="Upload file"
                title="Upload File"
              >
                <UploadIcon className="w-3 h-3" />
                <span>Upload File</span>
              </button>
            </>
          )}

          {onFormat && (
            <button
              onClick={onFormat}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Format code"
              title="Format Code"
            >
              <SparklesIcon className="w-4 h-4" />
            </button>
          )}

          {onClear && !props.readOnly && (
            <button
              onClick={onClear}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              aria-label="Clear code"
              title="Clear"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-2 rounded-lg text-slate-400 hover:text-green-400 hover:bg-green-500/10 transition-colors"
            aria-label="Copy code"
            title="Copy to Clipboard"
          >
            {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="relative flex-grow group">
        <textarea
          id={id}
          ref={textareaRef}
          className="w-full h-full p-6 bg-transparent text-slate-200 font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder-transparent scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative z-10 bg-transparent"
          placeholder={props.readOnly ? 'Output will appear here...' : ''}
          spellCheck={false}
          {...props}
          value={value}
        />

        {/* Empty State Overlay */}
        {showEmptyState && (
          <div className={`absolute inset-0 z-0 flex flex-col items-center justify-center text-center p-6 transition-opacity duration-300 ${isDragOver ? 'opacity-0' : 'opacity-100'}`}>
            <div className="p-4 rounded-full bg-white/5 mb-4 animate-in zoom-in duration-300">
              <UploadIcon className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Drag & Drop File Here</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
              Support for JSON, XML, YAML, TS, JS, Go, Python...
            </p>
            <div className="flex flex-col gap-3 pointer-events-auto">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95"
              >
                Browse Files
              </button>
              <button
                onClick={() => textareaRef.current?.focus()}
                className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4"
              >
                or paste code directly
              </button>
            </div>
          </div>
        )}

        {/* Read Only Placeholder (if we removed the placeholder attr above) */}
        {!value && props.readOnly && (
          <div className="absolute inset-0 z-0 flex items-center justify-center text-slate-600 pointer-events-none">
            <span>Output will appear here...</span>
          </div>
        )}
      </div>
    </div>
  );
};