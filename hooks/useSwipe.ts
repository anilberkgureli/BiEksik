import React, { useState, useRef } from 'react';

interface UseSwipeProps {
    onSwipeLeft?: (id: string) => void;
    onSwipeRight?: (id: string) => void;
    threshold?: number;
}

export const useSwipe = ({ onSwipeLeft, onSwipeRight, threshold = 50 }: UseSwipeProps = {}) => {
    const [swipedId, setSwipedId] = useState<string | null>(null);
    const startX = useRef<number | null>(null);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
        if (e.button !== 0) return; // Only left click/touch
        if ((e.target as HTMLElement).closest('button')) return; // Ignore buttons

        startX.current = e.clientX;
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
        if (startX.current === null) return;

        const diff = startX.current - e.clientX;
        const element = e.currentTarget as HTMLDivElement;

        if (diff > threshold) {
            // Swipe Left
            setSwipedId(id);
            onSwipeLeft?.(id);
        } else if (diff < -threshold) {
            // Swipe Right
            if (swipedId === id) setSwipedId(null);
            onSwipeRight?.(id);
        }

        startX.current = null;
        if (element.hasPointerCapture(e.pointerId)) {
            element.releasePointerCapture(e.pointerId);
        }
    };

    const handlePointerCancel = () => {
        startX.current = null;
    };

    const resetSwipe = () => setSwipedId(null);

    return {
        swipedId,
        setSwipedId,
        resetSwipe,
        handlers: {
            onPointerDown: handlePointerDown,
            onPointerUp: handlePointerUp,
            onPointerCancel: handlePointerCancel,
        },
    };
};
