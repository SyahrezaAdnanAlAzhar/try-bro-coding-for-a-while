import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { twMerge } from 'tailwind-merge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomCaptionProps {
    displayMonth: Date;
    onMonthChange: (month: Date) => void;
    fromYear: number;
    toYear: number;
}

function CustomCaption({ displayMonth, onMonthChange, fromYear, toYear }: CustomCaptionProps) {
    const currentMonth = displayMonth.getMonth();
    const currentYear = displayMonth.getFullYear();

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const handlePreviousMonth = () => {
        const newDate = new Date(currentYear, currentMonth - 1, 1);
        if (newDate.getFullYear() >= fromYear || (newDate.getFullYear() === fromYear && newDate.getMonth() >= 0)) {
            onMonthChange(newDate);
        }
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentYear, currentMonth + 1, 1);
        if (newDate.getFullYear() <= toYear || (newDate.getFullYear() === toYear && newDate.getMonth() <= 11)) {
            onMonthChange(newDate);
        }
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = parseInt(e.target.value);
        onMonthChange(new Date(currentYear, newMonth, 1));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = parseInt(e.target.value);
        onMonthChange(new Date(newYear, currentMonth, 1));
    };

    const canGoPrevious = () => {
        const prevDate = new Date(currentYear, currentMonth - 1, 1);
        return prevDate.getFullYear() >= fromYear;
    };

    const canGoNext = () => {
        const nextDate = new Date(currentYear, currentMonth + 1, 1);
        return nextDate.getFullYear() <= toYear;
    };

    return (
        <div className="flex justify-between items-center mb-4">
            <button
                type="button"
                onClick={handlePreviousMonth}
                disabled={!canGoPrevious()}
                className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex gap-2">
                <select
                    value={currentMonth}
                    onChange={handleMonthChange}
                    className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                    {months.map((month, index) => (
                        <option key={month} value={index}>
                            {month}
                        </option>
                    ))}
                </select>

                <select
                    value={currentYear}
                    onChange={handleYearChange}
                    className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                    {Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i).map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="button"
                onClick={handleNextMonth}
                disabled={!canGoNext()}
                className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}
export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    const currentYear = new Date().getFullYear();
    const fromYear = currentYear - 50;
    const toYear = currentYear + 10;

    const [month, setMonth] = React.useState<Date>(props.month || new Date());

    const handleMonthChange = (newMonth: Date) => {
        setMonth(newMonth);
        if (props.onMonthChange) {
            props.onMonthChange(newMonth);
        }
    };

    return (
        <div className={twMerge('p-3', className)}>
            <CustomCaption
                displayMonth={month}
                onMonthChange={handleMonthChange}
                fromYear={fromYear}
                toYear={toYear}
            />
            <DayPicker
                showOutsideDays={showOutsideDays}
                className=""
                month={month}
                onMonthChange={handleMonthChange}
                fromYear={fromYear}
                toYear={toYear}
                disableNavigation={true}
                classNames={{
                    months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                    month: 'space-y-4',
                    caption: 'hidden',
                    nav: 'hidden',
                    table: 'w-full border-collapse space-y-1',
                    head_row: 'flex',
                    head_cell: 'text-mono-grey rounded-md w-9 font-normal text-[0.8rem]',
                    row: 'flex w-full mt-2',
                    cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-blue-mtm-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                    day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
                    day_selected:
                        'bg-blue-mtm-700 text-mono-white hover:bg-blue-mtm-700 hover:text-mono-white focus:bg-blue-mtm-700 focus:text-mono-white font-bold',
                    day_today: 'bg-blue-mtm-100 text-blue-mtm-700 font-bold',
                    day_outside: 'text-mono-grey opacity-05',
                    day_disabled: 'text-mono-grey opacity-50',
                    day_hidden: 'invisible',
                    ...classNames,
                }}
                {...props}
            />
        </div>
    );
}
Calendar.displayName = 'Calendar';

export { Calendar };