import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';


const panelVariants = cva(
    'bg-mono-white rounded-2xl transition-shadow',
    {
        variants: {
            padding: {
                none: 'p-0',
                sm: 'p-4',
                md: 'p-6',
                lg: 'p-8',
            },
            shadow: {
                '100': 'shadow-100',
                '200': 'shadow-200',
                '300': 'shadow-300',
                '400': 'shadow-400',
                '500': 'shadow-500',
                '600': 'shadow-600',
                '700': 'shadow-700',
                '800': 'shadow-800',
            },
            bordered: {
                true: 'border border-mono-light-grey',
            },
        },
        defaultVariants: {
            padding: 'md',
            shadow: '200',
            bordered: false,
        },
    }
);


export interface PanelProps
    extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof panelVariants> { }

const Panel = forwardRef<HTMLDivElement, PanelProps>(
    ({ className, padding, shadow, bordered, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={twMerge(
                    panelVariants({ padding, shadow, bordered, className })
                )}
                {...props}
            />
        );
    }
);

Panel.displayName = 'Panel';

export { Panel };