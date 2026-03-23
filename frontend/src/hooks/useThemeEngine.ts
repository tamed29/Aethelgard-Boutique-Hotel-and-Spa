'use client';

import { useEffect, useState } from 'react';

export const useThemeEngine = () => {
    const [isDay, setIsDay] = useState(true);

    useEffect(() => {
        // Check chronologically
        const calculateTheme = () => {
            const currentTime = new Date().getHours();
            const day = currentTime > 6 && currentTime < 18;

            setIsDay(day);

            const root = document.documentElement;

            if (day) {
                root.classList.add('theme-nature-day');
                root.classList.remove('theme-nature-night');
            } else {
                root.classList.add('theme-nature-night');
                root.classList.remove('theme-nature-day');
            }
        };

        calculateTheme();
        const interval = setInterval(calculateTheme, 1000 * 60); // Check every minute

        return () => clearInterval(interval);
    }, []);

    return { isDay };
};
