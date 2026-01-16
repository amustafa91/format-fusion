import React from 'react';
import { Header } from '../../components/Header';

export const ToonFormatGuideArticle: React.FC = () => {
    return (
        <div className="min-h-screen font-sans flex flex-col relative z-0">
            <Header />

            <main className="flex-grow w-full max-w-4xl mx-auto p-4 md:p-8">
                <article className="prose prose-invert prose-lg max-w-none">
                    <div className="mb-8">
                        <a href="/blog" className="text-accent hover:underline">← Back to Blog</a>
                    </div>

                    <header className="mb-12">
                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                            <time dateTime="2026-01-14">January 14, 2026</time>
                            <span>•</span>
                            <span>6 min read</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            What is the Toon Format? A Human-Readable Alternative to JSON
                        </h1>
                        <p className="text-xl text-slate-300 leading-relaxed">
                            Discover Toon, a cleaner data format that uses minimal punctuation and significant whitespace. Perfect for configuration files and reducing token costs when working with LLMs.
                        </p>
                    </header>

                    <section className="space-y-6 text-slate-300 leading-relaxed">
                        <h2 className="text-2xl font-bold text-white mt-12 mb-4">The Problem with JSON</h2>
                        <p>
                            <strong>JSON</strong> is the de facto standard for data interchange, but it has significant drawbacks for human readability and token efficiency:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Excessive punctuation (braces, brackets, quotes, commas)</li>
                            <li>All keys must be quoted, even simple identifiers</li>
                            <li>No comments allowed</li>
                            <li>Wastes tokens when used in LLM prompts (costly for OpenAI API)</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Introducing Toon Format</h2>
                        <p>
                            <strong>Toon</strong> is a human-readable data format designed for configuration files and LLM prompts. It combines the best features of YAML's readability with a cleaner syntax:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Minimal punctuation</strong>: No braces, brackets, or mandatory quotes</li>
                            <li><strong>Significant whitespace</strong>: Indentation defines structure (like Python)</li>
                            <li><strong>Familiar delimiters</strong>: Use tabs, commas, or colons as you prefer</li>
                            <li><strong>Token efficient</strong>: 30-50% fewer tokens than equivalent JSON</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-white mt-12 mb-4">JSON vs Toon Comparison</h2>
                        <p>Here's the same data in both formats:</p>

                        <p className="font-bold text-white mt-6">JSON (42 tokens):</p>
                        <pre className="bg-slate-800 p-4 rounded-lg overflow-x-auto text-sm">
                            {`{
  "server": {
    "host": "localhost",
    "port": 3000,
    "ssl": true
  },
  "database": {
    "name": "myapp",
    "pool_size": 10
  }
}`}
                        </pre>

                        <p className="font-bold text-white mt-6">Toon (24 tokens):</p>
                        <pre className="bg-slate-800 p-4 rounded-lg overflow-x-auto text-sm">
                            {`server,
  host,localhost
  port,3000
  ssl,true
database,
  name,myapp
  pool_size,10`}
                        </pre>
                        <p className="text-accent font-medium">43% token reduction!</p>

                        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Key Features</h2>

                        <h3 className="text-xl font-semibold text-white mt-8 mb-3">Flexible Delimiters</h3>
                        <p>Choose your preferred key-value separator:</p>
                        <pre className="bg-slate-800 p-4 rounded-lg overflow-x-auto text-sm">
                            {`# Tab-delimited (default)
name	John
age	30

# Comma-delimited
name,John
age,30

# Colon-delimited
name:John
age:30`}
                        </pre>

                        <h3 className="text-xl font-semibold text-white mt-8 mb-3">Compact Arrays</h3>
                        <p>Lists can be written inline or expanded:</p>
                        <pre className="bg-slate-800 p-4 rounded-lg overflow-x-auto text-sm">
                            {`# Inline array
colors[3],red,green,blue

# Block array
items,
  - apple
  - banana
  - cherry`}
                        </pre>

                        <h3 className="text-xl font-semibold text-white mt-8 mb-3">Table Format</h3>
                        <p>Structured data in a readable table format:</p>
                        <pre className="bg-slate-800 p-4 rounded-lg overflow-x-auto text-sm">
                            {`users[2]{name,age,role},
  John,30,admin
  Jane,25,user`}
                        </pre>

                        <h2 className="text-2xl font-bold text-white mt-12 mb-4">When to Use Toon</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>LLM Prompts</strong>: Reduce token costs by 30-50% when sending structured data</li>
                            <li><strong>Config Files</strong>: More readable than JSON, less complex than YAML</li>
                            <li><strong>Quick Editing</strong>: Easy to modify without worrying about trailing commas</li>
                            <li><strong>Documentation</strong>: Include data examples that humans can actually read</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-white mt-12 mb-4">How to Convert</h2>
                        <p>
                            Our <a href="/" className="text-accent hover:underline">online converter</a> makes it easy to convert between Toon, JSON, YAML, and XML:
                        </p>
                        <ol className="list-decimal pl-6 space-y-2">
                            <li>Paste your JSON (or other format) into the Source editor</li>
                            <li>Select "Toon" as the target format</li>
                            <li>Customize delimiter and indentation if desired</li>
                            <li>Copy your Toon output - ready to use!</li>
                        </ol>

                        <div className="mt-12 p-6 bg-accent/10 border border-accent/30 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-3">Try Toon Now - Free & Private</h3>
                            <p className="mb-4">
                                Convert your data instantly. All processing happens locally in your browser.
                            </p>
                            <a
                                href="/"
                                className="inline-block px-6 py-3 bg-accent text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                            >
                                Convert to Toon →
                            </a>
                        </div>
                    </section>
                </article>
            </main>

            <footer className="text-center py-8 text-slate-500 text-sm">
                <p>© 2026 Format Fusion. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default ToonFormatGuideArticle;
