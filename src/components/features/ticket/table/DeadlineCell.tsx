import { Text } from '../../../ui/Text';
import { addDays, format, intervalToDuration, startOfToday } from 'date-fns';

interface DeadlineCellProps {
    deadline: string | null;
    daysRemaining: number | null;
}

const formatDurationFromDays = (totalDays: number): string => {
    if (totalDays === 0) return 'Hari Ini';

    const now = startOfToday();
    const futureDate = addDays(now, totalDays);

    const duration = intervalToDuration({ start: now, end: futureDate });

    const parts: string[] = [];
    if (duration.years && duration.years > 0) {
        parts.push(`${duration.years} Tahun`);
    }
    if (duration.months && duration.months > 0) {
        parts.push(`${duration.months} Bulan`);
    }
    if (duration.days && duration.days > 0) {
        parts.push(`${duration.days} Hari`);
    }

    return parts.join(' ');
};


export const DeadlineCell = ({ deadline, daysRemaining }: DeadlineCellProps) => {
    if (!deadline) {
        return <Text variant="body-md">-</Text>;
    }

    const isOverdue = daysRemaining !== null && daysRemaining < 0;
    const isUrgent = daysRemaining !== null && !isOverdue && daysRemaining <= 7;

    const daysRemainingColor = isOverdue
        ? 'text-basic-red'
        : isUrgent
            ? 'text-basic-orange'
            : 'text-mono-dark-grey';
    
    const absoluteDays = daysRemaining !== null ? Math.abs(daysRemaining) : 0;
    const durationText = formatDurationFromDays(absoluteDays);
    const suffix = isOverdue ? 'Terlambat' : 'Lagi';

    return (
        <div>
            <Text weight="bold" className={`${ daysRemainingColor } text-center`}>
                {durationText} {absoluteDays > 0 ? suffix : ''}
            </Text>
            <Text variant="body-sm" color="mono-dark-grey" className="text-center">
                {format(new Date(deadline), 'd MMMM yyyy')}
            </Text>
        </div>
    );
};