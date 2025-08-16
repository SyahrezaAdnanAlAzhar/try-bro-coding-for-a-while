import { forwardRef, useId } from 'react';
import { Input, type InputProps } from './Input';
import { TextArea, type TextAreaProps } from './TextArea';

type FormFieldElementProps =
    | ({ as?: 'input' } & InputProps)
    | ({ as: 'textarea' } & TextAreaProps);

export type FormFieldProps = Omit<FormFieldElementProps, 'id' | 'isError'> & {
    label: string;
    error?: string;
    helpText?: string;
    cornerHint?: string;
    id?: string;
};

const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
    (
        {
            label,
            error,
            helpText,
            cornerHint,
            id: propId,
            className,
            as = 'input',
            ...elementProps
        },
        ref
    ) => {
        const fallbackId = useId();
        const id = propId || fallbackId;
        const descriptionId = `${id}-description`;

        const Component = as === 'textarea' ? TextArea : Input;

        return (
            <div className={className}>
                {/* LABEL AND CORNER HINT */}
                <div className="mb-1 flex items-baseline justify-between">
                    <label
                        htmlFor={id}
                        className="text-base font-semibold text-blue-mtm-400"
                    >
                        {label}
                    </label>
                    {cornerHint && (
                        <span className="text-sm font-normal text-blue-mtm-400">
                            {cornerHint}
                        </span>
                    )}
                </div>

                {/* TEXTAREA OR INPUT COMPONENT */}
                <Component
                    id={id}
                    // @ts-ignore - Ref type is handled by forwardRef generic
                    ref={ref}
                    isError={!!error}
                    aria-describedby={error || helpText ? descriptionId : undefined}
                    {...(elementProps as any)}
                />

                {/* HELP TEXT OR ERROR */}
                <div className="mt-1 h-6">
                    {error ? (
                        <p id={descriptionId} className="text-base font-normal text-add-red">
                            {error}
                        </p>
                    ) : helpText ? (
                        <p id={descriptionId} className="text-base font-normal text-mono-black">
                            {helpText}
                        </p>
                    ) : null}
                </div>
            </div>
        );
    }
);

FormField.displayName = 'FormField';

export { FormField };