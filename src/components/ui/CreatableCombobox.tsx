import { useState, useRef, useEffect, useId, useMemo } from 'react';
import { ChevronDown, Search, X, PlusCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';

export interface ComboboxOption {
    value: string | number;
    label: string;
}

export interface CreatableComboboxProps {
    options: ComboboxOption[];
    value: ComboboxOption | null;
    onChange: (value: ComboboxOption | null) => void;
    onCreate: (inputValue: string) => void;
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
            if (!ref.current || ref.current.contains(event.target as Node)) return;
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

const CREATE_NEW_VALUE = '__CREATE_NEW__';

export const CreatableCombobox = ({
    options,
    value,
    onChange,
    onCreate,
    placeholder = 'Select or create...',
    disabled,
    className
}: CreatableComboboxProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeIndex, setActiveIndex] = useState(-1);

    const comboboxRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listboxId = useId();

    useClickOutside(comboboxRef, () => setIsOpen(false));

    useEffect(() => {
        if (isOpen) {
            setSearchTerm('');
            setActiveIndex(-1);
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const filteredOptions = useMemo(() => {
        const filtered = searchTerm
            ? options.filter((option) =>
                option.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : options;

        if (searchTerm && filtered.length === 0) {
            return [{ value: CREATE_NEW_VALUE, label: `Tambah "${searchTerm}"` }];
        }
        return filtered;
    }, [searchTerm, options]);

    const handleSelectOption = (option: ComboboxOption) => {
        if (option.value === CREATE_NEW_VALUE) {
            onCreate(searchTerm);
        } else {
            onChange(option);
        }
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
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
        }
    };

    return (
        <div ref={comboboxRef} className={twMerge('relative w-full', className)}>
            <Button
                variant="secondary"
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className="h-[40px] w-full justify-between rounded-[16px] px-4"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <span className={value ? 'text-mono-black' : 'text-mono-grey'}>
                    {value?.label || placeholder}
                </span>
                <div className="flex items-center">
                    {value && !disabled && (
                        <button type="button" onClick={handleClear} className="mr-2 rounded-full p-1 text-add-red transition-colors hover:bg-add-red/15" aria-label="Clear selection">
                            <X size={16} />
                        </button>
                    )}
                    <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </Button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-[20px] bg-mono-white p-2 text-base shadow-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="relative p-2">
                        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-mono-grey" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Cari atau buat baru..."
                            className="h-10 w-full rounded-lg border border-mono-grey bg-mono-white pl-10 pr-4 text-base text-mono-black focus:border-blue-mtm-400 focus:outline-none focus:ring-1 focus:ring-blue-mtm-400"
                        />
                    </div>

                    <ul className="mt-1 max-h-60 overflow-auto py-1" id={listboxId} role="listbox">
                        {filteredOptions.map((option, index) => (
                            <li
                                key={option.value}
                                onClick={() => handleSelectOption(option)}
                                className={twMerge(
                                    'relative flex items-center gap-2 cursor-pointer select-none rounded-md py-2 px-4 text-mono-grey transition-colors hover:bg-blue-mtm-100/50 hover:text-mono-black',
                                    activeIndex === index && 'bg-blue-mtm-100/50 text-mono-black'
                                )}
                                id={`${listboxId}-option-${index}`}
                                role="option"
                                aria-selected={value?.value === option.value}
                            >
                                {option.value === CREATE_NEW_VALUE && <PlusCircle size={16} className="text-add-green" />}
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};