import { useEffect, type RefObject } from 'react';

type Event = MouseEvent | TouchEvent;

type AnyElementWithContains = {
    contains(target: EventTarget | null): boolean;
};

export const useClickOutside = (
    ref: RefObject<AnyElementWithContains | null>,
    handler: (event: Event) => void
) => {
    useEffect(() => {
        const listener = (event: Event) => {
            const el = ref?.current;
            if (!el || el.contains(event.target as Node)) {
                return;
            }
            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};