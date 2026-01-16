import React from 'react';
import { Header } from '../../components/Header';

export const JsonToTypescriptArticle: React.FC = () => {
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
                            <time dateTime="2026-01-15">January 15, 2026</time>
                            <span>•</span>
                            <span>4 min read</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            JSON to TypeScript Converter - Generate Interfaces Instantly
                        </h1>
                        <p className="text-xl text-slate-300 leading-relaxed">
                            Convert JSON objects to TypeScript interfaces automatically. Our free online tool generates type-safe interfaces with proper typing for nested objects, arrays, and primitive values.
                        </p>
                    </header>

                    <section className="space-y-6 text-slate-300 leading-relaxed">
                        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Why Convert JSON to TypeScript?</h2>
                        <p>
                            When working with APIs, you often receive JSON responses that need to be typed for <strong>TypeScript</strong> applications. Manually creating interfaces is tedious and error-prone, especially for complex nested structures.
                        </p>
                        <p>
                            Our <a href="/" className="text-accent hover:underline">JSON to TypeScript converter</a> automates this process, saving you hours of manual work while ensuring type accuracy.
                        </p>

                        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Features of Our Converter</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Automatic Interface Generation</strong>: Paste JSON, get TypeScript interfaces instantly</li>
                            <li><strong>Nested Object Support</strong>: Properly handles deeply nested objects with separate interfaces</li>
                            <li><strong>Array Type Inference</strong>: Detects array types and generates appropriate typings</li>
                            <li><strong>PascalCase Naming</strong>: Follows TypeScript naming conventions automatically</li>
                            <li><strong>Optional Properties</strong>: Identifies potentially optional fields</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Example: API Response to Interface</h2>
                        <p>Given this JSON from an API:</p>
                        <pre className="bg-slate-800 p-4 rounded-lg overflow-x-auto text-sm">
                            {`{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["admin", "user"]
  }
}`}
                        </pre>

                        <p className="mt-4">Our tool generates:</p>
                        <pre className="bg-slate-800 p-4 rounded-lg overflow-x-auto text-sm">
                            {`interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

interface Root {
  user: User;
}`}
                        </pre>

                        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Supported Output Languages</h2>
                        <p>Besides TypeScript, our converter also generates types for:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Go Structs</strong> with proper JSON tags</li>
                            <li><strong>Python Dataclasses</strong> with type hints</li>
                            <li><strong>Rust Structs</strong> with Serde derive macros</li>
                            <li><strong>Java Classes</strong> with public fields</li>
                            <li><strong>C# Classes</strong> with get/set properties</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-white mt-12 mb-4">How to Use</h2>
                        <ol className="list-decimal pl-6 space-y-2">
                            <li>Paste your JSON into the Source editor</li>
                            <li>Select "TypeScript" (or another language) as the target format</li>
                            <li>View the generated interfaces in the Converted Code panel</li>
                            <li>Copy the code and use it in your project</li>
                        </ol>

                        <div className="mt-12 p-6 bg-accent/10 border border-accent/30 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-3">Convert JSON Now - Free & Private</h3>
                            <p className="mb-4">
                                All conversion happens locally in your browser. Your data never leaves your device.
                            </p>
                            <a
                                href="/"
                                className="inline-block px-6 py-3 bg-accent text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                            >
                                Convert JSON to TypeScript →
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

export default JsonToTypescriptArticle;
