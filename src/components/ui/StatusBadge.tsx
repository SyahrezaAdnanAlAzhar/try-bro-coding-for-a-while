import { forwardRef, type HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface StatusBadgeProps extends HTMLAttributes<HTMLDivElement> { }

const StatusBadge = forwardRef<HTMLDivElement, StatusBadgeProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={twMerge(
                    'inline-flex items-center justify-center rounded-lg border px-3 py-1.5',
                    className
                )}
                {...props}
            />
        );
    }
);

StatusBadge.displayName = 'StatusBadge';

export { StatusBadge };