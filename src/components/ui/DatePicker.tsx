import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Input } from './Input';
import { Button } from './Button';
import { Calendar } from './Calendar';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

interface DatePickerProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
    disabled?: boolean;
}

export const DatePicker = ({ value, onChange, placeholder = 'Pilih tanggal', disabled }: DatePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div className="relative">
                    <Input
                        type="text"
                        value={value ? format(value, 'd MMMM yyyy') : ''}
                        placeholder={placeholder}
                        readOnly
                        disabled={disabled}
                        className="pr-10 cursor-pointer"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8 p-0"
                        disabled={disabled}
                        aria-label="Pilih tanggal"
                    >
                        <CalendarIcon className="h-5 w-5 text-mono-grey" />
                    </Button>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value || undefined}
                    onSelect={(date) => {
                        onChange(date || null);
                        setIsOpen(false);
                    }}
                    initialFocus
                    captionLayout="dropdown-nav"
                    fromYear={2020}
                    toYear={new Date().getFullYear() + 5}
                />
            </PopoverContent>
        </Popover>
    );
};