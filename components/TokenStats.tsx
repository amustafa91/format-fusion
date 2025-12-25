
import React, { useState } from 'react';
import { GlassCard } from './ui/GlassCard';

interface TokenStatsProps {
    sourceTokens: number;
    targetTokens: number;
    sourceLabel: string;
    targetLabel: string;
}

export const TokenStats: React.FC<TokenStatsProps> = ({
    sourceTokens,
    targetTokens,
    sourceLabel,
    targetLabel,
}) => {
    const [showCost, setShowCost] = useState(false);

    // Approximate cost for GPT-4o (Input $5.00 / 1M tokens, Output $15.00 / 1M tokens) is too complex for this simple UI
    // Let's us GPT-4o Input pricing ($5.00 / 1M) as a baseline reference for "Input Cost"
    const costPer1k = 0.005;
    const estimatedSourceCost = (sourceTokens / 1000) * costPer1k;
    const estimatedTargetCost = (targetTokens / 1000) * costPer1k;

    const savedPercentage = sourceTokens > 0
        ? Math.round(((sourceTokens - targetTokens) / sourceTokens) * 100)
        : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <GlassCard className="p-6 flex flex-col items-center justify-center relative group" hoverEffect>
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{sourceLabel} Tokens</span>
                <span className="text-4xl font-bold text-white tracking-tight">{sourceTokens.toLocaleString()}</span>
                <div className="absolute inset-0 bg-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </GlassCard>

            <GlassCard className="p-6 flex flex-col items-center justify-center relative group" hoverEffect>
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{targetLabel} Tokens</span>
                <span className="text-4xl font-bold text-white tracking-tight">{targetTokens.toLocaleString()}</span>
                <div className="absolute inset-0 bg-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </GlassCard>

            <GlassCard className="p-6 flex flex-col items-center justify-center relative group" hoverEffect>
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Efficiency</span>
                <span className={`text-4xl font-bold tracking-tight ${savedPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {savedPercentage}%
                </span>
                <div className="absolute inset-0 bg-green-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </GlassCard>

            <GlassCard
                className="p-6 flex flex-col items-center justify-center relative cursor-pointer group"
                hoverEffect
                onClick={() => setShowCost(!showCost)}
                title="Click to toggle cost estimation details"
            >
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Est. Cost (GPT-4o)</span>
                {showCost ? (
                    <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between w-full px-2 text-xs text-slate-500 mb-1">
                            <span>In:</span>
                            <span className="font-mono text-accent">${estimatedSourceCost.toFixed(5)}</span>
                        </div>
                        <div className="flex justify-between w-full px-2 text-xs text-slate-500">
                            <span>Out:</span>
                            <span className="font-mono text-accent opacity-80">${estimatedTargetCost.toFixed(5)}</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-slate-300 group-hover:text-white transition-colors">
                        <span className="text-3xl font-bold">$</span>
                        <span className="text-xs text-slate-500">(Click to view)</span>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};
