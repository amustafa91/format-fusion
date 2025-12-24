import React from 'react';

export const SeoContent: React.FC = () => {
    return (
        <section className="mt-16 text-slate-400 text-sm space-y-12 max-w-4xl mx-auto px-4 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <article className="space-y-4">
                    <h2 className="text-2xl font-bold text-light flex items-center gap-2">
                        <span className="text-accent">#</span> GPT Token Counter & Calculator
                    </h2>
                    <p className="leading-relaxed">
                        Accurately count tokens for OpenAI's LLMs (GPT-4o, GPT-4, GPT-3.5 Turbo) using our integrated <strong>tiktoken</strong> calculator.
                        Understanding token usage is critical for managing API costs and context windows.
                        Our tool runs 100% client-side, ensuring your production keys and data never leave your browser.
                    </p>
                </article>

                <article className="space-y-4">
                    <h2 className="text-2xl font-bold text-light flex items-center gap-2">
                        <span className="text-accent">#</span> Universal Data Converter
                    </h2>
                    <p className="leading-relaxed">
                        Seamlessly convert between <strong>JSON</strong>, <strong>YAML</strong>, <strong>XML</strong>, and the human-readable <strong>Toon</strong> format.
                        Instantly generate <strong>TypeScript</strong> interfaces, <strong>Go</strong> structs, <strong>Python</strong> Pydantic models, and more.
                        Perfect for developers needing quick type definitions from API responses.
                    </p>
                </article>
            </div>

            <hr className="border-white/10" />

            <article>
                <h2 className="text-2xl font-bold text-light mb-8 text-center">Frequently Asked Questions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">

                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-200">How do I count tokens for GPT-4?</h3>
                        <p>Simply paste your text or code into the "Source" editor. The tool automatically calculates the token count based on the Tiktoken encoding used by GPT-4 and GPT-3.5.</p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-200">Is my data secure?</h3>
                        <p>Yes. All processing—token counting, file parsing, and conversion—happens <strong>locally in your browser</strong>. Your code and files are never sent to any server.</p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-200">What is the Toon format?</h3>
                        <p>Toon is a concise, human-readable data format designed for config files. It uses significant whitespace and minimal punctuation, making it cleaner than JSON or XML.</p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-200">Can I convert JSON to Go Structs?</h3>
                        <p>Absolutely. Paste your JSON, select "Go" as the target language, and we will generate the corresponding Go struct definitions with properly tagged fields.</p>
                    </div>

                </div>
            </article>
        </section>
    );
};
