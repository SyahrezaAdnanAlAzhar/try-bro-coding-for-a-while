import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import '../App.css'

const inputVariants = cva(
    'h-[32px] rounded-[16px] border bg-mono-white px-6 py-2 text-base text-mono-black transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-mono-grey focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            width: {
                full: 'w-full',
                half: 'w-1/2',
            },
            isError: {
                true: 'border-add-red focus-visible:border-add-red focus-visible:ring-add-red',
                false: 'border-mono-grey focus-visible:border-blue-mtm-400 focus-visible:ring-blue-mtm-400',
            },
        },
        defaultVariants: {
            width: 'full',
            isError: false,
        },
    }
);

export interface InputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'width'>,
    VariantProps<typeof inputVariants> { }

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, width, isError, type = 'text', ...props }, ref) => {
        return (
            <input
                type={type}
                className={twMerge(inputVariants({ width, isError, className }))}
                ref={ref}
                placeholder={props.placeholder}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';

export { Input };