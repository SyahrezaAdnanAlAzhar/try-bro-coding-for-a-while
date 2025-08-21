import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Button } from '../ui/Button';
import { Calendar } from '../ui/Calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../ui/Popover';

interface DatePickerProps {
    value: Date | null | undefined;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function DatePicker({
    value,
    onChange,
    placeholder = 'Pilih tanggal',
    className,
    disabled,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="secondary"
                    disabled={disabled}
                    className={twMerge(
                        'w-full justify-start text-left font-normal h-12',
                        !value && 'text-mono-grey',
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, 'PPP') : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={value || undefined}
                    onSelect={(date) => {
                        onChange(date);
                        setOpen(false);
                    }}
                    initialFocus
                    disabled={disabled}
                />
            </PopoverContent>
        </Popover>
    );
}