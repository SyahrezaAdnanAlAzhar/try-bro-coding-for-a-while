import CurrencyInput, { type CurrencyInputProps } from 'react-currency-input-field';
import { twMerge } from 'tailwind-merge';

const inputBaseClasses = 'h-12 w-full rounded-lg border border-mono-grey bg-mono-white px-4 py-2 text-base text-mono-black transition-colors placeholder:text-mono-grey focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-mtm-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

interface CustomCurrencyInputProps extends CurrencyInputProps {
    isError?: boolean;
}

export const CustomCurrencyInput = ({ className, isError, ...props }: CustomCurrencyInputProps) => {
    const errorClasses = 'border-add-red focus-visible:border-add-red focus-visible:ring-add-red';

    return (
        <CurrencyInput
            className={twMerge(inputBaseClasses, isError && errorClasses, className)}
            prefix="Rp "
            groupSeparator=","
            decimalSeparator="."
            defaultValue={0}
            decimalsLimit={2}
            allowNegativeValue={false}
            {...props}
        />
    );
};