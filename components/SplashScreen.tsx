import React, { useEffect, useState } from 'react';
import { t } from '../utils/i18n';

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
                <img src="/logo.png" alt="App Logo" className="w-24 h-24 rounded-2xl shadow-lg animate-bounce" />
                <h1 className="text-xl font-serif tracking-[0.3em] text-slate-800 uppercase select-none font-bold animate-pulse">
                    {t('app.createdBy')}
                </h1>
            </div>
        </div>
    );
};
