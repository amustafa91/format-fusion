import React from 'react';

export const Hero: React.FC = () => {
    return (
        <section className="text-center py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Free Online <span className="text-accent">GPT Token Counter</span> &amp;
                <br className="hidden md:block" /> Data Format Converter
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-6 leading-relaxed">
                Count tokens for <strong>GPT-4</strong>, <strong>GPT-3.5</strong>, and <strong>Claude</strong> using tiktoken.
                Convert between <strong>JSON</strong>, <strong>YAML</strong>, <strong>XML</strong>, and <strong>Toon</strong>.
                Generate <strong>TypeScript</strong>, <strong>Python</strong>, <strong>Go</strong>, and <strong>Rust</strong> types instantly.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-400">
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">✓ 100% Client-Side</span>
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">✓ No Data Sent to Servers</span>
                <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">✓ Free Forever</span>
            </div>
        </section>
    );
};
