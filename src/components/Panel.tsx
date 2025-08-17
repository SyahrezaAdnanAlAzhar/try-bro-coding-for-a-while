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
                's-100': 'shadow-s-100',
                's-200': 'shadow-s-200',
                's-300': 'shadow-s-300',
                's-400': 'shadow-s-400',
                's-500': 'shadow-s-500',
                's-600': 'shadow-s-600',
                's-700': 'shadow-s-700',
                's-800': 'shadow-s-800',
                'e-100': 'shadow-e-100',
                'e-200': 'shadow-e-200',
                'e-300': 'shadow-e-300',
                'e-400': 'shadow-e-400',
                'e-500': 'shadow-e-500',
            },
            bordered: {
                true: 'border border-mono-light-grey',
            },
        },
        defaultVariants: {
            padding: 'md',
            shadow: 's-200',
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