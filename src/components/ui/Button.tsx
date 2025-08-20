import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactElement } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import '../../App.css'


const buttonVariants = cva(
    'inline-flex items-center justify-center font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                'primary-green': 'bg-add-green text-mono-white hover:bg-add-green/75',
                'primary-blue': 'bg-add-blue text-mono-white hover:bg-add-blue/75',
                destructive: 'bg-add-red text-mono-white hover:bg-add-red/75',
                ghost: 'bg-mono-light-grey text-mono-black hover:bg-mono-grey/75',
                secondary: 'bg-mono-white text-mono-black border-2 border-mono-black hover:bg-mono-light-grey',
                'blue-mtm-light': 'bg-blue-mtm-100 text-mono-black hover:bg-blue-mtm-300/90',
                'blue-mtm-dark': 'bg-blue-mtm-400 text-mono-white hover:bg-blue-mtm-600/90',
            },
            size: {
                sm: 'h-[36px] px-4 rounded-[16px] text-sm',
                base: 'h-[40px] px-6 rounded-[20px] text-base',
                lg: 'h-[48px] px-8 rounded-[32px] text-xl',
            },
            fullWidth: {
                true: 'w-full',
            },
        },
        defaultVariants: {
            variant: 'primary-blue',
            size: 'base',
        },
    }
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
    leftIcon?: ReactElement;
    rightIcon?: ReactElement;
}


const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            fullWidth,
            isLoading,
            leftIcon,
            rightIcon,
            children,
            ...props
        },
        ref
    ) => {
        const iconClasses = 'mx-2';

        return (
            <button
                className={twMerge(
                    buttonVariants({ variant, size, fullWidth, className })
                )}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-current"></div>
                ) : (
                    <>
                        {leftIcon && <span className={iconClasses}>{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className={iconClasses}>{rightIcon}</span>}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button, buttonVariants };