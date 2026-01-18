import React, { useEffect, useState } from 'react';
import { translate } from '../utils/i18n';

export const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onFinish, 500); // Wait for transition out
        }, 2500);
        return () => clearTimeout(timer);
    }, [onFinish]);

    if (!visible) return null;

    return (
        <div className={`h-full w-full fixed inset-0 z-50 flex items-center justify-center bg-[url('/ui-bg.jpg')] bg-cover bg-center transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="animate-fade-in text-center p-8 rounded-2xl bg-white/30 backdrop-blur-md border border-white/20 shadow-xl flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-2xl shadow-lg overflow-hidden flex items-center justify-center bg-white animate-bounce">
                    <img src="/logo.png" alt="App Logo" className="w-full h-full object-cover scale-110" />
                </div>
                <h1 className="text-sm font-serif tracking-[0.15em] text-slate-800 select-none animate-pulse">
                    {translate('app.tagline')}
                </h1>
            </div>
        </div>
    );
};

