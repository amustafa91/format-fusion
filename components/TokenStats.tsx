import React from 'react';

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
    const savedPercentage = sourceTokens > 0
        ? Math.round(((sourceTokens - targetTokens) / sourceTokens) * 100)
        : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-secondary/50 border border-white/10 rounded-lg p-4 flex flex-col items-center justify-center">
                <span className="text-slate-400 text-sm font-medium mb-1">{sourceLabel} Tokens</span>
                <span className="text-2xl font-bold text-white">{sourceTokens.toLocaleString()}</span>
            </div>

            <div className="bg-secondary/50 border border-white/10 rounded-lg p-4 flex flex-col items-center justify-center">
                <span className="text-slate-400 text-sm font-medium mb-1">{targetLabel} Tokens</span>
                <span className="text-2xl font-bold text-white">{targetTokens.toLocaleString()}</span>
            </div>

            <div className="bg-secondary/50 border border-white/10 rounded-lg p-4 flex flex-col items-center justify-center">
                <span className="text-slate-400 text-sm font-medium mb-1">Saved</span>
                <span className={`text-2xl font-bold ${savedPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {savedPercentage}%
                </span>
            </div>
        </div>
    );
};
