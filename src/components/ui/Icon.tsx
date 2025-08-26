import { forwardRef, type HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface IconProps extends HTMLAttributes<HTMLSpanElement> {
    name: string;
}

const Icon = forwardRef<HTMLSpanElement, IconProps>(
    ({ name, className, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={twMerge('material-symbols-rounded', className)}
                {...props}
            >
                {name}
            </span>
        );
    }
);

Icon.displayName = 'Icon';

export { Icon };