import { StatusBadge } from '../../../ui/StatusBadge';
import { Text } from '../../../ui/Text';

interface StatusCellProps {
    statusName: string;
    hexCode: string;
}

export const StatusCell = ({ statusName, hexCode }: StatusCellProps) => {
    return (
        <StatusBadge
            className="w-32"
            style={{ backgroundColor: hexCode, borderColor: hexCode }}
        >
            <Text variant="body-sm" weight="bold" className="text-white text-center">
                {statusName}
            </Text>
        </StatusBadge>
    );
};