import { Badge } from '../../../ui/Badge';
import { useStatusSelectors, useStatusStore } from '../../../../store/statusStore';
import { Text } from '../../../ui/Text';

interface StatusCellProps {
    statusName: string;
}

export const StatusCell = ({ statusName }: StatusCellProps) => {
    const { getStatusByName } = useStatusSelectors();
    const storeStatus = useStatusStore((state) => state.status);
    const status = getStatusByName(statusName);

    if (storeStatus !== 'success' || !status) {
        return <div className="h-[36px] w-32 rounded-lg bg-mono-light-grey animate-pulse" />;
    }

    return (
        <Badge
            className="w-32"
            style={{ backgroundColor: status.hex_color, borderColor: 'transparent' }}
        >
            <Text variant="body-sm" weight="bold" className="text-mono-white text-center">
                {status.name}
            </Text>
        </Badge>
    );
};