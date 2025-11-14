import React, { useState, useRef, useEffect, useId } from 'react';
import type { LanguageOption } from '../types';
import { ChevronDownIcon } from './Icons';

interface LanguageSelectorProps {
  label: string;
  selected: LanguageOption;
  onChange: (option: LanguageOption) => void;
  options: LanguageOption[];
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ label, selected, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonId = useId();
  const listboxId = useId();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  
  const handleSelect = (option: LanguageOption) => {
    onChange(option);
    setIsOpen(false);
    (wrapperRef.current?.querySelector('button') as HTMLButtonElement)?.focus();
  };

  return (
    <div className="relative w-full lg:w-64" ref={wrapperRef}>
      <label htmlFor={buttonId} className="text-sm font-medium text-slate-400">{label}</label>
      <button
        id={buttonId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="relative mt-1 w-full bg-secondary border border-slate-600 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          <span className="block truncate">{selected.label}</span>
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon aria-hidden="true" className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={buttonId}
          tabIndex={-1}
          className="absolute z-10 mt-1 w-full bg-secondary shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none max-h-60"
        >
          {options.map((option) => (
            <li
              key={option.value}
              id={option.value}
              role="option"
              aria-selected={selected.value === option.value}
              tabIndex={0}
              onClick={() => handleSelect(option)}
              onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelect(option);
                  }
              }}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-slate-700 text-light focus:bg-slate-700 focus:outline-none"
            >
              <div className="flex items-center">
                <span className={`block font-normal truncate ${selected.value === option.value ? 'font-semibold' : ''}`}>
                  {option.label}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};