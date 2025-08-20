import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={twMerge('p-3 bg-mono-black rounded-md', className)}
            classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-medium text-mono-white',
                nav: 'space-x-1 flex items-center',
                nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-mono-white',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell: 'text-mono-grey rounded-md w-9 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-basic-blue/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 text-mono-white',
                day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-basic-blue/40',
                day_selected: 'bg-basic-blue text-white hover:bg-basic-blue focus:bg-basic-blue focus:text-white',
                day_today: 'bg-mono-dark-grey text-mono-white',
                day_outside: 'text-mono-grey opacity-50',
                day_disabled: 'text-mono-grey opacity-50',
                ...classNames,
            }}
            components={{
                IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                IconRight: () => <ChevronRight className="h-4 w-4" />,
            }}
            {...props}
        />
    );
}
Calendar.displayName = 'Calendar';

export { Calendar };