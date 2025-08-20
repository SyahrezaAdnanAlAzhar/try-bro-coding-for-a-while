import { forwardRef, useId } from 'react';
import { Input, type InputProps } from './Input';
import { TextArea, type TextAreaProps } from './TextArea';

interface FormFieldCommonProps {
    label: string;
    error?: string;
    helpText?: string;
    cornerHint?: string;
    id?: string;
    className?: string;
}

// 2. Buat tipe union yang benar-benar terpisah
export type FormFieldProps =
    | (FormFieldCommonProps & { as?: 'input' } & Omit<InputProps, 'id' | 'isError'>)
    | (FormFieldCommonProps & { as: 'textarea' } & Omit<TextAreaProps, 'id' | 'isError'>);


const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
    (props, ref) => {
        const {
            label,
            error,
            helpText,
            cornerHint,
            id: propId,
            className,
        } = props;

        const fallbackId = useId();
        const id = propId || fallbackId;
        const descriptionId = `${id}-description`;

        const getElementSpecificProps = () => {
            const {
                label: _l,
                error: _e,
                helpText: _h,
                cornerHint: _c,
                id: _i,
                className: _cn,
                as: _a,
                ...rest
            } = props;
            return rest;
        };

        const elementProps = getElementSpecificProps();

        return (
            <div className={className}>
                {/* LABEL AND CORNER HINT (Tidak berubah) */}
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
                {/* Kita gunakan 'props.as' untuk membedakan tipe */}
                {props.as === 'textarea' ? (
                    <TextArea
                        id={id}
                        ref={ref as React.Ref<HTMLTextAreaElement>}
                        isError={!!error}
                        aria-describedby={error || helpText ? descriptionId : undefined}
                        {...(elementProps as TextAreaProps)}
                    />
                ) : (
                    <Input
                        id={id}
                        ref={ref as React.Ref<HTMLInputElement>}
                        isError={!!error}
                        aria-describedby={error || helpText ? descriptionId : undefined}
                        {...(elementProps as InputProps)}
                    />
                )}

                {/* HELP TEXT OR ERROR (Tidak berubah) */}
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