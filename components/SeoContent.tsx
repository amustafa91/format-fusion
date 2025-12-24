import React from 'react';

export const SeoContent: React.FC = () => {
    return (
        <section className="mt-12 text-slate-400 text-sm space-y-8 max-w-4xl mx-auto px-4">
            <article>
                <h2 className="text-xl font-bold text-light mb-3">Free Online GPT Token Counter</h2>
                <p className="leading-relaxed">
                    Accurately count tokens for OpenAI's GPT models (including GPT-4o, GPT-4, and GPT-3.5 Turbo) using our integrated
                    <strong> tiktoken</strong> calculator. Understanding your token usage is crucial for estimating OpenAI API costs and ensuring
                    your prompts fit within the model's context window. Whether you're a developer optimizing prompts or a business managing
                    API expenses, this free tool provides instant, real-time token counts as you type.
                </p>
            </article>

            <article>
                <h2 className="text-xl font-bold text-light mb-3">Universal Data Converter & Toon Format</h2>
                <p className="leading-relaxed">
                    Format Fusion isn't just a token counter; it's a powerful data conversion utility. Seamlessly convert between
                    <strong> JSON</strong>, <strong> YAML</strong>, <strong> XML</strong>, and the human-readable <strong> Toon</strong> format.
                    The Toon format offers a concise, clean syntax perfect for configuration files and data interexchange, reducing clutter
                    compared to traditional JSON or XML.
                </p>
            </article>

            <article>
                <h2 className="text-xl font-bold text-light mb-3">Instant Type & Struct Generation</h2>
                <p className="leading-relaxed">
                    Streamline your development workflow by instantly generating type definitions and structs from your JSON data.
                    Support for <strong>TypeScript</strong> interfaces, <strong>Python</strong> dataclasses, <strong>Go</strong> structs,
                    <strong> Rust</strong> structs (with Serde), <strong>Java</strong> classes, and <strong>C#</strong> classes.
                    Simply paste your JSON and get ready-to-use code for your favorite programming language.
                </p>
            </article>
        </section>
    );
};
