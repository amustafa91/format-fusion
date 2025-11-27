

import React from 'react';
import { LogoIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-secondary/50 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center">
            <LogoIcon className="h-10 w-10 text-accent" />
            <h1 className="ml-3 text-2xl font-bold text-light tracking-tight">
              Format Fusion
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};