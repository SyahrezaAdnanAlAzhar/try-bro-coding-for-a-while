import { forwardRef } from 'react';
import TextareaAutosize, { type TextareaAutosizeProps } from 'react-textarea-autosize';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const textAreaVariants = cva(
    'min-h-[80px] w-full rounded-[16px] border bg-mono-white px-4 py-2 text-base text-mono-black transition-colors placeholder:text-mono-grey focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            isError: {
                true: 'border-add-red focus-visible:border-add-red focus-visible:ring-add-red',
                false: 'border-mono-grey focus-visible:border-blue-mtm-400 focus-visible:ring-blue-mtm-400',
            },
        },
        defaultVariants: {
            isError: false,
        },
    }
);

export interface TextAreaProps
    extends TextareaAutosizeProps,
    VariantProps<typeof textAreaVariants> {
    autoGrow?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className, isError, autoGrow = true, rows = 3, ...props }, ref) => {
        return (
            <TextareaAutosize
                ref={ref}
                minRows={rows}
                maxRows={autoGrow ? undefined : rows}
                className={twMerge(textAreaVariants({ isError, className }))}
                {...props}
            />
        );
    }
);

TextArea.displayName = 'TextArea';

export { TextArea };