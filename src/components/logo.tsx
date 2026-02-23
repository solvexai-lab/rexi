import React from 'react';
import Image from 'next/image';

interface LogoProps {
    className?: string;
    iconOnly?: boolean;
    variant?: 'dark' | 'light';
}

export function Logo({
    className = "w-14 h-14",
    iconOnly = false,
    variant = 'dark'
}: LogoProps) {
    const isDark = variant === 'dark';
    const logoSrc = isDark ? "/logo.svg" : "/logo-white.svg";

    return (
        <div className="flex items-center gap-3">
            <div className={`${className} relative transition-transform hover:scale-105 hover:rotate-3 duration-300 rounded-xl overflow-hidden shadow-sm`}>
                <Image
                    src={logoSrc}
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            {!iconOnly && (
                <span className={`font-serif text-2xl font-bold ${isDark ? 'text-slate-900' : 'text-white'} tracking-tight`}>REXI</span>
            )}
        </div>
    );
}
