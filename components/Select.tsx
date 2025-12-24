import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className, ...props }) => {
    return (
        <fieldset className={`border border-slate-600 rounded hover:border-slate-500 focus-within:border-accent transition-colors relative ${className}`}>
            <legend className="px-1 text-xs font-medium text-slate-400 ml-2">{label}</legend>
            <div className="relative">
                <select
                    className="w-full bg-transparent border-none text-slate-200 text-sm px-3 pb-2 pt-0 focus:ring-0 outline-none appearance-none cursor-pointer"
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-secondary text-slate-200">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-0 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
            </div>
        </fieldset>
    );
};
