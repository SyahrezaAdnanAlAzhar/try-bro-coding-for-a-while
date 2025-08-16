import { useState, useRef, useEffect, useId, forwardRef } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export interface ComboboxOption {
    value: string | number;
    label: string;
}

export interface ComboboxProps {
    options: ComboboxOption[];
    value: ComboboxOption | null;
    onChange: (value: ComboboxOption | null) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

const useClickOutside = (
    ref: React.RefObject<HTMLElement | null>,
    handler: (event: MouseEvent | TouchEvent) => void
) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};


export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
    ({ options, value, onChange, placeholder = 'Select an option...', disabled, className }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const [inputValue, setInputValue] = useState(value?.label || '');
        const [activeIndex, setActiveIndex] = useState(-1);

        const comboboxRef = useRef<HTMLDivElement>(null);
        const listboxId = useId();

        useClickOutside(comboboxRef, () => setIsOpen(false));

        useEffect(() => {
            setInputValue(value?.label || '');
        }, [value]);

        const filteredOptions = inputValue
            ? options.filter((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            )
            : options;

        const handleSelectOption = (option: ComboboxOption) => {
            onChange(option);
            setInputValue(option.label);
            setIsOpen(false);
        };

        const handleClear = (e: React.MouseEvent) => {
            e.stopPropagation();
            onChange(null);
            setInputValue('');
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setActiveIndex((prev) => (prev + 1) % filteredOptions.length);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setActiveIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (activeIndex >= 0 && filteredOptions[activeIndex]) {
                        handleSelectOption(filteredOptions[activeIndex]);
                    }
                    break;
                case 'Escape':
                    setIsOpen(false);
                    break;
                case 'Tab':
                    setIsOpen(false);
                    break;
            }
        };

        return (
            <div ref={comboboxRef} className={twMerge('relative w-full', className)}>
                <div className="relative">
                    <input
                        ref={ref}
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setIsOpen(true);
                            setActiveIndex(-1);
                        }}
                        onClick={() => setIsOpen(!isOpen)}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="h-12 w-full rounded-lg border border-mono-grey bg-mono-white px-4 py-2 pr-20 text-base text-mono-black transition-colors placeholder:text-mono-grey focus:border-blue-mtm-400 focus:outline-none focus:ring-2 focus:ring-blue-mtm-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        role="combobox"
                        aria-expanded={isOpen}
                        aria-controls={listboxId}
                        aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                        {value && (
                            <button type="button" onClick={handleClear} className="p-1 text-add-red">
                                <X size={20} />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-1 text-mono-grey"
                            aria-label="Toggle options"
                        >
                            <ChevronDown size={20} />
                        </button>
                    </div>
                </div>

                {isOpen && (
                    <ul
                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-mono-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        id={listboxId}
                        role="listbox"
                    >
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <li
                                    key={option.value}
                                    onClick={() => handleSelectOption(option)}
                                    className={twMerge(
                                        'relative cursor-pointer select-none py-2 px-4',
                                        activeIndex === index ? 'bg-blue-mtm-100 text-mono-black' : 'text-mono-dark-grey'
                                    )}
                                    id={`${listboxId}-option-${index}`}
                                    role="option"
                                    aria-selected={value?.value === option.value}
                                >
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li className="relative cursor-default select-none py-2 px-4 text-mono-grey">
                                No options found.
                            </li>
                        )}
                    </ul>
                )}
            </div>
        );
    }
);

Combobox.displayName = 'Combobox';