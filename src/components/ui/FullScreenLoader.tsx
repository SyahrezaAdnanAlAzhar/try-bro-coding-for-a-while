import { useState, useEffect } from 'react';
import { Text } from './Text';

export const FullScreenLoader = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => {
                if (prevDots.length >= 3) {
                    return '';
                }
                return prevDots + '.';
            });
        }, 500); 

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-mono-white"
            role="status"
            aria-live="polite"
        >
            <div
                className="mb-8 h-16 w-16 animate-spin rounded-full border-8 border-mono-light-grey border-t-blue-mtm-400"
                aria-hidden="true"
            ></div>

            <Text as="div" variant="display" weight="bold" className="w-80 text-center">
                Loading{dots}
            </Text>
        </div>
    );
};