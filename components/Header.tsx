

import React from 'react';
import { LogoIcon } from './Icons';

interface HeaderProps {
  showBlogLink?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showBlogLink = true }) => {
  return (
    <header className="bg-secondary/50 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <LogoIcon className="h-10 w-10 text-accent" />
            <span className="ml-3 text-2xl font-bold text-light tracking-tight">
              Format Fusion
            </span>
          </a>
          {showBlogLink && (
            <nav className="flex items-center gap-4">
              <a
                href="/blog"
                className="text-slate-300 hover:text-accent transition-colors font-medium"
              >
                Blog
              </a>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};
