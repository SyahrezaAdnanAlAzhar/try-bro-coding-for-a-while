import { forwardRef, type ComponentPropsWithoutRef, type ElementType } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const textVariants = cva(
    '',
    {
        variants: {
            variant: {
                display: 'text-3xl leading-none tracking-tight',
                'heading-xl': 'text-3xl leading-tight',
                'heading-lg': 'text-2xl leading-snug',
                'heading-md': 'text-xl leading-snug',
                'body-lg': 'text-lg leading-relaxed',
                'body-md': 'text-base leading-relaxed',
                'body-sm': 'text-sm leading-relaxed',
                caption: 'text-xs leading-snug',
            },
            weight: {
                regular: 'font-normal',
                medium: 'font-medium',
                semibold: 'font-semibold',
                bold: 'font-bold',
            },
            color: {
                'mono-black': 'text-black',
                'mono-dark-grey': 'text-gray-700',
                'mono-grey': 'text-gray-500',
                'blue-mtm-700': 'text-blue-700',
                'add-red': 'text-red-600',
            },
        },
        defaultVariants: {
            variant: 'body-md',
            weight: 'regular',
            color: 'mono-black',
        },
    }
);

type BaseTextProps = VariantProps<typeof textVariants> & {
    className?: string;
    children?: React.ReactNode;
};

export type TextProps<C extends ElementType = 'p'> = {
    as?: C;
} & BaseTextProps &
    Omit<ComponentPropsWithoutRef<C>, keyof BaseTextProps>;

export const Text = forwardRef(
    <C extends ElementType = 'p'>(
        { as, variant, weight, color, className, ...props }: TextProps<C>,
        ref: React.Ref<any>
    ) => {
        const Component = as || 'p';

        return (
            <Component
                ref={ref}
                className={twMerge(
                    textVariants({ variant, weight, color }),
                    className
                )}
                {...props}
            />
        );
    }
);

Text.displayName = 'Text';
