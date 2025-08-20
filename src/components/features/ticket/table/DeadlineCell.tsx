import { Text } from '../../../ui/Text';
import { format } from 'date-fns';

interface DeadlineCellProps {
    deadline: string | null;
    daysRemaining: number | null;
}

export const DeadlineCell = ({ deadline, daysRemaining }: DeadlineCellProps) => {
    if (!deadline) {
        return <Text variant="body-md">-</Text>;
    }

    const isOverdue = daysRemaining !== null && daysRemaining < 0;
    const isUrgent = daysRemaining !== null && daysRemaining <= 7;

    const daysRemainingColor = isOverdue
        ? 'text-add-red'
        : isUrgent
            ? 'text-add-dark-yellow'
            : 'text-mono-dark-grey';

    return (
        <div>
            <Text weight="bold" className={daysRemainingColor}>
                {daysRemaining !== null ? `${Math.abs(daysRemaining)} Hari ${isOverdue ? 'Terlambat' : 'Lagi'}` : '-'}
            </Text>
            <Text variant="body-sm" color="mono-dark-grey">
                {format(new Date(deadline), 'd MMMM yyyy')}
            </Text>
        </div>
    );
};