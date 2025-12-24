import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    hoverEffect = false,
    ...props
}) => {
    return (
        <div
            className={`
        backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl rounded-2xl
        ${hoverEffect ? 'transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-accent/5 hover:-translate-y-1' : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
};
