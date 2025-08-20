import { useStatusSelectors } from '../../../store/statusStore';
import { StatusBadge } from '../../ui/StatusBadge';
import { Text } from '../../ui/Text';

interface TicketStatusBadgeProps {
    statusId: number;
}

export const TicketStatusBadge = ({ statusId }: TicketStatusBadgeProps) => {
    const { getStatusById, getTextColorForStatus } = useStatusSelectors();

    const status = getStatusById(statusId);
    const textColorClass = getTextColorForStatus(statusId);

    if (!status) {
        return null;
    }

    return (
        <StatusBadge
            className="h-[52px] w-[100px] rounded-[20px] flex flex-col items-center justify-center"
            style={{ backgroundColor: status.hex_color, borderColor: 'transparent' }}
        >
            <Text variant="body-sm" weight="bold" className={`${textColorClass} text-center`}>
                {status.name}
            </Text>
        </StatusBadge>
    );
};