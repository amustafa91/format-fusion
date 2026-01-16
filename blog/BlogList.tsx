import React from 'react';
import { Header } from '../components/Header';

interface BlogArticle {
    slug: string;
    title: string;
    description: string;
    date: string;
    readTime: string;
}

const articles: BlogArticle[] = [
    {
        slug: 'gpt-token-counter',
        title: 'How to Count GPT-4 Tokens Online - Free Tiktoken Calculator',
        description: 'Learn how to accurately count tokens for GPT-4, GPT-3.5, and other LLMs using our free online tiktoken calculator. Understand token costs and context windows.',
        date: '2026-01-16',
        readTime: '5 min read'
    },
    {
        slug: 'json-to-typescript',
        title: 'JSON to TypeScript Converter - Generate Interfaces Instantly',
        description: 'Convert JSON objects to TypeScript interfaces automatically. Our free tool generates type-safe interfaces, types, and supports nested objects and arrays.',
        date: '2026-01-15',
        readTime: '4 min read'
    },
    {
        slug: 'toon-format-guide',
        title: 'What is the Toon Format? A Human-Readable Alternative to JSON',
        description: 'Discover Toon, a cleaner data format that uses minimal punctuation and significant whitespace. Learn how to convert between Toon, JSON, YAML, and XML.',
        date: '2026-01-14',
        readTime: '6 min read'
    }
];

export const BlogList: React.FC = () => {
    return (
        <div className="min-h-screen font-sans flex flex-col relative z-0">
            <Header />

            <main className="flex-grow w-full max-w-4xl mx-auto p-4 md:p-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Developer Blog
                </h1>
                <p className="text-xl text-slate-300 mb-6">
                    Tips, tutorials, and insights about data conversion, token counting, and developer tools.
                </p>

                <div className="space-y-4">
                    {articles.map((article) => (
                        <article
                            key={article.slug}
                            className="group p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-accent/30 transition-all duration-300"
                        >
                            <a href={`/blog/${article.slug}`} className="block">
                                <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                                    <time dateTime={article.date}>{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                                    <span>•</span>
                                    <span>{article.readTime}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white group-hover:text-accent transition-colors mb-3">
                                    {article.title}
                                </h2>
                                <p className="text-slate-300 leading-relaxed">
                                    {article.description}
                                </p>
                                <span className="inline-flex items-center mt-4 text-accent font-medium group-hover:translate-x-1 transition-transform">
                                    Read article →
                                </span>
                            </a>
                        </article>
                    ))}
                </div>
            </main>

            <footer className="text-center py-8 text-slate-500 text-sm">
                <p>© 2026 Format Fusion. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default BlogList;
